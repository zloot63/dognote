'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface QuickActionsProps {
  className?: string;
  customActions?: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({
  className = '',
  customActions = []
}) => {
  const router = useRouter();

  // 기본 퀵 액션들
  const defaultActions: QuickAction[] = [
    {
      id: 'start-walk',
      title: '산책 시작',
      description: '새로운 산책을 시작합니다',
      icon: '🚶‍♂️',
      color: 'bg-green-500 hover:bg-green-600',
      href: '/walks',
    },
    {
      id: 'add-dog',
      title: '반려견 등록',
      description: '새로운 반려견을 등록합니다',
      icon: '🐕',
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/dogs/add',
    },
    {
      id: 'health-record',
      title: '건강 기록',
      description: '건강 정보를 기록합니다',
      icon: '🏥',
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/health/add',
    },
    {
      id: 'schedule',
      title: '일정 관리',
      description: '예약 및 일정을 관리합니다',
      icon: '📅',
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/schedule',
    },
    {
      id: 'emergency',
      title: '응급 연락처',
      description: '응급상황시 연락처 목록',
      icon: '🚨',
      color: 'bg-red-500 hover:bg-red-600',
      href: '/emergency',
    },
    {
      id: 'community',
      title: '커뮤니티',
      description: '다른 반려인들과 소통',
      icon: '👥',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      href: '/community',
    },
  ];

  // 커스텀 액션이 있으면 우선 사용, 없으면 기본 액션 사용
  const actions = customActions.length > 0 ? customActions : defaultActions;

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return;
    
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      router.push(action.href);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>빠른 실행</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              className={`
                relative p-4 rounded-lg text-white text-left transition-all duration-200
                ${action.color}
                ${action.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-lg active:scale-95'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
            >
              {/* 아이콘 */}
              <div className="text-2xl mb-2">
                {action.icon}
              </div>
              
              {/* 제목 */}
              <div className="font-semibold text-sm mb-1">
                {action.title}
              </div>
              
              {/* 설명 */}
              <div className="text-xs opacity-90 line-clamp-2">
                {action.description}
              </div>

              {/* 비활성화 오버레이 */}
              {action.disabled && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium">준비중</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 추가 정보 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">💡 팁</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 매일 산책을 기록하면 보너스 포인트를 받을 수 있어요</li>
            <li>• 건강 기록을 꾸준히 입력하면 건강 관리에 도움이 됩니다</li>
            <li>• 응급상황에 대비해 연락처를 미리 등록해두세요</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
