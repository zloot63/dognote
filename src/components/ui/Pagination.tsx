import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { ButtonProps } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "hover:bg-accent hover:text-accent-foreground",
      size === "default" && "h-9 px-4 py-2",
      size === "sm" && "h-8 px-3 text-xs",
      size === "lg" && "h-10 px-8",
      size === "icon" && "h-9 w-9",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// Enhanced Pagination Component with all features
const paginationVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface EnhancedPaginationProps extends VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showInfo?: boolean;
  maxPageNumbers?: number;
  className?: string;
  onPageChange: (page: number) => void;
}

const EnhancedPagination = React.forwardRef<HTMLElement, EnhancedPaginationProps>(
  ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    showFirstLast = true,
    showPrevNext = true,
    showPageNumbers = true,
    showInfo = true,
    maxPageNumbers = 7,
    size = "md",
    className,
    onPageChange,
    ...props
  }, ref) => {
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

    const pageNumbers = getPageNumbers();

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };

    return (
      <div className={cn("space-y-4", className)} {...props}>
        {showInfo && totalItems && itemsPerPage && (
          <div className="text-sm text-muted-foreground text-center">
            {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
          </div>
        )}
        
        <Pagination ref={ref} className={paginationVariants({ size })}>
          <PaginationContent>
            {/* First Page */}
            {showFirstLast && currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  className="cursor-pointer"
                >
                  First
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Previous Page */}
            {showPrevNext && currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}

            {/* Page Numbers */}
            {showPageNumbers && pageNumbers.map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next Page */}
            {showPrevNext && currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}

            {/* Last Page */}
            {showFirstLast && currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  className="cursor-pointer"
                >
                  Last
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    );
  }
);
EnhancedPagination.displayName = "EnhancedPagination";

// 간단한 페이지네이션 컴포넌트
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const SimplePagination = React.forwardRef<HTMLElement, SimplePaginationProps>(
  ({ currentPage, totalPages, onPageChange, className, ...props }, ref) => {
    return (
      <EnhancedPagination
        ref={ref}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showFirstLast={false}
        showInfo={false}
        maxPageNumbers={5}
        className={className}
        {...props}
      />
    );
  }
);
SimplePagination.displayName = "SimplePagination";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  EnhancedPagination,
  SimplePagination,
}
