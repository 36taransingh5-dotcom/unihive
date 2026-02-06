import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Society } from '@/types/event';

export function useSocieties() {
  return useQuery({
    queryKey: ['societies'],
    queryFn: async (): Promise<Society[]> => {
      // SECURITY: Only select public fields, never expose user_id
      const { data, error } = await supabase
        .from('societies')
        .select('id, name, description, logo_url')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Society[];
    },
  });
}
