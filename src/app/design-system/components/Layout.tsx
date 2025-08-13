import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface LayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * 디자인 시스템 페이지의 레이아웃 컴포넌트
 * 제목, 설명 및 콘텐츠를 일관된 방식으로 표시
 */
export function Layout({ title, description, children }: LayoutProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 capitalize">
          {title}
        </h2>
        {description && (
          <p className="text-neutral-600 mt-2">
            {description}
          </p>
        )}
      </div>

      <Card className="p-6">
        {children}
      </Card>
    </div>
  );
}
