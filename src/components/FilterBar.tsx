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
    <div className="sticky top-14 z-40 bg-white border-b-2 border-black">
      <div className="container max-w-2xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap border-2 border-black transition-all duration-150',
                activeFilter === filter.value
                  ? 'bg-[#FFDE59] text-black translate-x-[1px] translate-y-[1px]'
                  : 'bg-white text-black hover:bg-gray-100'
              )}
              style={{
                boxShadow: activeFilter === filter.value 
                  ? 'none' 
                  : '2px 2px 0px 0px rgba(0,0,0,1)'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
