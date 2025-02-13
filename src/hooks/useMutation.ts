import { useState } from "react";

/**
 * ✅ 데이터 변경용 커스텀 훅 (추가, 수정, 삭제)
 */
export function useMutation<T>(mutationFunction: (data: T) => Promise<void>) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (data: T) => {
        try {
            setLoading(true);
            await mutationFunction(data);
        } catch (err) {
            setError("데이터 저장 중 오류 발생");
            console.error("🔥 API 호출 오류:", err);
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
}
