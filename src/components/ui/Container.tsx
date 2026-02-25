import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const containerVariants = cva('w-full', {
  variants: {
    size: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
      full: 'max-w-full',
    },
    padding: {
      none: '',
      sm: 'px-4 py-2',
      md: 'px-6 py-4',
      lg: 'px-8 py-6',
      xl: 'px-12 py-8',
    },
    center: {
      true: 'mx-auto',
      false: '',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'md',
    center: true,
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  children: React.ReactNode;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, center, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size, padding, center }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';

// 섹션 컨테이너 컴포넌트
const sectionVariants = cva('', {
  variants: {
    background: {
      none: '',
      muted: 'bg-muted',
      card: 'bg-card',
      accent: 'bg-accent',
    },
    border: {
      true: 'border border-border',
      false: '',
    },
    shadow: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
  },
  defaultVariants: {
    background: 'none',
    border: false,
    shadow: 'none',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof containerVariants>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'div' | 'article' | 'aside';
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      as: Component = 'section',
      className,
      size = 'lg',
      padding = 'lg',
      center = true,
      background = 'none',
      border = false,
      shadow = 'none',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        className={cn(
          containerVariants({ size, padding, center }),
          sectionVariants({ background, border, shadow }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Section.displayName = 'Section';

export { Container, Section, containerVariants, sectionVariants };
