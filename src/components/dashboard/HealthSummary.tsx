'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';

interface HealthRecord {
  id: string;
  date: string;
  type: 'vaccination' | 'checkup' | 'medication' | 'symptom' | 'weight';
  title: string;
  description?: string;
  status: 'completed' | 'upcoming' | 'overdue';
  dueDate?: string;
  dogName: string;
}

interface HealthSummaryProps {
  healthRecords: HealthRecord[];
  onViewAll?: () => void;
  onAddRecord?: () => void;
  className?: string;
}

const HealthSummary: React.FC<HealthSummaryProps> = ({
  healthRecords,
  onViewAll,
  onAddRecord,
  className = '',
}) => {
  // 상태별 기록 분류
  const upcomingRecords = healthRecords.filter(
    record => record.status === 'upcoming'
  );
  const overdueRecords = healthRecords.filter(
    record => record.status === 'overdue'
  );
  const recentRecords = healthRecords
    .filter(record => record.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // 타입별 아이콘
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return '💉';
      case 'checkup':
        return '🩺';
      case 'medication':
        return '💊';
      case 'symptom':
        return '🤒';
      case 'weight':
        return '⚖️';
      default:
        return '📋';
    }
  };

  // 타입별 한글명
  const getTypeName = (type: string) => {
    switch (type) {
      case 'vaccination':
        return '예방접종';
      case 'checkup':
        return '건강검진';
      case 'medication':
        return '투약';
      case 'symptom':
        return '증상';
      case 'weight':
        return '체중측정';
      default:
        return '기타';
    }
  };

  // 상태별 색상 (향후 사용 예정)
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'completed': return 'bg-green-100 text-green-800';
  //     case 'upcoming': return 'bg-blue-100 text-blue-800';
  //     case 'overdue': return 'bg-red-100 text-red-800';
  //     default: return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  // D-day 계산
  const getDday = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>건강 관리</span>
          <div className="flex space-x-2">
            {overdueRecords.length > 0 && (
              <Badge className="bg-red-500 text-white">
                {overdueRecords.length}개 지연
              </Badge>
            )}
            {upcomingRecords.length > 0 && (
              <Badge className="bg-blue-500 text-white">
                {upcomingRecords.length}개 예정
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 긴급/예정 알림 */}
        {(overdueRecords.length > 0 || upcomingRecords.length > 0) && (
          <div className="space-y-2">
            {overdueRecords.map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getTypeIcon(record.type)}</span>
                  <div>
                    <div className="font-medium text-sm text-red-800">
                      {record.title}
                    </div>
                    <div className="text-xs text-red-600">
                      {record.dogName} •{' '}
                      {record.dueDate && getDday(record.dueDate)}
                    </div>
                  </div>
                </div>
                <Badge className="bg-red-500 text-white text-xs">지연</Badge>
              </div>
            ))}

            {upcomingRecords.slice(0, 2).map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getTypeIcon(record.type)}</span>
                  <div>
                    <div className="font-medium text-sm text-blue-800">
                      {record.title}
                    </div>
                    <div className="text-xs text-blue-600">
                      {record.dogName} •{' '}
                      {record.dueDate && getDday(record.dueDate)}
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-500 text-white text-xs">예정</Badge>
              </div>
            ))}
          </div>
        )}

        {/* 최근 기록 */}
        {recentRecords.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-3 text-muted-foreground">
              최근 기록
            </h4>
            <div className="space-y-2">
              {recentRecords.map(record => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getTypeIcon(record.type)}</span>
                    <div>
                      <div className="font-medium text-sm">{record.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {record.dogName} • {formatDate(record.date)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getTypeName(record.type)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {healthRecords.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏥</div>
            <p className="text-muted-foreground mb-2">건강 기록이 없습니다.</p>
            <p className="text-sm text-muted-foreground">
              반려견의 건강 관리를 시작해보세요.
            </p>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddRecord}
            className="flex-1"
          >
            기록 추가
          </Button>
          {healthRecords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAll}
              className="flex-1"
            >
              전체 보기
            </Button>
          )}
        </div>

        {/* 통계 요약 */}
        {healthRecords.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {recentRecords.length}
              </div>
              <div className="text-xs text-muted-foreground">최근 기록</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {upcomingRecords.length}
              </div>
              <div className="text-xs text-muted-foreground">예정 항목</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {overdueRecords.length}
              </div>
              <div className="text-xs text-muted-foreground">지연 항목</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthSummary;
