import { useState } from 'react';
import { Palette, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { EventCategory } from '@/types/event';

interface ImageGeneratorProps {
  title: string;
  category: EventCategory;
  onImageGenerated: (imageUrl: string) => void;
  currentImage?: string | null;
}

export function ImageGenerator({ title, category, onImageGenerated, currentImage }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: 'Enter a title first',
        description: 'We need the event title to generate a relevant image.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-event-image', {
        body: { title, category }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        onImageGenerated(data.imageUrl);
        toast({
          title: 'Image generated! 🎨',
          description: 'Your custom cover art is ready.',
        });
      }
    } catch (err) {
      console.error('Image generation error:', err);
      toast({
        title: 'Generation failed',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : currentImage ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Image
            </>
          ) : (
            <>
              <Palette className="w-4 h-4 mr-2" />
              🎨 Auto-Generate Image
            </>
          )}
        </Button>
      </div>

      {/* Image Preview */}
      {currentImage && (
        <div className="relative rounded-xl overflow-hidden bg-muted aspect-square max-w-[200px]">
          <img
            src={currentImage}
            alt="Generated event cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
