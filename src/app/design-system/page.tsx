'use client';

import React, { useState } from 'react';
import { Sidebar, ComponentCategory } from './components/Sidebar';
import { ColorPalette } from './components/ColorPalette';
import { ButtonExamples } from './components/ButtonExamples';
import { InputExamples } from './components/InputExamples';
import { ThemeUtilities } from './components/ThemeUtilities';
import { ThemeToggle } from './components/ThemeToggle';
import { Layout } from './components/Layout';
import { TypographyExamples } from './components/TypographyExamples';
import { SpacingExamples } from './components/SpacingExamples';
import { ShadowExamples } from './components/ShadowExamples';

// 아이콘 임포트
import {
  PaletteIcon,
  ButtonsIcon,
  FormsIcon,
  ThemeIcon,
} from '@/components/icons';

/**
 * 디자인 시스템 페이지 컴포넌트
 * 다양한 UI 컴포넌트와 테마 유틸리티를 보여주는 페이지
 */
export default function DesignSystemPage() {
  // 활성화된 카테고리와 컴포넌트 상태
  const [activeCategory, setActiveCategory] = useState('foundations');
  const [activeComponent, setActiveComponent] = useState('colors');

  // 컴포넌트 카테고리 정의
  const categories: ComponentCategory[] = [
    {
      id: 'foundations',
      title: '기초',
      icon: <PaletteIcon className="w-5 h-5" />,
      items: ['colors', 'typography', 'spacing', 'shadows'],
    },
    {
      id: 'components',
      title: '컴포넌트',
      icon: <ButtonsIcon className="w-5 h-5" />,
      items: ['buttons', 'inputs', 'badges', 'cards', 'alerts'],
    },
    {
      id: 'forms',
      title: '폼',
      icon: <FormsIcon className="w-5 h-5" />,
      items: ['inputs', 'checkboxes', 'radio', 'select', 'textarea'],
    },
    {
      id: 'utilities',
      title: '유틸리티',
      icon: <ThemeIcon className="w-5 h-5" />,
      items: ['theme', 'responsive', 'animation'],
    },
  ];

  // 현재 선택된 컴포넌트에 따라 콘텐츠 렌더링
  const renderContent = () => {
    // 기초 카테고리
    if (activeCategory === 'foundations') {
      switch (activeComponent) {
        case 'colors':
          return (
            <Layout
              title="컬러 시스템"
              description="DogNote 디자인 시스템의 컬러 팔레트"
            >
              <ColorPalette />
            </Layout>
          );
        case 'typography':
          return (
            <Layout
              title="타이포그래피"
              description="폰트 패밀리, 크기, 가중치 시스템"
            >
              <TypographyExamples />
            </Layout>
          );
        case 'spacing':
          return (
            <Layout title="스페이싱" description="간격 및 여백 시스템">
              <SpacingExamples />
            </Layout>
          );
        case 'shadows':
          return (
            <Layout
              title="그림자"
              description="깊이와 계층을 표현하는 그림자 시스템"
            >
              <ShadowExamples />
            </Layout>
          );
        default:
          return (
            <Layout
              title={activeComponent}
              description={`${activeComponent} 시스템`}
            >
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">
                  {activeComponent} 시스템
                </h3>
                <p>이 섹션은 준비 중입니다.</p>
              </div>
            </Layout>
          );
      }
    }

    // 컴포넌트 카테고리
    if (activeCategory === 'components') {
      switch (activeComponent) {
        case 'buttons':
          return (
            <Layout
              title="버튼"
              description="사용자 액션을 유도하는 인터랙티브 요소"
            >
              <ButtonExamples />
            </Layout>
          );
        case 'inputs':
          return (
            <Layout
              title="입력 필드"
              description="사용자 데이터 수집을 위한 폼 요소"
            >
              <InputExamples />
            </Layout>
          );
        default:
          return (
            <Layout
              title={activeComponent}
              description={`${activeComponent} 컴포넌트`}
            >
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">
                  {activeComponent} 컴포넌트
                </h3>
                <p>이 컴포넌트는 준비 중입니다.</p>
              </div>
            </Layout>
          );
      }
    }

    // 유틸리티 카테고리
    if (activeCategory === 'utilities') {
      switch (activeComponent) {
        case 'theme':
          return (
            <Layout
              title="테마 유틸리티"
              description="테마 시스템 및 유틸리티 함수"
            >
              <ThemeUtilities />
              <div className="mt-8 p-4 bg-neutral-100 rounded-lg">
                <h4 className="font-medium mb-3">테마 전환 테스트</h4>
                <ThemeToggle />
              </div>
            </Layout>
          );
        default:
          return (
            <Layout
              title={activeComponent}
              description={`${activeComponent} 유틸리티`}
            >
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">
                  {activeComponent} 유틸리티
                </h3>
                <p>이 유틸리티는 준비 중입니다.</p>
              </div>
            </Layout>
          );
      }
    }

    // 기본 콘텐츠
    return (
      <Layout
        title="디자인 시스템"
        description="DogNote 디자인 시스템에 오신 것을 환영합니다"
      >
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">시작하기</h3>
          <p>왼쪽 사이드바에서 카테고리와 컴포넌트를 선택하여 시작하세요.</p>
        </div>
      </Layout>
    );
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* 사이드바 */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
}
