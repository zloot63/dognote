'use client';

import React from 'react';
import WalkStatsChart from '@/components/dashboard/WalkStatsChart';
import PointsDisplay from '@/components/dashboard/PointsDisplay';
import RecentWalksList from '@/components/dashboard/RecentWalksList';
import HealthSummary from '@/components/dashboard/HealthSummary';
import QuickActions from '@/components/dashboard/QuickActions';

/**
 * 대시보드 컴포넌트 통합 테스트 페이지
 */
export default function DashboardTestPage() {
  // 테스트용 목업 데이터
  const mockWalkData = [
    {
      id: '1',
      date: new Date().toISOString(),
      distance: 1500,
      duration: 1800
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      distance: 2200,
      duration: 2400
    },
    {
      id: '3',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      distance: 1800,
      duration: 2100
    },
    {
      id: '4',
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      distance: 2500,
      duration: 3000
    },
    {
      id: '5',
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      distance: 1200,
      duration: 1500
    }
  ];

  const mockPointsData = {
    totalPoints: 1250,
    monthlyPoints: 320,
    weeklyPoints: 85,
    todayPoints: 15,
    rank: 'Silver',
    nextMilestone: 2000
  };

  const mockWalkRecords = [
    {
      id: '1',
      date: new Date().toISOString(),
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      distance: 1500,
      duration: 1800,
      dogNames: ['멍멍이', '왈왈이'],
      status: 'completed' as const,
      rating: 4,
      issues: ['행동 문제'],
      notes: '오늘은 다른 강아지들과 잘 어울렸어요!'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      startTime: new Date(Date.now() - 86400000 - 2400000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      distance: 2200,
      duration: 2400,
      dogNames: ['멍멍이'],
      status: 'completed' as const,
      rating: 5
    },
    {
      id: '3',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      startTime: new Date(Date.now() - 2 * 86400000 - 2100000).toISOString(),
      endTime: new Date(Date.now() - 2 * 86400000).toISOString(),
      distance: 1800,
      duration: 2100,
      dogNames: ['왈왈이'],
      status: 'completed' as const,
      rating: 3,
      notes: '비가 와서 짧게 산책했어요.'
    }
  ];

  const mockHealthRecords = [
    {
      id: '1',
      date: new Date().toISOString(),
      type: 'vaccination' as const,
      title: '종합백신 접종',
      status: 'upcoming' as const,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      dogName: '멍멍이'
    },
    {
      id: '2',
      date: new Date(Date.now() - 30 * 86400000).toISOString(),
      type: 'checkup' as const,
      title: '정기 건강검진',
      status: 'overdue' as const,
      dueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      dogName: '왈왈이'
    },
    {
      id: '3',
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      type: 'weight' as const,
      title: '체중 측정',
      status: 'completed' as const,
      dogName: '멍멍이'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🐕 대시보드 컴포넌트 테스트
          </h1>
          <p className="text-gray-600">
            DogNote 대시보드의 모든 컴포넌트를 테스트할 수 있는 페이지입니다.
          </p>
        </div>

        {/* 퀵 액션 테스트 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">퀵 액션 컴포넌트</h2>
          <QuickActions />
        </section>

        {/* 메인 대시보드 그리드 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">메인 대시보드 레이아웃</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 포인트 현황 */}
            <div>
              <h3 className="text-lg font-medium mb-2">포인트 현황</h3>
              <PointsDisplay pointsData={mockPointsData} />
            </div>
            
            {/* 건강 요약 */}
            <div>
              <h3 className="text-lg font-medium mb-2">건강 관리 요약</h3>
              <HealthSummary 
                healthRecords={mockHealthRecords}
                onViewAll={() => alert('건강 기록 전체 보기')}
                onAddRecord={() => alert('건강 기록 추가')}
              />
            </div>
            
            {/* 산책 통계 차트 */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium mb-2">산책 통계 차트</h3>
              <WalkStatsChart walks={mockWalkData} />
            </div>
            
            {/* 최근 산책 기록 */}
            <div>
              <h3 className="text-lg font-medium mb-2">최근 산책 기록</h3>
              <RecentWalksList 
                walks={mockWalkRecords}
                onShowMore={() => alert('더 많은 산책 기록 보기')}
                onWalkClick={(walkId) => alert(`산책 기록 ${walkId} 클릭`)}
              />
            </div>

            {/* 차트 타입 테스트 */}
            <div>
              <h3 className="text-lg font-medium mb-2">차트 타입 테스트 (Bar Chart)</h3>
              <WalkStatsChart walks={mockWalkData} chartType="bar" period="week" />
            </div>
          </div>
        </section>

        {/* 기간별 차트 테스트 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">기간별 차트 테스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">주간 통계</h3>
              <WalkStatsChart walks={mockWalkData} period="week" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">월간 통계</h3>
              <WalkStatsChart walks={mockWalkData} period="month" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">연간 통계</h3>
              <WalkStatsChart walks={mockWalkData} period="year" />
            </div>
          </div>
        </section>

        {/* 빈 상태 테스트 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">빈 상태 테스트</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">빈 산책 기록</h3>
              <RecentWalksList walks={[]} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">빈 건강 기록</h3>
              <HealthSummary healthRecords={[]} />
            </div>
          </div>
        </section>

        {/* 테스트 정보 */}
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🧪 테스트 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">테스트 항목</h3>
              <ul className="text-sm space-y-1">
                <li>✅ 퀵 액션 버튼 클릭</li>
                <li>✅ 포인트 현황 표시</li>
                <li>✅ 건강 기록 상태별 표시</li>
                <li>✅ 산책 통계 차트 (Line/Bar)</li>
                <li>✅ 최근 산책 기록 목록</li>
                <li>✅ 기간별 차트 (주/월/년)</li>
                <li>✅ 빈 상태 UI</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">확인 사항</h3>
              <ul className="text-sm space-y-1">
                <li>• 반응형 레이아웃 동작</li>
                <li>• 차트 데이터 정확성</li>
                <li>• 버튼 클릭 이벤트</li>
                <li>• 색상 및 스타일링</li>
                <li>• 로딩 상태 처리</li>
                <li>• 에러 상태 처리</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
