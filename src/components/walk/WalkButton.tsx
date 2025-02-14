"use client";

import { useState, useEffect, useRef } from "react";
import { startWalkInFirestore, endWalkInFirestore } from "@/lib/firestore";
import {
    saveToIndexedDB,
    getCurrentWalkFromDB,
    removeCurrentWalkFromDB,
    saveCurrentWalkToDB,
} from "@/lib/indexedDB";
import { useFetchDogs } from "@/hooks/useDogs";
import { Dog } from "@/types/dogs";

export default function WalkButton() {
    const [walkId, setWalkId] = useState<string | null>(null);
    const { data: dogs, isLoading } = useFetchDogs();
    const watchIdRef = useRef<number | null>(null);

    // ✅ IndexedDB에서 기존 산책 기록 복원
    useEffect(() => {
        const restoreWalkState = async () => {
            console.log("🔄 IndexedDB에서 저장된 walkId 불러오는 중...");
            const savedWalkId = await getCurrentWalkFromDB();
            if (savedWalkId) {
                setWalkId(savedWalkId);
                console.log("✅ walkId 복원 성공:", savedWalkId);
            } else {
                console.log("❌ IndexedDB에 저장된 walkId가 없습니다.");
            }
        };
        restoreWalkState();
    }, []);

    // ✅ 위치 추적 활성화
    const startTracking = () => {
        if (navigator.geolocation) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await saveToIndexedDB({ lat: latitude, lng: longitude, timestamp: new Date().toISOString() });
                },
                (error) => console.error("🚨 위치 추적 실패:", error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );
        } else {
            alert("❌ 위치 추적을 지원하지 않는 브라우저입니다.");
        }
    };

    // ✅ 위치 추적 중지
    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };



    // ✅ 산책 시작
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


    // ✅ 산책 종료 (삭제 완료 확인 후 상태 업데이트)
    const handleEndWalk = async () => {
        console.log("🚀 산책 종료 버튼 클릭됨");

        if (!walkId) {
            alert("❌ 유효한 산책 기록이 없습니다.");
            return;
        }

        stopTracking();
        setWalkId(null); // ✅ UI 즉시 업데이트

        // ✅ Firestore 및 IndexedDB에서 삭제 후 검증
        setTimeout(async () => {
            await endWalkInFirestore(walkId);
            await removeCurrentWalkFromDB();

            // ✅ 삭제 후 확인 (완전히 삭제되었는지 체크)
            const checkWalkId = await getCurrentWalkFromDB();
            if (checkWalkId === null) {
                console.log("✅ walkId 삭제 완료 확인됨!");
            } else {
                console.error("🚨 walkId 삭제 실패, 재삭제 진행");
                await removeCurrentWalkFromDB();
            }
        }, 100);
    };

    const isWalking = walkId !== null;
    const isButtonDisabled = isLoading || !dogs || dogs.length === 0;

    return (
        <button
            onClick={isWalking ? handleEndWalk : handleStartWalk}
            className={`w-full px-6 py-3 text-white rounded-lg ${isWalking ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isButtonDisabled}>
            {isWalking ? "산책 종료" : "산책 시작"}
        </button>
    );
}