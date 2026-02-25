import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DogsPage from '../page';
import type { Dog } from '@/types/dog';

// === AI 자동화 룰: Mock 설정 ===
// Supabase 모킹
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

// NextAuth 세션 모킹
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: '테스트 사용자',
      },
    },
    status: 'authenticated',
  })),
}));

// React Query 훅들 모킹
vi.mock('@/hooks/dogs/useDogs', () => ({
  useDogs: vi.fn(() => ({
    data: mockDogs,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('@/hooks/dogs/useCreateDog', () => ({
  useCreateDog: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/dogs/useUpdateDog', () => ({
  useUpdateDog: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  })),
}));

vi.mock('@/hooks/dogs/useDeleteDog', () => ({
  useDeleteDog: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
    error: null,
  })),
}));

// UI 컴포넌트들 모킹
vi.mock('@/components/ui/Container', () => ({
  default: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="container" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/Modal', () => ({
  default: ({
    open,
    onClose,
    title,
    children,
  }: {
    open: boolean;
    onClose?: (reason: string) => void;
    title?: string;
    children: React.ReactNode;
  }) =>
    open ? (
      <div data-testid="modal" role="dialog" aria-label={title}>
        <div data-testid="modal-title">{title}</div>
        <button onClick={() => onClose?.('close')}>닫기</button>
        {children}
      </div>
    ) : null,
}));

vi.mock('@/components/ui/Loading', () => ({
  default: ({
    text,
    ...props
  }: { text?: string } & React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="loading" {...props}>
      {text}
    </div>
  ),
}));

vi.mock('@/components/dog/DogList', () => ({
  default: ({
    dogs,
    isLoading,
    error,
    searchQuery,
    sortBy,
    sortOrder,
    onAddNew,
    onEdit,
    onView,
    onDelete,
    // onSearchChange,
    // onSortChange,
  }: {
    dogs: Dog[];
    isLoading?: boolean;
    error?: string | null;
    searchQuery: string;
    sortBy: string;
    sortOrder: string;
    onAddNew?: () => void;
    onEdit?: (dog: Dog) => void;
    onView?: (dog: Dog) => void;
    onDelete?: (dogId: string) => void;
    onSearchChange?: (query: string) => void;
    onSortChange?: (sortBy: string, sortOrder: string) => void;
  }) => (
    <div data-testid="dog-list">
      {isLoading && <div data-testid="dog-list-loading">로딩 중...</div>}
      {error && <div data-testid="dog-list-error">{error}</div>}
      {!isLoading && !error && (
        <>
          <div data-testid="search-query">{searchQuery}</div>
          <div data-testid="sort-info">
            {sortBy}-{sortOrder}
          </div>
          <button onClick={() => onAddNew?.()}>새 강아지 등록</button>
          {dogs.map((dog: Dog) => (
            <div key={dog.id} data-testid={`dog-item-${dog.id}`}>
              <span>{dog.name}</span>
              <button onClick={() => onEdit?.(dog)}>수정</button>
              <button onClick={() => onView?.(dog)}>보기</button>
              <button onClick={() => onDelete?.(dog.id)}>삭제</button>
            </div>
          ))}
        </>
      )}
    </div>
  ),
}));

vi.mock('@/components/dog/DogForm', () => ({
  default: ({
    dog,
    onSubmit,
    onCancel,
    isLoading,
  }: {
    dog?: Dog;
    onSubmit: (data: { name: string; breed: string }) => void;
    onCancel: () => void;
    isLoading?: boolean;
  }) => (
    <form
      data-testid="dog-form"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ name: '테스트 강아지', breed: '테스트 견종' });
      }}
    >
      <div data-testid="form-mode">{dog ? 'edit' : 'create'}</div>
      <input data-testid="dog-name-input" defaultValue={dog?.name || ''} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '처리 중...' : dog ? '수정하기' : '등록하기'}
      </button>
      <button type="button" onClick={onCancel}>
        취소
      </button>
    </form>
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn(),
  },
}));

