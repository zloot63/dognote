/**
 * DogNote Design System - Theme Utilities
 * 
 * 고도화된 테마 유틸리티 라이브러리
 * - 타입 안전성 보장
 * - 확장 가능한 아키텍처
 * - 개발자 친화적 API
 * - 성능 최적화
 * 
 * @version 2.0.0
 * @author DogNote Team
 */

import { theme } from '@/styles/theme';

// ============================================================================
// TYPE DEFINITIONS - 강력한 타입 시스템
// ============================================================================

/** 테마 컬러 스케일 타입 */
export type ColorScale = keyof typeof theme.colors;

/** 컬러 음영 타입 */
export type ColorShade = keyof typeof theme.colors.primary;

/** 간격 키 타입 */
export type SpacingKey = keyof typeof theme.spacing;

/** 폰트 크기 키 타입 */
export type FontSizeKey = keyof typeof theme.typography.fontSize;

/** 보더 반지름 키 타입 */
export type BorderRadiusKey = keyof typeof theme.borderRadius;

/** 그림자 키 타입 */
export type ShadowKey = keyof typeof theme.boxShadow;

/** 컴포넌트 변형 타입 */
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'info';

/** 컴포넌트 크기 타입 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** CSS 속성 값 타입 */
export type CSSValue = string;

/** 테마 토큰 인터페이스 */
export interface ThemeToken {
  value: CSSValue;
  description?: string;
  deprecated?: boolean;
}

/** 반응형 값 타입 */
export type ResponsiveValue<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

/** 다크모드 지원 값 타입 */
export type ThemeAwareValue<T> = T | {
  light: T;
  dark: T;
};

// ============================================================================
// CORE UTILITY FUNCTIONS - 핵심 유틸리티 함수들
// ============================================================================

/**
 * 안전하고 타입 안전한 컬러 값 조회
 * @param scale - 컬러 스케일 (primary, secondary, neutral 등)
 * @param shade - 컬러 음영 (50, 100, 200 등)
 * @returns CSS 컬러 값 또는 fallback
 * 
 * @example
 * ```
 * const primaryColor = getColor('primary', 600); // '#4f46e5'
 * const invalidColor = getColor('invalid', 999); // fallback color
 * ```
 */
export function getColor(scale: ColorScale, shade: ColorShade): CSSValue {
  try {
    const colorScale = theme.colors[scale];
    if (!colorScale) {
      console.warn(`[ThemeUtils] Invalid color scale: ${scale}`);
      return theme.colors.neutral[500]; // fallback
    }
    
    const colorValue = colorScale[shade as keyof typeof colorScale];
    if (!colorValue) {
      console.warn(`[ThemeUtils] Invalid color shade: ${shade} for scale: ${scale}`);
      return theme.colors.neutral[500]; // fallback
    }
    
    return colorValue;
  } catch (error) {
    console.error('[ThemeUtils] Error getting color:', error);
    return theme.colors.neutral[500]; // fallback
  }
}

/**
 * 반응형 컬러 값 생성
 * @param scale - 컬러 스케일
 * @param shades - 반응형 음영 설정
 * @returns 반응형 CSS 클래스 문자열
 */
export function getResponsiveColor(
  scale: ColorScale, 
  shades: ResponsiveValue<ColorShade>
): string {
  if (typeof shades === 'string' || typeof shades === 'number') {
    return `text-${scale}-${shades}`;
  }
  
  const classes = [];
  if (shades.base) classes.push(`text-${scale}-${shades.base}`);
  if (shades.sm) classes.push(`sm:text-${scale}-${shades.sm}`);
  if (shades.md) classes.push(`md:text-${scale}-${shades.md}`);
  if (shades.lg) classes.push(`lg:text-${scale}-${shades.lg}`);
  if (shades.xl) classes.push(`xl:text-${scale}-${shades.xl}`);
  
  return classes.join(' ');
}

/**
 * 간격 값 조회 (에러 처리 포함)
 * @param key - 간격 키
 * @returns CSS 간격 값
 */
export function getSpacing(key: SpacingKey): CSSValue {
  const value = theme.spacing[key];
  if (!value) {
    console.warn(`[ThemeUtils] Invalid spacing key: ${key}`);
    return theme.spacing[4]; // fallback to 1rem
  }
  return value;
}

/**
 * 반응형 간격 값 생성
 * @param property - CSS 속성 (p, m, px, py 등)
 * @param values - 반응형 간격 값
 * @returns 반응형 CSS 클래스 문자열
 */
