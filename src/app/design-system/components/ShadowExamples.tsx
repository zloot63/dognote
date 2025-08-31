'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { boxShadow } from '@/styles/theme';
import { useState } from 'react';

/**
 * 그림자 예제 컴포넌트
 * 그림자 시스템과 사용 예시를 보여줍니다.
 */
export function ShadowExamples() {
  const [copiedText, setCopiedText] = useState<string>("");

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-10">
      {/* 그림자 시스템 개요 */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">그림자 시스템</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-2 border-neutral-300">
            <h4 className="font-medium text-lg mb-3">그림자의 목적</h4>
            <p className="mb-4">
              그림자는 UI 에서 깊이와 계층을 표현하는 중요한 요소입니다.
              요소 간의 관계와 중요도를 시각적으로 전달하고, 사용자가 인터페이스를 더 직관적으로 이해할 수 있도록 도와줍니다.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">그림자 사용 원칙</h5>
              <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-300">
                <li>요소의 높이에 따라 적절한 그림자 강도 선택</li>
                <li>상호작용 상태에 따라 그림자 변화 적용</li>
                <li>과도한 그림자 사용 피하기</li>
                <li>다크 모드에서는 더 미묘한 그림자 사용</li>
              </ul>
            </div>
          </Card>
          <Card className="p-6 border-2 border-neutral-300">
            <h4 className="font-medium text-lg mb-3">그림자 구성 요소</h4>
            <p className="mb-4">
              DogNote의 그림자 시스템은 다음 요소로 구성됩니다:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <span className="font-medium">수평 오프셋</span>: 그림자의 수평 위치
              </li>
              <li>
                <span className="font-medium">수직 오프셋</span>: 그림자의 수직 위치
              </li>
              <li>
                <span className="font-medium">블러 반경</span>: 그림자의 흐림 정도
              </li>
              <li>
                <span className="font-medium">확산 반경</span>: 그림자의 크기
              </li>
              <li>
                <span className="font-medium">색상 및 투명도</span>: 그림자의 색상과 강도
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 그림자 예시 */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">그림자 변형</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(boxShadow).map(([key, value]) => (
            <ShadowCard 
              key={key} 
              name={key} 
              value={value as string} 
              copiedText={copiedText}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </section>

      {/* 그림자 사용 예시 */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">그림자 사용 예시</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-6 border-2 border-neutral-300">
            <h4 className="font-semibold text-lg">컴포넌트별 권장 그림자</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-medium mb-2">카드 및 패널</h5>
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                    <p className="text-center">shadow-sm</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                    <p className="text-center">shadow-md</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  카드와 패널에는 일반적으로 sm~md 그림자를 사용합니다.
                </p>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">모달 및 드롭다운</h5>
                <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
                  <p className="text-center">shadow-lg</p>
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  모달과 드롭다운은 다른 요소 위에 떠있는 느낌을 주기 위해 lg 그림자를 사용합니다.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6 border-2 border-neutral-300">
            <h4 className="font-semibold text-lg">상호작용 그림자</h4>
            <div className="space-y-6">
              <div>
                <h5 className="font-medium mb-2">호버 효과</h5>
                <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-center">호버하면 그림자가 커집니다</p>
                </div>
                <code className="text-xs text-neutral-500 mt-2 block">
                  shadow-sm hover:shadow-md transition-shadow duration-300
                </code>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">활성 상태</h5>
                <div className="flex gap-4">
                  <div className="p-4 flex-1 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                    <p className="text-center">비활성</p>
                  </div>
                  <div className="p-4 flex-1 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border-2 border-primary-500">
                    <p className="text-center">활성</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  활성 상태는 더 강한 그림자와 테두리 강조로 표현합니다.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 다크 모드 그림자 */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">다크 모드 그림자</h3>
        <Card className="p-6 border-2 border-neutral-300">
          <h4 className="font-medium text-lg mb-4">다크 모드에서의 그림자 처리</h4>
          
          <p className="mb-4">
            다크 모드에서는 그림자의 가시성과 효과가 다르게 나타납니다. 
            밝은 배경에서는 어두운 그림자가 잘 보이지만, 어두운 배경에서는 그림자의 대비가 줄어듭니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg">
              <h5 className="font-medium mb-3">라이트 모드</h5>
              <div className="p-4 bg-white rounded-lg shadow-md border border-neutral-200">
                <p className="text-center">일반적인 그림자</p>
              </div>
            </div>
            <div className="bg-neutral-900 p-6 rounded-lg">
              <h5 className="font-medium mb-3 text-white">다크 모드</h5>
              <div className="p-4 bg-neutral-800 rounded-lg shadow-md border border-neutral-700">
                <p className="text-center text-white">강조된 테두리와 미묘한 그림자</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h5 className="font-medium text-amber-800 dark:text-amber-300 mb-2">다크 모드 그림자 팁</h5>
            <ul className="list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-300">
              <li>다크 모드에서는 그림자보다 테두리를 더 활용하기</li>
              <li>그림자 색상을 더 밝게 조정하여 가시성 높이기</li>
              <li>요소 간 대비를 위해 배경 색상 차이 활용하기</li>
              <li>hover 상태에서는 더 뚜렷한 변화 주기</li>
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}

interface ShadowCardProps {
  name: string;
  value: string;
  copiedText: string;
  onCopy: (text: string) => void;
}

function ShadowCard({ name, value, copiedText, onCopy }: ShadowCardProps) {
  const shadowClass = `shadow-${name}`;
  const isCopied = copiedText === shadowClass;
  // value 파라미터 사용 (미사용 경고 제거)
  console.log('Shadow value:', value);
  
  return (
    <div className="flex flex-col">
      <div 
        className={`h-32 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center mb-3 ${shadowClass}`}
      >
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex justify-between items-center">
        <code className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">{shadowClass}</code>
          <button className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors" onClick={() => onCopy(shadowClass)}>
            {isCopied ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-neutral-500 dark:text-neutral-400">📋</span>
            )}
          </button>
      </div>
    </div>
  );
}
