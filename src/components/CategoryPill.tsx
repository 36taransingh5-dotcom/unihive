import { getCategoryStyle } from '@/lib/categoryStyles';
import type { EventCategory } from '@/types/event';

interface CategoryPillProps {
  category: EventCategory;
}

export function CategoryPill({ category }: CategoryPillProps) {
  const style = getCategoryStyle(category);
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-black text-white border-2 ${style.borderColor}`}
    >
      {style.label}
    </span>
  );
}
