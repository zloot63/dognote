import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  showPercentage = false,
  label,
  animated = false,
  striped = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    destructive: 'bg-red-500',
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* 라벨 및 퍼센티지 */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {showLabel && label && (
            <span className="font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <span className="text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* 프로그레스 바 */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-secondary',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            variants[variant],
            striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_1rem]',
            animated && striped && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
};

// 원형 프로그레스 컴포넌트
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  showPercentage?: boolean;
  showValue?: boolean;
  label?: string;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showPercentage = true,
  showValue = false,
  label,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variants = {
    default: 'stroke-primary',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    destructive: 'stroke-red-500',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-secondary"
        />
        
        {/* 프로그레스 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-300 ease-in-out', variants[variant])}
        />
      </svg>
      
      {/* 중앙 텍스트 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showPercentage && (
          <span className="text-lg font-semibold">
            {Math.round(percentage)}%
          </span>
        )}
        {showValue && (
          <span className="text-sm text-muted-foreground">
            {value} / {max}
          </span>
        )}
        {label && (
          <span className="text-xs text-muted-foreground mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

// 스텝 프로그레스 컴포넌트
export interface Step {
  label: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
  error?: boolean;
}

export interface StepProgressProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  orientation = 'horizontal',
  size = 'md',
  className,
}) => {
  const sizeStyles = {
    sm: {
      circle: 'h-6 w-6 text-xs',
      text: 'text-xs',
      line: 'h-0.5',
    },
    md: {
      circle: 'h-8 w-8 text-sm',
      text: 'text-sm',
      line: 'h-1',
    },
    lg: {
      circle: 'h-10 w-10 text-base',
      text: 'text-base',
      line: 'h-1.5',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center',
            orientation === 'vertical' && 'flex-col w-full'
          )}
        >
          {/* 스텝 원 */}
          <div className="relative flex items-center">
            <div
              className={cn(
                'flex items-center justify-center rounded-full border-2 font-medium',
                styles.circle,
                step.error
                  ? 'border-red-500 bg-red-500 text-white'
                  : step.completed
                  ? 'border-green-500 bg-green-500 text-white'
                  : step.current
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted bg-background text-muted-foreground'
              )}
            >
              {step.error ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : step.completed ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
          </div>

          {/* 스텝 텍스트 */}
          <div
            className={cn(
              'ml-3',
              orientation === 'vertical' && 'ml-0 mt-2 text-center',
              styles.text
            )}
          >
            <div
              className={cn(
                'font-medium',
                step.current
                  ? 'text-foreground'
                  : step.completed
                  ? 'text-green-600'
                  : step.error
                  ? 'text-red-600'
                  : 'text-muted-foreground'
              )}
            >
              {step.label}
            </div>
            {step.description && (
              <div className="text-muted-foreground">
                {step.description}
              </div>
            )}
          </div>

          {/* 연결선 */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 mx-4',
                orientation === 'horizontal' ? styles.line : 'w-0.5 h-8 my-2',
                step.completed ? 'bg-green-500' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export { CircularProgress, StepProgress };
export default Progress;
