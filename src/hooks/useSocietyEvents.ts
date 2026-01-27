import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSociety } from '@/hooks/useSociety';
import type { Event } from '@/types/event';

export function useSocietyEvents() {
  const { data: society } = useSociety();

  return useQuery({
    queryKey: ['society-events', society?.id],
    queryFn: async (): Promise<Event[]> => {
      if (!society) return [];

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
        .eq('society_id', society.id)
        .order('starts_at', { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!society,
  });
}
