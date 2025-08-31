import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { DogService } from '@/services/dogService';
import { Dog, DogFormData } from '@/types/dog';
import { useDogStore } from '@/store/dogStore';
import { useToast } from '@/components/ui';
import * as React from 'react';

// React Query 키 상수
const QUERY_KEYS = {
  dogs: (userId: string) => ['dogs', userId],
  dog: (dogId: string) => ['dog', dogId]
} as const;

/**
 * 강아지 목록 조회 훅
 */
export const useDogs = () => {
  const { data: session } = useSession();
  const { setDogs, setLoading, setError } = useDogStore();
  const { toast } = useToast();
  
  const query = useQuery({
    queryKey: QUERY_KEYS.dogs(session?.user?.id || ''),
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      setLoading(true);
      return await DogService.getDogsByUserId(session.user.id);
    },
    enabled: !!session?.user?.id,
  });

  React.useEffect(() => {
    if (query.data) {
      setDogs(query.data);
      setLoading(false);
      setError(null);
    }
    
    if (query.error) {
      setError((query.error as Error).message);
      setLoading(false);
      toast.error('오류', (query.error as Error).message);
    }
    
    if (query.isFetching) {
      setLoading(true);
    }
  }, [query.data, query.error, query.isFetching, setDogs, setLoading, setError, toast]);
  
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
    select: (data) => data
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
  const { data: session } = useSession();
  const { addDog } = useDogStore();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (dogData: DogFormData) => {
      if (!session?.user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      return await DogService.createDog(session.user.id, dogData);
    },
  });

  React.useEffect(() => {
    if (mutation.isSuccess) {
      addDog(mutation.data);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(session?.user?.id || '')
      });
      toast.success('성공', `${mutation.data.name}이(가) 성공적으로 등록되었습니다! 🐶`);
    }
    
    if (mutation.isError) {
      toast.error('등록 실패', (mutation.error as Error).message);
    }
  }, [mutation.isSuccess, mutation.data, mutation.isError, mutation.error, addDog, queryClient, session, toast]);
  
  return mutation;
};

/**
 * 강아지 수정 훅
 */
export const useUpdateDog = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { updateDog } = useDogStore();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async ({ dogId, dogData }: { dogId: string; dogData: Partial<DogFormData> }) => {
      return await DogService.updateDog(dogId, dogData);
    },
  });

  React.useEffect(() => {
    if (mutation.isSuccess) {
      updateDog(mutation.data.id, mutation.data);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(session?.user?.id || '')
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dog(mutation.data.id)
      });
      toast.success('수정 완료', `${mutation.data.name}의 정보가 수정되었습니다.`);
    }
    
    if (mutation.isError) {
      toast.error('수정 실패', (mutation.error as Error).message);
    }
  }, [mutation.isSuccess, mutation.data, mutation.isError, mutation.error, updateDog, queryClient, session, toast]);
  
  return mutation;
};

/**
 * 강아지 삭제 훅
 */
export const useDeleteDog = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { removeDog } = useDogStore();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (dogId: string) => {
      await DogService.deleteDog(dogId);
      return dogId;
    },
  });

  React.useEffect(() => {
    if (mutation.isSuccess) {
      removeDog(mutation.data);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(session?.user?.id || '')
      });
      toast.success('삭제 완료', '강아지 정보가 삭제되었습니다.');
    }
    
    if (mutation.isError) {
      toast.error('삭제 실패', (mutation.error as Error).message);
    }
  }, [mutation.isSuccess, mutation.data, mutation.isError, mutation.error, removeDog, queryClient, session, toast]);
  
  return mutation;
};

/**
 * 강아지 검색 훅
 */
export const useSearchDogs = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      if (!session?.user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      return await DogService.searchDogs(session.user.id, searchQuery);
    },
  });

  React.useEffect(() => {
    if (mutation.isError) {
      toast.error('검색 실패', (mutation.error as Error).message);
    }
  }, [mutation.isError, mutation.error, toast]);
  
  return mutation;
};
