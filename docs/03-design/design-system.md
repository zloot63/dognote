# 🎨 DogNote 디자인 시스템 (Design System)

_버전: 2.0_  
_최종 업데이트: 2025-08-31_  
_승인자: Design Lead, Frontend Lead_

---

## 📖 목차

1. [디자인 철학](#디자인-철학)
2. [디자인 토큰](#디자인-토큰)
3. [컬러 시스템](#컬러-시스템)
4. [타이포그래피](#타이포그래피)
5. [간격 시스템](#간격-시스템)
6. [컴포넌트 시스템](#컴포넌트-시스템)
7. [반응형 시스템](#반응형-시스템)
8. [접근성](#접근성)

---

## 1. 디자인 철학

### 1.1 브랜드 가치

> **"반려견과의 소중한 순간을 더욱 특별하게"**

DogNote의 디자인은 반려견과 함께하는 일상의 따뜻함과 즐거움을 시각적으로 표현합니다.

#### 핵심 가치

- **따뜻함 (Warmth)**: 부드러운 색상과 둥근 모서리
- **신뢰성 (Trust)**: 일관된 인터페이스와 명확한 정보 전달
- **즐거움 (Joy)**: 경쾌한 애니메이션과 친근한 톤앤매너
- **효율성 (Efficiency)**: 직관적인 사용성과 빠른 태스크 완료

### 1.2 디자인 원칙

#### 🎯 **사용자 중심 설계**

- 반려견 케어의 편의성 증대
- 데이터 입력의 간소화
- 정보 조회의 직관성

#### 🔄 **일관성 유지**

- 컴포넌트 재사용성 극대화
- 인터랙션 패턴 표준화
- 시각적 계층구조 일관성

#### ♿ **포용적 접근성**

- WCAG 2.1 AA 준수
- 다양한 디바이스 지원
- 여러 사용 시나리오 고려

---

## 2. 디자인 토큰

### 2.1 토큰 구조

```typescript
// 디자인 토큰 구조
interface DesignTokens {
  color: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  shadow: ShadowTokens;
  borderRadius: BorderRadiusTokens;
}

// Tailwind CSS 설정 연동
export const designTokens: DesignTokens = {
  color: {
    primary: {
      /* ... */
    },
    secondary: {
      /* ... */
    },
    neutral: {
      /* ... */
    },
    semantic: {
      /* ... */
    },
  },
  // ...
};
```

### 2.2 토큰 네이밍 규칙

```
{category}-{property}-{modifier}-{state}

예시:
- color-primary-500     (기본 주색상)
- color-primary-500-hover (호버 상태 주색상)
- spacing-4             (16px 간격)
- typography-body-lg    (큰 본문 텍스트)
```

---

## 3. 컬러 시스템

### 3.1 메인 컬러 팔레트

#### 🔵 Primary (파란색 계열)

```typescript
export const primary = {
  50: '#f0f9ff', // 배경용 (연한)
  100: '#e0f2fe', // 호버 배경
  200: '#bae6fd', // 비활성 상태
  300: '#7dd3fc', // 보조 요소
  400: '#38bdf8', // 인터랙티브 요소
  500: '#3b82f6', // 메인 브랜드 색상 ⭐
  600: '#2563eb', // 클릭/활성 상태
  700: '#1d4ed8', // 강조 요소
  800: '#1e40af', // 진한 텍스트
  900: '#1e3a8a', // 가장 진한 텍스트
} as const;
```

#### 시맨틱 컬러

```typescript
export const semantic = {
  success: '#10b981', // 성공 (산책 완료)
  warning: '#f59e0b', // 주의 (알림)
  error: '#ef4444', // 오류 (문제)
  info: '#3b82f6', // 정보 (안내)
} as const;
```

### 3.2 중성 컬러

```typescript
export const neutral = {
  0: '#ffffff', // 순백
  50: '#f9fafb', // 매우 연한 회색 (배경)
  100: '#f3f4f6', // 연한 회색 (카드 배경)
  200: '#e5e7eb', // 구분선
  300: '#d1d5db', // 테두리
  400: '#9ca3af', // 비활성 텍스트
  500: '#6b7280', // 보조 텍스트 ⭐
  600: '#4b5563', // 일반 텍스트
  700: '#374151', // 진한 텍스트
  800: '#1f2937', // 매우 진한 텍스트
  900: '#111827', // 메인 텍스트 ⭐
} as const;
```

### 3.3 컬러 사용 가이드

#### 텍스트 대비 규칙

```typescript
// WCAG 2.1 AA 준수 조합
const textColorCombinations = {
  // 높은 대비 (7:1 이상) - AAA 등급
  highContrast: [
    { bg: 'white', text: 'neutral-900' },
    { bg: 'neutral-900', text: 'white' },
    { bg: 'primary-500', text: 'white' },
  ],

  // 중간 대비 (4.5:1 이상) - AA 등급
  mediumContrast: [
    { bg: 'neutral-50', text: 'neutral-700' },
    { bg: 'primary-50', text: 'primary-800' },
  ],
} as const;
```

---

## 4. 타이포그래피

### 4.1 폰트 패밀리

```typescript
export const fontFamily = {
  // 한글 최적화 폰트 스택
  sans: [
    'Pretendard Variable', // 메인 한글 폰트
    'Pretendard',
    '-apple-system', // iOS Safari
    'BlinkMacSystemFont', // macOS Chrome
    'system-ui', // 시스템 기본 폰트
    sans - serif, // 최종 대체
  ],

  // 숫자/코드용 고정폭 폰트
  mono: ['"JetBrains Mono"', '"Fira Code"', 'Monaco', monospace],
} as const;
```

### 4.2 타이포그래피 스케일

```typescript
export const typography = {
  // 헤딩 계층
  heading: {
    xl: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.333', // 32px
      fontWeight: '600',
    },
    lg: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.4', // 28px
      fontWeight: '600',
    },
    md: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.556', // 28px
      fontWeight: '600',
    },
    sm: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5', // 24px
      fontWeight: '600',
    },
  },

  // 본문 계층
  body: {
    lg: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.556', // 28px
      fontWeight: '400',
    },
    md: {
      fontSize: '1rem', // 16px ⭐ 기본 크기
      lineHeight: '1.5', // 24px
      fontWeight: '400',
    },
    sm: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.429', // 20px
      fontWeight: '400',
    },
    xs: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.333', // 16px
      fontWeight: '400',
    },
  },
} as const;
```

---

## 5. 간격 시스템

### 5.1 간격 토큰

```typescript
export const spacing = {
  // 기본 단위: 4px (0.25rem)
  0: '0px',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px ⭐ 기본 단위
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px
} as const;
```

### 5.2 간격 사용 가이드

#### 컴포넌트 내부 간격

```typescript
const componentSpacing = {
  // 버튼 내부 패딩
  button: {
    sm: { x: 3, y: 1.5 }, // 12px 8px
    md: { x: 4, y: 2 }, // 16px 8px
    lg: { x: 6, y: 3 }, // 24px 12px
  },

  // 카드 내부 패딩
  card: {
    sm: 4, // 16px
    md: 6, // 24px
    lg: 8, // 32px
  },
} as const;
```

---

## 6. 컴포넌트 시스템

### 6.1 그림자와 깊이

```typescript
export const boxShadow = {
  // 레이어별 그림자
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  none: '0 0 #0000',

  // 포커스 링
  focus: '0 0 0 3px rgb(59 130 246 / 0.2)',
} as const;
```

### 6.2 Border Radius

```typescript
export const borderRadius = {
  none: '0px',
  sm: '0.125rem', // 2px
  md: '0.375rem', // 6px  ⭐ 기본값
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px', // 완전한 원
} as const;
```

---

## 7. 반응형 시스템

### 7.1 브레이크포인트

```typescript
export const breakpoints = {
  sm: '640px', // 모바일 (가로)
  md: '768px', // 태블릿 (세로)
  lg: '1024px', // 태블릿 (가로) / 데스크톱 (소)
  xl: '1280px', // 데스크톱 (중)
  '2xl': '1536px', // 데스크톱 (대)
} as const;

// 모바일 퍼스트 접근법
export const mediaQueries = {
  mobile: '@media (max-width: 639px)',
  tablet: '@media (min-width: 640px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
} as const;
```

### 7.2 컨테이너 시스템

```typescript
// 최대 너비 제한
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',

  // 컨텐츠 너비
  content: '1200px', // 메인 컨텐츠
  narrow: '768px', // 읽기 최적화
  wide: '1400px', // 대시보드
} as const;
```

---

## 8. 접근성

### 8.1 WCAG 2.1 AA 준수

#### 색상 대비

- **일반 텍스트**: 4.5:1 이상
- **큰 텍스트 (18px+)**: 3:1 이상
- **UI 컴포넌트**: 3:1 이상

#### 터치 타겟

- **최소 크기**: 44x44px
- **간격**: 8px 이상

#### 키보드 접근성

- **Tab 순서**: 논리적 순서
- **포커스 표시**: 명확한 시각적 표시
- **키보드 트랩**: 모달 내 포커스 관리

### 8.2 접근성 유틸리티

```typescript
// 스크린 리더 전용 텍스트
export const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
} as const;

// 포커스 가능한 요소 스타일
export const focusVisible = {
  '&:focus-visible': {
    outline: '2px solid var(--color-primary-500)',
    outlineOffset: '2px',
  },
} as const;
```

---

## 📎 참고 자료

### A. 구현 가이드

- [컴포넌트 구현 가이드](./ui-components.md)
- [접근성 체크리스트](./accessibility-guidelines.md)
- [반응형 디자인 가이드](./responsive-design.md)

### B. 디자인 도구

- **Figma**: UI 디자인 및 프로토타이핑
- **Tailwind CSS**: 유틸리티 CSS 프레임워크
- **Radix UI**: 접근성 우선 프리미티브

### C. 관련 문서

- [기술 명세서](../01-requirements/technical-specifications.md)
- [시스템 아키텍처](../02-architecture/system-architecture.md)

---

_본 문서는 디자인 시스템 발전에 따라 지속적으로 업데이트됩니다._

**문서 히스토리:**

- v1.0: 2025-08-03 (초기 디자인 시스템 구축)
- v2.0: 2025-08-31 (GlobalRules 표준 적용, 접근성 강화, 토큰 체계화)
