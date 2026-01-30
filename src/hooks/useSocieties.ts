import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Society } from '@/types/event';

export function useSocieties() {
  return useQuery({
    queryKey: ['societies'],
    queryFn: async (): Promise<Society[]> => {
      const { data, error } = await supabase
        .from('societies')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Society[];
    },
  });
}
