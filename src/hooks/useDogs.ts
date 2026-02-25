import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuthSupabase';
import { DogService } from '@/lib/supabase/index';
import { DogFormData } from '@/types/dog';
import { useDogStore } from '@/store/dogStore';
import * as React from 'react';

// React Query 키 상수
const QUERY_KEYS = {
  dogs: (userId: string) => ['dogs', userId],
  dog: (dogId: string) => ['dog', dogId],
} as const;

/**
 * 강아지 목록 조회 훅
 */
export const useDogs = () => {
  const { user } = useAuth();
  const { setDogs, setLoading, setError } = useDogStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.dogs(user?.id || ''),
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      return await DogService.getUserDogs(user.id);
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (query.data) {
      setDogs(query.data);
      setLoading(false);
      setError(null);
    }
  }, [query.data, setDogs, setLoading, setError]);

  React.useEffect(() => {
    if (query.error) {
      setError((query.error as Error).message);
      setLoading(false);
    }
  }, [query.error, setError, setLoading]);

  React.useEffect(() => {
    if (query.isFetching) {
      setLoading(true);
    }
  }, [query.isFetching, setLoading]);

  return query;
};

/**
 * 특정 강아지 조회 훅
 */
export const useDog = (dogId: string) => {
  const { setSelectedDog } = useDogStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.dog(dogId),
    queryFn: async () => {
      if (!dogId) return null;
      return await DogService.getDogById(dogId);
    },
    enabled: !!dogId,
    select: data => data,
  });

  React.useEffect(() => {
    if (query.data) {
      setSelectedDog(query.data);
    }
  }, [query.data, setSelectedDog]);

  return query;
};

/**
 * 강아지 등록 훅
 */
export const useCreateDog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addDog } = useDogStore();

  return useMutation({
    mutationFn: async (dogData: DogFormData) => {
      if (!user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      return await DogService.createDog(user.id, dogData);
    },
    onSuccess: data => {
      addDog(data);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(user?.id || ''),
      });
    },
  });
};

/**
 * 강아지 수정 훅
 */
export const useUpdateDog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { updateDog } = useDogStore();

  return useMutation({
    mutationFn: async ({
      dogId,
      dogData,
    }: {
      dogId: string;
      dogData: Partial<DogFormData>;
    }) => {
      return await DogService.updateDog(dogId, dogData);
    },
    onSuccess: data => {
      updateDog(data.id, data);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(user?.id || ''),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dog(data.id),
      });
    },
  });
};

/**
 * 강아지 삭제 훅
 */
export const useDeleteDog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { removeDog } = useDogStore();

  return useMutation({
    mutationFn: async (dogId: string) => {
      await DogService.deleteDog(dogId);
      return dogId;
    },
    onSuccess: data => {
      removeDog(data);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(user?.id || ''),
      });
    },
  });
};

/**
 * 강아지 검색 훅
 */
export const useSearchDogs = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      // TODO: DogService에 searchDogs 메서드 구현 필요
      // return await DogService.searchDogs(user.id, searchQuery);
      return [];
    },
  });
};
