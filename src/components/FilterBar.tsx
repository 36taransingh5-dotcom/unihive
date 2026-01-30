import { cn } from '@/lib/utils';
import type { FilterType } from '@/types/event';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'socials', label: 'Socials' },
  { value: 'workshops', label: 'Workshops' },
  { value: 'sports', label: 'Sports' },
];

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="sticky top-14 z-40 glass border-b border-border/50">
      <div className="container max-w-2xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                activeFilter === filter.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/80 text-secondary-foreground hover:bg-secondary'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
