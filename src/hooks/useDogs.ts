import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { DogService } from '@/services/dogService';
import { Dog, DogFormData } from '@/types/dog';
import { useDogStore } from '@/store/dogStore';
import { useToast } from '@/components/ui/Toast';

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
  
  return useQuery({
    queryKey: QUERY_KEYS.dogs(session?.user?.id || ''),
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      return await DogService.getDogsByUserId(session.user.id);
    },
    enabled: !!session?.user?.id,
    onSuccess: (data: Dog[]) => {
      setDogs(data);
      setLoading(false);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
      toast.error('오류', error.message);
    },
    onLoading: () => {
      setLoading(true);
    }
  });
};

/**
 * 특정 강아지 조회 훅
 */
export const useDog = (dogId: string) => {
  const { setSelectedDog } = useDogStore();
  
  return useQuery({
    queryKey: QUERY_KEYS.dog(dogId),
    queryFn: async () => {
      if (!dogId) return null;
      return await DogService.getDogById(dogId);
    },
    enabled: !!dogId,
    onSuccess: (data) => {
      setSelectedDog(data);
    }
  });
};

/**
 * 강아지 등록 훅
 */
export const useCreateDog = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { addDog } = useDogStore();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (dogData: DogFormData) => {
      if (!session?.user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      return await DogService.createDog(session.user.id, dogData);
    },
    onSuccess: (newDog) => {
      addDog(newDog);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(session?.user?.id || '')
      });
      toast.success('성공', `${newDog.name}이(가) 성공적으로 등록되었습니다! 🐶`);
    },
    onError: (error: Error) => {
      toast.error('등록 실패', error.message);
    }
  });
};

/**
 * 강아지 수정 훅
 */
export const useUpdateDog = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { updateDog } = useDogStore();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ dogId, dogData }: { dogId: string; dogData: Partial<DogFormData> }) => {
      return await DogService.updateDog(dogId, dogData);
    },
    onSuccess: (updatedDog) => {
      updateDog(updatedDog.id, updatedDog);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(session?.user?.id || '')
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dog(updatedDog.id)
      });
      toast.success('수정 완료', `${updatedDog.name}의 정보가 수정되었습니다.`);
    },
    onError: (error: Error) => {
      toast.error('수정 실패', error.message);
    }
  });
};

/**
 * 강아지 삭제 훅
 */
export const useDeleteDog = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { removeDog } = useDogStore();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (dogId: string) => {
      await DogService.deleteDog(dogId);
      return dogId;
    },
    onSuccess: (dogId) => {
      removeDog(dogId);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.dogs(session?.user?.id || '')
      });
      toast.success('삭제 완료', '강아지 정보가 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error('삭제 실패', error.message);
    }
  });
};

/**
 * 강아지 검색 훅
 */
export const useSearchDogs = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (searchQuery: string) => {
      if (!session?.user?.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      return await DogService.searchDogs(session.user.id, searchQuery);
    },
    onError: (error: Error) => {
      toast.error('검색 실패', error.message);
    }
  });
};
