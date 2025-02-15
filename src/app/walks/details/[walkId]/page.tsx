"use client"; // ✅ 클라이언트 컴포넌트 설정

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ useParams 사용
import { getWalkById } from "@/lib/firebase/walks";
import { Walk } from "@/types/walks";
import WalkDetail from "@/components/walk/WalkDetail";

export default function WalkDetailPage() {
    const params = useParams(); // ✅ useParams()로 비동기적으로 가져오기
    const router = useRouter();
    const [walk, setWalk] = useState<Walk | null>(null);

    useEffect(() => {
        if (!params?.walkId) return; // ✅ walkId가 존재하는지 확인

        const fetchWalk = async () => {
            const walkData = await getWalkById(params.walkId as string); // ✅ 문자열 변환
            if (!walkData) {
                router.push("/walks"); // 🚨 데이터 없으면 목록으로 이동
                return;
            }
            setWalk(walkData);
        };

        fetchWalk();
    }, [params, router]);

    if (!params?.walkId) {
        return <div>❌ 올바르지 않은 요청입니다.</div>;
    }

    if (!walk) {
        return <div>⏳ 산책 정보를 불러오는 중...</div>;
    }

    return <WalkDetail walkId={params.walkId as string} />;
}