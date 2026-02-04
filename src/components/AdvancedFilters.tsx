import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventCategory, FilterState, Society } from '@/types/event';

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  societies: Society[];
  hasActiveFilters: boolean;
}

const categories: { value: EventCategory; label: string }[] = [
  { value: 'social', label: 'Socials' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'sports', label: 'Sports' },
  { value: 'meeting', label: 'Meetings' },
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  societies,
  hasActiveFilters,
}: AdvancedFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({
      societyId: null,
      category: null,
      freeFoodOnly: false,
    });
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1">
      {/* Society Filter */}
      <Select
        value={filters.societyId || 'all'}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, societyId: value === 'all' ? null : value })
        }
      >
        <SelectTrigger className="w-auto min-w-[140px] h-9 rounded-xl bg-card border-border text-sm">
          <SelectValue placeholder="All Societies" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="all">All Societies</SelectItem>
          {societies.map((society) => (
            <SelectItem key={society.id} value={society.id}>
              {society.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select
        value={filters.category || 'all'}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            category: value === 'all' ? null : (value as EventCategory),
          })
        }
      >
        <SelectTrigger className="w-auto min-w-[140px] h-9 rounded-xl bg-card border-border text-sm">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Free Food Button */}
      <button
        onClick={() => onFiltersChange({ ...filters, freeFoodOnly: !filters.freeFoodOnly })}
        className={`h-9 px-4 rounded-xl border-2 border-black font-bold text-sm whitespace-nowrap transition-all duration-150 ${
          filters.freeFoodOnly
            ? 'bg-[#bef264] translate-x-[2px] translate-y-[2px] shadow-none'
            : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
        }`}
      >
        {filters.freeFoodOnly ? '🍕 Free Food Only' : '🍕 Free Food'}
      </button>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 px-3 rounded-xl text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
