"use client";

import { useState, useEffect, useRef } from "react";
import { startWalkInFirestore, endWalkInFirestore } from "@/lib/firestore";
import {
    saveGPSToStorage,
    getCurrentWalkFromDB,
    saveCurrentWalkToDB,
    removeCurrentWalkFromDB,
} from "@/lib/localStorage";
import { useFetchDogs } from "@/hooks/useDogs";
import { Dog } from "@/types/dogs";

export default function WalkButton() {
    const [walkId, setWalkId] = useState<string | null>(null);
    const { data: dogs, isLoading } = useFetchDogs();
    const watchIdRef = useRef<number | null>(null);

    // ✅ 기존 진행 중인 산책 ID 복원
    useEffect(() => {
        const restoreWalkState = async () => {
            console.log("🔄 LocalStorage에서 저장된 walkId 불러오는 중...");
            const savedWalkId = await getCurrentWalkFromDB();
            if (savedWalkId) {
                setWalkId(savedWalkId);
                console.log("✅ walkId 복원 성공:", savedWalkId);
            } else {
                console.log("❌ LocalStorage에 저장된 walkId가 없습니다.");
            }
        };
        restoreWalkState();
    }, []);

    // ✅ 위치 추적 오류 핸들링 함수
    const handleLocationError = (error: GeolocationPositionError) => {
        console.error("🚨 위치 추적 실패:", {
            code: error.code,
            message: error.message,
        });

        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("❌ 위치 정보 제공이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("⚠️ 위치 정보를 가져올 수 없습니다. 다시 시도해주세요.");
                break;
            case error.TIMEOUT:
                alert("⏳ 위치 정보 요청이 시간 초과되었습니다. 다시 시도해주세요.");
                break;
            default:
                alert("🚨 알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    // ✅ 위치 권한 확인 함수
    const checkLocationPermission = async () => {
        if (!navigator.permissions) {
            console.warn("🚨 브라우저가 위치 권한 확인을 지원하지 않습니다.");
            return true; // 권한 확인이 불가능하면 시도는 계속해야 함
        }

        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "denied") {
            alert("❌ 위치 권한이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.");
            return false;
        }
        return true;
    };

    // ✅ 위치 추적 활성화 (GPS 데이터 LocalStorage에 저장)
    const startTracking = () => {
        if (navigator.geolocation) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    saveGPSToStorage({ lat: latitude, lng: longitude, timestamp: new Date().toISOString() });
                },
                handleLocationError,
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

        // ✅ 위치 권한 확인
        const hasPermission = await checkLocationPermission();
        if (!hasPermission) return;

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

    // ✅ 산책 종료
    const handleEndWalk = async () => {
        console.log("🚀 산책 종료 버튼 클릭됨");

        if (!walkId) {
            alert("❌ 유효한 산책 기록이 없습니다.");
            return;
        }

        stopTracking();
        setWalkId(null); // ✅ UI 즉시 업데이트

        await endWalkInFirestore(walkId);
        await removeCurrentWalkFromDB();

        console.log("✅ Firestore & LocalStorage에서 walkId 삭제 완료");
    };

    const isWalking = walkId !== null;
    const isButtonDisabled = isLoading || !dogs || dogs.length === 0;

    return (
        <button
            onClick={isWalking ? handleEndWalk : handleStartWalk}
            className={`w-full px-6 py-3 text-white rounded-lg ${isWalking ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isButtonDisabled}
        >
            {isWalking ? "산책 종료" : "산책 시작"}
        </button>
    );
}
