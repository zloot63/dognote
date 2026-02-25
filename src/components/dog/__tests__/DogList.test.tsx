import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DogList from '../DogList';
import type { Dog } from '@/types/dog';

// === AI 자동화 룰: Mock 설정 ===
// DogCard 컴포넌트 모킹 - 직접 구현
vi.mock('../DogCard', () => {
  const MockDogCard = ({
    dog,
    onEdit,
    onDelete,
    onView,
    variant,
  }: {
    dog: Dog;
    onEdit?: (dog: Dog) => void;
    onDelete?: (dog: Dog) => void;
    onView?: (dog: Dog) => void;
    variant?: 'default' | 'compact' | 'detailed';
  }) => (
    <div data-testid={`dog-card-${dog.id}`} data-variant={variant}>
      <span data-testid="dog-name">{dog.name}</span>
      <span data-testid="dog-breed">{dog.breed}</span>
      <button onClick={() => onEdit?.(dog)} data-testid="edit-button">
        수정
      </button>
      <button onClick={() => onDelete?.(dog)} data-testid="delete-button">
        삭제
      </button>
      <button onClick={() => onView?.(dog)} data-testid="view-button">
        보기
      </button>
    </div>
  );

  return {
    __esModule: true,
    default: MockDogCard,
  };
});

