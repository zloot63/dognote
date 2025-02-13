"use client";

import { useState } from "react";
import { startWalkInFirestore, updateWalkInFirestore, endWalkInFirestore } from "@/lib/firestore";
import { saveToIndexedDB } from "@/lib/indexedDB";

export default function WalkButton() {
    const [isWalking, setIsWalking] = useState(false);
    const [walkId, setWalkId] = useState<string | null>(null);
    let intervalId: NodeJS.Timeout | null = null;

    // ✅ 위치 추적 활성화 함수
    const startTracking = () => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await saveToIndexedDB({ lat: latitude, lng: longitude, timestamp: new Date().toISOString() });
                },
                (error) => console.error("🚨 위치 추적 실패:", error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            );
        } else {
            alert("❌ 위치 추적을 지원하지 않는 브라우저입니다.");
        }
    };

    const handleStartWalk = async () => {
        setIsWalking(true);
        const id = await startWalkInFirestore(["강아지1_ID"]);
        if (id) setWalkId(id);

        startTracking();

        // ✅ 5분마다 Firestore 업데이트 실행
        intervalId = setInterval(async () => {
            if (id) await updateWalkInFirestore(id);
        }, 5 * 60 * 1000);
    };

    const handleEndWalk = async () => {
        setIsWalking(false);
        if (walkId) await endWalkInFirestore(walkId);
        if (intervalId) clearInterval(intervalId);
    };

    return (
        <button
            onClick={isWalking ? handleEndWalk : handleStartWalk}
            className={`w-full px-6 py-3 text-white rounded-lg ${isWalking ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
        >
            {isWalking ? "산책 종료" : "산책 시작"}
        </button>
    );
}
