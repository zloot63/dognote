import React from 'react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showInfo?: boolean;
  maxPageNumbers?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  showInfo = true,
  maxPageNumbers = 7,
  size = 'md',
  className,
  onPageChange,
}) => {
  // 페이지 번호 계산
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPageNumbers / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxPageNumbers - 1);

    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(1, end - maxPageNumbers + 1);
    }

    const pages: (number | string)[] = [];

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const sizeStyles = {
    sm: 'h-8 min-w-8 text-xs',
    md: 'h-9 min-w-9 text-sm',
    lg: 'h-10 min-w-10 text-base',
  };

  const pageNumbers = getPageNumbers();
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // 정보 텍스트 생성
  const getInfoText = (): string => {
    if (!totalItems || !itemsPerPage) {
      return `${currentPage} / ${totalPages} 페이지`;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return `${startItem}-${endItem} / ${totalItems}개 항목`;
  };

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {/* 페이지 네비게이션 */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* 첫 페이지 */}
        {showFirstLast && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrev}
            className={cn(
              'inline-flex items-center justify-center rounded-md border border-input bg-background px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              sizeStyles[size]
            )}
            aria-label="첫 페이지로 이동"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 이전 페이지 */}
        {showPrevNext && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrev}
            className={cn(
              'inline-flex items-center justify-center rounded-md border border-input bg-background px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              sizeStyles[size]
            )}
            aria-label="이전 페이지로 이동"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 페이지 번호들 */}
        {showPageNumbers && pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className={cn(
                  'inline-flex items-center justify-center px-2 text-muted-foreground',
                  sizeStyles[size]
                )}
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'inline-flex items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                sizeStyles[size],
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label={`${pageNumber}페이지로 이동`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* 다음 페이지 */}
        {showPrevNext && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className={cn(
              'inline-flex items-center justify-center rounded-md border border-input bg-background px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              sizeStyles[size]
            )}
            aria-label="다음 페이지로 이동"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* 마지막 페이지 */}
        {showFirstLast && (
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            className={cn(
              'inline-flex items-center justify-center rounded-md border border-input bg-background px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              sizeStyles[size]
            )}
            aria-label="마지막 페이지로 이동"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </nav>

      {/* 페이지 정보 */}
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          {getInfoText()}
        </div>
      )}
    </div>
  );
};

// 간단한 페이지네이션 컴포넌트
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showFirstLast={false}
      showInfo={false}
      maxPageNumbers={5}
      className={className}
    />
  );
};

export { SimplePagination };
export default Pagination;
