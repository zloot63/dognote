"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { saveWalkToFirestore } from "@/lib/firebase/walks";

export default function AddWalkForm() {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        
        return () => unsubscribe();
    }, []);
    const [isWalking, setIsWalking] = useState(false);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [route, setRoute] = useState<{ lat: number; lng: number }[]>([]);
    const [watchId, setWatchId] = useState<number | null>(null);

    // 산책 시작
    const handleStartWalk = () => {
        setIsWalking(true);
        const now = new Date().toISOString();
        setStartTime(now);

        // GPS 추적 시작
        const id = navigator.geolocation.watchPosition(
            (position) => {
                setRoute((prev) => [
                    ...prev,
                    { lat: position.coords.latitude, lng: position.coords.longitude },
                ]);
            },
            (error) => console.error("❌ 위치 추적 실패:", error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        setWatchId(id);
    };

    // 산책 종료
    const handleEndWalk = async () => {
        if (!startTime || !user?.uid) return;

        const endTime = new Date().toISOString();
        const duration = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
        const distance = calculateDistance(route);

        await saveWalkToFirestore({
            id: `walk_${Date.now()}`, // 고유 ID 생성
            userId: user.uid,
            dogIds: ["coco123"], // TODO: 여러 마리 선택 가능하게 수정
            startTime,
            endTime,
            duration,
            distance,
            route,
            status: "completed",
        });

        // 위치 추적 종료
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }

        setIsWalking(false);
        setStartTime(null);
        setRoute([]);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <h2 className="text-xl font-bold mb-2">🐶 산책 기록</h2>

            {isWalking ? (
                <>
                    <p className="text-gray-600">산책 진행 중...</p>
                    <button onClick={handleEndWalk} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-2">
                        산책 종료
                    </button>
                </>
            ) : (
                <button onClick={handleStartWalk} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    산책 시작
                </button>
            )}
        </div>
    );
}

// 거리 계산 함수 (Haversine Formula 사용)
const calculateDistance = (route: { lat: number; lng: number }[]): number => {
    if (route.length < 2) return 0;

    let distance = 0;
    for (let i = 1; i < route.length; i++) {
        const prev = route[i - 1];
        const curr = route[i];

        const R = 6371; // 지구 반지름 (km)
        const dLat = ((curr.lat - prev.lat) * Math.PI) / 180;
        const dLng = ((curr.lng - prev.lng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((prev.lat * Math.PI) / 180) * Math.cos((curr.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance += R * c;
    }

    return parseFloat(distance.toFixed(2));
};
