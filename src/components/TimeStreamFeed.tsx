import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { groupEventsByTime, timeGroupLabels } from '@/lib/eventGrouping';
import type { Event, GroupedEvents, FilterType } from '@/types/event';

interface TimeStreamFeedProps {
  events: Event[];
  activeFilter?: FilterType;
}

export function TimeStreamFeed({ events, activeFilter = 'all' }: TimeStreamFeedProps) {
  const groupedEvents = groupEventsByTime(events);

  const groupOrder: (keyof GroupedEvents)[] = [
    'happening-now',
    'later-today',
    'tomorrow',
    'this-week',
  ];

  const hasAnyEvents = groupOrder.some(
    (group) => groupedEvents[group].length > 0
  );

  if (!hasAnyEvents) {
    return <EmptyState filter={activeFilter} />;
  }

  return (
    <div className="space-y-6">
      {groupOrder.map((group) => {
        const groupEvents = groupedEvents[group];
        if (groupEvents.length === 0) return null;

        return (
          <section key={group}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {timeGroupLabels[group]}
            </h2>
            <div className="space-y-3">
              {groupEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
