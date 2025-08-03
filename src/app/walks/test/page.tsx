'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import WalkTracker from '@/components/walk/WalkTracker';
import WalkMap from '@/components/walk/WalkMap';
import WalkEndModal, { WalkEndData } from '@/components/walk/WalkEndModal';
import { GPSPosition } from '@/lib/gps';
import { Walk } from '@/types/walks';

export default function WalkTestPage() {
  const [currentWalk, setCurrentWalk] = useState<{
    walkId: string | null;
    isActive: boolean;
    startTime: Date | null;
    duration: number;
    distance: number;
    positions: GPSPosition[];
  }>({
    walkId: null,
    isActive: false,
    startTime: null,
    duration: 0,
    distance: 0,
    positions: []
  });

  const [showEndModal, setShowEndModal] = useState(false);
  const [testPositions, setTestPositions] = useState<GPSPosition[]>([
    // 테스트용 GPS 위치 데이터 (서울 시내 산책 경로)
    { lat: 37.5665, lng: 126.9780, timestamp: new Date().toISOString(), accuracy: 5 },
    { lat: 37.5670, lng: 126.9785, timestamp: new Date(Date.now() + 30000).toISOString(), accuracy: 5 },
    { lat: 37.5675, lng: 126.9790, timestamp: new Date(Date.now() + 60000).toISOString(), accuracy: 5 },
    { lat: 37.5680, lng: 126.9795, timestamp: new Date(Date.now() + 90000).toISOString(), accuracy: 5 },
    { lat: 37.5685, lng: 126.9800, timestamp: new Date(Date.now() + 120000).toISOString(), accuracy: 5 },
  ]);

  // 산책 시작 핸들러
  const handleWalkStart = (walkId: string) => {
    console.log('산책 시작:', walkId);
    setCurrentWalk(prev => ({
      ...prev,
      walkId,
      isActive: true,
      startTime: new Date(),
      positions: [testPositions[0]] // 첫 번째 위치로 시작
    }));
  };

  // 산책 종료 핸들러
  const handleWalkEnd = (walk: Walk) => {
    console.log('산책 종료:', walk);
    setShowEndModal(true);
  };

  // 산책 완료 모달 제출 핸들러
  const handleWalkEndSubmit = (data: WalkEndData) => {
    console.log('산책 완료 데이터:', data);
    
    // 산책 상태 초기화
    setCurrentWalk({
      walkId: null,
      isActive: false,
      startTime: null,
      duration: 0,
      distance: 0,
      positions: []
    });
    
    setShowEndModal(false);
    alert('산책이 성공적으로 완료되었습니다!');
  };

  // 테스트용 GPS 위치 시뮬레이션
  const simulateGPSTracking = () => {
    if (!currentWalk.isActive) return;
    
    const nextPositionIndex = currentWalk.positions.length;
    if (nextPositionIndex < testPositions.length) {
      setCurrentWalk(prev => ({
        ...prev,
        positions: [...prev.positions, testPositions[nextPositionIndex]],
        duration: prev.duration + 30, // 30초씩 증가
        distance: prev.distance + Math.random() * 50 + 20 // 20-70m씩 증가
      }));
    }
  };

  // 테스트 데이터 리셋
  const resetTestData = () => {
    setCurrentWalk({
      walkId: null,
      isActive: false,
      startTime: null,
      duration: 0,
      distance: 0,
      positions: []
    });
    setShowEndModal(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">산책 추적 시스템 테스트</h1>
        <p className="text-muted-foreground">
          산책 추적 시스템의 모든 기능을 테스트할 수 있는 페이지입니다.
        </p>
      </div>

      {/* 테스트 컨트롤 패널 */}
      <Card>
        <CardHeader>
          <CardTitle>테스트 컨트롤</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={simulateGPSTracking}
              disabled={!currentWalk.isActive}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              GPS 위치 시뮬레이션
            </button>
            <button
              onClick={() => setShowEndModal(true)}
              disabled={!currentWalk.isActive}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              산책 종료 모달 테스트
            </button>
            <button
              onClick={resetTestData}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              데이터 리셋
            </button>
          </div>
          
          {/* 현재 상태 표시 */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">현재 상태</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">상태:</span>{' '}
                <span className={currentWalk.isActive ? 'text-green-600' : 'text-gray-600'}>
                  {currentWalk.isActive ? '추적 중' : '대기 중'}
                </span>
              </div>
              <div>
                <span className="font-medium">시간:</span>{' '}
                {Math.floor(currentWalk.duration / 60)}분 {currentWalk.duration % 60}초
              </div>
              <div>
                <span className="font-medium">거리:</span>{' '}
                {currentWalk.distance.toFixed(0)}m
              </div>
              <div>
                <span className="font-medium">위치:</span>{' '}
                {currentWalk.positions.length}개 지점
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 컨텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 산책 추적기 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>산책 추적기 (WalkTracker)</CardTitle>
            </CardHeader>
            <CardContent>
              <WalkTracker
                onWalkStart={handleWalkStart}
                onWalkEnd={handleWalkEnd}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* 기능 설명 */}
          <Card>
            <CardHeader>
              <CardTitle>테스트 가능한 기능들</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✅ GPS 권한 요청 및 관리</li>
                <li>✅ 산책 시작/종료 버튼</li>
                <li>✅ 실시간 시간/거리 표시</li>
                <li>✅ GPS 위치 수집 상태</li>
                <li>✅ 하버사인 거리 계산</li>
                <li>✅ Firestore 연동 (시뮬레이션)</li>
                <li>✅ 산책 종료 시 이슈/메모 입력</li>
                <li>✅ 지도 경로 표시</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 지도 영역 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>실시간 지도 (WalkMap)</CardTitle>
            </CardHeader>
            <CardContent>
              <WalkMap
                positions={currentWalk.positions}
                isTracking={currentWalk.isActive}
                height="400px"
                showStartEndMarkers={true}
                showCurrentPosition={true}
              />
            </CardContent>
          </Card>

          {/* GPS 위치 로그 */}
          <Card>
            <CardHeader>
              <CardTitle>GPS 위치 로그</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {currentWalk.positions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    산책을 시작하면 GPS 위치가 표시됩니다.
                  </p>
                ) : (
                  currentWalk.positions.map((pos, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-xs">
                      <div className="font-mono">
                        #{index + 1}: {pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(pos.timestamp).toLocaleTimeString()}
                        {pos.accuracy && ` (정확도: ${pos.accuracy}m)`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 산책 종료 모달 */}
      {showEndModal && (
        <WalkEndModal
          isOpen={showEndModal}
          walkData={{
            duration: currentWalk.duration,
            distance: currentWalk.distance,
            startTime: currentWalk.startTime || new Date()
          }}
          onClose={() => setShowEndModal(false)}
          onSubmit={handleWalkEndSubmit}
          isLoading={false}
        />
      )}
    </div>
  );
}
