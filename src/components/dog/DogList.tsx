'use client';

// === AI 자동화 룰: 리스트 컴포넌트 자동 생성 패턴 ===
// 입력: 데이터 타입, 카드 컴포넌트, 필터/검색/정렬 요구사항
// 출력: 완전한 리스트 컴포넌트 (검색, 필터링, 정렬, 페이지네이션, 접근성)

import React, { useState, useCallback, useMemo, useId, memo } from 'react';
import { Dog } from '@/types/dog';
import DogCard from './DogCard';
import {
  Button,
  Input,
  CustomSelect,
  Grid,
  Container,
  Loading,
  Badge,
} from '@/components/ui';
import { cn } from '@/lib/utils';

// === AI 자동화 룰: 엄격한 타입 안전성 및 확장 가능한 Props ===
export interface DogListProps {
  // 데이터
  dogs: Dog[];
  isLoading?: boolean;
  error?: string | null;

  // 검색 및 필터링
  searchQuery: string;
  sortBy: 'name' | 'breed' | 'age' | 'updatedAt';
  sortOrder: 'asc' | 'desc';

  // 이벤트 핸들러
  onAddNew?: () => void;
  onEdit?: (dog: Dog) => void;
  onDelete?: (dog: Dog) => void;
  onView?: (dog: Dog) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (
    sortBy: DogListProps['sortBy'],
    sortOrder: DogListProps['sortOrder']
  ) => void;

  // UI 옵션
  className?: string;
  itemsPerPage?: number;
  showPagination?: boolean;

