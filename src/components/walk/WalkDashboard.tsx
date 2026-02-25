'use client';

import { useState } from 'react';
import { Walk } from '@/types/walks';
import { useRouter } from 'next/navigation'; // ✅ 모달 방식 적용
import WalkDetailModal from './WalkDetailModal';

interface WalkDashboardProps {
  walks: Walk[];
}

export default function WalkDashboard({ walks }: WalkDashboardProps) {
  const router = useRouter();
  const [selectedWalkId, setSelectedWalkId] = useState<string | null>(null);

  if (!walks || walks.length === 0) {
    return (
      <div className="text-center p-5 text-gray-600">
        📭 아직 산책 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 산책 대시보드</h1>

      {/* ✅ 최근 산책 기록 */}
      <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">📅 최근 산책 기록</h2>
        {walks.slice(0, 2).map(walk => (
          <div
            key={walk.id}
            className="border-b py-3 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-700">
                <strong>📆 날짜:</strong>{' '}
                {new Date(walk.startTime).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>🚶 거리:</strong>{' '}
                {walk.distance ? `${walk.distance} km` : '측정 중'}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedWalkId(walk.id);
                router.push(`/walks/details/${walk.id}`, { scroll: false });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
              자세히 보기
            </button>
          </div>
        ))}
      </div>

      {/* ✅ WalkDetailModal 사용 */}
      {selectedWalkId && (
        <WalkDetailModal
          walkId={selectedWalkId}
          isOpen={Boolean(selectedWalkId)}
          onClose={() => setSelectedWalkId(null)}
        />
      )}
    </div>
  );
}