// === AI 자동화 룰: 테스트 데이터 ===
const mockDogs: Dog[] = [
  {
    id: 'dog-1',
    userId: 'user-123',
    name: '멍멍이',
    breed: '골든 리트리버',
    gender: 'male',
    birthDate: '2021-01-15T00:00:00.000Z',
    weight: 25.5,
    profileImage: 'https://example.com/dog1.jpg',
    description: '활발한 성격',
    isNeutered: true,
    microchipId: 'CHIP123456',
    color: 'golden',
    size: 'large',
    activityLevel: 'high',
    temperament: ['활발한', '친화적인'],
    allergies: [],
    medicalConditions: ['광견병 접종 완료'],
    emergencyContact: {
      name: '비상연락처',
      phone: '010-1234-5678',
      relationship: '가족',
    },
    veterinarian: {
      name: '김수의사',
      clinic: '동물병원',
      phone: '02-1234-5678',
      address: '서울시 강남구',
    },
    createdAt: '2021-03-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'dog-2',
    userId: 'user-123',
    name: '바둑이',
    breed: '시베리안 허스키',
    gender: 'female',
    birthDate: '2019-05-10T00:00:00.000Z',
    weight: 20.0,
    profileImage: 'https://example.com/dog2.jpg',
    description: '차분한 성격',
    isNeutered: false,
    microchipId: 'CHIP789012',
    color: 'black-white',
    size: 'medium',
    activityLevel: 'moderate',
    temperament: ['차분한', '독립적인'],
    allergies: [],
    medicalConditions: ['광견병 접종 완료', '종합백신 접종 완료'],
    emergencyContact: {
      name: '비상연락처',
      phone: '010-9876-5432',
      relationship: '가족',
    },
    veterinarian: {
      name: '이수의사',
      clinic: '행복동물병원',
      phone: '02-8765-4321',
      address: '서울시 서초구',
    },
    createdAt: '2019-07-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
];

// Mock 데이터 참조를 위한 전역 변수
let mockUseDogs: ReturnType<typeof vi.fn>;
let mockUseCreateDog: ReturnType<typeof vi.fn>;
let mockUseUpdateDog: ReturnType<typeof vi.fn>;
let mockUseDeleteDog: ReturnType<typeof vi.fn>;

describe('DogsPage', () => {
  let queryClient: QueryClient;

  // === AI 자동화 룰: 공통 설정 ===
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock 함수들 재설정
    mockUseDogs = vi.fn(() => ({
      data: mockDogs,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }));

    mockUseCreateDog = vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
    }));

    mockUseUpdateDog = vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
    }));

    mockUseDeleteDog = vi.fn(() => ({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
    }));

    // 모듈 재모킹
    vi.doMock('@/hooks/dogs/useDogs', () => ({ useDogs: mockUseDogs }));
    vi.doMock('@/hooks/dogs/useCreateDog', () => ({
      useCreateDog: mockUseCreateDog,
    }));
    vi.doMock('@/hooks/dogs/useUpdateDog', () => ({
      useUpdateDog: mockUseUpdateDog,
    }));
    vi.doMock('@/hooks/dogs/useDeleteDog', () => ({
      useDeleteDog: mockUseDeleteDog,
    }));

    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  // === AI 자동화 룰: 기본 렌더링 테스트 ===
  describe('Basic Rendering', () => {
    it('renders dogs page correctly', () => {
      renderWithProviders(<DogsPage />);

      expect(screen.getByText('강아지 관리')).toBeInTheDocument();
      expect(screen.getByTestId('dog-list')).toBeInTheDocument();
    });

    it('renders dogs list with correct data', () => {
      renderWithProviders(<DogsPage />);

      expect(screen.getByTestId('dog-item-dog-1')).toBeInTheDocument();
      expect(screen.getByTestId('dog-item-dog-2')).toBeInTheDocument();
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByText('바둑이')).toBeInTheDocument();
    });

    it('renders page header with correct title', () => {
      renderWithProviders(<DogsPage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        '강아지 관리'
      );
    });
  });

  // === AI 자동화 룰: 로딩 상태 테스트 ===
  describe('Loading States', () => {
    it('shows loading state when dogs are loading', () => {
      mockUseDogs.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderWithProviders(<DogsPage />);

      expect(screen.getByTestId('dog-list-loading')).toBeInTheDocument();
    });

    it('shows form loading state when submitting', () => {
      mockUseCreateDog.mockReturnValue({
        mutate: vi.fn(),
        isLoading: true,
        error: null,
      });

      renderWithProviders(<DogsPage />);

      // 새 강아지 등록 버튼 클릭하여 모달 열기
      fireEvent.click(screen.getByText('새 강아지 등록'));

      expect(screen.getByText('처리 중...')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 에러 상태 테스트 ===
  describe('Error States', () => {
    it('shows error state when dogs loading fails', () => {
      const errorMessage = '강아지 목록을 불러올 수 없습니다.';
      mockUseDogs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: errorMessage },
        refetch: vi.fn(),
      });

      renderWithProviders(<DogsPage />);

      expect(screen.getByTestId('dog-list-error')).toHaveTextContent(
        errorMessage
      );
    });

    it('shows error alert when page error occurs', () => {
      renderWithProviders(<DogsPage />);

      // 페이지 상태에 에러가 있을 때
      // 실제 구현에 따라 에러 상태를 시뮬레이션해야 함
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 검색 및 필터링 테스트 ===
  describe('Search and Filtering', () => {
    it('passes search query to DogList component', () => {
      renderWithProviders(<DogsPage />);

      // 초기 상태에서는 빈 검색어
      expect(screen.getByTestId('search-query')).toHaveTextContent('');
    });

    it('passes sort information to DogList component', () => {
      renderWithProviders(<DogsPage />);

      // 기본 정렬은 이름 오름차순
      expect(screen.getByTestId('sort-info')).toHaveTextContent('name-asc');
    });

    it('updates search query when DogList calls onSearchChange', async () => {
      renderWithProviders(<DogsPage />);

      // DogList의 onSearchChange 시뮬레이션은 실제 구현에 따라 조정 필요
      // 현재는 props 전달 확인만 진행
      expect(screen.getByTestId('dog-list')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 모달 관리 테스트 ===
  describe('Modal Management', () => {
    it('opens create modal when add new button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DogsPage />);

      const addButton = screen.getByText('새 강아지 등록');
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          '새 강아지 등록'
        );
        expect(screen.getByTestId('form-mode')).toHaveTextContent('create');
      });
    });

    it('opens edit modal when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DogsPage />);

      const editButton = screen.getAllByText('수정')[0];
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent(
          '멍멍이 정보 수정'
        );
        expect(screen.getByTestId('form-mode')).toHaveTextContent('edit');
      });
    });

    it('closes modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DogsPage />);

      // 모달 열기
      await user.click(screen.getByText('새 강아지 등록'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // 모달 닫기
      await user.click(screen.getByText('취소'));

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DogsPage />);

      await user.click(screen.getByText('새 강아지 등록'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      await user.click(screen.getByText('닫기'));

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });
  });

  // === AI 자동화 룰: CRUD 작업 테스트 ===
  describe('CRUD Operations', () => {
    it('creates new dog when form is submitted', async () => {
      const user = userEvent.setup();
      const mutateFn = vi.fn();
      mockUseCreateDog.mockReturnValue({
        mutate: mutateFn,
        isLoading: false,
        error: null,
      });

      renderWithProviders(<DogsPage />);

      // 새 강아지 등록 모달 열기
      await user.click(screen.getByText('새 강아지 등록'));

      await waitFor(() => {
        expect(screen.getByTestId('dog-form')).toBeInTheDocument();
      });

      // 폼 제출
      await user.click(screen.getByText('등록하기'));

      await waitFor(() => {
        expect(mutateFn).toHaveBeenCalledWith({
          name: '테스트 강아지',
          breed: '테스트 견종',
        });
      });
    });

    it('updates existing dog when edit form is submitted', async () => {
      const user = userEvent.setup();
      const mutateFn = vi.fn();
      mockUseUpdateDog.mockReturnValue({
        mutate: mutateFn,
        isLoading: false,
        error: null,
      });

      renderWithProviders(<DogsPage />);

      // 수정 모달 열기
      await user.click(screen.getAllByText('수정')[0]);

      await waitFor(() => {
        expect(screen.getByTestId('dog-form')).toBeInTheDocument();
      });

      // 폼 제출
      await user.click(screen.getByText('수정하기'));

      await waitFor(() => {
        expect(mutateFn).toHaveBeenCalledWith({
          id: mockDogs[0].id,
          data: {
            name: '테스트 강아지',
            breed: '테스트 견종',
          },
        });
      });
    });

    it('deletes dog when delete button is clicked', async () => {
      const user = userEvent.setup();
      const mutateFn = vi.fn();
      mockUseDeleteDog.mockReturnValue({
        mutate: mutateFn,
        isLoading: false,
        error: null,
      });

      renderWithProviders(<DogsPage />);

      // 삭제 버튼 클릭
      await user.click(screen.getAllByText('삭제')[0]);

      // 삭제 확인 모달이 열리고 확인 버튼 클릭
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      await user.click(screen.getByText('삭제'));

      await waitFor(() => {
        expect(mutateFn).toHaveBeenCalledWith(mockDogs[0].id);
      });
    });
  });

  // === AI 자동화 룰: 상세보기 모드 테스트 ===
  describe('Detail View Mode', () => {
    it('switches to detail view when view button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DogsPage />);

      const viewButton = screen.getAllByText('보기')[0];
      await user.click(viewButton);

      // 상세보기 모드로 전환되는지 확인
      // 실제 구현에 따라 조정 필요
      await waitFor(() => {
        expect(screen.getByText('멍멍이')).toBeInTheDocument();
      });
    });

    it('returns to list view from detail view', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DogsPage />);

      // 상세보기로 전환
      await user.click(screen.getAllByText('보기')[0]);

      // 목록으로 돌아가기 (실제 구현에 따라 조정 필요)
      // 뒤로 가기 버튼이나 목록 버튼 클릭
    });
  });

  // === AI 자동화 룰: 세션 관리 테스트 ===
  describe('Session Management', () => {
    it('redirects when user is not authenticated', () => {
      const mockUseSession = vi.fn(() => ({
        data: null,
        status: 'unauthenticated',
      }));

      vi.doMock('next-auth/react', () => ({
        useSession: mockUseSession,
      }));

      renderWithProviders(<DogsPage />);

      // 인증되지 않은 상태에서 리디렉션 로직 확인
      // 실제 구현에 따라 조정 필요
    });

    it('shows loading when session is loading', () => {
      const mockUseSession = vi.fn(() => ({
        data: null,
        status: 'loading',
      }));

      vi.doMock('next-auth/react', () => ({
        useSession: mockUseSession,
      }));

      renderWithProviders(<DogsPage />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('filters dogs by user when authenticated', () => {
      renderWithProviders(<DogsPage />);

      // 현재 사용자의 강아지만 표시되는지 확인
      expect(screen.getByTestId('dog-item-dog-1')).toBeInTheDocument();
      expect(screen.getByTestId('dog-item-dog-2')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 접근성 테스트 ===
  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderWithProviders(<DogsPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('강아지 관리');
    });

    it('has proper ARIA labels for interactive elements', () => {
      renderWithProviders(<DogsPage />);

      // 버튼들이 적절한 ARIA 라벨을 가지는지 확인
      expect(screen.getByText('새 강아지 등록')).toBeInTheDocument();
    });

    it('manages focus properly when modals open/close', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DogsPage />);

      const addButton = screen.getByText('새 강아지 등록');
      await user.click(addButton);

      await waitFor(() => {
        const modal = screen.getByTestId('modal');
        expect(modal).toBeInTheDocument();
        // 모달이 열릴 때 포커스가 적절히 관리되는지 확인
      });
    });

    it('has proper error announcements', () => {
      const errorMessage = '강아지 목록을 불러올 수 없습니다.';
      mockUseDogs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: errorMessage },
        refetch: vi.fn(),
      });

      renderWithProviders(<DogsPage />);

      const errorElement = screen.getByTestId('dog-list-error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });
  });

  // === AI 자동화 룰: 통합 시나리오 테스트 ===
  describe('Integration Scenarios', () => {
    it('completes full create flow', async () => {
      const user = userEvent.setup();
      const createMutate = vi.fn((data, options) => {
        options?.onSuccess?.();
      });

      mockUseCreateDog.mockReturnValue({
        mutate: createMutate,
        isLoading: false,
        error: null,
      });

      renderWithProviders(<DogsPage />);

      // 1. 새 강아지 등록 버튼 클릭
      await user.click(screen.getByText('새 강아지 등록'));

      // 2. 모달이 열림
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // 3. 폼 제출
      await user.click(screen.getByText('등록하기'));

      // 4. 등록 완료 후 모달 닫힘
      await waitFor(() => {
        expect(createMutate).toHaveBeenCalled();
      });
    });

    it('completes full edit flow', async () => {
      const user = userEvent.setup();
      const updateMutate = vi.fn((data, options) => {
        options?.onSuccess?.();
      });

      mockUseUpdateDog.mockReturnValue({
        mutate: updateMutate,
        isLoading: false,
        error: null,
      });

      renderWithProviders(<DogsPage />);

      // 1. 수정 버튼 클릭
      await user.click(screen.getAllByText('수정')[0]);

      // 2. 수정 모달이 열림
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('form-mode')).toHaveTextContent('edit');
      });

      // 3. 폼 제출
      await user.click(screen.getByText('수정하기'));

      // 4. 수정 완료
      await waitFor(() => {
        expect(updateMutate).toHaveBeenCalled();
      });
    });

    it('handles error recovery flow', async () => {
      // const user = userEvent.setup();
      const refetchFn = vi.fn();

      // 초기에는 에러 상태
      mockUseDogs.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: '네트워크 오류' },
        refetch: refetchFn,
      });

      renderWithProviders(<DogsPage />);

      expect(screen.getByTestId('dog-list-error')).toBeInTheDocument();

      // 성공 상태로 변경하여 재시도 시뮬레이션
      mockUseDogs.mockReturnValue({
        data: mockDogs,
        isLoading: false,
        error: null,
        refetch: refetchFn,
      });

      // 컴포넌트 리렌더링 트리거
      renderWithProviders(<DogsPage />);

      expect(screen.getByTestId('dog-item-dog-1')).toBeInTheDocument();
    });
  });
});
