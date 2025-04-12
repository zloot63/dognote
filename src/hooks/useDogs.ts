import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listUserDogs, createDog, deleteDog } from "@/lib/firebase/dogs";
import { Dog } from "@/types/dogs";

/**
 * ✅ 특정 사용자의 강아지 목록 가져오기 훅 (Read)
 */
export const useFetchDogs = (userId: string) => {
  return useQuery<Dog[]>({
    queryKey: ["dogs", userId],
    queryFn: () => listUserDogs(userId),
    enabled: Boolean(userId), // ✅ userId가 있을 때만 실행
  });
};

/**
 * ✅ 강아지 추가 훅 (Create)
 */
export const useAddDog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dog: Omit<Dog, "id" | "createdAt" | "updatedAt">) => await createDog(dog),
    onSuccess: (_, variables) => {
      alert(`✅ ${variables.name} 강아지가 성공적으로 등록되었습니다! 🐶`);
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    },
    onError: (error) => {
      console.error("🚨 강아지 추가 실패:", error);
      alert("⚠️ 강아지 추가 중 오류가 발생했습니다.");
    },
  });
};

/**
 * ✅ 강아지 삭제 훅 (Delete)
 */
export const useDeleteDog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dogId: string) => await deleteDog(dogId),
    onSuccess: () => {
      alert("✅ 강아지가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    },
    onError: (error) => {
      console.error("🚨 강아지 삭제 실패:", error);
      alert("⚠️ 강아지 삭제 중 오류가 발생했습니다.");
    },
  });
};