export function getResponsiveSpacing(
  property: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr',
  values: ResponsiveValue<SpacingKey>
): string {
  if (typeof values === 'string' || typeof values === 'number') {
    return `${property}-${values}`;
  }
  
  const classes = [];
  if (values.base) classes.push(`${property}-${values.base}`);
  if (values.sm) classes.push(`sm:${property}-${values.sm}`);
  if (values.md) classes.push(`md:${property}-${values.md}`);
  if (values.lg) classes.push(`lg:${property}-${values.lg}`);
  if (values.xl) classes.push(`xl:${property}-${values.xl}`);
  
  return classes.join(' ');
}

/**
 * 폰트 크기 설정 조회
 * @param key - 폰트 크기 키
 * @returns 폰트 크기와 라인 높이 설정
 */
export function getFontSize(key: FontSizeKey): [string, { lineHeight: string }] | [string] {
  const value = theme.typography.fontSize[key];
  if (!value) {
    console.warn(`[ThemeUtils] Invalid font size key: ${key}`);
    return theme.typography.fontSize.base; // fallback
  }
  return value;
}

/**
 * 보더 반지름 값 조회
 * @param key - 보더 반지름 키
 * @returns CSS 보더 반지름 값
 */
export function getBorderRadius(key: BorderRadiusKey): CSSValue {
  const value = theme.borderRadius[key];
  if (!value) {
    console.warn(`[ThemeUtils] Invalid border radius key: ${key}`);
    return theme.borderRadius.md; // fallback
  }
  return value;
}

/**
 * 박스 그림자 값 조회
 * @param key - 그림자 키
 * @returns CSS 박스 그림자 값
 */
export function getBoxShadow(key: ShadowKey): CSSValue {
  const value = theme.boxShadow[key];
  if (!value) {
    console.warn(`[ThemeUtils] Invalid box shadow key: ${key}`);
    return theme.boxShadow.sm; // fallback
  }
  return value;
}

// ============================================================================
// CSS VARIABLES & ADVANCED UTILITIES - CSS 변수 및 고급 유틸리티
// ============================================================================

/**
 * 테마에서 CSS 커스텀 속성(변수) 생성
 * CSS-in-JS 또는 CSS 변수 시스템에 유용
 * 
 * @param options - 생성 옵션
 * @returns CSS 변수 객체
 * 
 * @example
 * ```typescript
 * const cssVars = generateCSSVariables({ prefix: 'dognote' });
 * // { '--dognote-color-primary-500': '#4f46e5', ... }
 * ```
 */
export function generateCSSVariables(options: {
  prefix?: string;
  includeColors?: boolean;
  includeSpacing?: boolean;
  includeTypography?: boolean;
  includeBorderRadius?: boolean;
  includeBoxShadow?: boolean;
  darkMode?: boolean;
} = {}): Record<string, CSSValue> {
  const {
    prefix = '',
    includeColors = true,
    includeSpacing = true,
    includeTypography = true,
    includeBorderRadius = true,
    includeBoxShadow = true,
    darkMode = false
  } = options;
  
  const cssVars: Record<string, CSSValue> = {};
  const varPrefix = prefix ? `--${prefix}-` : '--';
  
  try {
    // Colors
    if (includeColors) {
      Object.entries(theme.colors).forEach(([scale, shades]) => {
        Object.entries(shades).forEach(([shade, value]) => {
          const varName = `${varPrefix}color-${scale}-${shade}`;
          cssVars[varName] = value;
          
          // 다크모드 지원을 위한 추가 변수
          if (darkMode && scale === 'neutral') {
            const darkValue = getDarkModeColor(scale as ColorScale, shade as unknown as ColorShade);
            cssVars[`${varName}-dark`] = darkValue;
          }
        });
      });
    }
    
    // Spacing
    if (includeSpacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        cssVars[`${varPrefix}spacing-${key}`] = value;
      });
    }
    
    // Typography
    if (includeTypography) {
      Object.entries(theme.typography.fontSize).forEach(([key, sizeConfig]) => {
        const [size, config] = Array.isArray(sizeConfig) ? sizeConfig : [sizeConfig, {}];
        cssVars[`${varPrefix}font-size-${key}`] = size;
        
        if (typeof config === 'object' && config.lineHeight) {
          cssVars[`${varPrefix}line-height-${key}`] = config.lineHeight;
        }
      });
      
      // 폰트 패밀리
      if (theme.typography.fontFamily) {
        Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
          cssVars[`${varPrefix}font-family-${key}`] = Array.isArray(value) ? value.join(', ') : value;
        });
      }
    }
    
    // Border radius
    if (includeBorderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        cssVars[`${varPrefix}border-radius-${key}`] = value;
      });
    }
    
    // Box shadow
    if (includeBoxShadow) {
      Object.entries(theme.boxShadow).forEach(([key, value]) => {
        cssVars[`${varPrefix}box-shadow-${key}`] = value;
      });
    }
    
    return cssVars;
  } catch (error) {
    console.error('[ThemeUtils] Error generating CSS variables:', error);
    return {};
  }
}