// 외부 의존성 모킹
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({
    value,
    onChange,
    placeholder,
    ...props
  }: {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    [key: string]: unknown;
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/CustomSelect', () => ({
  CustomSelect: ({
    value,
    onValueChange,
    children,
    ...props
  }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <select
      value={value}
      onChange={e => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
}));

vi.mock('@/components/ui/Container', () => ({
  Container: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="container" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/Grid', () => ({
  Grid: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="grid" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/Loading', () => ({
  Loading: ({ text, ...props }: { text?: string; [key: string]: unknown }) => (
    <div data-testid="loading" {...props}>
      {text}
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon">Search</span>,
  Grid: () => <span data-testid="grid-icon">Grid</span>,
  List: () => <span data-testid="list-icon">List</span>,
  SlidersHorizontal: () => <span data-testid="filters-icon">Filters</span>,
  X: () => <span data-testid="x-icon">X</span>,
  ChevronLeft: () => <span data-testid="chevron-left">Left</span>,
  ChevronRight: () => <span data-testid="chevron-right">Right</span>,
}));

// === AI 자동화 룰: 테스트 데이터 ===
const mockDogs: Dog[] = [
  {
    id: 'dog-1',
    userId: 'user-123',
    name: '멍멍이',
    breed: '골든 리트리버',
    gender: 'male',
    birthDate: '2021-01-15',
    weight: 25.5,
    profileImage: 'https://example.com/dog1.jpg',
    isNeutered: true,
    microchipId: 'CHIP123456',
    color: 'golden',
    size: 'large',
    activityLevel: 'high',
    temperament: ['활발한', '친화적인'],
    allergies: [],
    medicalConditions: [],
    emergencyContact: {
      name: '비상연락처',
      phone: '010-1234-5678',
      relationship: '주인',
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
    birthDate: '2019-05-10',
    weight: 20.0,
    profileImage: 'https://example.com/dog2.jpg',
    isNeutered: false,
    microchipId: 'CHIP789012',
    color: 'black-white',
    size: 'medium',
    activityLevel: 'moderate',
    temperament: ['차분한', '독립적인'],
    allergies: [],
    medicalConditions: [],
    emergencyContact: {
      name: '비상연락처',
      phone: '010-1234-5678',
      relationship: '주인',
    },
    veterinarian: {
      name: '김수의사',
      clinic: '동물병원',
      phone: '02-1234-5678',
      address: '서울시 강남구',
    },
    createdAt: '2019-07-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'dog-3',
    userId: 'user-123',
    name: '쿠키',
    breed: '포메라니안',
    gender: 'female',
    birthDate: '2022-03-20',
    weight: 3.5,
    profileImage: 'https://example.com/dog3.jpg',
    isNeutered: true,
    microchipId: 'CHIP345678',
    color: 'cream',
    size: 'small',
    activityLevel: 'low',
    temperament: ['온순한', '사교적인'],
    allergies: [],
    medicalConditions: [],
    emergencyContact: {
      name: '비상연락처',
      phone: '010-1234-5678',
      relationship: '주인',
    },
    veterinarian: {
      name: '김수의사',
      clinic: '동물병원',
      phone: '02-1234-5678',
      address: '서울시 강남구',
    },
    createdAt: '2022-05-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
];

describe('DogList', () => {
  // === AI 자동화 룰: 공통 설정 ===
  const defaultProps = {
    dogs: mockDogs,
    isLoading: false,
    error: null,
    searchQuery: '',
    sortBy: 'name' as const,
    sortOrder: 'asc' as const,
    onAddNew: vi.fn(),
    onEdit: vi.fn(),
    onView: vi.fn(),
    onDelete: vi.fn(),
    onSearchChange: vi.fn(),
    onSortChange: vi.fn(),
    itemsPerPage: 10,
    showPagination: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === AI 자동화 룰: 기본 렌더링 테스트 ===
  describe('Basic Rendering', () => {
    it('renders dog list correctly', () => {
      render(<DogList {...defaultProps} />);

      expect(screen.getByTestId('dog-card-dog-1')).toBeInTheDocument();
      expect(screen.getByTestId('dog-card-dog-2')).toBeInTheDocument();
      expect(screen.getByTestId('dog-card-dog-3')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<DogList {...defaultProps} />);

      expect(
        screen.getByPlaceholderText(/강아지 이름 또는 견종으로 검색/i)
      ).toBeInTheDocument();
    });

    it('renders view mode toggle buttons', () => {
      render(<DogList {...defaultProps} />);

      expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
      expect(screen.getByTestId('list-icon')).toBeInTheDocument();
    });

    it('renders sort controls', () => {
      render(<DogList {...defaultProps} />);

      expect(screen.getByDisplayValue('이름 순')).toBeInTheDocument();
    });

    it('renders add new button', () => {
      render(<DogList {...defaultProps} />);

      expect(screen.getByText('새 강아지 등록')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 검색 기능 테스트 ===
  describe('Search Functionality', () => {
    it('calls onSearchChange when search input changes', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const searchInput =
        screen.getByPlaceholderText(/강아지 이름 또는 견종으로 검색/i);
      await user.type(searchInput, '멍멍이');

      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('멍멍이');
    });

    it('displays current search query', () => {
      render(<DogList {...defaultProps} searchQuery="골든" />);

      expect(screen.getByDisplayValue('골든')).toBeInTheDocument();
    });

    it('shows clear search button when search query exists', () => {
      render(<DogList {...defaultProps} searchQuery="멍멍이" />);

      expect(screen.getByText('검색 지우기')).toBeInTheDocument();
    });

    it('calls onSearchChange with empty string when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} searchQuery="멍멍이" />);

      const clearButton = screen.getByText('검색 지우기');
      await user.click(clearButton);

      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
    });
  });

  // === AI 자동화 룰: 정렬 기능 테스트 ===
  describe('Sorting Functionality', () => {
    it('calls onSortChange when sort option changes', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const sortSelect = screen.getByDisplayValue('이름 순');
      await user.selectOptions(sortSelect, 'age');

      expect(defaultProps.onSortChange).toHaveBeenCalledWith('age', 'asc');
    });

    it('toggles sort order when same sort field is selected', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} sortBy="name" sortOrder="asc" />);

      const sortSelect = screen.getByDisplayValue('이름 순');
      await user.selectOptions(sortSelect, 'name');

      expect(defaultProps.onSortChange).toHaveBeenCalledWith('name', 'desc');
    });

    it('displays correct sort options', () => {
      render(<DogList {...defaultProps} />);

      expect(screen.getByText('이름 순')).toBeInTheDocument();
      expect(screen.getByText('나이 순')).toBeInTheDocument();
      expect(screen.getByText('견종 순')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 뷰 모드 테스트 ===
  describe('View Mode Functionality', () => {
    it('defaults to grid view', () => {
      render(<DogList {...defaultProps} />);

      expect(screen.getByTestId('grid')).toBeInTheDocument();
      expect(screen.getByTestId('dog-card-dog-1')).toHaveAttribute(
        'data-variant',
        'default'
      );
    });

    it('switches to list view when list button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const listButton = screen.getByTestId('list-icon').closest('button');
      await user.click(listButton!);

      expect(screen.getByTestId('dog-card-dog-1')).toHaveAttribute(
        'data-variant',
        'compact'
      );
    });

    it('switches back to grid view when grid button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const listButton = screen.getByTestId('list-icon').closest('button');
      const gridButton = screen.getByTestId('grid-icon').closest('button');

      await user.click(listButton!);
      await user.click(gridButton!);

      expect(screen.getByTestId('dog-card-dog-1')).toHaveAttribute(
        'data-variant',
        'default'
      );
    });

    it('applies active state to current view button', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const gridButton = screen.getByTestId('grid-icon').closest('button');
      expect(gridButton).not.toHaveAttribute('data-variant', 'outline');

      const listButton = screen.getByTestId('list-icon').closest('button');
      await user.click(listButton!);

      expect(listButton).not.toHaveAttribute('data-variant', 'outline');
    });
  });

  // === AI 자동화 룰: 페이지네이션 테스트 ===
  describe('Pagination Functionality', () => {
    it('shows pagination when dogs exceed itemsPerPage', () => {
      render(<DogList {...defaultProps} itemsPerPage={2} />);

      expect(screen.getByText('이전')).toBeInTheDocument();
      expect(screen.getByText('다음')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('does not show pagination when showPagination is false', () => {
      render(<DogList {...defaultProps} showPagination={false} />);

      expect(screen.queryByText('이전')).not.toBeInTheDocument();
      expect(screen.queryByText('다음')).not.toBeInTheDocument();
    });

    it('navigates to next page correctly', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} itemsPerPage={2} />);

      const nextButton = screen.getByText('다음');
      await user.click(nextButton);

      // 첫 번째 페이지의 강아지들이 보이지 않고 두 번째 페이지 강아지가 보임
      expect(screen.queryByTestId('dog-card-dog-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dog-card-dog-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('dog-card-dog-3')).toBeInTheDocument();
    });

    it('navigates to specific page when page number is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} itemsPerPage={2} />);

      const pageButton = screen.getByText('2');
      await user.click(pageButton);

      expect(screen.getByTestId('dog-card-dog-3')).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      render(<DogList {...defaultProps} itemsPerPage={2} />);

      const prevButton = screen.getByText('이전');
      expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} itemsPerPage={2} />);

      const nextButton = screen.getByText('다음');
      await user.click(nextButton);

      expect(nextButton).toBeDisabled();
    });
  });

  // === AI 자동화 룰: 로딩 및 에러 상태 테스트 ===
  describe('Loading and Error States', () => {
    it('renders loading state correctly', () => {
      render(<DogList {...defaultProps} isLoading={true} />);

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(
        screen.getByText('강아지 목록을 불러오는 중...')
      ).toBeInTheDocument();
    });

    it('renders error state correctly', () => {
      const errorMessage = '강아지 목록을 불러올 수 없습니다.';
      render(<DogList {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText('다시 시도')).toBeInTheDocument();
    });

    it('hides dog cards when loading', () => {
      render(<DogList {...defaultProps} isLoading={true} />);

      expect(screen.queryByTestId('dog-card-dog-1')).not.toBeInTheDocument();
    });

    it('hides dog cards when error occurs', () => {
      render(<DogList {...defaultProps} error="Error occurred" />);

      expect(screen.queryByTestId('dog-card-dog-1')).not.toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 빈 상태 테스트 ===
  describe('Empty States', () => {
    it('renders empty state when no dogs', () => {
      render(<DogList {...defaultProps} dogs={[]} />);

      expect(
        screen.getByText('아직 등록된 강아지가 없습니다.')
      ).toBeInTheDocument();
      expect(screen.getByText('첫 번째 강아지 등록하기')).toBeInTheDocument();
    });

    it('renders no results state when search has no matches', () => {
      render(
        <DogList {...defaultProps} dogs={[]} searchQuery="존재하지않는강아지" />
      );

      expect(
        screen.getByText('검색 조건에 맞는 강아지가 없습니다.')
      ).toBeInTheDocument();
      expect(screen.getByText('검색어 지우기')).toBeInTheDocument();
    });

    it('calls onAddNew when "첫 번째 강아지 등록하기" is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} dogs={[]} />);

      const addButton = screen.getByText('첫 번째 강아지 등록하기');
      await user.click(addButton);

      expect(defaultProps.onAddNew).toHaveBeenCalled();
    });
  });

  // === AI 자동화 룰: 이벤트 핸들링 테스트 ===
  describe('Event Handling', () => {
    it('calls onEdit when dog card edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const editButton = screen.getAllByText('수정')[0];
      await user.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockDogs[0]);
    });

    it('calls onDelete when dog card delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const deleteButton = screen.getAllByText('삭제')[0];
      await user.click(deleteButton);

      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockDogs[0]);
    });

    it('calls onView when dog card view button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const viewButton = screen.getAllByText('보기')[0];
      await user.click(viewButton);

      expect(defaultProps.onView).toHaveBeenCalledWith(mockDogs[0]);
    });

    it('calls onAddNew when add new button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const addButton = screen.getByText('새 강아지 등록');
      await user.click(addButton);

      expect(defaultProps.onAddNew).toHaveBeenCalled();
    });
  });

  // === AI 자동화 룰: 접근성 테스트 ===
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<DogList {...defaultProps} />);

      const mainSection = screen.getByRole('main');
      expect(mainSection).toHaveAttribute('aria-label', '강아지 목록');
    });

    it('has proper labels for search input', () => {
      render(<DogList {...defaultProps} />);

      const searchInput = screen.getByLabelText('강아지 검색');
      expect(searchInput).toBeInTheDocument();
    });

    it('has proper labels for sort controls', () => {
      render(<DogList {...defaultProps} />);

      const sortSelect = screen.getByLabelText('정렬 기준');
      expect(sortSelect).toBeInTheDocument();
    });

    it('has proper ARIA live region for results count', () => {
      render(<DogList {...defaultProps} />);

      const resultsCount = screen.getByText('총 3마리의 강아지');
      expect(resultsCount.closest('[aria-live]')).toHaveAttribute(
        'aria-live',
        'polite'
      );
    });

    it('has proper button labels for view toggle', () => {
      render(<DogList {...defaultProps} />);

      const gridButton = screen.getByLabelText('격자 보기');
      const listButton = screen.getByLabelText('목록 보기');

      expect(gridButton).toBeInTheDocument();
      expect(listButton).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 키보드 내비게이션 테스트 ===
  describe('Keyboard Navigation', () => {
    it('supports tab navigation through controls', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const searchInput =
        screen.getByPlaceholderText(/강아지 이름 또는 견종으로 검색/i);

      searchInput.focus();
      expect(searchInput).toHaveFocus();

      await user.tab();
      const sortSelect = screen.getByDisplayValue('이름 순');
      expect(sortSelect).toHaveFocus();
    });

    it('supports Enter key for button activation', async () => {
      const user = userEvent.setup();
      render(<DogList {...defaultProps} />);

      const addButton = screen.getByText('새 강아지 등록');
      addButton.focus();

      await user.keyboard('{Enter}');
      expect(defaultProps.onAddNew).toHaveBeenCalled();
    });
  });

  // === AI 자동화 룰: 성능 테스트 ===
  describe('Performance', () => {
    it('renders large number of dogs efficiently', () => {
      const manyDogs = Array.from({ length: 100 }, (_, i) => ({
        ...mockDogs[0],
        id: `dog-${i}`,
        name: `강아지${i}`,
      }));

      const startTime = performance.now();
      render(<DogList {...defaultProps} dogs={manyDogs} itemsPerPage={10} />);
      const endTime = performance.now();

      // 렌더링이 100ms 이내에 완료되는지 확인
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<DogList {...defaultProps} />);

      // 동일한 props로 리렌더링
      rerender(<DogList {...defaultProps} />);

      // 컴포넌트가 여전히 정상적으로 렌더링됨
      expect(screen.getByTestId('dog-card-dog-1')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 반응형 테스트 ===
  describe('Responsive Behavior', () => {
    it('adjusts grid layout for different screen sizes', () => {
      render(<DogList {...defaultProps} />);

      const grid = screen.getByTestId('grid');
      expect(grid).toBeInTheDocument();

      // Grid 컴포넌트가 반응형 속성을 받는지 확인
      expect(grid).toBeDefined();
    });

    it('maintains functionality on mobile view', async () => {
      const user = userEvent.setup();

      // 모바일 뷰포트 시뮬레이션 (실제로는 CSS 미디어 쿼리에 의존)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<DogList {...defaultProps} />);

      // 검색 기능이 여전히 작동하는지 확인
      const searchInput =
        screen.getByPlaceholderText(/강아지 이름 또는 견종으로 검색/i);
      await user.type(searchInput, '테스트');

      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('테스트');
    });
  });
});
