import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryBadge } from '@/components/CategoryBadge';
import type { EventCategory } from '@/types/event';

interface CategorySelectProps {
  value: EventCategory;
  onValueChange: (value: EventCategory) => void;
}

const categories: EventCategory[] = ['social', 'workshop', 'sports', 'meeting'];

export function CategorySelect({ value, onValueChange }: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue>
          <CategoryBadge category={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category} value={category} className="py-2">
            <CategoryBadge category={category} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
