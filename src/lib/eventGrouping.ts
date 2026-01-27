import { 
  isToday, 
  isTomorrow, 
  isThisWeek, 
  isBefore, 
  isAfter, 
  startOfDay, 
  endOfDay 
} from 'date-fns';
import type { Event, GroupedEvents, FilterType } from '@/types/event';

export function isHappeningNow(event: Event): boolean {
  const now = new Date();
  const start = new Date(event.starts_at);
  const end = new Date(event.ends_at);
  return isBefore(start, now) && isAfter(end, now);
}

export function isLaterToday(event: Event): boolean {
  const now = new Date();
  const start = new Date(event.starts_at);
  const todayEnd = endOfDay(now);
  return isAfter(start, now) && isBefore(start, todayEnd) && isToday(start);
}

export function groupEventsByTime(events: Event[]): GroupedEvents {
  const now = new Date();
  
  // Filter out past events
  const futureEvents = events.filter(event => {
    const end = new Date(event.ends_at);
    return isAfter(end, now);
  });

  const grouped: GroupedEvents = {
    'happening-now': [],
    'later-today': [],
    'tomorrow': [],
    'this-week': [],
  };

  futureEvents.forEach(event => {
    const start = new Date(event.starts_at);
    
    if (isHappeningNow(event)) {
      grouped['happening-now'].push(event);
    } else if (isLaterToday(event)) {
      grouped['later-today'].push(event);
    } else if (isTomorrow(start)) {
      grouped['tomorrow'].push(event);
    } else if (isThisWeek(start, { weekStartsOn: 1 })) {
      grouped['this-week'].push(event);
    }
  });

  // Sort each group by start time
  Object.keys(grouped).forEach(key => {
    grouped[key as keyof GroupedEvents].sort((a, b) => 
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    );
  });

  return grouped;
}

export function filterEvents(events: Event[], filter: FilterType): Event[] {
  const now = new Date();
  
  switch (filter) {
    case 'all':
      return events;
    case 'today':
      return events.filter(e => isToday(new Date(e.starts_at)));
    case 'tomorrow':
      return events.filter(e => isTomorrow(new Date(e.starts_at)));
    case 'this-week':
      return events.filter(e => isThisWeek(new Date(e.starts_at), { weekStartsOn: 1 }));
    case 'socials':
      return events.filter(e => e.category === 'social');
    case 'workshops':
      return events.filter(e => e.category === 'workshop');
    case 'sports':
      return events.filter(e => e.category === 'sports');
    default:
      return events;
  }
}

export const timeGroupLabels: Record<keyof GroupedEvents, string> = {
  'happening-now': 'Happening Now',
  'later-today': 'Later Today',
  'tomorrow': 'Tomorrow',
  'this-week': 'This Week',
};
