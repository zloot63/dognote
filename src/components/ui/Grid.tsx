import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' | 'fit';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: GridProps['cols'];
    md?: GridProps['cols'];
    lg?: GridProps['cols'];
    xl?: GridProps['cols'];
  };
  children: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({
  className,
  cols = 'auto',
  gap = 'md',
  responsive,
  children,
  ...props
}) => {
  const colsStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
    auto: 'grid-cols-auto',
    fit: 'grid-cols-fit',
  };

  const gapStyles = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const responsiveStyles = responsive ? {
    sm: responsive.sm ? `sm:${colsStyles[responsive.sm]}` : '',
    md: responsive.md ? `md:${colsStyles[responsive.md]}` : '',
    lg: responsive.lg ? `lg:${colsStyles[responsive.lg]}` : '',
    xl: responsive.xl ? `xl:${colsStyles[responsive.xl]}` : '',
  } : {};

  return (
    <div
      className={cn(
        'grid',
        colsStyles[cols],
        gapStyles[gap],
        Object.values(responsiveStyles).join(' '),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Grid Item 컴포넌트
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  responsive?: {
    sm?: { span?: GridItemProps['span']; start?: GridItemProps['start']; end?: GridItemProps['end'] };
    md?: { span?: GridItemProps['span']; start?: GridItemProps['start']; end?: GridItemProps['end'] };
    lg?: { span?: GridItemProps['span']; start?: GridItemProps['start']; end?: GridItemProps['end'] };
    xl?: { span?: GridItemProps['span']; start?: GridItemProps['start']; end?: GridItemProps['end'] };
  };
  children: React.ReactNode;
}

const GridItem: React.FC<GridItemProps> = ({
  className,
  span,
  start,
  end,
  responsive,
  children,
  ...props
}) => {
  const spanStyles = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    12: 'col-span-12',
    full: 'col-span-full',
  };

  const startStyles = {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
  };

  const endStyles = {
    1: 'col-end-1',
    2: 'col-end-2',
    3: 'col-end-3',
    4: 'col-end-4',
    5: 'col-end-5',
    6: 'col-end-6',
    7: 'col-end-7',
    8: 'col-end-8',
    9: 'col-end-9',
    10: 'col-end-10',
    11: 'col-end-11',
    12: 'col-end-12',
    13: 'col-end-13',
  };

  const getResponsiveClasses = () => {
    if (!responsive) return '';
    
    const classes: string[] = [];
    
    Object.entries(responsive).forEach(([breakpoint, styles]) => {
      if (styles.span) classes.push(`${breakpoint}:${spanStyles[styles.span]}`);
      if (styles.start) classes.push(`${breakpoint}:${startStyles[styles.start]}`);
      if (styles.end) classes.push(`${breakpoint}:${endStyles[styles.end]}`);
    });
    
    return classes.join(' ');
  };

  return (
    <div
      className={cn(
        span && spanStyles[span],
        start && startStyles[start],
        end && endStyles[end],
        getResponsiveClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Flex 컴포넌트 (그리드 대안)
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: GridProps['gap'];
  children: React.ReactNode;
}

const Flex: React.FC<FlexProps> = ({
  className,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'start',
  gap = 'none',
  children,
  ...props
}) => {
  const directionStyles = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const wrapStyles = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  const justifyStyles = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignStyles = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const gapStyles = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        directionStyles[direction],
        wrapStyles[wrap],
        justifyStyles[justify],
        alignStyles[align],
        gapStyles[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { GridItem, Flex };
export default Grid;
