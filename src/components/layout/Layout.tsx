'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  showFooter?: boolean;
  showWalkButton?: boolean;
  variant?: 'default' | 'dashboard' | 'minimal' | 'auth';
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true,
  showFooter = false,
  showWalkButton = true,
  variant = 'default',
  className = '',
}) => {
  // 변형별 스타일 설정
  const getLayoutClasses = () => {
    const baseClasses = 'min-h-screen bg-gray-50';

    switch (variant) {
      case 'dashboard':
        return `${baseClasses} bg-gradient-to-br from-blue-50 to-indigo-100`;
      case 'minimal':
        return `${baseClasses} bg-white`;
      case 'auth':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-purple-600`;
      default:
        return baseClasses;
    }
  };

  const getMainClasses = () => {
    let classes = 'flex-grow';

    // 헤더가 있는 경우 상단 여백
    if (showHeader) {
      classes += ' pt-16'; // Header 높이만큼 여백
    }

    // 하단 네비게이션이 있는 경우 하단 여백
    if (showBottomNav) {
      classes += ' pb-20'; // BottomNav 높이만큼 여백
    }

    // 변형별 패딩
    switch (variant) {
      case 'dashboard':
        classes += ' px-4 py-6';
        break;
      case 'minimal':
        classes += ' px-6 py-8';
        break;
      case 'auth':
        classes += ' px-4 py-8 flex items-center justify-center';
        break;
      default:
        classes += ' p-4';
    }

    return classes;
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {/* 헤더 */}
      {showHeader && (
        <div className="fixed top-0 left-0 right-0 z-40">
          <Header />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <main className={getMainClasses()}>
        {variant === 'dashboard' ? (
          <div className="max-w-7xl mx-auto">{children}</div>
        ) : (
          children
        )}
      </main>

      {/* 풀 푸터 (데스크톱용) */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer variant="full" />
        </div>
      )}

      {/* 하단 네비게이션 (모바일용) */}
      {showBottomNav && (
        <BottomNav showWalkButton={showWalkButton} className="md:hidden" />
      )}
    </div>
  );
};

export default Layout;
