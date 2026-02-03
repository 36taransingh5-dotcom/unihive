import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getTagColor } from '@/lib/tagColors';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({ tags, onTagsChange, placeholder = 'Type a tag and press Enter...', className }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      
      if (trimmedValue && !tags.some(tag => tag.toLowerCase() === trimmedValue.toLowerCase())) {
        onTagsChange([...tags, trimmedValue]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag if backspace pressed on empty input
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            const colors = getTagColor(tag);
            return (
              <span
                key={`${tag}-${index}`}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border-2 border-black',
                  colors.bg,
                  colors.text
                )}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="w-3 h-3" strokeWidth={3} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Input */}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="bg-white border-2 border-black rounded-lg placeholder:text-gray-500"
        style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
      />
      
      <p className="text-xs text-gray-500">
        Press Enter to add a tag. Backspace to remove the last tag.
      </p>
    </div>
  );
}