/**
 * CSS 변수를 DOM에 주입
 * @param variables - CSS 변수 객체
 * @param target - 주입할 대상 엘리먼트 (기본: document.documentElement)
 */
export function injectCSSVariables(
  variables: Record<string, CSSValue>,
  target: HTMLElement = document.documentElement
): void {
  try {
    Object.entries(variables).forEach(([name, value]) => {
      target.style.setProperty(name, value);
    });
  } catch (error) {
    console.error('[ThemeUtils] Error injecting CSS variables:', error);
  }
}

/**
 * 다크모드 컬러 값 계산 (간단한 구현)
 * @param scale - 컬러 스케일
 * @param shade - 컬러 음영
 * @returns 다크모드용 컬러 값
 */
function getDarkModeColor(scale: ColorScale, shade: ColorShade): CSSValue {
  // 간단한 다크모드 변환 로직 (실제로는 더 정교한 로직 필요)
  const lightColor = getColor(scale, shade);
  
  // neutral 컬러의 경우 명도 반전
  if (scale === 'neutral') {
    // 안전한 타입 변환을 위한 매핑 테이블
    const shadeMap: Record<ColorShade, ColorShade> = {
      50: 950, 100: 900, 200: 800, 300: 700, 400: 600,
      500: 500, 600: 400, 700: 300, 800: 200, 900: 100, 950: 50,
      DEFAULT: 500
    };
    
    const invertedShade = shadeMap[shade] || 500;
    return getColor(scale, invertedShade);
  }
  
  return lightColor;
}

// ============================================================================
// TAILWIND CSS CLASS GENERATORS - Tailwind CSS 클래스 생성기
// ============================================================================

/**
 * 고도화된 Tailwind CSS 클래스 생성기
 * 타입 안전성과 자동 완성 지원
 */
