import React from 'react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  maxItems,
  className,
  onItemClick,
}) => {
  // 기본 구분자
  const defaultSeparator = (
    <svg
      className="h-4 w-4 text-muted-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  // 아이템 수 제한 처리
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    if (maxItems <= 1) {
      return [items[items.length - 1]];
    }

    if (maxItems === 2) {
      return [items[0], items[items.length - 1]];
    }

    // maxItems > 2인 경우
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 2));
    
    return [
      firstItem,
      { label: '...', disabled: true },
      ...lastItems,
    ];
  }, [items, maxItems]);

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (!item.disabled) {
      onItemClick?.(item, index);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1', className)}
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={index} className="flex items-center space-x-1">
              {/* 브레드크럼 아이템 */}
              <div className="flex items-center">
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (onItemClick) {
                        e.preventDefault();
                        handleItemClick(item, index);
                      }
                    }}
                    className={cn(
                      'flex items-center space-x-1 rounded-md px-2 py-1 text-sm transition-colors',
                      isLast
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      item.disabled && 'pointer-events-none opacity-50'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleItemClick(item, index)}
                    disabled={item.disabled || isEllipsis}
                    className={cn(
                      'flex items-center space-x-1 rounded-md px-2 py-1 text-sm transition-colors',
                      isLast
                        ? 'text-foreground font-medium cursor-default'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      (item.disabled || isEllipsis) && 'pointer-events-none opacity-50',
                      !isLast && !item.disabled && !isEllipsis && 'cursor-pointer'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon && !isEllipsis && (
                      <span className="flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </button>
                )}
              </div>

              {/* 구분자 */}
              {!isLast && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
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
  const breadcrumbItems: BreadcrumbItem[] = items.map((item) => ({
    label: item,
  }));

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    onItemClick?.(item.label, index);
  };

  return (
    <Breadcrumb
      items={breadcrumbItems}
      separator={separator}
      className={className}
      onItemClick={handleItemClick}
    />
  );
};

export { SimpleBreadcrumb };
export default Breadcrumb;
