/**
 * 본문으로 건너뛰기 링크 컴포넌트
 *
 * 키보드 사용자가 네비게이션을 건너뛰고 메인 콘텐츠로 바로 이동할 수 있도록 합니다.
 * WCAG 2.1 AA - 2.4.1 (Bypass Blocks) 준수
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  targetId?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * SkipToContent 컴포넌트
 *
 * @example
 * ```tsx
 * // layout.tsx에서 사용
 * <SkipToContent targetId="main-content" />
 * <nav>...</nav>
 * <main id="main-content">...</main>
 * ```
 */
export const SkipToContent = ({
  targetId = 'main-content',
  className,
  children = '본문으로 건너뛰기',
}: SkipToContentProps) => {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // 기본적으로 숨겨져 있다가 포커스시에만 보임
        'sr-only',
        'focus:not-sr-only',
        'focus:absolute',
        'focus:top-4',
        'focus:left-4',
        'focus:z-50',

        // 스타일링
        'inline-flex',
        'items-center',
        'justify-center',
        'px-4',
        'py-2',
        'text-sm',
        'font-medium',
        'text-white',
        'bg-blue-600',
        'border',
        'border-transparent',
        'rounded-md',
        'shadow-sm',

        // 호버 및 포커스 상태
        'hover:bg-blue-700',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500',
        'focus:ring-offset-2',

        // 애니메이션
        'transition-all',
        'duration-150',

        className
      )}
      onClick={e => {
        // 부드러운 스크롤 효과
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          // 스크린 리더를 위한 포커스 이동
          target.focus({ preventScroll: true });
        }
      }}
    >
      {children}
    </a>
  );
};