export const tw = {
  // 배경 컬러
  bg: {
    primary: (shade: ColorShade = 600) => `bg-primary-${shade}`,
    secondary: (shade: ColorShade = 600) => `bg-secondary-${shade}`,
    neutral: (shade: ColorShade = 600) => `bg-neutral-${shade}`,
    success: (shade: ColorShade = 600) => `bg-success-${shade}`,
    warning: (shade: ColorShade = 600) => `bg-warning-${shade}`,
    error: (shade: ColorShade = 600) => `bg-error-${shade}`,
    info: (shade: ColorShade = 600) => `bg-info-${shade}`,
  },
  
  // 텍스트 컬러
  text: {
    primary: (shade: ColorShade = 600) => `text-primary-${shade}`,
    secondary: (shade: ColorShade = 600) => `text-secondary-${shade}`,
    neutral: (shade: ColorShade = 600) => `text-neutral-${shade}`,
    success: (shade: ColorShade = 600) => `text-success-${shade}`,
    warning: (shade: ColorShade = 600) => `text-warning-${shade}`,
    error: (shade: ColorShade = 600) => `text-error-${shade}`,
    info: (shade: ColorShade = 600) => `text-info-${shade}`,
  },
  
  // 보더 컬러
  border: {
    primary: (shade: ColorShade = 600) => `border-primary-${shade}`,
    secondary: (shade: ColorShade = 600) => `border-secondary-${shade}`,
    neutral: (shade: ColorShade = 600) => `border-neutral-${shade}`,
    success: (shade: ColorShade = 600) => `border-success-${shade}`,
    warning: (shade: ColorShade = 600) => `border-warning-${shade}`,
    error: (shade: ColorShade = 600) => `border-error-${shade}`,
    info: (shade: ColorShade = 600) => `border-info-${shade}`,
  },
  
  // 링 컬러 (포커스 상태)
  ring: {
    primary: (shade: ColorShade = 500) => `ring-primary-${shade}`,
    secondary: (shade: ColorShade = 500) => `ring-secondary-${shade}`,
    neutral: (shade: ColorShade = 500) => `ring-neutral-${shade}`,
    success: (shade: ColorShade = 500) => `ring-success-${shade}`,
    warning: (shade: ColorShade = 500) => `ring-warning-${shade}`,
    error: (shade: ColorShade = 500) => `ring-error-${shade}`,
    info: (shade: ColorShade = 500) => `ring-info-${shade}`,
  },
  
  // 간격 유틸리티
  spacing: {
    p: (key: SpacingKey) => `p-${key}`,
    px: (key: SpacingKey) => `px-${key}`,
    py: (key: SpacingKey) => `py-${key}`,
    pt: (key: SpacingKey) => `pt-${key}`,
    pb: (key: SpacingKey) => `pb-${key}`,
    pl: (key: SpacingKey) => `pl-${key}`,
    pr: (key: SpacingKey) => `pr-${key}`,
    m: (key: SpacingKey) => `m-${key}`,
    mx: (key: SpacingKey) => `mx-${key}`,
    my: (key: SpacingKey) => `my-${key}`,
    mt: (key: SpacingKey) => `mt-${key}`,
    mb: (key: SpacingKey) => `mb-${key}`,
    ml: (key: SpacingKey) => `ml-${key}`,
    mr: (key: SpacingKey) => `mr-${key}`,
  },
  
  // 타이포그래피
  typography: {
    size: (key: FontSizeKey) => `text-${key}`,
    weight: {
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
  },
  
  // 보더 반지름
  rounded: (key: BorderRadiusKey) => `rounded-${key}`,
  
  // 그림자
  shadow: (key: ShadowKey) => `shadow-${key}`,
};

// ============================================================================
// COMPONENT VARIANT GENERATORS - 컴포넌트 변형 생성기
// ============================================================================

/**
 * 컴포넌트별 사전 정의된 변형 스타일
 * 일관성 있는 디자인과 유지보수성 향상
 */
export const variants = {
  // 버튼 변형
  button: {
    primary: 'bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary-500 shadow-sm transition-colors duration-200',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-500 shadow-sm transition-colors duration-200',
    outline: 'border-2 border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-neutral-500 transition-colors duration-200',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-500 transition-colors duration-200',
    destructive: 'bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500 shadow-sm transition-colors duration-200',
    success: 'bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500 shadow-sm transition-colors duration-200',
    warning: 'bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500 shadow-sm transition-colors duration-200',
    info: 'bg-info-600 text-white hover:bg-info-700 focus-visible:ring-info-500 shadow-sm transition-colors duration-200',
    default: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-500 shadow-sm transition-colors duration-200',
    link: 'bg-transparent text-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:ring-neutral-500 transition-colors duration-200',
  },
  
  // 입력 필드 변형
  input: {
    default: 'border-2 border-neutral-200 bg-white rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200',
    filled: 'border-0 bg-neutral-100 rounded-lg focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all duration-200',
    underlined: 'border-0 border-b-2 border-neutral-200 bg-transparent rounded-none focus:border-primary-500 focus:ring-0 transition-colors duration-200',
    error: 'border-2 border-error-300 bg-white rounded-lg focus:border-error-500 focus:ring-4 focus:ring-error-100 transition-all duration-200',
  },
  
  // 배지 변형
  badge: {
    primary: 'bg-primary-100 text-primary-800 border border-primary-200 rounded-full px-2 py-1 text-xs font-medium',
    secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200 rounded-full px-2 py-1 text-xs font-medium',
    neutral: 'bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-full px-2 py-1 text-xs font-medium',
    success: 'bg-success-100 text-success-800 border border-success-200 rounded-full px-2 py-1 text-xs font-medium',
    warning: 'bg-warning-100 text-warning-800 border border-warning-200 rounded-full px-2 py-1 text-xs font-medium',
    error: 'bg-error-100 text-error-800 border border-error-200 rounded-full px-2 py-1 text-xs font-medium',
    info: 'bg-info-100 text-info-800 border border-info-200 rounded-full px-2 py-1 text-xs font-medium',
  },
  
  // 카드 변형
  card: {
    default: 'bg-white border border-neutral-200 rounded-lg shadow-sm',
    elevated: 'bg-white border border-neutral-200 rounded-lg shadow-lg',
    outlined: 'bg-white border-2 border-neutral-300 rounded-lg shadow-none',
    filled: 'bg-neutral-50 border-none rounded-lg shadow-sm',
    interactive: 'bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-lg hover:border-primary-300 cursor-pointer transition-all duration-200',
  },
  
  // 알림 변형
  alert: {
    info: 'bg-info-50 border border-info-200 text-info-800 rounded-lg p-4',
    success: 'bg-success-50 border border-success-200 text-success-800 rounded-lg p-4',
    warning: 'bg-warning-50 border border-warning-200 text-warning-800 rounded-lg p-4',
    error: 'bg-error-50 border border-error-200 text-error-800 rounded-lg p-4',
  },
};

// ============================================================================
// ANIMATION UTILITIES - 애니메이션 유틸리티
// ============================================================================

/**
 * 애니메이션 및 트랜지션 유틸리티
 * 일관된 애니메이션 경험 제공
 */
export const animations = {
  // 기본 트랜지션
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-200 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out',
    opacity: 'transition-opacity duration-200 ease-in-out',
  },
  
  // 호버 효과
  hover: {
    scale: 'hover:scale-105 active:scale-95 transition-transform duration-200',
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
    glow: 'hover:shadow-xl hover:shadow-primary-200/50 transition-shadow duration-200',
    brightness: 'hover:brightness-110 transition-all duration-200',
    opacity: 'hover:opacity-80 transition-opacity duration-200',
  },
  
  // 포커스 효과
  focus: {
    ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    glow: 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-100',
    scale: 'focus-visible:scale-105 transition-transform duration-200',
  },
  
  // 로딩 애니메이션
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
  },
};

