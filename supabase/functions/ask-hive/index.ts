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
    const { question, events } = await req.json();

    if (!question || !events) {
      return new Response(
        JSON.stringify({ error: 'Missing question or events' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Include tags in context so AI can search them too
    const eventsContext = events.map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      category: e.category,
      starts_at: e.starts_at,
      ends_at: e.ends_at,
      tags: e.tags || [],
      food_detail: e.food_detail,
      society: e.societies?.name || 'Unknown'
    }));

const systemPrompt = `You are Hive, a friendly and helpful AI assistant for university students looking for events and activities.

Your personality:
- Warm, encouraging, and student-focused
- Use casual language with occasional emoji (but not too many)
- Be concise and direct - students are busy!
- Sound like a helpful friend, not a corporate bot

Your task:
- Analyze the user's question about events
- Look through the available events and recommend the most relevant ones
- IMPORTANT: Search through BOTH the title/description AND the tags array for matches
- Tags contain keywords like "pizza", "free food", "party", "study", etc.
- If asking about "free food", check both tags and food_detail fields
- If asking about "chill" activities, look for tags like "study", "coffee", "sober"
- If no events match, be honest but encouraging

Available events (note: each event has a 'tags' array - search these for keywords!):
${JSON.stringify(eventsContext, null, 2)}`;

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
          { role: 'user', content: question }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_events",
              description: "Return a conversational answer and the IDs of relevant events to show the user.",
              parameters: {
                type: "object",
                properties: {
                  answer: { 
                    type: "string", 
                    description: "A friendly, conversational response (2-4 sentences max) mentioning specific event names and times." 
                  },
                  relevant_event_ids: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Array of event IDs that match the user's query. Empty array if no matches."
                  }
                },
                required: ["answer", "relevant_event_ids"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "recommend_events" } },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    
    // Parse the tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let answer = 'Sorry, I couldn\'t process that request.';
    let relevant_event_ids: string[] = [];

    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        answer = args.answer || answer;
        relevant_event_ids = args.relevant_event_ids || [];
      } catch (e) {
        console.error('Failed to parse tool call arguments:', e);
        answer = data.choices?.[0]?.message?.content || answer;
      }
    }

    return new Response(
      JSON.stringify({ answer, relevant_event_ids }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ask-hive error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
