'use client';

// === AI 자동화 룰: 페이지 컴포넌트 자동 생성 패턴 ===
// 입력: 페이지 이름, 주요 기능 (CRUD), 데이터 타입
// 출력: 완전한 페이지 컴포넌트 (상태 관리, 접근성, 에러 처리, 로딩 상태, SEO)

import React, {
  useState,
  useCallback,
  useMemo,
  useId,
  useRef,
  Suspense,
} from 'react';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Dog, DogFormData } from '@/types/dog';
import {
  useDogs,
  useCreateDog,
  useUpdateDog,
  useDeleteDog,
} from '@/hooks/useDogs';
import DogList from '@/components/dog/DogList';
import DogForm from '@/components/dog/DogForm';
import DogCard from '@/components/dog/DogCard';
import { Button, Container, Loading } from '@/components/ui';
import ControlledModal from '@/components/ui/ControlledModal';
import { toast } from 'sonner';

// Memoize DogList to prevent unnecessary re-renders
const MemoizedDogList = React.memo(DogList);

// === AI 자동화: 타입 안전성 강화 ===
type ViewMode = 'list' | 'form' | 'detail';

interface PageState {
  viewMode: ViewMode;
  selectedDog: Dog | null;
  isFormModalOpen: boolean;
  isDeleteConfirmOpen: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'breed' | 'age' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

// === AI 자동화: 최적화된 페이지 컴포넌트 구조 ===
const DogsPage: React.FC = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const pageId = useId(); // 접근성: 고유 ID 생성
  const errorId = useId(); // 접근성: 에러 메시지 ID

