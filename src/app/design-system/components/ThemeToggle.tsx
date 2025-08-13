import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  className?: string;
}

/**
 * 테마 전환 컴포넌트
 * 라이트 모드와 다크 모드 간 전환 기능 제공
 */
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 테마 상태에 접근
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-primary-100 text-primary-700'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
        aria-label="라이트 모드로 전환"
      >
        <span role="img" aria-hidden="true">
          ☀️
        </span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-primary-100 text-primary-700'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
        aria-label="다크 모드로 전환"
      >
        <span role="img" aria-hidden="true">
          🌙
        </span>
      </button>
      <span className="text-sm text-neutral-600">
        현재 테마: {theme === 'light' ? '라이트' : '다크'}
      </span>
    </div>
  );
}
