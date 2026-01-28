import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { EventCategory } from '@/types/event';

interface ExtractedEventData {
  title: string | null;
  description: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  category: EventCategory | null;
}

interface MagicFillButtonProps {
  onExtracted: (data: ExtractedEventData) => void;
}

export function MagicFillButton({ onExtracted }: MagicFillButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!captionText.trim()) {
      toast({
        title: 'Paste a caption first',
        description: 'Enter the Instagram caption or event text to extract details.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('extract-event-details', {
        body: { captionText: captionText.trim() },
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract details');
      }

      const extracted = data.data as ExtractedEventData;
      onExtracted(extracted);
      
      toast({
        title: '✨ Magic Fill complete!',
        description: 'Event details extracted. Review and save.',
      });

      setIsOpen(false);
      setCaptionText('');
    } catch (error) {
      console.error('Magic fill error:', error);
      toast({
        title: 'Extraction failed',
        description: error instanceof Error ? error.message : 'Could not extract event details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="w-full border-dashed border-2 border-primary/40 hover:border-primary hover:bg-primary/5 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">Auto-Fill from Instagram</span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Paste your caption</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setCaptionText('');
                }}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Textarea
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Paste your Instagram caption, WhatsApp message, or any event text here... e.g. '🎉 POKER NIGHT THIS FRIDAY! Join us at Building 38, Room 1023 at 7pm for an epic night of cards and chill vibes 🃏'"
              rows={4}
              className="resize-none bg-background"
              autoFocus
            />
            
            <Button
              type="button"
              onClick={handleExtract}
              disabled={isLoading || !captionText.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract Event Details
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
