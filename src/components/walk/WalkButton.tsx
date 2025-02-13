"use client";

import { useState, useEffect } from "react";
import { startWalkInFirestore, updateWalkInFirestore, endWalkInFirestore } from "@/lib/firestore";
import { saveToIndexedDB } from "@/lib/indexedDB";

export default function WalkButton() {
  const [isWalking, setIsWalking] = useState(false);
  let watchId: number | null = null;
  let intervalId: NodeJS.Timeout | null = null;

  // ✅ 위치 추적 활성화 함수
  const startTracking = () => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
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

  // ✅ 위치 추적 중지 함수
  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    if (intervalId) clearInterval(intervalId);
  };

  const handleStartWalk = async () => {
    setIsWalking(true);
    await startWalkInFirestore("사용자 UID", ["강아지1_ID", "강아지2_ID"]);

    startTracking(); // ✅ 위치 추적 시작

    // ✅ 5분마다 Firestore 업데이트 실행
    intervalId = setInterval(async () => {
      await updateWalkInFirestore();
    }, 5 * 60 * 1000);
  };

  const handleEndWalk = async () => {
    setIsWalking(false);
    stopTracking(); // ✅ 위치 추적 종료
    await endWalkInFirestore();
  };

  // ✅ 산책 종료 시 정리 작업 보장
  useEffect(() => {
    return () => stopTracking();
  }, []);

  return (
    <button
      onClick={isWalking ? handleEndWalk : handleStartWalk}
      className={`w-full px-6 py-3 text-white rounded-lg ${
        isWalking ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {isWalking ? "산책 종료" : "산책 시작"}
    </button>
  );
}
