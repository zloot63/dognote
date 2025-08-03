'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { GPSPosition } from '@/lib/gps';
import type * as L from 'leaflet';

// Leaflet을 동적으로 로드 (SSR 방지)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface WalkMapProps {
  positions: GPSPosition[];
  isTracking?: boolean;
  height?: string;
  className?: string;
  showStartEndMarkers?: boolean;
  showCurrentPosition?: boolean;
}

const WalkMap: React.FC<WalkMapProps> = ({
  positions,
  isTracking = false,
  height = '400px',
  className = '',
  showStartEndMarkers = true,
  showCurrentPosition = true
}) => {
  const mapRef = useRef<L.Map | null>(null);

  // 지도 중심점 계산
  const getMapCenter = useCallback((): [number, number] => {
    if (positions.length === 0) {
      // 기본 위치 (서울)
      return [37.5665, 126.9780];
    }
    
    if (positions.length === 1) {
      return [positions[0].lat, positions[0].lng];
    }
    
    // 모든 위치의 중심점 계산
    const avgLat = positions.reduce((sum, pos) => sum + pos.lat, 0) / positions.length;
    const avgLng = positions.reduce((sum, pos) => sum + pos.lng, 0) / positions.length;
    
    return [avgLat, avgLng];
  }, [positions]);

  // 지도 줌 레벨 계산
  const getMapZoom = useCallback((): number => {
    if (positions.length <= 1) return 16;
    
    // 위치들 간의 거리를 기반으로 적절한 줌 레벨 계산
    const lats = positions.map(pos => pos.lat);
    const lngs = positions.map(pos => pos.lng);
    
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    const maxRange = Math.max(latRange, lngRange);
    
    if (maxRange > 0.01) return 13;
    if (maxRange > 0.005) return 14;
    if (maxRange > 0.002) return 15;
    return 16;
  }, [positions]);

  // 경로 좌표 변환
  const pathCoordinates: [number, number][] = positions.map(pos => [pos.lat, pos.lng]);

  // 지도 뷰 업데이트
  useEffect(() => {
    if (mapRef.current && positions.length > 0) {
      const map = mapRef.current;
      
      // 현재 추적 중이면 최신 위치로 이동
      if (isTracking && positions.length > 0) {
        const lastPosition = positions[positions.length - 1];
        map.setView([lastPosition.lat, lastPosition.lng], map.getZoom());
      } else {
        const center = getMapCenter();
        const zoom = getMapZoom();
        map.setView(center, zoom);
      }
    }
  }, [positions, isTracking, getMapCenter, getMapZoom]);

  const center = getMapCenter();
  const zoom = getMapZoom();

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        {/* 타일 레이어 (OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 경로 표시 */}
        {pathCoordinates.length > 1 && (
          <Polyline
            positions={pathCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
          />
        )}
        
        {/* 시작점 마커 */}
        {showStartEndMarkers && positions.length > 0 && (
          <Marker position={[positions[0].lat, positions[0].lng]}>
            <Popup>
              <div className="text-center">
                <strong>시작점</strong>
                <br />
                <small>{new Date(positions[0].timestamp).toLocaleTimeString()}</small>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* 종료점 마커 */}
        {showStartEndMarkers && positions.length > 1 && !isTracking && (
          <Marker position={[positions[positions.length - 1].lat, positions[positions.length - 1].lng]}>
            <Popup>
              <div className="text-center">
                <strong>종료점</strong>
                <br />
                <small>{new Date(positions[positions.length - 1].timestamp).toLocaleTimeString()}</small>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* 현재 위치 마커 (추적 중일 때) */}
        {showCurrentPosition && isTracking && positions.length > 0 && (
          <Marker position={[positions[positions.length - 1].lat, positions[positions.length - 1].lng]}>
            <Popup>
              <div className="text-center">
                <strong>현재 위치</strong>
                <br />
                <small>{new Date(positions[positions.length - 1].timestamp).toLocaleTimeString()}</small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* 추적 상태 표시 */}
      {isTracking && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
          추적 중
        </div>
      )}
      
      {/* 위치 정보 표시 */}
      {positions.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs">
          위치 수집: {positions.length}개 지점
        </div>
      )}
    </div>
  );
};

export default WalkMap;
