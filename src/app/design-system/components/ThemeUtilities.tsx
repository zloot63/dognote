import React from 'react';
import themeUtils, { theme } from '@/lib/theme-utils';

interface ThemeUtilitiesProps {
  className?: string;
}

/**
 * 테마 유틸리티 예제 컴포넌트
 * 테마 시스템의 주요 기능과 사용 방법을 보여줌
 */
export function ThemeUtilities({ className = '' }: ThemeUtilitiesProps) {
  // 테마 유틸리티 예제 코드
  const exampleCode = {
    getColor: `// 색상 가져오기
const primaryColor = themeUtils.getColor('primary', 600);
const errorLight = themeUtils.getColor('error', 200);
const neutral = themeUtils.getColor('neutral');  // 기본값 500 사용`,

    getResponsiveColor: `// 반응형 색상 가져오기
const textColor = themeUtils.getResponsiveColor({
  light: 'neutral-900',
  dark: 'neutral-100'
});`,

    getSpacing: `// 간격 가져오기
const spacing = themeUtils.getSpacing(4);  // 1rem
const largeSpacing = themeUtils.getSpacing(8);  // 2rem`,

    getFontSize: `// 폰트 크기 가져오기
const fontSize = themeUtils.getFontSize('lg');  // 1.125rem
const smallFontSize = themeUtils.getFontSize('sm');  // 0.875rem`,

    getBorderRadius: `// 테두리 반경 가져오기
const radius = themeUtils.getBorderRadius('md');  // 0.375rem
const largeRadius = themeUtils.getBorderRadius('xl');  // 0.75rem`,

    getBoxShadow: `// 그림자 가져오기
const shadow = themeUtils.getBoxShadow('md');
const largeShadow = themeUtils.getBoxShadow('xl');`,

    generateCSSVariables: `// CSS 변수 생성하기
const cssVars = themeUtils.generateCSSVariables();
// 결과: { '--color-primary-500': '#3B82F6', ... }`,

    tw: `// Tailwind 클래스 생성하기
const buttonClasses = themeUtils.tw.bg.primary();  // 'bg-primary-500'
const textClasses = themeUtils.tw.text.secondary(700);  // 'text-secondary-700'
const paddingClasses = themeUtils.tw.spacing.p(4);  // 'p-4'`,

    cn: `// 클래스 결합하기
const classes = themeUtils.cn(
  'flex items-center',
  isActive && 'bg-primary-100',
  isDisabled && 'opacity-50 cursor-not-allowed'
);`,

    createComponentClasses: `// 컴포넌트 클래스 생성하기
const buttonClasses = themeUtils.createComponentClasses('button', 'primary', 'md');`
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold mb-4">테마 유틸리티</h3>
        <p className="mb-4">
          DogNote 디자인 시스템은 일관된 테마 적용을 위한 다양한 유틸리티 함수를 제공합니다.
          이 함수들은 색상, 간격, 폰트 크기 등의 디자인 토큰을 쉽게 사용할 수 있게 해줍니다.
        </p>

        {/* 테마 유틸리티 섹션 */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">색상 유틸리티</h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.getColor}</code>
              </pre>
            </div>
            <div className="mt-2 bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.getResponsiveColor}</code>
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">간격 및 크기 유틸리티</h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.getSpacing}</code>
              </pre>
            </div>
            <div className="mt-2 bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.getFontSize}</code>
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">스타일 유틸리티</h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.getBorderRadius}</code>
              </pre>
            </div>
            <div className="mt-2 bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.getBoxShadow}</code>
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">CSS 변수 및 클래스 생성</h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.generateCSSVariables}</code>
              </pre>
            </div>
            <div className="mt-2 bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.tw}</code>
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">유틸리티 함수</h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.cn}</code>
              </pre>
            </div>
            <div className="mt-2 bg-neutral-50 p-4 rounded-lg">
              <pre className="text-sm text-neutral-700 overflow-x-auto">
                <code>{exampleCode.createComponentClasses}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* 테마 시스템 구조 */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">테마 시스템 구조</h4>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <pre className="text-sm text-neutral-700 overflow-x-auto">
              <code>{`// 테마 객체 구조 (간략화)
const theme = {
  colors: {
    primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a', ... },
    secondary: { ... },
    neutral: { ... },
    // ...기타 색상 스케일
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    // ...기타 간격 값
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    // ...기타 폰트 크기
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    // ...기타 반경 값
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    // ...기타 그림자 값
  }
}`}</code>
            </pre>
          </div>
        </div>

        {/* 사용 가이드 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">사용 권장사항</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
              <li>하드코딩된 값 대신 테마 유틸리티 사용</li>
              <li>일관된 디자인 토큰으로 UI 구성</li>
              <li>다크 모드는 getResponsiveColor 활용</li>
              <li>반복되는 스타일은 variants 객체로 추출</li>
              <li>컴포넌트 간 일관성을 위해 createComponentClasses 활용</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">사용 주의사항</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
              <li>테마 객체를 직접 수정하지 않기</li>
              <li>하드코딩된 색상 값 피하기</li>
              <li>과도한 커스텀 변형 생성 자제</li>
              <li>성능을 위해 불필요한 동적 클래스 생성 피하기</li>
              <li>테마 확장 시 타입 안전성 유지하기</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
