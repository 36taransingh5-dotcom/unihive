import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { groupEventsByTime, timeGroupLabels } from '@/lib/eventGrouping';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Event, GroupedEvents, FilterType } from '@/types/event';

interface TimeStreamFeedProps {
  events: Event[];
  activeFilter?: FilterType;
  filteredEventIds?: string[] | null;
  hasAdvancedFilters?: boolean;
  onClearFilters?: () => void;
}

export function TimeStreamFeed({ 
  events, 
  activeFilter = 'all', 
  filteredEventIds,
  hasAdvancedFilters = false,
  onClearFilters,
}: TimeStreamFeedProps) {
  const [isPastOpen, setIsPastOpen] = useState(false);
  
  // If we have filtered event IDs from AI, only show those events
  const displayEvents = filteredEventIds 
    ? events.filter(e => filteredEventIds.includes(e.id))
    : events;
  
  const groupedEvents = groupEventsByTime(displayEvents);

  // Order for display - past events handled separately
  const futureGroupOrder: (keyof GroupedEvents)[] = [
    'happening-now',
    'later-today',
    'tomorrow',
    'this-week',
    'upcoming',
  ];

  const hasFutureEvents = futureGroupOrder.some(
    (group) => groupedEvents[group].length > 0
  );

  const hasPastEvents = groupedEvents['past'].length > 0;

  // If filtering by AI and no matches found
  if (filteredEventIds && filteredEventIds.length === 0) {
    return <EmptyState filter={activeFilter} hasAdvancedFilters={hasAdvancedFilters} onClearFilters={onClearFilters} />;
  }

  // If no future events and no past events
  if (!hasFutureEvents && !hasPastEvents) {
    return <EmptyState filter={activeFilter} hasAdvancedFilters={hasAdvancedFilters} onClearFilters={onClearFilters} />;
  }

  return (
    <div className="space-y-6">
      {/* Future Events Sections */}
      {futureGroupOrder.map((group) => {
        const groupEvents = groupedEvents[group];
        if (groupEvents.length === 0) return null;

        return (
          <section key={group}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {timeGroupLabels[group]}
            </h2>
            <div className="space-y-3">
              {groupEvents.map((event, idx) => (
                <EventCard key={event.id} event={event} index={idx} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Past Events Accordion */}
      {hasPastEvents && (
        <Collapsible open={isPastOpen} onOpenChange={setIsPastOpen}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {timeGroupLabels['past']} ({groupedEvents['past'].length})
              </span>
              <motion.div
                animate={{ rotate: isPastOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <AnimatePresence>
              {isPastOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 mt-3"
                >
                  {groupedEvents['past'].map((event, idx) => (
                    <div key={event.id} className="opacity-60">
                      <EventCard event={event} index={idx} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
