import { useState, useEffect } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/types/event';

interface AskHiveProps {
  events: Event[];
  onFilterEvents: (eventIds: string[] | null) => void;
}

const placeholderExamples = [
  "Where can I find free donuts?",
  "Any chill workshops this week?",
  "Find me a gym buddy",
  "What's happening tonight?",
  "Any free food events?",
  "Sports events tomorrow",
];

export function AskHive({ events, onFilterEvents }: AskHiveProps) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveFilter, setHasActiveFilter] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle through placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAsk = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ask-hive', {
        body: { question: query, events }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnswer(data.answer);
      
      // Filter events if AI returned relevant IDs
      if (data.relevant_event_ids && data.relevant_event_ids.length > 0) {
        onFilterEvents(data.relevant_event_ids);
        setHasActiveFilter(true);
      } else {
        // No matching events - clear filter but keep answer visible
        onFilterEvents(null);
        setHasActiveFilter(false);
      }
    } catch (err) {
      console.error('Ask Hive error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const clearSearch = () => {
    setAnswer(null);
    setError(null);
    setQuery('');
    onFilterEvents(null);
    setHasActiveFilter(false);
  };

  return (
    <div className="space-y-3">
      {/* Ask Hive Super Bar - Pop Brutalist Style */}
      <div 
        className="bg-[#bde0fe] border-2 border-black rounded-xl transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none focus-within:translate-x-[2px] focus-within:translate-y-[2px] focus-within:shadow-none"
        style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
      >
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Hive... "${placeholderExamples[placeholderIndex]}"`}
            className="pl-12 pr-14 h-14 bg-transparent border-0 rounded-xl font-bold text-black placeholder:text-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleAsk}
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg border-2 border-black bg-white hover:bg-gray-100 transition-all"
            style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
          >
            <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse text-purple-600' : 'text-black'}`} strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {/* AI Response Bubble */}
      <AnimatePresence>
        {(answer || error || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="relative bg-gradient-to-br from-gradient-start/5 via-accent/10 to-gradient-end/10 rounded-2xl p-4 border border-gradient-start/20">
              {/* Close button */}
              <button
                onClick={clearSearch}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-background/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Hive Avatar */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-xs font-semibold text-gradient-start mb-1">Hive AI</p>
                  {isLoading ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-gradient-start/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gradient-start/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gradient-start/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : error ? (
                    <p className="text-sm text-destructive">{error}</p>
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed">{answer}</p>
                  )}
                </div>
              </div>

              {/* Clear Search Button */}
              {hasActiveFilter && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 pt-3 border-t border-gradient-start/10"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSearch}
                    className="w-full rounded-xl text-xs border-gradient-start/20 hover:bg-gradient-start/5"
                  >
                    Clear Search • Show All Events
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
