import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthSupabase';
import { supabase } from '@/lib/supabase';
import { Walk } from '@/types/walks';

/**
 * ✅ 사용자의 산책 기록을 불러오는 Hook
 */
export const useUserWalks = () => {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWalks = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('walks')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false });

        if (error) throw error;
        setWalks(data || []);
      } catch (error) {
        console.error('산책 기록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalks();
  }, [user?.id]);

  return { walks, loading };
};
