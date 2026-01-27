import { EventCard } from '@/components/EventCard';
import { groupEventsByTime, timeGroupLabels } from '@/lib/eventGrouping';
import type { Event, GroupedEvents } from '@/types/event';

interface TimeStreamFeedProps {
  events: Event[];
}

export function TimeStreamFeed({ events }: TimeStreamFeedProps) {
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
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No upcoming events found</p>
      </div>
    );
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
