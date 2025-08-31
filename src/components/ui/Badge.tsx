import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white shadow hover:bg-green-500/80",
        warning:
          "border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80",
        info:
          "border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, shape, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

// NumberBadge component for displaying numbers
export interface NumberBadgeProps extends BadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
}

const NumberBadge = React.forwardRef<HTMLDivElement, NumberBadgeProps>(
  ({ count, max = 99, showZero = false, className, variant = "destructive", size = "sm", shape = "rounded", ...props }, ref) => {
    if (count === 0 && !showZero) {
      return null;
    }

    const displayCount = max && count > max ? `${max}+` : count.toString();

    return (
      <Badge
        ref={ref}
        variant={variant}
        size={size}
        shape={shape}
        className={cn("min-w-[1.25rem] justify-center", className)}
        {...props}
      >
        {displayCount}
      </Badge>
    );
  }
);
NumberBadge.displayName = "NumberBadge";

// StatusBadge component for displaying status
export interface StatusBadgeProps extends BadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning';
  showDot?: boolean;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, showDot = true, className, ...props }, ref) => {
    const statusConfig = {
      active: { variant: 'success' as const, label: '활성' },
      inactive: { variant: 'secondary' as const, label: '비활성' },
      pending: { variant: 'warning' as const, label: '대기' },
      success: { variant: 'success' as const, label: '성공' },
      error: { variant: 'destructive' as const, label: '오류' },
      warning: { variant: 'warning' as const, label: '경고' },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={cn("gap-1", className)}
        {...props}
      >
        {showDot && (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {config.label}
      </Badge>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { Badge, NumberBadge, StatusBadge, badgeVariants }
