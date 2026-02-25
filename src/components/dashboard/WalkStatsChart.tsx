'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatDistance } from '@/lib/gps';

interface WalkData {
  id: string;
  date: string;
  distance: number;
  duration: number;
}

interface WalkStatsChartProps {
  walks: WalkData[];
  chartType?: 'line' | 'bar';
  period?: 'week' | 'month' | 'year';
  className?: string;
}

const WalkStatsChart: React.FC<WalkStatsChartProps> = ({
  walks,
  chartType = 'line',
  period = 'month',
  className = '',
}) => {
  // 기간별 데이터 집계
  const chartData = useMemo(() => {
    const now = new Date();
    const data: {
      [key: string]: {
        date: string;
        distance: number;
        count: number;
        duration: number;
      };
    } = {};

    // 기간 설정
    let daysToShow = 30;
    let dateFormat = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

    if (period === 'week') {
      daysToShow = 7;
      dateFormat = (date: Date) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()];
      };
    } else if (period === 'year') {
      daysToShow = 365;
      dateFormat = (date: Date) => `${date.getMonth() + 1}월`;
    }

    // 기간 내 모든 날짜 초기화
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const displayDate = dateFormat(date);

      data[dateKey] = {
        date: displayDate,
        distance: 0,
        count: 0,
        duration: 0,
      };
    }

    // 실제 산책 데이터 집계
    walks.forEach(walk => {
      const walkDate = new Date(walk.date);
      const dateKey = walkDate.toISOString().split('T')[0];

      if (data[dateKey]) {
        data[dateKey].distance += walk.distance;
        data[dateKey].count += 1;
        data[dateKey].duration += walk.duration;
      }
    });

    return Object.values(data);
  }, [walks, period]);

  // 통계 계산
  const stats = useMemo(() => {
    const totalDistance = chartData.reduce((sum, day) => sum + day.distance, 0);
    const totalWalks = chartData.reduce((sum, day) => sum + day.count, 0);
    const totalDuration = chartData.reduce((sum, day) => sum + day.duration, 0);
    const avgDistance = totalWalks > 0 ? totalDistance / totalWalks : 0;
    const avgDuration = totalWalks > 0 ? totalDuration / totalWalks : 0;

    return {
      totalDistance,
      totalWalks,
      totalDuration,
      avgDistance,
      avgDuration,
    };
  }, [chartData]);

  // 커스텀 툴팁
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: { distance: number; duration: number; count: number };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">거리: {formatDistance(data.distance)}</p>
          <p className="text-green-600">산책 횟수: {data.count}회</p>
          {data.duration > 0 && (
            <p className="text-purple-600">
              시간: {Math.floor(data.duration / 60)}분
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {period === 'week' && '주간'}
            {period === 'month' && '월간'}
            {period === 'year' && '연간'} 산책 통계
          </span>
          <div className="text-sm text-muted-foreground">
            총 {formatDistance(stats.totalDistance)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 요약 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatDistance(stats.totalDistance)}
            </div>
            <div className="text-xs text-muted-foreground">총 거리</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalWalks}회
            </div>
            <div className="text-xs text-muted-foreground">총 산책</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(stats.totalDuration / 3600)}h{' '}
              {Math.floor((stats.totalDuration % 3600) / 60)}m
            </div>
            <div className="text-xs text-muted-foreground">총 시간</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatDistance(stats.avgDistance)}
            </div>
            <div className="text-xs text-muted-foreground">평균 거리</div>
          </div>
        </div>

        {/* 차트 */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={value => formatDistance(value)}
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="distance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={value => formatDistance(value)}
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="distance" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 기간 선택 버튼 (향후 확장용) */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className={`px-3 py-1 text-xs rounded ${
              period === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            주간
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              period === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            월간
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              period === 'year'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            연간
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalkStatsChart;
