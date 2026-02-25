import React, { ReactNode } from 'react';

// 컴포넌트 카테고리 타입 정의
export interface ComponentCategory {
  id: string;
  title: string;
  icon: ReactNode;
  items: string[];
}

interface SidebarProps {
  categories: ComponentCategory[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

/**
 * 디자인 시스템 사이드바 컴포넌트
 * 카테고리와 컴포넌트 목록을 표시하고 선택 상태를 관리
 */
export function Sidebar({
  categories,
  activeCategory,
  setActiveCategory,
  activeComponent,
  setActiveComponent,
}: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-neutral-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-neutral-900">Design System</h1>
        <p className="text-sm text-neutral-600 mt-1">DogNote UI Components</p>
      </div>

      <nav className="px-4">
        {categories.map(category => (
          <div key={category.id} className="mb-6">
            <button
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {category.icon}
              <span className="font-medium">{category.title}</span>
            </button>

            {activeCategory === category.id && (
              <div className="ml-8 mt-2 space-y-1">
                {category.items.map(item => (
                  <button
                    key={item}
                    onClick={() => setActiveComponent(item)}
                    className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                      activeComponent === item
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
