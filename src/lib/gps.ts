/**
 * GPS 위치 추적 관련 유틸리티 함수들
 */

export interface GPSPosition {
  lat: number;
  lng: number;
  timestamp: string;
  accuracy?: number;
}

export interface GPSPermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
  supported: boolean;
}

/**
 * GPS 권한 상태를 확인합니다
 */
export async function checkGPSPermission(): Promise<GPSPermissionStatus> {
  if (!navigator.geolocation) {
    return {
      granted: false,
      denied: false,
      prompt: false,
      supported: false,
    };
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return {
      granted: permission.state === 'granted',
      denied: permission.state === 'denied',
      prompt: permission.state === 'prompt',
      supported: true,
    };
  } catch (error) {
    console.warn('권한 API를 사용할 수 없습니다:', error);
    return {
      granted: false,
      denied: false,
      prompt: true,
      supported: true,
    };
  }
}

/**
 * GPS 권한을 요청합니다
 */
export function requestGPSPermission(): Promise<GPSPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GPS를 지원하지 않는 브라우저입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpsPosition: GPSPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: position.coords.accuracy,
        };
        resolve(gpsPosition);
      },
      (error) => {
        let errorMessage = 'GPS 권한 요청에 실패했습니다.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'GPS 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS 위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS 위치 요청 시간이 초과되었습니다.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * GPS 위치 추적을 시작합니다
 */
export function startGPSTracking(
  onPosition: (position: GPSPosition) => void,
  onError: (error: string) => void
): number | null {
  if (!navigator.geolocation) {
    onError('GPS를 지원하지 않는 브라우저입니다.');
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const gpsPosition: GPSPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: new Date().toISOString(),
        accuracy: position.coords.accuracy,
      };
      onPosition(gpsPosition);
    },
    (error) => {
      let errorMessage = 'GPS 추적 중 오류가 발생했습니다.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'GPS 권한이 거부되었습니다.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'GPS 위치 정보를 사용할 수 없습니다.';
          break;
        case error.TIMEOUT:
          errorMessage = 'GPS 위치 요청 시간이 초과되었습니다.';
          break;
      }
      
      onError(errorMessage);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    }
  );

  return watchId;
}

/**
 * GPS 위치 추적을 중지합니다
 */
export function stopGPSTracking(watchId: number): void {
  if (navigator.geolocation && watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * 하버사인 공식을 사용하여 두 GPS 좌표 간의 거리를 계산합니다 (미터 단위)
 */
export function calculateDistance(
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number }
): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (pos1.lat * Math.PI) / 180;
  const φ2 = (pos2.lat * Math.PI) / 180;
  const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리 (미터)
}

/**
 * GPS 좌표 배열에서 총 거리를 계산합니다
 */
export function calculateTotalDistance(positions: GPSPosition[]): number {
  if (positions.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < positions.length; i++) {
    totalDistance += calculateDistance(positions[i - 1], positions[i]);
  }

  return totalDistance;
}

/**
 * 거리를 사람이 읽기 쉬운 형태로 포맷합니다
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(2)}km`;
  }
}

/**
 * 시간을 사람이 읽기 쉬운 형태로 포맷합니다
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  } else if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`;
  } else {
    return `${remainingSeconds}초`;
  }
}
