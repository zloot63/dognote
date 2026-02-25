'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';

/**
 * 레이아웃 컴포넌트 통합 테스트 페이지
 */
export default function LayoutTestPage() {
  const [currentVariant, setCurrentVariant] = useState<
    'default' | 'dashboard' | 'minimal' | 'auth'
  >('default');
  const [showHeader, setShowHeader] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showFooter, setShowFooter] = useState(false);
  const [showWalkButton, setShowWalkButton] = useState(true);

  const variants = [
    { key: 'default', label: '기본' },
    { key: 'dashboard', label: '대시보드' },
    { key: 'minimal', label: '미니멀' },
    { key: 'auth', label: '인증' },
  ] as const;

  return (
    <Layout
      variant={currentVariant}
      showHeader={showHeader}
      showBottomNav={showBottomNav}
      showFooter={showFooter}
      showWalkButton={showWalkButton}
    >
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏗️ 레이아웃 컴포넌트 테스트
          </h1>
          <p className="text-gray-600">
            DogNote의 레이아웃 시스템을 테스트할 수 있는 페이지입니다.
          </p>
        </div>

        {/* 레이아웃 설정 컨트롤 */}
        <Card>
          <CardHeader>
            <CardTitle>레이아웃 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 변형 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                레이아웃 변형
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {variants.map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={currentVariant === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentVariant(key)}
                    className="w-full"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 컴포넌트 표시 옵션 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showHeader}
                  onChange={e => setShowHeader(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">헤더 표시</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showBottomNav}
                  onChange={e => setShowBottomNav(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">하단 네비</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showFooter}
                  onChange={e => setShowFooter(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">푸터 표시</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showWalkButton}
                  onChange={e => setShowWalkButton(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">산책 버튼</span>
              </label>
            </div>

            {/* 현재 설정 표시 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">현재 설정</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  변형: <span className="font-medium">{currentVariant}</span>
                </div>
                <div>
                  헤더:{' '}
                  <span className="font-medium">
                    {showHeader ? '표시' : '숨김'}
                  </span>
                </div>
                <div>
                  하단 네비:{' '}
                  <span className="font-medium">
                    {showBottomNav ? '표시' : '숨김'}
                  </span>
                </div>
                <div>
                  푸터:{' '}
                  <span className="font-medium">
                    {showFooter ? '표시' : '숨김'}
                  </span>
                </div>
                <div>
                  산책 버튼:{' '}
                  <span className="font-medium">
                    {showWalkButton ? '표시' : '숨김'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 네비게이션 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>네비게이션 컴포넌트 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 사이드바 스타일 */}
            <div>
              <h4 className="font-medium mb-3">사이드바 스타일</h4>
              <div className="bg-white border rounded-lg p-4 max-w-xs">
                <Navigation variant="sidebar" showLabels={true} />
              </div>
            </div>

            {/* 수평 스타일 */}
            <div>
              <h4 className="font-medium mb-3">수평 스타일</h4>
              <div className="bg-white border rounded-lg p-4">
                <Navigation variant="horizontal" showLabels={true} />
              </div>
            </div>

            {/* 하단 네비 스타일 */}
            <div>
              <h4 className="font-medium mb-3">하단 네비게이션 스타일</h4>
              <div className="bg-white border rounded-lg p-4">
                <Navigation variant="bottom" showLabels={true} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 푸터 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>푸터 컴포넌트 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 풀 푸터 */}
            <div>
              <h4 className="font-medium mb-3">풀 푸터</h4>
              <div className="border rounded-lg overflow-hidden">
                <Footer variant="full" />
              </div>
            </div>

            {/* 미니멀 푸터 */}
            <div>
              <h4 className="font-medium mb-3">미니멀 푸터</h4>
              <div className="border rounded-lg overflow-hidden">
                <Footer variant="minimal" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 샘플 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>샘플 카드 {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  레이아웃 테스트를 위한 샘플 컨텐츠입니다. 다양한 화면 크기에서
                  레이아웃이 어떻게 동작하는지 확인할 수 있습니다.
                </p>
                <Button className="mt-4 w-full" size="sm">
                  테스트 버튼 {i}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 테스트 가이드 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">🧪 테스트 가이드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-blue-800">테스트 항목</h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li>✅ 레이아웃 변형 전환</li>
                  <li>✅ 헤더/푸터/네비 표시/숨김</li>
                  <li>✅ 반응형 레이아웃</li>
                  <li>✅ 네비게이션 활성 상태</li>
                  <li>✅ 산책 버튼 플로팅</li>
                  <li>✅ 스크롤 동작</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-800">확인 사항</h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li>• 모바일/데스크톱 반응형</li>
                  <li>• 컨텐츠 오버플로우 처리</li>
                  <li>• 네비게이션 접근성</li>
                  <li>• 색상 및 스타일 일관성</li>
                  <li>• 터치 인터랙션</li>
                  <li>• 성능 최적화</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
