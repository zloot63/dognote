/**
 * 스크린 리더 전용 텍스트 컴포넌트
 *
 * 시각적으로는 숨겨져 있지만 스크린 리더에는 읽혀지는 텍스트를 제공합니다.
 * WCAG 2.1 AA 준수를 위한 핵심 컴포넌트입니다.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * ScreenReaderOnly 컴포넌트
 *
 * @example
 * ```tsx
 * <button>
 *   <ScreenReaderOnly>산책 시작하기</ScreenReaderOnly>
 *   <PlayIcon />
 * </button>
 * ```
 */
export const ScreenReaderOnly = ({
  children,
  className,
  as: Component = 'span',
}: ScreenReaderOnlyProps) => {
  return (
    <Component
      className={cn(
        // 접근성을 위한 스크린 리더 전용 스타일
        'absolute',
        '-m-px',
        'h-px',
        'w-px',
        'overflow-hidden',
        'whitespace-nowrap',
        'border-0',
        'p-0',
        // clip 대신 clip-path 사용 (최신 표준)
        '[clip-path:inset(50%)]',
        className
      )}
    >
      {children}
    </Component>
  );
};
