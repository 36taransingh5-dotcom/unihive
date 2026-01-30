import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { captionText } = await req.json();
    
    if (!captionText || typeof captionText !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Caption text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const today = new Date();
    const currentYear = today.getFullYear();

    const systemPrompt = `You are an expert at extracting event details from messy social media captions, especially Instagram posts from university societies.

Your job is to extract structured event information and return it as JSON. Be smart about:
- Inferring dates from context like "this Friday", "next week", "tomorrow"
- Recognizing common abbreviations and slang
- Guessing the category based on keywords
- Detecting free food mentions and extracting the specific food item

Current date for reference: ${today.toISOString().split('T')[0]}

Categories to choose from:
- "social" - parties, hangouts, mixers, pub events, socials
- "workshop" - learning sessions, tutorials, skill-building
- "sports" - games, matches, training, fitness activities  
- "meeting" - AGMs, committee meetings, general meetings

Southampton University Building Coordinates (use these for accurate location):
- SUSU Building: 50.9341, -1.3966
- Building 32 (ECS): 50.9370, -1.3976
- Building 58: 50.9362, -1.3985
- Hartley Library: 50.9358, -1.3978
- Jubilee Sports Centre: 50.9355, -1.3950
- Highfield Campus (general): 50.9359, -1.3964

Return ONLY valid JSON with this structure:
{
  "title": "Event Title (cleaned up)",
  "description": "Brief description if available",
  "date": "YYYY-MM-DD",
  "startTime": "HH:MM (24hr format)",
  "endTime": "HH:MM (24hr format, estimate if not given, usually 2 hours after start)",
  "location": "Venue or location",
  "category": "social|workshop|sports|meeting",
  "foodDetail": "Specific food item if free food is mentioned (Pizza, Donuts, Coffee, etc.) or null if no free food",
  "latitude": latitude as number or null,
  "longitude": longitude as number or null
}

IMPORTANT: If you detect ANY mention of free food, snacks, refreshments, pizza, drinks, donuts, cookies, etc., extract the specific item into foodDetail. Common phrases: "free pizza", "snacks provided", "refreshments available", "free food".

If you cannot extract a field with confidence, use null for that field. For dates without a year, assume ${currentYear}.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Extract event details from this Instagram caption:\n\n${captionText}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to process with AI');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON from the response (handle markdown code blocks)
    let extractedData;
    try {
      // Remove markdown code blocks if present
      const jsonString = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse extracted data');
    }

    console.log('Successfully extracted event details:', extractedData);

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error extracting event details:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to extract event details' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
