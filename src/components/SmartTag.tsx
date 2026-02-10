import { getTagColor } from '@/lib/tagColors';
import { cn } from '@/lib/utils';

interface SmartTagProps {
  tag: string;
  className?: string;
}

export function SmartTag({ tag, className }: SmartTagProps) {
  const colors = getTagColor(tag);
  
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs font-bold border-2 border-black uppercase tracking-wide dark:border-gray-700',
        colors.bg,
        colors.text,
        className
      )}
    >
      {tag}
    </span>
  );
}

interface SmartTagListProps {
  tags: string[];
  className?: string;
}

export function SmartTagList({ tags, className }: SmartTagListProps) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag, index) => (
        <SmartTag key={`${tag}-${index}`} tag={tag} />
      ))}
    </div>
  );
}
