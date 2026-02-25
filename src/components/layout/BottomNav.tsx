'use client';

import React from 'react';
import Navigation from './Navigation';
import WalkButton from '@/components/walk/WalkButton';

interface BottomNavProps {
  className?: string;
  showWalkButton?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({
  className = '',
  showWalkButton = true,
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      {/* 산책 버튼 (플로팅) */}
      {showWalkButton && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <WalkButton />
        </div>
      )}

      {/* 네비게이션 바 */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="px-2 py-1">
          <Navigation
            variant="bottom"
            showLabels={true}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
