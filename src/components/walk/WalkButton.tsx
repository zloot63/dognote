"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { startWalkInFirestore, endWalkInFirestore } from "@/lib/firebase/walks";
import {
  saveGPSToStorage,
  getCurrentWalkFromDB,
  saveCurrentWalkToDB,
  removeCurrentWalkFromDB,
} from "@/lib/localStorage";
import { useDogs } from "@/hooks/useDogs";
import { Dog } from "@/types/dog";
import WalkDetailModal from "@/components/walk/WalkDetailModal"; // ✅ 모달 추가

export default function WalkButton() {
  const [walkId, setWalkId] = useState<string | null>(null);
  const { data: dogs, isLoading } = useDogs();
  const watchIdRef = useRef<number | null>(null);
  const router = useRouter();
  const [isWalkDetailOpen, setIsWalkDetailOpen] = useState(false); // ✅ 모달 상태 추가

  // ✅ LocalStorage 에서 기존 walkId 복원
  useEffect(() => {
    console.log("🔄 LocalStorage 에서 저장된 walkId 불러오는 중...");
    const savedWalkId = getCurrentWalkFromDB();
    if (savedWalkId && savedWalkId !== walkId) {
      setWalkId(savedWalkId);
      console.log("✅ walkId 복원 성공:", savedWalkId);
    } else {
      console.log("❌ LocalStorage에 저장된 walkId가 없습니다.");
    }
  }, [walkId]);

  // ✅ 위치 추적 시작 (산책 시작 후 실행)
  useEffect(() => {
    if (!walkId) return;

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          saveGPSToStorage({ lat: latitude, lng: longitude, timestamp: new Date().toISOString() });
        },
        (error) => console.error("🚨 위치 추적 실패:", error),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      alert("❌ 위치 추적을 지원하지 않는 브라우저입니다.");
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [walkId]);

  // ✅ 산책 시작 핸들러
  const handleStartWalk = async () => {
    console.log("🚀 산책 시작 버튼 클릭됨");

    if (!dogs || dogs.length === 0) {
      alert("⚠️ 등록된 강아지가 없습니다. 강아지를 먼저 추가해주세요.");
      return;
    }

    const dogIds = dogs.map((dog: Dog) => dog.id);
    console.log("🐶 선택된 강아지 ID:", dogIds);

    try {
      const newWalkId = await startWalkInFirestore(dogIds);
      if (!newWalkId) {
        throw new Error("❌ Firestore 에서 walkId 생성 실패");
      }

      await saveCurrentWalkToDB(newWalkId);
      setWalkId(newWalkId);
      console.log("✅ walkId 저장 완료:", newWalkId);
    } catch (error) {
      console.error("🚨 산책 시작 오류:", error);
      alert("🚨 산책을 시작하는 데 문제가 발생했습니다.");
    }
  };

  // ✅ 산책 종료 핸들러
  const handleEndWalk = async () => {
    console.log("🚀 산책 종료 버튼 클릭됨");

    if (!walkId) {
      alert("❌ 유효한 산책 기록이 없습니다.");
      return;
    }

    try {
      // 기본값으로 산책 종료 처리
      const duration = 0; // 실제 duration은 GPS 추적에서 계산되어야 함
      const distance = 0; // 실제 distance는 GPS 추적에서 계산되어야 함
      const route: { lat: number; lng: number }[] = []; // 빈 경로 배열
      
      await endWalkInFirestore(walkId, duration, distance, route);
      await removeCurrentWalkFromDB();
      setWalkId(null);
      console.log("✅ Firestore & LocalStorage 에서 walkId 삭제 완료");
      setIsWalkDetailOpen(true);
    } catch (error) {
      console.error("🚨 산책 종료 오류:", error);
      alert("🚨 산책을 종료하는 데 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <button
        onClick={walkId ? handleEndWalk : handleStartWalk}
        className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition ${
          walkId ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading}
      >
        {walkId ? "산책 종료" : "산책 시작"}
      </button>

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
