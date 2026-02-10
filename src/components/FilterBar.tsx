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
    <div className="sticky top-14 z-40 bg-background border-b-2 border-border dark:bg-black/50 dark:backdrop-blur-md dark:border-gray-800">
      <div className="container max-w-2xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap border-2 border-border transition-all duration-150 brutal-shadow-sm dark:border-purple-500/50 dark:bg-black/50 dark:backdrop-blur-md',
                activeFilter === filter.value
                  ? 'bg-primary text-primary-foreground translate-x-[1px] translate-y-[1px] shadow-none dark:shadow-[0px_0px_10px_#22d3ee]'
                  : 'bg-card text-foreground hover:bg-secondary'
              )}
              style={activeFilter === filter.value ? { boxShadow: 'none' } : undefined}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