// ============================================================================
// UTILITY FUNCTIONS - 고급 유틸리티 함수들
// ============================================================================

/**
 * 클래스 이름들을 조건부로 결합
 * @param classes - 클래스 이름들과 조건들
 * @returns 결합된 클래스 문자열
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 컴포넌트 변형과 크기를 결합하여 완전한 클래스 생성
 * @param component - 컴포넌트 타입
 * @param variant - 변형 타입
 * @param size - 크기 (선택사항)
 * @returns 완전한 CSS 클래스 문자열
 */
export function createComponentClasses(
  component: keyof typeof variants,
  variant: ComponentVariant,
  size?: ComponentSize
): string {
  const baseClasses = variants[component]?.[variant as keyof typeof variants[typeof component]] || '';
  
  // 크기별 클래스 추가 (간단한 구현)
  const sizeClasses = size ? getSizeClasses(size) : '';
  
  return cn(baseClasses, sizeClasses);
}

/**
 * 크기에 따른 클래스 반환
 * @param size - 컴포넌트 크기
 * @returns 크기 관련 CSS 클래스
 */
function getSizeClasses(size: ComponentSize): string {
  const sizeMap: Record<ComponentSize, string> = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
    xl: 'text-xl px-8 py-4',
  };
  
  return sizeMap[size] || sizeMap.md;
}

/**
 * 테마 값 검증 함수
 * @param value - 검증할 값
 * @param type - 값의 타입
 * @returns 검증 결과
 */
export function validateThemeValue(
  value: unknown,
  type: 'color' | 'spacing' | 'fontSize' | 'borderRadius' | 'boxShadow'
): boolean {
  try {
    switch (type) {
      case 'color':
        return typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value);
      case 'spacing':
      case 'fontSize':
      case 'borderRadius':
      case 'boxShadow':
        return typeof value === 'string' && value.length > 0;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

// ============================================================================
// MAIN EXPORT - 메인 익스포트
// ============================================================================

/**
 * 통합된 테마 유틸리티 객체
 * 모든 기능을 하나의 네임스페이스로 제공
 */
const themeUtils = {
  // 핵심 함수들
  getColor,
  getResponsiveColor,
  getSpacing,
  getResponsiveSpacing,
  getFontSize,
  getBorderRadius,
  getBoxShadow,
  
  // CSS 변수 관련
  generateCSSVariables,
  injectCSSVariables,
  
  // 클래스 생성기들
  tw,
  variants,
  animations,
  
  // 유틸리티 함수들
  cn,
  createComponentClasses,
  validateThemeValue,
  
  // 테마 객체 직접 접근
  theme,
} as const;

// 기본 익스포트
export default themeUtils;

// 개별 익스포트들은 이미 위에서 정의됨
// export { getColor, getSpacing, ... } 등
