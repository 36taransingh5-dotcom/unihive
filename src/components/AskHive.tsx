import { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/types/event';

interface AskHiveProps {
  events: Event[];
}

export function AskHive({ events }: AskHiveProps) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const clearAnswer = () => {
    setAnswer(null);
    setError(null);
    setQuery('');
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Hive... 'Any free food tonight?'"
          className="pl-10 pr-12 h-12 bg-card border-border rounded-2xl shadow-sm focus-visible:ring-primary/20"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleAsk}
          disabled={!query.trim() || isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-primary/10"
        >
          <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
        </Button>
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
            <div className="relative bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20 rounded-2xl p-4 border border-primary/10">
              {/* Close button */}
              <button
                onClick={clearAnswer}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-background/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Hive Avatar */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Hive AI</p>
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : error ? (
                    <p className="text-sm text-destructive">{error}</p>
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed">{answer}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
