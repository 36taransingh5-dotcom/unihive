// Category Intelligence - Visual Mapping
// Maps event categories to meaningful shadow colors and styles

import type { EventCategory } from '@/types/event';

export interface CategoryStyle {
  shadowColor: string;
  borderColor: string;
  label: string;
}

// Strict Category Map for shadows and borders
export const categoryStyleMap: Record<EventCategory, CategoryStyle> = {
  social: {
    shadowColor: '#FF4081', // Hot Pink for Socials/Parties
    borderColor: 'border-[#FF4081]',
    label: 'Social',
  },
  sports: {
    shadowColor: '#84cc16', // Lime Green for Sports/Active
    borderColor: 'border-[#84cc16]',
    label: 'Sports',
  },
  workshop: {
    shadowColor: '#2563eb', // Electric Blue for Workshops/Education
    borderColor: 'border-[#2563eb]',
    label: 'Workshop',
  },
  meeting: {
    shadowColor: '#FACC15', // Yellow for Meetings/Admin
    borderColor: 'border-[#FACC15]',
    label: 'Meeting',
  },
};

// Default for any undefined category
export const defaultCategoryStyle: CategoryStyle = {
  shadowColor: '#9333ea', // Purple as default
  borderColor: 'border-[#9333ea]',
  label: 'Event',
};

export function getCategoryStyle(category: EventCategory | undefined): CategoryStyle {
  if (!category || !categoryStyleMap[category]) {
    return defaultCategoryStyle;
  }
  return categoryStyleMap[category];
}

export function getCategoryShadow(category: EventCategory | undefined): string {
  const style = getCategoryStyle(category);
  return `4px 4px 0px 0px ${style.shadowColor}`;
}
