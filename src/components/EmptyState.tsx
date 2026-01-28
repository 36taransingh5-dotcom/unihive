import { Calendar, Search } from 'lucide-react';
import type { FilterType } from '@/types/event';

interface EmptyStateProps {
  filter: FilterType;
}

const filterMessages: Record<FilterType, { title: string; subtitle: string }> = {
  all: {
    title: 'No upcoming events',
    subtitle: 'Check back soon or follow your favorite societies',
  },
  today: {
    title: 'Nothing happening today',
    subtitle: 'Take a break or check what\'s coming up this week',
  },
  tomorrow: {
    title: 'No events tomorrow',
    subtitle: 'Plenty of time to plan something fun!',
  },
  'this-week': {
    title: 'Quiet week ahead',
    subtitle: 'Maybe it\'s time for some self-care 🧘',
  },
  socials: {
    title: 'No socials scheduled',
    subtitle: 'The party planning must be underway!',
  },
  workshops: {
    title: 'No workshops coming up',
    subtitle: 'Check back for learning opportunities',
  },
  sports: {
    title: 'No sports events',
    subtitle: 'Time for a rest day perhaps?',
  },
};

export function EmptyState({ filter }: EmptyStateProps) {
  const message = filterMessages[filter];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {filter === 'all' ? (
          <Calendar className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Search className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {message.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {message.subtitle}
      </p>
    </div>
  );
}
