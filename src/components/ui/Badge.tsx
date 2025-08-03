import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  dot?: boolean;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
    success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
    warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const shapes = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
    square: 'rounded-none',
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        shapes[shape],
        className
      )}
      {...props}
    >
      {dot && (
        <div
          className={cn(
            'mr-1 rounded-full bg-current',
            dotSizes[size]
          )}
        />
      )}
      {children}
    </div>
  );
};

// 숫자 배지 컴포넌트
export interface NumberBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
  className?: string;
}

const NumberBadge: React.FC<NumberBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  variant = 'destructive',
  size = 'sm',
  className,
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant={variant}
      size={size}
      shape="pill"
      className={cn('min-w-5 justify-center', className)}
    >
      {displayCount}
    </Badge>
  );
};

// 상태 배지 컴포넌트
export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away' | 'idle';
  showText?: boolean;
  size?: BadgeProps['size'];
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showText = true,
  size = 'md',
  className,
}) => {
  const statusConfig = {
    online: { variant: 'success' as const, text: '온라인', dot: true },
    offline: { variant: 'secondary' as const, text: '오프라인', dot: true },
    busy: { variant: 'destructive' as const, text: '바쁨', dot: true },
    away: { variant: 'warning' as const, text: '자리비움', dot: true },
    idle: { variant: 'info' as const, text: '대기중', dot: true },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      shape="pill"
      dot={config.dot}
      className={className}
    >
      {showText && config.text}
    </Badge>
  );
};

export { NumberBadge, StatusBadge };
export default Badge;
