import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Society } from '@/types/event';

export function useSociety() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['society', user?.id],
    queryFn: async (): Promise<Society | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('societies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
