'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { formatDistance, formatDuration } from '@/lib/gps';

interface WalkRecord {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  distance: number;
  duration: number;
  dogNames: string[];
  status: 'completed' | 'active';
  issues?: string[];
  notes?: string;
  rating?: number;
}

interface RecentWalksListProps {
  walks: WalkRecord[];
  maxItems?: number;
  showMoreButton?: boolean;
  onShowMore?: () => void;
  onWalkClick?: (walkId: string) => void;
  className?: string;
}

const RecentWalksList: React.FC<RecentWalksListProps> = ({
  walks,
  maxItems = 3,
  showMoreButton = true,
  onShowMore,
  onWalkClick,
  className = ''
}) => {
  // 최신 순으로 정렬하고 제한된 개수만 표시
  const displayWalks = walks
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  // 시간 포맷팅
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 평점 표시
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xs ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  if (walks.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>최근 산책 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚶‍♂️</div>
            <p className="text-muted-foreground">
              아직 산책 기록이 없습니다.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              첫 산책을 시작해보세요!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>최근 산책 기록</span>
          <Badge variant="secondary">
            {walks.length}개 기록
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayWalks.map((walk) => (
          <div
            key={walk.id}
            className={`p-4 border rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
              walk.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'
            }`}
            onClick={() => onWalkClick?.(walk.id)}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {formatDate(walk.date)}
                </span>
                {walk.status === 'active' && (
                  <Badge className="bg-green-500 text-white text-xs">
                    진행 중
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTime(walk.startTime)}
                {walk.endTime && ` - ${formatTime(walk.endTime)}`}
              </div>
            </div>

            {/* 통계 정보 */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {formatDistance(walk.distance)}
                </div>
                <div className="text-xs text-muted-foreground">거리</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {formatDuration(walk.duration)}
                </div>
                <div className="text-xs text-muted-foreground">시간</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {Math.floor(walk.distance / 100)}P
                </div>
                <div className="text-xs text-muted-foreground">포인트</div>
              </div>
            </div>

            {/* 반려견 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">함께한 반려견:</span>
                <div className="flex space-x-1">
                  {walk.dogNames.map((name, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
              {renderRating(walk.rating)}
            </div>

            {/* 이슈 및 메모 */}
            {(walk.issues?.length || walk.notes) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {walk.issues && walk.issues.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground">이슈: </span>
                    <span className="text-xs text-red-600">
                      {walk.issues.length}개 발생
                    </span>
                  </div>
                )}
                {walk.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {walk.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 더보기 버튼 */}
        {showMoreButton && walks.length > maxItems && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowMore}
              className="w-full"
            >
              더 많은 산책 기록 보기 ({walks.length - maxItems}개 더)
            </Button>
          </div>
        )}

        {/* 빈 상태일 때 액션 버튼 */}
        {walks.length === 0 && (
          <div className="text-center pt-4">
            <Button size="sm" className="w-full">
              첫 산책 시작하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentWalksList;
