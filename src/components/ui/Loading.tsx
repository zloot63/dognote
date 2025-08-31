import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '@/lib/utils';

// Spinner variants using cva
const spinnerVariants = cva(
  "animate-spin text-current",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// Skeleton variants using cva
const skeletonVariants = cva(
  "animate-pulse bg-muted",
  {
    variants: {
      variant: {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded",
      },
    },
    defaultVariants: {
      variant: "rectangular",
    },
  }
);

interface SpinnerProps 
  extends React.SVGAttributes<SVGElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn(spinnerVariants({ size }), className)}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }
);
Spinner.displayName = "Spinner";

// Loading component with text
interface LoadingProps extends VariantProps<typeof spinnerVariants> {
  text?: string;
  className?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ text = '로딩 중...', size = 'md', className }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center space-y-2 p-4",
          className
        )}
      >
        <Spinner size={size} />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    );
  }
);
Loading.displayName = "Loading";

// Enhanced Skeleton with more options
interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const EnhancedSkeleton = React.forwardRef<HTMLDivElement, EnhancedSkeletonProps>(
  ({ className, variant = 'rectangular', width, height, lines = 1, ...props }, ref) => {
    const baseClasses = "animate-pulse bg-muted";
    
    const variantClasses = {
      text: "h-4 rounded",
      circular: "rounded-full",
      rectangular: "rounded",
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(baseClasses, variantClasses[variant])}
              style={index === lines - 1 ? { ...style, width: '60%' } : style}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        style={style}
        {...props}
      />
    );
  }
);
EnhancedSkeleton.displayName = "EnhancedSkeleton";

// Card Skeleton component
interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3 p-4", className)} {...props}>
        <EnhancedSkeleton className="h-4 w-3/4" />
        <EnhancedSkeleton className="h-4 w-1/2" />
        <EnhancedSkeleton className="h-20 w-full" />
      </div>
    );
  }
);
CardSkeleton.displayName = "CardSkeleton";

// List Skeleton component
interface ListSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number;
}

const ListSkeleton = React.forwardRef<HTMLDivElement, ListSkeletonProps>(
  ({ items = 3, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <EnhancedSkeleton variant="circular" className="h-12 w-12" />
            <div className="space-y-2 flex-1">
              <EnhancedSkeleton className="h-4 w-3/4" />
              <EnhancedSkeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);
ListSkeleton.displayName = "ListSkeleton";

export { 
  Spinner, 
  Loading, 
  EnhancedSkeleton, 
  CardSkeleton, 
  ListSkeleton, 
  spinnerVariants,
  skeletonVariants
};