  // === AI 자동화: 통합 상태 관리 ===
  const [pageState, setPageState] = useState<PageState>({
    viewMode: 'list',
    selectedDog: null,
    isFormModalOpen: false,
    isDeleteConfirmOpen: false,
    error: null,
    searchQuery: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  // Ref to track selectedDog without causing callback re-creation
  const selectedDogRef = useRef<Dog | null>(null);
  selectedDogRef.current = pageState.selectedDog;

  // === AI 자동화: React Query 최적화 ===
  const { data: dogs, isLoading, error: dogsError, refetch } = useDogs();
  const createDogMutation = useCreateDog();
  const updateDogMutation = useUpdateDog();
  const deleteDogMutation = useDeleteDog();

  // === AI 자동화: 메모이제이션된 계산 값들 ===
  const isEditMode = !!pageState.selectedDog;
  const isAnyLoading = useMemo(
    () =>
      isLoading ||
      createDogMutation.isPending ||
      updateDogMutation.isPending ||
      deleteDogMutation.isPending,
    [
      isLoading,
      createDogMutation.isPending,
      updateDogMutation.isPending,
      deleteDogMutation.isPending,
    ]
  );

  // 필터링된 강아지 목록
  const filteredAndSortedDogs = useMemo(() => {
    if (!dogs) return [];

    let filtered = dogs;

    // 검색 필터링
    if (pageState.searchQuery) {
      const query = pageState.searchQuery.toLowerCase();
      filtered = dogs.filter(
        dog =>
          dog.name.toLowerCase().includes(query) ||
          dog.breed.toLowerCase().includes(query)
      );
    }

    // 정렬
    return filtered.sort((a, b) => {
      const { sortBy, sortOrder } = pageState;
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case 'age':
          aVal = new Date().getFullYear() - new Date(a.birthDate).getFullYear();
          bVal = new Date().getFullYear() - new Date(b.birthDate).getFullYear();
          break;
        case 'updatedAt':
          aVal = new Date(a.updatedAt || a.createdAt).getTime();
          bVal = new Date(b.updatedAt || b.createdAt).getTime();
          break;
        default:
          aVal = a[sortBy]?.toString().toLowerCase() || '';
          bVal = b[sortBy]?.toString().toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [dogs, pageState.searchQuery, pageState.sortBy, pageState.sortOrder]);

  // === AI 자동화: 에러 처리 강화된 이벤트 핸들러들 ===
  const handleSortChange = useCallback(
    (sortBy: PageState['sortBy'], sortOrder: PageState['sortOrder']) => {
      setPageState(prev => ({ ...prev, sortBy, sortOrder }));
    },
    []
  );

  const handleSearchChange = useCallback((query: string) => {
    setPageState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const handleAddNew = useCallback(() => {
    setPageState(prev => ({
      ...prev,
      selectedDog: null,
      isFormModalOpen: true,
      error: null,
    }));
  }, []);

  const handleEdit = useCallback((dog: Dog) => {
    setPageState(prev => ({
      ...prev,
      selectedDog: dog,
      isFormModalOpen: true,
      error: null,
    }));
  }, []);

  const handleView = useCallback((dog: Dog) => {
    setPageState(prev => ({ ...prev, selectedDog: dog, viewMode: 'detail' }));
  }, []);

  const handleDelete = useCallback(async (dog: Dog) => {
    setPageState(prev => ({
      ...prev,
      selectedDog: dog,
      isDeleteConfirmOpen: true,
    }));
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const dog = selectedDogRef.current;
    if (!dog) return;

    try {
      await deleteDogMutation.mutateAsync(dog.id);
      toast.success(`${dog.name}이(가) 삭제되었습니다.`);
      setPageState(prev => ({
        ...prev,
        isDeleteConfirmOpen: false,
        selectedDog: null,
        error: null,
      }));
    } catch (error) {
      console.error('삭제 실패:', error);
      const errorMessage = '강아지 정보 삭제에 실패했습니다.';
      setPageState(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, [deleteDogMutation]);

  const handleFormSubmit = useCallback(
    async (data: DogFormData) => {
      const currentSelectedDog = selectedDogRef.current;
      try {
        setPageState(prev => ({ ...prev, error: null }));

        if (currentSelectedDog) {
          // 수정
          await updateDogMutation.mutateAsync({
            dogId: currentSelectedDog.id,
            dogData: data,
          });
          toast.success(`${data.name}의 정보가 수정되었습니다.`);
        } else {
          // 등록
          await createDogMutation.mutateAsync(data);
          toast.success(`${data.name}이(가) 등록되었습니다.`);
        }

        setPageState(prev => ({
          ...prev,
          isFormModalOpen: false,
          selectedDog: null,
          error: null,
        }));
      } catch (error: unknown) {
        console.error('폼 제출 실패:', error);

        let errorMessage = currentSelectedDog
          ? '강아지 정보 수정에 실패했습니다.'
          : '강아지 등록에 실패했습니다.';

        if (error instanceof Error && error.message) {
          errorMessage += ` (${error.message})`;
        } else if (error?.code === 'PGRST116') {
          errorMessage =
            '데이터베이스 테이블이 없습니다. Supabase Dashboard에서 SQL을 실행해주세요.';
        }

        setPageState(prev => ({ ...prev, error: errorMessage }));
        toast.error(errorMessage);
      }
    },
    [updateDogMutation, createDogMutation]
  );

  const handleFormCancel = useCallback(() => {
    setPageState(prev => ({
      ...prev,
      isFormModalOpen: false,
      selectedDog: null,
      error: null,
    }));
  }, []);

  const handleBackToList = useCallback(() => {
    setPageState(prev => ({ ...prev, viewMode: 'list', selectedDog: null }));
  }, []);

  // === AI 자동화: 접근성 강화된 조기 반환 패턴 ===

  // 로딩 상태
  if (authLoading) {
    return (
      <Container className="py-12" aria-busy="true">
        <div className="flex justify-center">
          <Loading size="lg" text="인증 확인 중..." />
        </div>
        <div className="sr-only" aria-live="polite">
          사용자 인증을 확인하고 있습니다. 잠시만 기다려주세요.
        </div>
      </Container>
    );
  }

  // 로그인하지 않은 경우
  if (!isAuthenticated) {
    return (
      <Container className="py-12">
        <div
          className="text-center"
          role="main"
          aria-labelledby={`${pageId}-auth-title`}
        >
          <h1 id={`${pageId}-auth-title`} className="text-2xl font-bold mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-muted-foreground mb-6">
            강아지 프로필을 관리하려면 먼저 로그인해주세요.
          </p>
          <Button
            onClick={() => (window.location.href = '/auth/signin')}
            aria-label="로그인 페이지로 이동"
          >
            로그인하기
          </Button>
        </div>
      </Container>
    );
  }

  // React Query 에러 처리
  if (dogsError) {
    return (
      <Container className="py-12">
        <div
          className="text-center"
          role="alert"
          aria-labelledby={`${pageId}-error-title`}
        >
          <h1
            id={`${pageId}-error-title`}
            className="text-2xl font-bold mb-4 text-red-600"
          >
            데이터 로딩 오류
          </h1>
          <p className="text-muted-foreground mb-6">
            강아지 정보를 불러오는 중 오류가 발생했습니다.
          </p>
          <Button onClick={() => refetch()} aria-label="데이터 다시 로딩">
            다시 시도
          </Button>
        </div>
      </Container>
    );
  }

  // === AI 자동화: 접근성 강화된 상세 보기 모드 ===
  if (pageState.viewMode === 'detail' && pageState.selectedDog) {
    return (
      <Container
        className="py-6"
        role="main"
        aria-labelledby={`${pageId}-detail-title`}
      >
        {/* 브레드크럼 네비게이션 */}
        <nav aria-label="페이지 네비게이션" className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToList}
            aria-label="강아지 목록으로 돌아가기"
          >
            ← 목록으로 돌아가기
          </Button>
        </nav>

        <div className="sr-only">
          <h1 id={`${pageId}-detail-title`}>
            {pageState.selectedDog.name} 강아지 상세 정보
          </h1>
        </div>

        {/* 전역 에러 표시 */}
        {pageState.error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
          >
            <p>{pageState.error}</p>
          </div>
        )}

        <div className="flex justify-center">
          <DogCard
            dog={pageState.selectedDog}
            variant="detailed"
            onEdit={handleEdit}
            onDelete={handleDelete}
            aria-label={`${pageState.selectedDog.name} 강아지 상세 카드`}
          />
        </div>
      </Container>
    );
  }

  // === AI 자동화: 접근성 강화된 목록 보기 모드 (기본) ===
  return (
    <div role="main" aria-labelledby={`${pageId}-main-title`}>
      {/* 페이지 제목 (스크린 리더용) */}
      <div className="sr-only">
        <h1 id={`${pageId}-main-title`}>우리 강아지 관리</h1>
        <p>등록된 강아지들을 확인하고 관리할 수 있습니다.</p>
      </div>

      {/* 전역 에러 표시 */}
      {pageState.error && (
        <Container className="py-4">
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
          >
            <h2 className="font-semibold text-sm mb-1">오류가 발생했습니다</h2>
            <p className="text-sm">{pageState.error}</p>
          </div>
        </Container>
      )}

      {/* 메인 콘텐츠 */}
      <Suspense
        fallback={<Loading size="lg" text="강아지 목록을 불러오는 중..." />}
      >
        <MemoizedDogList
          dogs={filteredAndSortedDogs}
          isLoading={isLoading}
          error={null}
          searchQuery={pageState.searchQuery}
          sortBy={pageState.sortBy}
          sortOrder={pageState.sortOrder}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          itemsPerPage={12}
          showPagination={true}
          aria-label="강아지 목록"
          aria-describedby={pageState.error ? errorId : undefined}
        />
      </Suspense>

      {/* === AI 자동화: 접근성 강화된 폼 모달 === */}
      <ControlledModal
        open={pageState.isFormModalOpen}
        onClose={handleFormCancel}
        title={
          isEditMode
            ? `${pageState.selectedDog?.name} 정보 수정`
            : '새 강아지 등록'
        }
        description={
          isEditMode
            ? `${pageState.selectedDog?.name}의 정보를 수정할 수 있습니다.`
            : '새로운 강아지의 정보를 입력해주세요.'
        }
      >
        <DogForm
          dog={pageState.selectedDog || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isAnyLoading}
          aria-label={isEditMode ? '강아지 정보 수정 폼' : '강아지 등록 폼'}
        />
      </ControlledModal>

      {/* === AI 자동화: 삭제 확인 모달 === */}
      <ControlledModal
        open={pageState.isDeleteConfirmOpen}
        onClose={() =>
          setPageState(prev => ({
            ...prev,
            isDeleteConfirmOpen: false,
            selectedDog: null,
          }))
        }
        title="삭제 확인"
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">정말로 삭제하시겠습니까?</h2>
            <p className="text-muted-foreground mt-2">
              {pageState.selectedDog?.name}의 정보가 영구적으로 삭제됩니다. 이
              작업은 되돌릴 수 없습니다.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setPageState(prev => ({
                  ...prev,
                  isDeleteConfirmOpen: false,
                  selectedDog: null,
                }))
              }
              disabled={deleteDogMutation.isPending}
              aria-label="삭제 취소"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              loading={deleteDogMutation.isPending}
              disabled={deleteDogMutation.isPending}
              aria-label={`${pageState.selectedDog?.name} 삭제 확인`}
            >
              삭제하기
            </Button>
          </div>
        </div>
      </ControlledModal>
    </div>
  );
};

// === AI 자동화: 컴포넌트 메타데이터 ===
DogsPage.displayName = 'DogsPage';

export default DogsPage;

// === AI 자동화: 타입 내보내기 ===
export type { PageState, ViewMode };
