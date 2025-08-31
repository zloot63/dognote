'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { 
  checkGPSPermission, 
  requestGPSPermission, 
  startGPSTracking, 
  stopGPSTracking,
  calculateTotalDistance,
  formatDistance,
  formatDuration,
  GPSPosition 
} from '@/lib/gps';
import { startWalkInFirestore, endWalkInFirestore } from '@/lib/firebase/walks';
// import { useFetchDogs } from '@/hooks/useDogs'; // 임시 주석 처리
const useFetchDogs = () => ({ 
  data: [{ id: 'mock-dog-1', name: '테스트 강아지' }], 
  isLoading: false 
}); // 임시 mock
import { Walk } from '@/types/walks';
import { cn } from '@/lib/utils';

interface WalkTrackerProps {
  className?: string;
  onWalkStart?: (walkId: string) => void;
  onWalkEnd?: (walk: Walk) => void;
}

interface WalkState {
  isActive: boolean;
  walkId: string | null;
  startTime: Date | null;
  duration: number;
  distance: number;
  positions: GPSPosition[];
  selectedDogIds: string[];
}

const WalkTracker: React.FC<WalkTrackerProps> = ({
  className,
  onWalkStart,
  onWalkEnd
}) => {
  const router = useRouter();
  const { data: dogs, isLoading: dogsLoading } = useFetchDogs();
  
  // 상태 관리
  const [walkState, setWalkState] = useState<WalkState>({
    isActive: false,
    walkId: null,
    startTime: null,
    duration: 0,
    distance: 0,
    positions: [],
    selectedDogIds: []
  });
  
  const [gpsPermission, setGpsPermission] = useState({
    granted: false,
    checking: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const watchIdRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // GPS 권한 확인
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permission = await checkGPSPermission();
        setGpsPermission({
          granted: permission.granted,
          checking: false
        });
      } catch (error) {
        console.error('GPS 권한 확인 실패:', error);
        setGpsPermission({
          granted: false,
          checking: false
        });
      }
    };
    
    checkPermission();
  }, []);
  
  // 산책 시간 업데이트
  useEffect(() => {
    if (walkState.isActive && walkState.startTime) {
      durationIntervalRef.current = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - walkState.startTime!.getTime()) / 1000);
        setWalkState(prev => ({ ...prev, duration }));
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
    
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [walkState.isActive, walkState.startTime]);
  
  // GPS 위치 업데이트 콜백
  const handlePositionUpdate = useCallback((position: GPSPosition) => {
    setWalkState(prev => {
      const newPositions = [...prev.positions, position];
      const newDistance = calculateTotalDistance(newPositions);
      
      return {
        ...prev,
        positions: newPositions,
        distance: newDistance
      };
    });
  }, []);
  
  // GPS 오류 처리 콜백
  const handleGPSError = useCallback((error: string) => {
    console.error('GPS 추적 오류:', error);
    setError(error);
  }, []);
  
  // 산책 시작
  const handleStartWalk = async () => {
    if (!dogs || dogs.length === 0) {
      setError('등록된 반려견이 없습니다. 먼저 반려견을 등록해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // GPS 권한 요청
      if (!gpsPermission.granted) {
        await requestGPSPermission();
        setGpsPermission(prev => ({ ...prev, granted: true }));
      }
      
      // 기본적으로 첫 번째 반려견 선택 (향후 다중 선택 기능 추가 예정)
      const selectedDogIds = dogs && dogs.length > 0 ? [dogs[0].id] : ['mock-dog-1'];
      
      // Firestore에 산책 시작 기록
      const walkId = await startWalkInFirestore(selectedDogIds);
      
      const startTime = new Date();
      const initialPosition = await requestGPSPermission();
      
      // 상태 업데이트
      setWalkState({
        isActive: true,
        walkId,
        startTime,
        duration: 0,
        distance: 0,
        positions: [initialPosition],
        selectedDogIds
      });
      
      // GPS 추적 시작
      const watchId = startGPSTracking(handlePositionUpdate, handleGPSError);
      watchIdRef.current = watchId;
      
      // 콜백 호출
      if (walkId) {
        onWalkStart?.(walkId);
      }
      
      console.log('산책 시작:', { walkId, startTime, selectedDogIds });
      
    } catch (error) {
      console.error('산책 시작 실패:', error);
      setError(error instanceof Error ? error.message : '산책 시작에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 산책 종료
  const handleEndWalk = async () => {
    if (!walkState.isActive || !walkState.walkId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // GPS 추적 중지
      if (watchIdRef.current) {
        stopGPSTracking(watchIdRef.current);
        watchIdRef.current = null;
      }
      
      const endTime = new Date();
      const finalDistance = calculateTotalDistance(walkState.positions);
      const finalDuration = Math.floor((endTime.getTime() - walkState.startTime!.getTime()) / 1000);
      
      // Firestore에 산책 종료 기록
      const completedWalk = await endWalkInFirestore(
        walkState.walkId,
        finalDuration,
        finalDistance,
        walkState.positions.map(pos => ({ lat: pos.lat, lng: pos.lng }))
      );
      
      // 상태 초기화
      setWalkState({
        isActive: false,
        walkId: null,
        startTime: null,
        duration: 0,
        distance: 0,
        positions: [],
        selectedDogIds: []
      });
      
      // 콜백 호출
      onWalkEnd?.(completedWalk);
      
      console.log('산책 종료:', completedWalk);
      
      // 산책 상세 페이지로 이동
      if (walkState.walkId) {
        router.push(`/walks/${walkState.walkId}`);
      }
      
    } catch (error) {
      console.error('산책 종료 실패:', error);
      setError(error instanceof Error ? error.message : '산책 종료에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // GPS 권한 재요청
  const handleRequestPermission = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await requestGPSPermission();
      setGpsPermission(prev => ({ ...prev, granted: true }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'GPS 권한 요청에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 로딩 중
  if (gpsPermission.checking || dogsLoading) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">초기화 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // GPS 권한이 없는 경우
  if (!gpsPermission.granted) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', className)}>
        <CardHeader>
          <CardTitle className="text-center">GPS 권한 필요</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            산책 추적을 위해 GPS 권한이 필요합니다.
          </p>
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <Button 
            onClick={handleRequestPermission}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? '요청 중...' : 'GPS 권한 허용'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader>
        <CardTitle className="text-center">
          {walkState.isActive ? '산책 중' : '산책 추적'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 산책 상태 표시 */}
        {walkState.isActive && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">상태</span>
              <Badge variant="default" className="bg-green-500">
                추적 중
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">시간</span>
              <span className="text-sm font-mono">
                {formatDuration(walkState.duration)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">거리</span>
              <span className="text-sm font-mono">
                {formatDistance(walkState.distance)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">위치 수집</span>
              <span className="text-sm text-muted-foreground">
                {walkState.positions.length}개 지점
              </span>
            </div>
          </div>
        )}
        
        {/* 오류 메시지 */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        {/* 액션 버튼 */}
        <div className="space-y-2">
          {!walkState.isActive ? (
            <Button 
              onClick={handleStartWalk}
              disabled={isLoading || !dogs || dogs.length === 0}
              className="w-full"
              size="lg"
            >
              {isLoading ? '시작 중...' : '산책 시작'}
            </Button>
          ) : (
            <Button 
              onClick={handleEndWalk}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              {isLoading ? '종료 중...' : '산책 종료'}
            </Button>
          )}
        </div>
        
        {/* 반려견 정보 */}
        {dogs && dogs.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              함께하는 반려견: {dogs[0]?.name || '알 수 없음'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalkTracker;
