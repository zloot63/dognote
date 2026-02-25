'use client';

import { useState, useEffect, useRef } from 'react';
import {
  saveGPSToStorage,
  getCurrentWalkFromDB,
  saveCurrentWalkToDB,
  removeCurrentWalkFromDB,
} from '@/lib/localStorage';
import { useDogs } from '@/hooks/useDogs';

// TODO: Supabase walks 서비스 연동 필요
export default function WalkButton() {
  const [walkId, setWalkId] = useState<string | null>(null);
  const { data: dogs, isLoading } = useDogs();
  const watchIdRef = useRef<number | null>(null);

  // LocalStorage 에서 기존 walkId 복원
  useEffect(() => {
    const savedWalkId = getCurrentWalkFromDB();
    if (savedWalkId && savedWalkId !== walkId) {
      setWalkId(savedWalkId);
    }
  }, [walkId]);

  // 위치 추적 시작 (산책 시작 후 실행)
  useEffect(() => {
    if (!walkId) return;

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          saveGPSToStorage({
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toISOString(),
          });
        },
        error => console.error('위치 추적 실패:', error),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [walkId]);

  // 산책 시작 핸들러
  const handleStartWalk = async () => {
    if (!dogs || dogs.length === 0) {
      alert('등록된 강아지가 없습니다. 강아지를 먼저 추가해주세요.');
      return;
    }

    try {
      // TODO: Supabase walks 서비스로 산책 시작 기록
      const newWalkId = `walk_${Date.now()}`;
      await saveCurrentWalkToDB(newWalkId);
      setWalkId(newWalkId);
    } catch (error) {
      console.error('산책 시작 오류:', error);
      alert('산책을 시작하는 데 문제가 발생했습니다.');
    }
  };

  // 산책 종료 핸들러
  const handleEndWalk = async () => {
    if (!walkId) {
      alert('유효한 산책 기록이 없습니다.');
      return;
    }

    try {
      // TODO: Supabase walks 서비스로 산책 종료 기록
      await removeCurrentWalkFromDB();
      setWalkId(null);
    } catch (error) {
      console.error('산책 종료 오류:', error);
      alert('산책을 종료하는 데 문제가 발생했습니다.');
    }
  };

  return (
    <button
      onClick={walkId ? handleEndWalk : handleStartWalk}
      className={`w-full px-6 py-3 text-white font-semibold rounded-lg transition ${
        walkId
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-green-500 hover:bg-green-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isLoading}
    >
      {walkId ? '산책 종료' : '산책 시작'}
    </button>
  );
}
