"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { startWalkInFirestore, endWalkInFirestore } from "@/lib/firebase/walks";
import {
    saveGPSToStorage,
    getGPSFromStorage,
    removeGPSFromStorage,
    getCurrentWalkFromDB,
    saveCurrentWalkToDB,
    removeCurrentWalkFromDB
} from "@/lib/localStorage";
import { useFetchDogs } from "@/hooks/useDogs";
import { Dog } from "@/types/dogs";
import WalkDetailModal from "@/components/walk/WalkDetailModal"; // ✅ 모달 추가
import Button from "../ui/inputs/Button"; // ✅ 새 Button 컴포넌트 적용

export default function WalkButton() {
    const [walkId, setWalkId] = useState<string | null>(null);
    const { data: dogs, isLoading } = useFetchDogs();
    const watchIdRef = useRef<number | null>(null);
    const router = useRouter();
    const [isWalkDetailOpen, setIsWalkDetailOpen] = useState(false); // ✅ 모달 상태 추가

    useEffect(() => {
        console.log("🔄 LocalStorage에서 저장된 walkId 불러오는 중...");
        const savedWalkId = getCurrentWalkFromDB();
        if (savedWalkId) {
            setWalkId(savedWalkId);
            console.log("✅ walkId 복원 성공:", savedWalkId);
        } else {
            console.log("❌ LocalStorage에 저장된 walkId가 없습니다.");
        }
    }, []);

    const startTracking = () => {
        if (navigator.geolocation) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    saveGPSToStorage({ lat: latitude, lng: longitude, timestamp: new Date().toISOString() });
                },
                (error) => console.error("🚨 위치 추적 실패:", error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );
        } else {
            alert("❌ 위치 추적을 지원하지 않는 브라우저입니다.");
        }
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    const handleStartWalk = async () => {
        console.log("🚀 산책 시작 버튼 클릭됨");

        if (!dogs || dogs.length === 0) {
            alert("⚠️ 등록된 강아지가 없습니다. 강아지를 먼저 추가해주세요.");
            return;
        }

        const dogIds = dogs.map((dog: Dog) => dog.id);
        console.log("🐶 선택된 강아지 ID:", dogIds);

        const newWalkId = await startWalkInFirestore(dogIds);
        if (!newWalkId) {
            console.error("❌ Firestore에서 walkId 생성 실패");
            alert("🚨 산책을 시작하는 데 문제가 발생했습니다.");
            return;
        }

        await saveCurrentWalkToDB(newWalkId);
        setWalkId(newWalkId);
        console.log("✅ walkId 저장 완료:", newWalkId);

        startTracking();
    };

    const handleEndWalk = async () => {
        console.log("🚀 산책 종료 버튼 클릭됨");

        if (!walkId) {
            alert("❌ 유효한 산책 기록이 없습니다.");
            return;
        }

        stopTracking();
        setWalkId(null);
        await endWalkInFirestore(walkId);
        await removeCurrentWalkFromDB();
        console.log("✅ Firestore & LocalStorage에서 walkId 삭제 완료");
        setIsWalkDetailOpen(true);
    };

    return (
        <>
            <Button
                onClick={walkId ? handleEndWalk : handleStartWalk}
                variant={walkId ? "danger" : "primary"}
                disabled={isLoading}
            >
                {walkId ? "산책 종료" : "산책 시작"}
            </Button>

            {/* ✅ WalkDetailModal 사용 (산책 종료 후 상세 입력) */}
            {isWalkDetailOpen && walkId && (
                <WalkDetailModal
                    walkId={walkId}
                    isOpen={isWalkDetailOpen}
                    onClose={() => setIsWalkDetailOpen(false)}
                />
            )}
        </>
    );
}