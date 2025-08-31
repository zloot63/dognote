import * as React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '@/lib/utils';

const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        12: "grid-cols-12",
        auto: "grid-cols-auto",
        fit: "grid-cols-fit",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      cols: "auto",
      gap: "md",
    },
  }
);

export interface GridProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  responsive?: {
    sm?: VariantProps<typeof gridVariants>['cols'];
    md?: VariantProps<typeof gridVariants>['cols'];
    lg?: VariantProps<typeof gridVariants>['cols'];
    xl?: VariantProps<typeof gridVariants>['cols'];
  };
  children: React.ReactNode;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, responsive, children, ...props }, ref) => {
    const responsiveClasses = responsive ? [
      responsive.sm && `sm:grid-cols-${responsive.sm === 'auto' ? 'auto' : responsive.sm === 'fit' ? 'fit' : responsive.sm}`,
      responsive.md && `md:grid-cols-${responsive.md === 'auto' ? 'auto' : responsive.md === 'fit' ? 'fit' : responsive.md}`,
      responsive.lg && `lg:grid-cols-${responsive.lg === 'auto' ? 'auto' : responsive.lg === 'fit' ? 'fit' : responsive.lg}`,
      responsive.xl && `xl:grid-cols-${responsive.xl === 'auto' ? 'auto' : responsive.xl === 'fit' ? 'fit' : responsive.xl}`,
    ].filter(Boolean).join(' ') : '';

    return (
      <div
        ref={ref}
        className={cn(
          gridVariants({ cols, gap }),
          responsiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = "Grid";

// Grid Item variants
const gridItemVariants = cva(
  "",
  {
    variants: {
      span: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        12: "col-span-12",
        full: "col-span-full",
      },
      start: {
        1: "col-start-1",
        2: "col-start-2",
        3: "col-start-3",
        4: "col-start-4",
        5: "col-start-5",
        6: "col-start-6",
        7: "col-start-7",
        8: "col-start-8",
        9: "col-start-9",
        10: "col-start-10",
        11: "col-start-11",
        12: "col-start-12",
      },
      end: {
        1: "col-end-1",
        2: "col-end-2",
        3: "col-end-3",
        4: "col-end-4",
        5: "col-end-5",
        6: "col-end-6",
        7: "col-end-7",
        8: "col-end-8",
        9: "col-end-9",
        10: "col-end-10",
        11: "col-end-11",
        12: "col-end-12",
        13: "col-end-13",
      },
    },
  }
);

export interface GridItemProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  responsive?: {
    sm?: { 
      span?: VariantProps<typeof gridItemVariants>['span']; 
      start?: VariantProps<typeof gridItemVariants>['start']; 
      end?: VariantProps<typeof gridItemVariants>['end']; 
    };
    md?: { 
      span?: VariantProps<typeof gridItemVariants>['span']; 
      start?: VariantProps<typeof gridItemVariants>['start']; 
      end?: VariantProps<typeof gridItemVariants>['end']; 
    };
    lg?: { 
      span?: VariantProps<typeof gridItemVariants>['span']; 
      start?: VariantProps<typeof gridItemVariants>['start']; 
      end?: VariantProps<typeof gridItemVariants>['end']; 
    };
    xl?: { 
      span?: VariantProps<typeof gridItemVariants>['span']; 
      start?: VariantProps<typeof gridItemVariants>['start']; 
      end?: VariantProps<typeof gridItemVariants>['end']; 
    };
  };
  children: React.ReactNode;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, start, end, responsive, children, ...props }, ref) => {
    const responsiveClasses = responsive ? [
      responsive.sm?.span && `sm:col-span-${responsive.sm.span === 'full' ? 'full' : responsive.sm.span}`,
      responsive.sm?.start && `sm:col-start-${responsive.sm.start}`,
      responsive.sm?.end && `sm:col-end-${responsive.sm.end}`,
      responsive.md?.span && `md:col-span-${responsive.md.span === 'full' ? 'full' : responsive.md.span}`,
      responsive.md?.start && `md:col-start-${responsive.md.start}`,
      responsive.md?.end && `md:col-end-${responsive.md.end}`,
      responsive.lg?.span && `lg:col-span-${responsive.lg.span === 'full' ? 'full' : responsive.lg.span}`,
      responsive.lg?.start && `lg:col-start-${responsive.lg.start}`,
      responsive.lg?.end && `lg:col-end-${responsive.lg.end}`,
      responsive.xl?.span && `xl:col-span-${responsive.xl.span === 'full' ? 'full' : responsive.xl.span}`,
      responsive.xl?.start && `xl:col-start-${responsive.xl.start}`,
      responsive.xl?.end && `xl:col-end-${responsive.xl.end}`,
    ].filter(Boolean).join(' ') : '';

    return (
      <div
        ref={ref}
        className={cn(
          gridItemVariants({ span, start, end }),
          responsiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GridItem.displayName = "GridItem";

// Flex variants
const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        col: "flex-col",
        "row-reverse": "flex-row-reverse",
        "col-reverse": "flex-col-reverse",
      },
      wrap: {
        wrap: "flex-wrap",
        nowrap: "flex-nowrap",
        "wrap-reverse": "flex-wrap-reverse",
      },
      justify: {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      align: {
        start: "items-start",
        end: "items-end",
        center: "items-center",
        baseline: "items-baseline",
        stretch: "items-stretch",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      direction: "row",
      wrap: "nowrap",
      justify: "start",
      align: "start",
      gap: "none",
    },
  }
);

export interface FlexProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  children: React.ReactNode;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, wrap, justify, align, gap, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(flexVariants({ direction, wrap, justify, align, gap }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Flex.displayName = "Flex";

export { Grid, GridItem, Flex, gridVariants, gridItemVariants, flexVariants };
