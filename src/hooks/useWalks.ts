import { useState, useEffect } from "react";
import { getUserWalks } from "@/lib/firebase/walks";
import { Walk } from "@/types/walks";

/**
 * ✅ 사용자의 산책 기록을 불러오는 Hook
 */
export const useUserWalks = () => {
    const [walks, setWalks] = useState<Walk[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWalks = async () => {
            setLoading(true);
            const fetchedWalks = await getUserWalks();
            setWalks(fetchedWalks);
            setLoading(false);
        };
        fetchWalks();
    }, []);

    return { walks, loading };
};
