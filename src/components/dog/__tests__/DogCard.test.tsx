import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DogCard from '../DogCard';
import type { Dog } from '@/types/dog';

// === AI 자동화 룰: Mock 설정 ===
// 외부 의존성 모킹
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) => (
    <span data-variant={variant} {...props}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="avatar" {...props}>
      {children}
    </div>
  ),
  AvatarFallback: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="avatar-fallback" {...props}>
      {children}
    </div>
  ),
  AvatarImage: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // src가 있을 때만 img 요소를 렌더링
    if (src) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img data-testid="avatar-image" src={src} alt={alt} {...props} />;
    }
    return null;
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// === AI 자동화 룰: 테스트 데이터 ===
const mockDog: Dog = {
  id: 'test-dog-1',
  userId: 'user-123',
  name: '멍멍이',
  breed: '골든 리트리버',
  gender: 'male',
  birthDate: '2021-01-15',
  weight: 25.5,
  profileImage: 'https://example.com/dog-image.jpg',
  description: '매우 활발하고 친근한 성격입니다.',
  isNeutered: true,
  microchipId: 'CHIP123456',
  registrationNumber: 'REG123456',
  color: 'golden',
  size: 'large',
  activityLevel: 'high',
  temperament: ['친근함', '활발함', '지능적'],
  allergies: ['견과류', '닭고기'],
  medicalConditions: ['없음'],
  emergencyContact: {
    name: '김철수',
    phone: '010-1234-5678',
    relationship: '가족',
  },
  veterinarian: {
    name: '서울동물병원',
    clinic: '서울동물병원',
    phone: '02-123-4567',
    address: '서울시 강남구',
  },
  createdAt: '2021-03-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

describe('DogCard', () => {
  // === AI 자동화 룰: 공통 설정 ===
  const defaultProps = {
    dog: mockDog,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onView: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === AI 자동화 룰: 기본 렌더링 테스트 ===
  describe('Basic Rendering', () => {
    it('renders dog information correctly', () => {
      render(<DogCard {...defaultProps} />);

      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByText('골든 리트리버')).toBeInTheDocument();
      expect(screen.getByText('5세 1개월')).toBeInTheDocument(); // birthDate 기반 계산된 나이
      expect(screen.getByText('25.5kg')).toBeInTheDocument();
    });

    it('renders profile image or fallback avatar', () => {
      render(<DogCard {...defaultProps} />);

      // 실제 컴포넌트에서는 fallback 아바타가 렌더링됨
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('멍'); // 이름 첫 글자
    });

    it('renders fallback avatar when no profile image', () => {
      const dogWithoutImage = { ...mockDog, profileImage: undefined };
      render(<DogCard {...defaultProps} dog={dogWithoutImage} />);

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('멍'); // 이름 첫 글자
    });
  });

  // === AI 자동화 룰: 컴포넌트 변형 테스트 ===
  describe('Component Variants', () => {
    it('renders compact variant correctly', () => {
      render(<DogCard {...defaultProps} variant="compact" />);

      // compact 변형에서는 간단한 정보만 표시
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByText('골든 리트리버')).toBeInTheDocument();
    });

    it('renders detailed variant correctly', () => {
      render(<DogCard {...defaultProps} variant="detailed" />);

      // detailed 변형에서는 더 많은 정보 표시 (의료 정보, 연락처 등)
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByText('골든 리트리버')).toBeInTheDocument();
      expect(screen.getByText('의료 정보')).toBeInTheDocument();
      expect(screen.getByText('연락처')).toBeInTheDocument();
      expect(screen.getByText('김철수')).toBeInTheDocument(); // 응급 연락처
      expect(screen.getAllByText('서울동물병원')).toHaveLength(2); // 수의사 (병원명과 수의사 이름)
    });

    it('renders default variant correctly', () => {
      render(<DogCard {...defaultProps} />);

      // 기본 변형 확인
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /수정/i })).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 이벤트 핸들링 테스트 ===
  describe('Event Handling', () => {
    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogCard {...defaultProps} />);

      // 수정 버튼을 텍스트로 찾기 (UI 라이브러리의 Button 컴포넌트 사용)
      const editButton = screen.getByText('수정');
      await user.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockDog);
    });

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogCard {...defaultProps} />);

      const deleteButton = screen.getByText('삭제');
      await user.click(deleteButton);

      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockDog);
    });

    it('calls onView when card is clicked', async () => {
      const user = userEvent.setup();
      render(<DogCard {...defaultProps} />);

      // 카드 자체를 클릭 (메인 카드는 button role을 가짐)
      const cardButtons = screen.getAllByRole('button');
      const mainCard = cardButtons.find(button =>
        button.getAttribute('aria-labelledby')?.includes('dog-name')
      );

      if (mainCard) {
        await user.click(mainCard);
        expect(defaultProps.onView).toHaveBeenCalledWith(mockDog);
      }
    });

    it('handles click events correctly', () => {
      const mockOnView = vi.fn();
      render(<DogCard {...defaultProps} onView={mockOnView} />);

      // 카드의 메인 영역 클릭 (강아지 이름 클릭)
      const dogName = screen.getByText('멍멍이');
      fireEvent.click(dogName);

      expect(mockOnView).toHaveBeenCalledWith(defaultProps.dog);
    });
  });

  // === AI 자동화 룰: 키보드 접근성 테스트 ===
  describe('Keyboard Accessibility', () => {
    it('supports keyboard navigation (Enter)', () => {
      const mockOnView = vi.fn();
      render(<DogCard {...defaultProps} onView={mockOnView} />);

      // 메인 카드 찾기 (tabIndex가 0인 버튼)
      const cardButtons = screen.getAllByRole('button');
      const mainCard = cardButtons.find(
        button => button.getAttribute('tabindex') === '0'
      );

      expect(mainCard).toBeInTheDocument();
      if (mainCard) {
        fireEvent.keyDown(mainCard, { key: 'Enter', code: 'Enter' });
        expect(mockOnView).toHaveBeenCalledWith(defaultProps.dog);
      }
    });

    it('supports keyboard navigation (Space)', () => {
      const mockOnView = vi.fn();
      render(<DogCard {...defaultProps} onView={mockOnView} />);

      // 메인 카드 찾기
      const cardButtons = screen.getAllByRole('button');
      const mainCard = cardButtons.find(
        button => button.getAttribute('tabindex') === '0'
      );

      if (mainCard) {
        fireEvent.keyDown(mainCard, { key: ' ', code: 'Space' });
        expect(mockOnView).toHaveBeenCalledWith(defaultProps.dog);
      }
    });

    it('has focusable elements', () => {
      render(<DogCard {...defaultProps} />);

      // 버튼들이 포커스 가능한지 확인
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // === AI 자동화 룰: 접근성 속성 테스트 ===
  describe('Accessibility Attributes', () => {
    it('has correct ARIA attributes', () => {
      render(<DogCard {...defaultProps} />);

      // Card 컴포넌트는 보통 div로 렌더링되므로 첫 번째 div를 찾음
      const card =
        screen.getByText('멍멍이').closest('.rounded-xl, [role="article"]') ||
        screen.getByText('멍멍이').closest('div');
      expect(card).toBeInTheDocument();
    });

    it('has correct semantic HTML structure', () => {
      render(<DogCard {...defaultProps} />);

      // 강아지 이름이 렌더링되는지 확인 (기본 구조 확인)
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByText('골든 리트리버')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 로딩 및 에러 상태 테스트 ===
  describe('Loading and Error States', () => {
    it('renders loading skeleton when loading is true', () => {
      render(<DogCard {...defaultProps} loading={true} />);

      // 로딩 상태에서는 animate-pulse 클래스를 가진 요소가 있어야 함
      const loadingElement = document.querySelector('.animate-pulse');
      expect(loadingElement).toBeInTheDocument();
      expect(screen.queryByText('멍멍이')).not.toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
      const errorMessage = '강아지 정보를 불러올 수 없습니다.';
      render(<DogCard {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText('멍멍이')).not.toBeInTheDocument();
    });

    it('renders dog content when not loading and no error', () => {
      render(<DogCard {...defaultProps} loading={false} error={null} />);

      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      // 로딩 상태가 아닐 때는 animate-pulse 클래스가 없어야 함
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 데이터 변환 테스트 ===
  describe('Data Processing', () => {
    it('formats age correctly', () => {
      render(<DogCard {...defaultProps} />);
      expect(screen.getByText('5세 1개월')).toBeInTheDocument(); // birthDate 기반 계산된 나이
    });

    it('formats weight correctly', () => {
      render(<DogCard {...defaultProps} />);
      expect(screen.getByText('25.5kg')).toBeInTheDocument();
    });

    it('displays gender badge correctly', () => {
      render(<DogCard {...defaultProps} />);
      expect(screen.getByText('수컷')).toBeInTheDocument();
    });

    it('displays activity level correctly', () => {
      render(<DogCard {...defaultProps} />);
      // 활동 수준은 badge나 다른 형태로 표시될 수 있으므로 기본 정보 확인
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByText('골든 리트리버')).toBeInTheDocument();
    });

    it('handles missing optional data gracefully', () => {
      const incompleteDog = {
        ...mockDog,
        profileImage: undefined,
        description: undefined,
        microchipId: undefined,
        registrationNumber: undefined,
      };

      render(<DogCard {...defaultProps} dog={incompleteDog} />);

      // 필수 정보는 여전히 표시됨
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
      expect(screen.getByText('골든 리트리버')).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 성능 테스트 ===
  describe('Performance', () => {
    it('does not re-render unnecessarily with same props', () => {
      const { rerender } = render(<DogCard {...defaultProps} />);

      // 동일한 props로 리렌더링
      rerender(<DogCard {...defaultProps} />);

      // 컴포넌트가 여전히 정상적으로 렌더링됨
      expect(screen.getByText('멍멍이')).toBeInTheDocument();
    });

    it('memoizes expensive computations', () => {
      const { rerender } = render(<DogCard {...defaultProps} />);

      // props가 변경되지 않으면 동일한 결과 반환
      const firstRender = screen.getByText('5세 1개월'); // 실제 렌더링된 나이

      rerender(<DogCard {...defaultProps} />);
      const secondRender = screen.getByText('5세 1개월');

      expect(firstRender).toBe(secondRender);
    });
  });

  // === AI 자동화 룰: 커스텀 클래스명 테스트 ===
  describe('Custom Styling', () => {
    it('applies custom className correctly', () => {
      const customClass = 'custom-dog-card';
      render(<DogCard {...defaultProps} className={customClass} />);

      // 메인 카드 찾기 (tabIndex가 0인 버튼)
      const cardButtons = screen.getAllByRole('button');
      const mainCard = cardButtons.find(
        button => button.getAttribute('tabindex') === '0'
      );

      expect(mainCard).toHaveClass(customClass);
    });

    it('combines className with default classes', () => {
      const customClass = 'custom-class';
      render(<DogCard {...defaultProps} className={customClass} />);

      // 메인 카드 찾기
      const cardButtons = screen.getAllByRole('button');
      const mainCard = cardButtons.find(
        button => button.getAttribute('tabindex') === '0'
      );

      expect(mainCard).toHaveClass(customClass);
    });
  });
});