  // 접근성
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// 페이지네이션을 위한 타입
interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// === AI 자동화 룰: React.memo로 성능 최적화 ===
const DogList: React.FC<DogListProps> = memo(
  ({
    // 데이터
    dogs,
    isLoading = false,
    error = null,

    // 검색 및 필터링
    searchQuery,
    sortBy,
    sortOrder,

    // 이벤트 핸들러
    onAddNew,
    onEdit,
    onDelete,
    onView,
    onSearchChange,
    onSortChange,

    // UI 옵션
    className,
    itemsPerPage = 12,
    showPagination = true,

    // 접근성
    'aria-label': ariaLabel = '강아지 목록',
    'aria-describedby': ariaDescribedBy,
  }) => {
    // === AI 자동화 룰: 접근성을 위한 고유 ID 생성 ===
    const listId = useId();
    const searchId = useId();
    const filtersId = useId();

    // === AI 자동화 룰: 로컬 상태 관리 ===
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    // === AI 자동화 룰: useMemo를 통한 계산 최적화 ===
    const paginationData = useMemo(() => {
      const totalItems = dogs.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageItems = dogs.slice(startIndex, endIndex);

      return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        startIndex,
        endIndex,
        currentPageItems,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      };
    }, [dogs, currentPage, itemsPerPage]);

    // === AI 자동화 룰: 상수 데이터 메모이제이션 ===
    const sortOptions = useMemo(
      () => [
        { value: 'name', label: '이름순' },
        { value: 'age', label: '나이순' },
        { value: 'breed', label: '견종순' },
        { value: 'updatedAt', label: '수정일순' },
      ],
      []
    );

    // === AI 자동화 룰: useCallback으로 이벤트 핸들러 최적화 ===
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
      },
      [onSearchChange]
    );

    const handleSortChange = useCallback(
      (field: string) => {
        const newSortBy = field as DogListProps['sortBy'];
        // Only update if the field is different
        if (newSortBy !== sortBy) {
          const newSortOrder = 'asc'; // Start with asc when changing field
          onSortChange(newSortBy, newSortOrder);
          setCurrentPage(1); // 정렬 시 첫 페이지로 이동
        } else {
          // If same field, just toggle order
          const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
          onSortChange(newSortBy, newSortOrder);
          setCurrentPage(1); // 정렬 시 첫 페이지로 이동
        }
      },
      [sortBy, sortOrder, onSortChange]
    );

    const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
      setViewMode(mode);
    }, []);

    const handlePageChange = useCallback(
      (page: number) => {
        setCurrentPage(page);
        // 접근성: 페이지 변경 시 목록 상단으로 스크롤
        document
          .getElementById(listId)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      [listId]
    );

    // === AI 자동화 룰: 접근성 강화된 조기 반환 패턴 ===
    if (isLoading) {
      return (
        <Container className={className}>
          <div
            className="flex justify-center py-12"
            role="status"
            aria-live="polite"
          >
            <Loading size="lg" text="강아지 목록을 불러오는 중..." />
            <span className="sr-only">
              강아지 목록 데이터를 로딩하고 있습니다.
            </span>
          </div>
        </Container>
      );
    }

    // === AI 자동화 룰: 에러 상태 처리 ===
    if (error) {
      return (
        <Container className={className}>
          <div className="text-center py-12" role="alert" aria-live="assertive">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              오류 발생
            </h2>
            <p className="text-destructive mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              aria-label="페이지 새로고침하여 다시 시도"
            >
              다시 시도
            </Button>
          </div>
        </Container>
      );
    }

    // === AI 자동화 룰: 접근성 강화된 메인 렌더링 ===
    return (
      <Container
        className={cn('py-6', className)}
        role="main"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {/* === AI 자동화 룰: 접근성이 강화된 헤더 === */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 id={listId} className="text-2xl font-bold">
              내 강아지들
            </h1>
            <p className="text-muted-foreground" aria-live="polite">
              총 {dogs.length}마리의 강아지가 등록되어 있습니다
              {showPagination && paginationData.totalPages > 1 && (
                <span className="ml-2">
                  (페이지 {paginationData.currentPage}/
                  {paginationData.totalPages})
                </span>
              )}
            </p>
          </div>

          {onAddNew && (
            <Button onClick={onAddNew} aria-label="새로운 강아지 등록하기">
              + 새 강아지 등록
            </Button>
          )}
        </header>

        {/* === AI 자동화 룰: 접근성 강화된 검색 및 필터 섹션 === */}
        <section
          className="bg-card rounded-lg p-4 mb-6 space-y-4"
          aria-labelledby={`${searchId}-title`}
        >
          <h2 id={`${searchId}-title`} className="sr-only">
            검색 및 필터링 옵션
          </h2>

          {/* === AI 자동화 룰: 접근성이 강화된 검색바 === */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor={searchId} className="sr-only">
                강아지 검색
              </label>
              <Input
                id={searchId}
                placeholder="강아지 이름, 견종으로 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
                aria-describedby={`${searchId}-help`}
              />
              <div id={`${searchId}-help`} className="sr-only">
                강아지 이름이나 견종으로 검색할 수 있습니다. 검색어를 입력하면
                실시간으로 결과가 필터링됩니다.
              </div>
            </div>

            {/* === AI 자동화 룰: 보기 모드 선택 === */}
            <div
              className="flex gap-2"
              role="radiogroup"
              aria-label="목록 보기 모드 선택"
            >
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                role="radio"
                aria-checked={viewMode === 'grid'}
                aria-label="그리드 보기"
              >
                그리드
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                role="radio"
                aria-checked={viewMode === 'list'}
                aria-label="목록 보기"
              >
                목록
              </Button>
            </div>
          </div>

          {/* === AI 자동화 룰: 접근성이 강화된 정렬 옵션 === */}
          <div
            className="flex flex-col sm:flex-row gap-4"
            role="group"
            aria-labelledby={`${filtersId}-title`}
          >
            <h3 id={`${filtersId}-title`} className="sr-only">
              정렬 및 필터링 옵션
            </h3>

            <div className="flex gap-2">
              <label htmlFor={`${filtersId}-sort`} className="sr-only">
                정렬 기준
              </label>
              <CustomSelect
                id={`${filtersId}-sort`}
                placeholder="정렬 기준"
                options={sortOptions}
                value={sortBy}
                onChange={handleSortChange}
                aria-label="정렬 기준 선택"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSortChange(sortBy)}
                aria-label={`현재 ${sortOrder === 'asc' ? '오름차순' : '내림차순'}, 클릭하여 ${sortOrder === 'asc' ? '내림차순' : '오름차순'}으로 변경`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* === AI 자동화 룰: 검색 결과 요약 === */}
          {searchQuery && (
            <div
              className="flex items-center gap-2"
              role="status"
              aria-live="polite"
            >
              <Badge variant="secondary" className="text-sm">
                <span aria-label={`"${searchQuery}" 검색 결과`}>
                  {`검색: "{searchQuery}"`}
                </span>
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 hover:text-destructive focus:text-destructive focus:outline-none"
                  aria-label="검색어 지우기"
                  type="button"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </section>

        {/* === AI 자동화 룰: 접근성 강화된 결과 표시 === */}
        <section aria-labelledby={`${listId}-results`}>
          <h2 id={`${listId}-results`} className="sr-only">
            검색 결과
          </h2>

          {dogs.length === 0 ? (
            <div className="text-center py-12" role="status">
              <div>
                <p className="text-muted-foreground mb-4">
                  아직 등록된 강아지가 없습니다.
                </p>
                {onAddNew && (
                  <Button
                    onClick={onAddNew}
                    aria-label="첫 번째 강아지 등록하기"
                  >
                    첫 번째 강아지 등록하기
                  </Button>
                )}
              </div>
            </div>
          ) : paginationData.currentPageItems.length === 0 ? (
            <div className="text-center py-12" role="status">
              <div>
                <p className="text-muted-foreground mb-4">
                  검색 조건에 맞는 강아지가 없습니다.
                </p>
                <Button
                  variant="outline"
                  onClick={() => onSearchChange('')}
                  aria-label="검색어 초기화"
                >
                  검색 초기화
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* === AI 자동화 룰: 결과 요약 정보 === */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {showPagination
                    ? `${paginationData.startIndex + 1}-${Math.min(paginationData.endIndex, dogs.length)}개 (전체 ${dogs.length}개)`
                    : `${dogs.length}마리의 강아지를 찾았습니다`}
                </p>

                <div className="text-xs text-muted-foreground">
                  {sortBy}순 {sortOrder === 'asc' ? '오름차순' : '내림차순'}
                </div>
              </div>

              {/* === AI 자동화 룰: 접근성이 강화된 강아지 목록 === */}
              <div
                role="region"
                aria-label="강아지 목록"
                aria-live="polite"
                tabIndex={0}
              >
                {viewMode === 'grid' ? (
                  <Grid
                    cols={1}
                    gap="lg"
                    responsive={{
                      sm: 2,
                      md: 3,
                      lg: 4,
                    }}
                  >
                    {paginationData.currentPageItems.map((dog: Dog) => (
                      <DogCard
                        key={dog.id}
                        dog={dog}
                        variant="default"
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                      />
                    ))}
                  </Grid>
                ) : (
                  <div className="space-y-4">
                    {paginationData.currentPageItems.map((dog: Dog) => (
                      <DogCard
                        key={dog.id}
                        dog={dog}
                        variant="compact"
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* === AI 자동화 룰: 접근성 강화된 페이지네이션 === */}
              {showPagination && paginationData.totalPages > 1 && (
                <nav
                  className="flex justify-center items-center gap-2 mt-8"
                  aria-label="페이지 네비게이션"
                  role="navigation"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(paginationData.currentPage - 1)
                    }
                    disabled={!paginationData.hasPrevPage}
                    aria-label="이전 페이지"
                  >
                    이전
                  </Button>

                  <div className="flex gap-1">
                    {Array.from(
                      { length: paginationData.totalPages },
                      (_, i) => i + 1
                    )
                      .filter(page => {
                        const current = paginationData.currentPage;
                        return (
                          page === 1 ||
                          page === paginationData.totalPages ||
                          (page >= current - 1 && page <= current + 1)
                        );
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-1 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={
                              page === paginationData.currentPage
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            aria-label={`페이지 ${page}${page === paginationData.currentPage ? ' (현재 페이지)' : ''}`}
                            aria-current={
                              page === paginationData.currentPage
                                ? 'page'
                                : undefined
                            }
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(paginationData.currentPage + 1)
                    }
                    disabled={!paginationData.hasNextPage}
                    aria-label="다음 페이지"
                  >
                    다음
                  </Button>
                </nav>
              )}
            </>
          )}
        </section>
      </Container>
    );
  }
);

// === AI 자동화 룰: 디스플레이 네임 설정 ===
DogList.displayName = 'DogList';

export default DogList;

// === AI 자동화 룰: 타입 내보내기 ===
export type { PaginationState };
