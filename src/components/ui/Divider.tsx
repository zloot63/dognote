import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: 'thin' | 'medium' | 'thick';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

const Divider: React.FC<DividerProps> = ({
  className,
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  spacing = 'md',
  label,
  labelPosition = 'center',
  ...props
}) => {
  const orientationStyles = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px',
  };

  const variantStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const thicknessStyles = {
    thin: orientation === 'horizontal' ? 'border-t' : 'border-l',
    medium: orientation === 'horizontal' ? 'border-t-2' : 'border-l-2',
    thick: orientation === 'horizontal' ? 'border-t-4' : 'border-l-4',
  };

  const spacingStyles = {
    none: orientation === 'horizontal' ? 'my-0' : 'mx-0',
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
    xl: orientation === 'horizontal' ? 'my-8' : 'mx-8',
  };

  const labelPositionStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  if (label && orientation === 'horizontal') {
    return (
      <div
        className={cn(
          'flex items-center',
          spacingStyles[spacing],
          labelPositionStyles[labelPosition],
          className
        )}
        {...props}
      >
        {labelPosition !== 'left' && (
          <div
            className={cn(
              'flex-1',
              thicknessStyles[thickness],
              variantStyles[variant],
              'border-border'
            )}
          />
        )}
        <span className="px-3 text-sm text-muted-foreground bg-background">
          {label}
        </span>
        {labelPosition !== 'right' && (
          <div
            className={cn(
              'flex-1',
              thicknessStyles[thickness],
              variantStyles[variant],
              'border-border'
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        orientationStyles[orientation],
        thicknessStyles[thickness],
        variantStyles[variant],
        spacingStyles[spacing],
        'border-border',
        className
      )}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
};

// 간단한 구분선 컴포넌트들
export const Hr: React.FC<{ className?: string }> = ({ className }) => (
  <Divider className={className} />
);

export const Vr: React.FC<{ className?: string }> = ({ className }) => (
  <Divider orientation="vertical" className={className} />
);

export default Divider;
