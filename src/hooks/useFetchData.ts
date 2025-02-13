import { useEffect, useState } from "react";

/**
 * ✅ 데이터 패칭용 커스텀 훅 (조회 API)
 */
export function useFetchData<T>(fetchFunction: () => Promise<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError("데이터를 불러오는 중 오류 발생");
            console.error("🔥 API 호출 오류:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, deps);

    return { data, loading, error, refetch: fetchData };
}
