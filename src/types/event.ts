export type EventCategory = 'workshop' | 'social' | 'sports' | 'meeting';

export interface Event {
  id: string;
  society_id: string;
  title: string;
  description: string | null;
  location: string;
  category: EventCategory;
  starts_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
  food_detail: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  tags: string[] | null;
  societies?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export interface Society {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type TimeGroup = 'happening-now' | 'later-today' | 'tomorrow' | 'this-week' | 'upcoming' | 'past';

export interface GroupedEvents {
  'happening-now': Event[];
  'later-today': Event[];
  'tomorrow': Event[];
  'this-week': Event[];
  'upcoming': Event[];
  'past': Event[];
}

export type FilterType = 'all' | 'today' | 'tomorrow' | 'this-week' | 'socials' | 'workshops' | 'sports';

export interface FilterState {
  societyId: string | null;
  category: EventCategory | null;
  freeFoodOnly: boolean;
}
