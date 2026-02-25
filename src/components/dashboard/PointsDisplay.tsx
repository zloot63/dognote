'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';

interface PointsData {
  totalPoints: number;
  monthlyPoints: number;
  weeklyPoints: number;
  todayPoints: number;
  rank?: string;
  nextMilestone?: number;
}

interface PointsDisplayProps {
  pointsData: PointsData;
  className?: string;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  pointsData,
  className = '',
}) => {
  const {
    totalPoints,
    monthlyPoints,
    weeklyPoints,
    todayPoints,
    rank = 'Bronze',
    nextMilestone = 1000,
  } = pointsData;

  // 다음 마일스톤까지 남은 포인트
  const pointsToNext = nextMilestone - totalPoints;
  const progressPercentage = Math.min((totalPoints / nextMilestone) * 100, 100);

  // 랭크별 색상 설정
  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze':
        return 'bg-amber-600';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-yellow-500';
      case 'platinum':
        return 'bg-purple-500';
      case 'diamond':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 랭크별 아이콘
  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze':
        return '🥉';
      case 'silver':
        return '🥈';
      case 'gold':
        return '🥇';
      case 'platinum':
        return '💎';
      case 'diamond':
        return '💠';
      default:
        return '🏅';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>포인트 현황</span>
          <Badge className={`${getRankColor(rank)} text-white`}>
            {getRankIcon(rank)} {rank}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 총 포인트 */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">총 누적 포인트</div>
        </div>

        {/* 진행률 바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>다음 마일스톤까지</span>
            <span className="font-medium">
              {pointsToNext > 0
                ? `${pointsToNext.toLocaleString()}P 남음`
                : '달성!'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{totalPoints.toLocaleString()}</span>
            <span>{nextMilestone.toLocaleString()}</span>
          </div>
        </div>

        {/* 기간별 포인트 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">
              {todayPoints}
            </div>
            <div className="text-xs text-muted-foreground">오늘</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">
              {weeklyPoints}
            </div>
            <div className="text-xs text-muted-foreground">이번 주</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">
              {monthlyPoints}
            </div>
            <div className="text-xs text-muted-foreground">이번 달</div>
          </div>
        </div>

        {/* 포인트 획득 방법 안내 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">포인트 획득 방법</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 산책 100m마다 1포인트</li>
            <li>• 매일 산책 완료시 보너스 10포인트</li>
            <li>• 주간 목표 달성시 보너스 50포인트</li>
            <li>• 건강 기록 입력시 5포인트</li>
          </ul>
        </div>

        {/* 다음 목표 */}
        {pointsToNext > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm text-blue-800">다음 목표</h4>
                <p className="text-xs text-blue-600">
                  {nextMilestone.toLocaleString()}포인트 달성
                </p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
