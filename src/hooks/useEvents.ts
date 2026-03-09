import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockEvents } from '@/data/mockEvents';
import type { Event } from '@/types/event';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          societies (
            id,
            name,
            logo_url
          )
        `)
        .order('starts_at', { ascending: true });

      if (error) throw error;

      // Combine real events with mock events for demo purposes
      const realEvents = data as Event[];

      // Filter out any mock events that might have the same ID as real events (just in case)
      const realEventIds = new Set(realEvents.map(e => e.id));
      const filteredMockEvents = mockEvents.filter(e => !realEventIds.has(e.id));

      return [...filteredMockEvents, ...realEvents];
    },
  });
}
