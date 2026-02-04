import { useState, useEffect } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/types/event';

interface AskHiveProps {
  events: Event[];
  onFilterEvents: (eventIds: string[] | null) => void;
}

const placeholderExamples = [
  "Where is the free pizza?",
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
      {/* AI Command Center - Terminal Aesthetic */}
      <div 
        className="bg-gray-900 border-2 border-[#d946ef] rounded-full transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none focus-within:translate-x-[2px] focus-within:translate-y-[2px] focus-within:shadow-none"
        style={{ boxShadow: '4px 4px 0px 0px #a855f7' }}
      >
        <div className="relative flex items-center">
          <div className="absolute left-5 top-1/2 -translate-y-1/2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Hive... "${placeholderExamples[placeholderIndex]}"`}
            className="pl-14 pr-16 h-14 bg-transparent border-0 rounded-full font-bold text-white placeholder:text-purple-300 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            onClick={handleAsk}
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white flex items-center justify-center transition-all duration-150 hover:rotate-[-15deg] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className={`w-5 h-5 text-black ${isLoading ? 'animate-pulse' : ''}`} strokeWidth={2.5} />
          </button>
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
            <div className="relative bg-gray-900 border-2 border-[#d946ef] rounded-2xl p-4">
              {/* Close button */}
              <button
                onClick={clearSearch}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>

              {/* Hive Avatar */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-xs font-semibold text-purple-400 mb-1">Hive AI</p>
                  {isLoading ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : error ? (
                    <p className="text-sm text-red-400">{error}</p>
                  ) : (
                    <p className="text-sm text-white leading-relaxed">{answer}</p>
                  )}
                </div>
              </div>

              {/* Clear Search Button */}
              {hasActiveFilter && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 pt-3 border-t border-purple-500/30"
                >
                  <button
                    onClick={clearSearch}
                    className="w-full py-2 px-4 rounded-xl text-xs font-bold border-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-colors"
                  >
                    Clear Search • Show All Events
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
