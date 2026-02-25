'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  PawPrint,
  MapPin,
  Heart,
  Calendar,
  Settings,
  Users,
  BarChart3,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  disabled?: boolean;
}

interface NavigationProps {
  className?: string;
  variant?: 'sidebar' | 'bottom' | 'horizontal';
  showLabels?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  className = '',
  variant = 'sidebar',
  showLabels = true,
}) => {
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      href: '/dashboard',
      icon: Home,
    },
    {
      id: 'dogs',
      label: '반려견 관리',
      href: '/dogs',
      icon: PawPrint,
    },
    {
      id: 'walks',
      label: '산책',
      href: '/walks',
      icon: MapPin,
    },
    {
      id: 'health',
      label: '건강 관리',
      href: '/health',
      icon: Heart,
    },
    {
      id: 'schedule',
      label: '일정',
      href: '/schedule',
      icon: Calendar,
    },
    {
      id: 'community',
      label: '커뮤니티',
      href: '/community',
      icon: Users,
      disabled: true,
    },
    {
      id: 'analytics',
      label: '통계',
      href: '/analytics',
      icon: BarChart3,
      disabled: true,
    },
    {
      id: 'settings',
      label: '설정',
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;

    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getItemClasses = (item: NavigationItem) => {
    const baseClasses =
      'flex items-center transition-colors duration-200 rounded-lg';
    const activeClasses = isActive(item.href)
      ? 'bg-blue-100 text-blue-700 font-medium'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
    const disabledClasses = item.disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

    // 변형별 클래스
    switch (variant) {
      case 'sidebar':
        return `${baseClasses} ${activeClasses} ${disabledClasses} p-3 mb-1`;
      case 'bottom':
        return `${baseClasses} ${activeClasses} ${disabledClasses} flex-col p-2 min-w-0`;
      case 'horizontal':
        return `${baseClasses} ${activeClasses} ${disabledClasses} px-4 py-2`;
      default:
        return `${baseClasses} ${activeClasses} ${disabledClasses} p-3`;
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case 'sidebar':
        return showLabels ? 'w-5 h-5 mr-3' : 'w-6 h-6';
      case 'bottom':
        return 'w-5 h-5 mb-1';
      case 'horizontal':
        return showLabels ? 'w-4 h-4 mr-2' : 'w-5 h-5';
      default:
        return 'w-5 h-5 mr-3';
    }
  };

  const getLabelClasses = () => {
    switch (variant) {
      case 'bottom':
        return 'text-xs truncate';
      case 'horizontal':
        return 'text-sm';
      default:
        return 'text-sm';
    }
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const IconComponent = item.icon;
    const content = (
      <>
        <IconComponent className={getIconClasses()} />
        {showLabels && <span className={getLabelClasses()}>{item.label}</span>}
        {item.badge && item.badge > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </>
    );

    if (item.disabled) {
      return (
        <div key={item.id} className={getItemClasses(item)}>
          {content}
        </div>
      );
    }

    return (
      <Link key={item.id} href={item.href} className={getItemClasses(item)}>
        {content}
      </Link>
    );
  };

  // 변형별 컨테이너 클래스
  const getContainerClasses = () => {
    const baseClasses = className;

    switch (variant) {
      case 'sidebar':
        return `${baseClasses} flex flex-col space-y-1`;
      case 'bottom':
        return `${baseClasses} flex justify-around items-center bg-white border-t border-gray-200`;
      case 'horizontal':
        return `${baseClasses} flex space-x-1`;
      default:
        return `${baseClasses} flex flex-col space-y-1`;
    }
  };

  return (
    <nav className={getContainerClasses()}>
      {navigationItems.map(renderNavigationItem)}
    </nav>
  );
};

export default Navigation;
