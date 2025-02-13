import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDogsFromFirestore, saveDogToFirestore, deleteDogFromFirestore } from "@/lib/firestore";
import { Dog } from "@/types/dogs";

/**
 * ✅ 강아지 목록 가져오기 훅
 */
export const useFetchDogs = () => {
    return useQuery({
        queryKey: ["dogs"],
        queryFn: fetchDogsFromFirestore,
    });
};

/**
 * ✅ 강아지 추가 훅
 */
export const useAddDog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dog: Dog) => await saveDogToFirestore(dog),
        onSuccess: () => {
            alert("✅ 강아지가 성공적으로 등록되었습니다! 🐶");
            queryClient.invalidateQueries(["dogs"]); // ✅ 강아지 목록 업데이트
        },
        onError: (error) => {
            console.error("🚨 강아지 추가 실패:", error);
            alert("⚠️ 강아지 추가 중 오류가 발생했습니다.");
        },
    });
};

/**
 * ✅ 강아지 삭제 훅
 */
export const useDeleteDog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dogId: string) => await deleteDogFromFirestore(dogId),
        onSuccess: () => {
            alert("✅ 강아지가 삭제되었습니다.");
            queryClient.invalidateQueries(["dogs"]); // ✅ 강아지 목록 업데이트
        },
        onError: (error) => {
            console.error("🚨 강아지 삭제 실패:", error);
            alert("⚠️ 강아지 삭제 중 오류가 발생했습니다.");
        },
    });
};
