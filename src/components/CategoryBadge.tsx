import { cn } from '@/lib/utils';
import type { EventCategory } from '@/types/event';

interface CategoryBadgeProps {
  category: EventCategory;
  className?: string;
}

const categoryStyles: Record<EventCategory, string> = {
  workshop: 'bg-category-workshop-bg text-category-workshop-fg',
  social: 'bg-category-social-bg text-category-social-fg',
  sports: 'bg-category-sports-bg text-category-sports-fg',
  meeting: 'bg-category-meeting-bg text-category-meeting-fg',
};

const categoryLabels: Record<EventCategory, string> = {
  workshop: 'Workshop',
  social: 'Social',
  sports: 'Sports',
  meeting: 'Meeting',
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        categoryStyles[category],
        className
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}
