import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-[1px] w-full',
      vertical: 'h-full w-[1px]',
    },
    variant: {
      solid: '',
      dashed: 'border-dashed bg-transparent border-t border-border',
      dotted: 'border-dotted bg-transparent border-t border-border',
    },
    thickness: {
      thin: '',
      medium: 'h-[2px] data-[orientation=vertical]:w-[2px]',
      thick: 'h-[4px] data-[orientation=vertical]:w-[4px]',
    },
    spacing: {
      none: 'my-0 mx-0',
      sm: 'my-2 mx-2',
      md: 'my-4 mx-4',
      lg: 'my-6 mx-6',
      xl: 'my-8 mx-8',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      variant: 'dashed',
      className: 'border-t border-l-0 border-r-0 border-b-0',
    },
    {
      orientation: 'horizontal',
      variant: 'dotted',
      className: 'border-t border-l-0 border-r-0 border-b-0',
    },
    {
      orientation: 'vertical',
      variant: 'dashed',
      className: 'border-l border-t-0 border-r-0 border-b-0',
    },
    {
      orientation: 'vertical',
      variant: 'dotted',
      className: 'border-l border-t-0 border-r-0 border-b-0',
    },
    {
      orientation: 'horizontal',
      spacing: 'none',
      className: 'my-0',
    },
    {
      orientation: 'horizontal',
      spacing: 'sm',
      className: 'my-2',
    },
    {
      orientation: 'horizontal',
      spacing: 'md',
      className: 'my-4',
    },
    {
      orientation: 'horizontal',
      spacing: 'lg',
      className: 'my-6',
    },
    {
      orientation: 'horizontal',
      spacing: 'xl',
      className: 'my-8',
    },
    {
      orientation: 'vertical',
      spacing: 'none',
      className: 'mx-0',
    },
    {
      orientation: 'vertical',
      spacing: 'sm',
      className: 'mx-2',
    },
    {
      orientation: 'vertical',
      spacing: 'md',
      className: 'mx-4',
    },
    {
      orientation: 'vertical',
      spacing: 'lg',
      className: 'mx-6',
    },
    {
      orientation: 'vertical',
      spacing: 'xl',
      className: 'mx-8',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    thickness: 'thin',
    spacing: 'md',
  },
});

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> &
    VariantProps<typeof separatorVariants>
>(
  (
    {
      className,
      orientation = 'horizontal',
      variant,
      thickness,
      spacing,
      decorative = true,
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        separatorVariants({ orientation, variant, thickness, spacing }),
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// Enhanced Divider with label support
export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = 'horizontal',
      variant = 'solid',
      thickness = 'thin',
      spacing = 'md',
      label,
      labelPosition = 'center',
      ...props
    },
    ref
  ) => {
    if (!label) {
      return (
        <Separator
          ref={ref}
          className={className}
          orientation={orientation || undefined}
          variant={variant}
          thickness={thickness}
          spacing={spacing}
          {...props}
        />
      );
    }

    if (orientation === 'vertical') {
      // 세로 방향에서는 라벨을 지원하지 않음
      return (
        <Separator
          ref={ref}
          className={className}
          orientation={orientation}
          variant={variant}
          thickness={thickness}
          spacing={spacing}
          {...props}
        />
      );
    }

    const labelPositionStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    const spacingClass = {
      none: 'my-0',
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-6',
      xl: 'my-8',
    }[spacing || 'md'];

    return (
      <div
        ref={ref}
        className={cn('relative flex items-center', spacingClass, className)}
        {...props}
      >
        <div
          className={cn(
            'flex w-full items-center',
            labelPositionStyles[labelPosition]
          )}
        >
          {labelPosition !== 'left' && (
            <Separator
              className="flex-1"
              orientation={orientation || 'horizontal'}
              variant={variant}
              thickness={thickness}
              spacing="none"
            />
          )}
          <span className="px-3 text-sm text-muted-foreground bg-background">
            {label}
          </span>
          {labelPosition !== 'right' && (
            <Separator
              className="flex-1"
              orientation={orientation || 'horizontal'}
              variant={variant}
              thickness={thickness}
              spacing="none"
            />
          )}
        </div>
      </div>
    );
  }
);
Divider.displayName = 'Divider';

// 간단한 구분선 컴포넌트들
const Hr = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={className}
    orientation="horizontal"
    {...props}
  />
));
Hr.displayName = 'Hr';

const Vr = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={className}
    orientation="vertical"
    {...props}
  />
));
Vr.displayName = 'Vr';

export { Separator, Divider, Hr, Vr, separatorVariants };
