import * as React from 'react';
import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ComponentType<{ className?: string }>;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

// Enhanced Breadcrumb with custom features
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const EnhancedBreadcrumb: React.FC<EnhancedBreadcrumbProps> = ({
  items,
  separator,
  maxItems,
  className,
  onItemClick,
}) => {
  // 아이템 수 제한 처리
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    if (maxItems <= 1) {
      return [items[items.length - 1]];
    }

    // 첫 번째와 마지막 아이템을 유지하고 중간에 ellipsis 추가
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));

    return [firstItem, { label: '...', disabled: true }, ...lastItems];
  }, [items, maxItems]);

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (item.disabled || item.label === '...') return;
    onItemClick?.(item, index);
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {displayItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.icon && <span className="mr-1 h-4 w-4">{item.icon}</span>}
              {item.label === '...' ? (
                <BreadcrumbEllipsis />
              ) : index === displayItems.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink
                  href={item.href}
                  onClick={e => {
                    if (onItemClick) {
                      e.preventDefault();
                      handleItemClick(item, index);
                    }
                  }}
                  className={cn(
                    item.disabled && 'pointer-events-none opacity-50'
                  )}
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <span
                  onClick={() => handleItemClick(item, index)}
                  className={cn(
                    'cursor-pointer transition-colors hover:text-foreground',
                    item.disabled && 'pointer-events-none opacity-50'
                  )}
                >
                  {item.label}
                </span>
              )}
            </BreadcrumbItem>
            {index < displayItems.length - 1 && (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

// 간단한 브레드크럼 컴포넌트 (문자열 배열 사용)
export interface SimpleBreadcrumbProps {
  items: string[];
  separator?: React.ReactNode;
  className?: string;
  onItemClick?: (item: string, index: number) => void;
}

const SimpleBreadcrumb: React.FC<SimpleBreadcrumbProps> = ({
  items,
  separator,
  className,
  onItemClick,
}) => {
  const breadcrumbItems: BreadcrumbItem[] = items.map(item => ({
    label: item,
  }));

  return (
    <EnhancedBreadcrumb
      items={breadcrumbItems}
      separator={separator}
      className={className}
      onItemClick={(item, index) => onItemClick?.(item.label, index)}
    />
  );
};

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  EnhancedBreadcrumb,
  SimpleBreadcrumb,
};
