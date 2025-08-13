import React from 'react';
import { Loader2 } from 'lucide-react';
import { 
  cn, 
  variants, 
  animations,
  type ComponentSize 
} from '@/lib/theme-utils';

// ============================================================================
// TYPES & INTERFACES - 타입 정의
// ============================================================================

/**
 * Button 컴포넌트의 변형 타입
 * theme-utils의 variants.button과 동기화
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive' 
  | 'success' 
  | 'warning'
  | 'info'
  | 'default'
  | 'link';

/**
 * Button 컴포넌트의 크기 타입
 * 일관된 크기 시스템 사용
 */
export type ButtonSize = ComponentSize;

/**
 * Button 컴포넌트의 모서리 둥글기 타입
 */
export type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Button 컴포넌트의 그림자 타입
 */
export type ButtonShadow = 'none' | 'sm' | 'md' | 'lg';

/**
 * Button 컴포넌트 Props 인터페이스
 * 확장 가능하고 타입 안전한 설계
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 시각적 변형 */
  variant?: ButtonVariant;
  /** 버튼의 크기 */
  size?: ButtonSize;
  /** 로딩 상태 표시 여부 */
  loading?: boolean;
  /** 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  /** 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 모서리 둥글기 */
  rounded?: ButtonRounded;
  /** 그림자 효과 */
  shadow?: ButtonShadow;
  /** 버튼 내용 */
  children: React.ReactNode;
}

// ============================================================================
// STYLE CONFIGURATION - 스타일 구성
// ============================================================================

/**
 * 버튼 크기별 스타일 매핑
 * theme-utils의 spacing과 typography 시스템 활용
 */
const BUTTON_SIZES: Record<ButtonSize, string> = {
  xs: cn(
    'h-7 px-2 gap-1',
    'text-xs',
  ),
  sm: cn(
    'h-8 px-3 gap-1.5',
    'text-sm',
  ),
  md: cn(
    'h-10 px-4 py-2 gap-2',
    'text-sm',
  ),
  lg: cn(
    'h-11 px-6 gap-2',
    'text-base',
  ),
  xl: cn(
    'h-12 px-8 gap-2.5',
    'text-lg',
  ),
};

/**
 * 버튼 모서리 둥글기 스타일 매핑
 * theme-utils의 borderRadius 시스템 활용
 */
const BUTTON_ROUNDED: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

/**
 * 버튼 그림자 효과 스타일 매핑
 * theme-utils의 boxShadow 시스템과 hover 효과 결합
 */
const BUTTON_SHADOWS: Record<ButtonShadow, string> = {
  none: '',
  sm: cn('shadow-sm', 'hover:shadow-md', animations.transition.normal),
  md: cn('shadow-md', 'hover:shadow-lg', animations.transition.normal),
  lg: cn('shadow-lg', 'hover:shadow-xl', animations.transition.normal),
};

/**
 * 로딩 아이콘 크기 매핑
 * 버튼 크기에 따른 적절한 아이콘 크기
 */
const LOADING_ICON_SIZES: Record<ButtonSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4 w-4',
  xl: 'h-5 w-5',
};

// ============================================================================
// UTILITY FUNCTIONS - 유틸리티 함수들
// ============================================================================

/**
 * 버튼의 기본 스타일 클래스 생성
 * 모든 버튼에 공통으로 적용되는 스타일
 */
function getBaseButtonStyles(): string {
  return cn(
    // 레이아웃 및 정렬
    'inline-flex items-center justify-center',
    // 타이포그래피
    'font-medium',
    // 상호작용 효과
    animations.transition.normal,
    animations.focus.ring,
    'active:scale-95',
    // 비활성화 상태
    'disabled:pointer-events-none disabled:opacity-50',
    // 사용자 선택 방지
    'select-none'
  );
}

/**
 * 버튼 변형에 따른 스타일 클래스 반환
 * theme-utils의 variants 시스템 활용
 */
function getVariantStyles(variant: ButtonVariant): string {
  const variantMap: Record<ButtonVariant, string> = {
    primary: variants.button.primary,
    secondary: variants.button.secondary,
    outline: variants.button.outline,
    ghost: variants.button.ghost,
    destructive: variants.button.destructive,
    success: variants.button.success,
    warning: variants.button.warning,
    info: variants.button.info,
    default: variants.button.default,
    link: variants.button.link
  };
  
  return variantMap[variant] || variants.button.primary;
}

/**
 * 아이콘 컨테이너 스타일 생성
 * 일관된 아이콘 배치와 간격 제공
 */
function getIconContainerStyles(): string {
  return cn(
    'flex-shrink-0',
    'flex items-center justify-center'
  );
}

/**
 * 버튼 텍스트 컨테이너 스타일 생성
 * 텍스트 오버플로우 처리와 정렬
 */
function getTextContainerStyles(): string {
  return cn(
    'flex-1',
    'truncate',
    'text-center',
    // 아이콘이 있을 때 여백 조정은 gap으로 처리되므로 제거
  );
}

// ============================================================================
// MAIN COMPONENT - 메인 컴포넌트
// ============================================================================

/**
 * 고도화된 Button 컴포넌트
 * theme-utils 기반의 일관된 디자인 시스템 적용
 * 확장 가능하고 유지보수 용이한 구조
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled, 
    leftIcon,
    rightIcon,
    fullWidth = false,
    rounded = 'md',
    shadow = 'sm',
    children, 
    ...props 
  }, ref) => {
    // 상태 계산
    const isDisabled = disabled || loading;
    const hasLeftIcon = !loading && !!leftIcon;
    const hasRightIcon = !loading && !!rightIcon;
    const showLoadingIcon = loading;
    
    // 스타일 클래스 조합
    const buttonClasses = cn(
      getBaseButtonStyles(),
      getVariantStyles(variant),
      BUTTON_SIZES[size],
      BUTTON_ROUNDED[rounded],
      BUTTON_SHADOWS[shadow],
      fullWidth && 'w-full',
      className
    );
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {/* 왼쪽 아이콘 또는 로딩 아이콘 */}
        {showLoadingIcon && (
          <span className={getIconContainerStyles()}>
            <Loader2
              className={cn(
                LOADING_ICON_SIZES[size],
                animations.loading.spin
              )} 
            />
          </span>
        )}
        
        {hasLeftIcon && (
          <span className={getIconContainerStyles()}>
            {leftIcon}
          </span>
        )}
        
        {/* 버튼 텍스트 */}
        <span className={getTextContainerStyles()}>
          {children}
        </span>
        
        {/* 오른쪽 아이콘 */}
        {hasRightIcon && (
          <span className={getIconContainerStyles()}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// 버튼 그룹 컴포넌트
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  spacing = 'sm'
}) => {
  const orientationStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  const spacingStyles = {
    none: 'gap-0',
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  return (
    <div className={cn(
      'flex',
      orientationStyles[orientation],
      spacingStyles[spacing],
      className
    )}>
      {children}
    </div>
  );
};

// 아이콘 버튼 컴포넌트
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', rounded = 'md', ...props }, ref) => {
    const iconSizes = {
      xs: 'h-4 w-4',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6'
    };

    return (
      <Button
        ref={ref}
        size={size}
        rounded={rounded}
        className={cn('aspect-square p-0', className)}
        {...props}
      >
        <span className={iconSizes[size]}>
          {icon}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { Button };
export default Button;
