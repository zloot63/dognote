import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

export const useFetchData = <T>(fetchFunction: () => Promise<T>, dependencies: any[] = []) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // ✅ 로그인 여부 확인 후 데이터 패칭 실행
                const user = auth.currentUser;
                if (!user) {
                    setLoading(false);
                    return;
                }

                const result = await fetchFunction();
                setData(result);
            } catch (err) {
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
                console.error("🔥 데이터 패칭 오류:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    return { data, loading, error };
};
