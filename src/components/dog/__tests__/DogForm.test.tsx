import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import DogForm from '../DogForm';
import type { Dog } from '@/types/dog';

// Define proper types for mocked components
interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  [key: string]: unknown;
}

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

interface LabelProps {
  children?: React.ReactNode;
  htmlFor?: string;
  [key: string]: unknown;
}

interface CustomSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface SelectContentProps {
  children?: React.ReactNode;
}

interface SelectItemProps {
  value?: string;
  children?: React.ReactNode;
}

interface SelectTriggerProps {
  children?: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: unknown;
}

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  [key: string]: unknown;
}

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  [key: string]: unknown;
}

interface ImageUploadProps {
  onImageChange?: (file: File) => void;
  existingImageUrl?: string;
}

// === AI 자동화 룰: Mock 설정 ===
// 외부 의존성 모킹
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    loading,
    ...props
  }: ButtonProps) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, ...props }: InputProps) => (
    <input value={value} onChange={onChange} {...props} />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, ...props }: LabelProps) => (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  ),
}));

vi.mock('@/components/ui/CustomSelect', () => ({
  CustomSelect: ({
    value,
    onValueChange,
    children,
    ...props
  }: CustomSelectProps) => (
    <select
      value={value}
      onChange={e => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: SelectContentProps) => <div>{children}</div>,
  SelectItem: ({ value, children }: SelectItemProps) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: SelectTriggerProps) => <div>{children}</div>,
  SelectValue: ({ placeholder }: SelectValueProps) => (
    <span>{placeholder}</span>
  ),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, ...props }: TextareaProps) => (
    <textarea value={value} onChange={onChange} {...props} />
  ),
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, ...props }: CheckboxProps) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/DatePicker', () => ({
  DatePicker: ({ value, onChange, ...props }: DatePickerProps) => (
    <input
      type="date"
      value={value?.toISOString().split('T')[0] || ''}
      onChange={e => onChange?.(new Date(e.target.value))}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/ImageUpload', () => ({
  ImageUpload: ({ onImageChange, existingImageUrl }: ImageUploadProps) => (
    <div data-testid="image-upload">
      <input
        type="file"
        data-testid="file-input"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onImageChange?.(file);
        }}
      />
      {existingImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={existingImageUrl}
          alt="existing"
          data-testid="existing-image"
        />
      )}
    </div>
  ),
}));

// NextAuth 세션 모킹
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    },
    status: 'authenticated',
  })),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn(),
  },
}));

vi.mock('@/lib/supabase/storage', () => ({
  uploadDogProfileImage: vi.fn(),
}));

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
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

vi.mock('@/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: { id: 'test-user-1' },
    loading: false,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// === AI 자동화 룰: 테스트 데이터 ===
const mockDogData: Dog = {
  id: 'test-dog-1',
  userId: 'test-user-1',
  name: '멍멍이',
  breed: '골든 리트리버',
  gender: 'male',
  weight: 25.5,
  color: 'golden',
  profileImage: 'https://example.com/dog-image.jpg',
  activityLevel: 'high',
  isNeutered: true,
  birthDate: '2021-01-15',
  description: '매우 활발하고 친근한 성격입니다.',
  microchipId: 'CHIP123456',
  registrationNumber: 'REG123456',
  size: 'large',
  temperament: ['활발한', '친화적인'],
  allergies: [],
  medicalConditions: [],
  emergencyContact: {
    name: '비상연락처',
    phone: '010-1234-5678',
    relationship: '보호자',
  },
  veterinarian: {
    name: '수의사',
    clinic: '동물병원',
    phone: '02-1234-5678',
    address: '서울시 강남구',
  },
  createdAt: '2021-01-01T00:00:00Z',
  updatedAt: '2021-01-01T00:00:00Z',
};

describe('DogForm', () => {
  // === AI 자동화 룰: 공통 설정 ===
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  // === AI 자동화 룰: 기본 렌더링 테스트 ===
  describe('Basic Rendering', () => {
    it('renders all form fields correctly', () => {
      render(<DogForm {...defaultProps} />);

      // 필수 필드들 확인
      expect(screen.getByLabelText(/이름/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/견종/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/나이/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/성별/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/체중/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/색상/i)).toBeInTheDocument();
      expect(screen.getByTestId('image-upload')).toBeInTheDocument();
    });

    it('renders form title correctly for new dog', () => {
      render(<DogForm {...defaultProps} />);
      expect(screen.getByText('새 강아지 등록')).toBeInTheDocument();
    });

    it('renders form title correctly for editing existing dog', () => {
      render(<DogForm {...defaultProps} dog={mockDogData} />);
      expect(screen.getByText('강아지 정보 수정')).toBeInTheDocument();
    });

    it('renders submit and cancel buttons', () => {
      render(<DogForm {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /등록하기/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /취소/i })).toBeInTheDocument();
    });
  });

  // === AI 자동화 룰: 폼 초기값 테스트 ===
  describe('Form Initial Values', () => {
    it('initializes with empty values for new dog', () => {
      render(<DogForm {...defaultProps} />);

      expect(screen.getByLabelText(/이름/i)).toHaveValue('');
      expect(screen.getByLabelText(/견종/i)).toHaveValue('');
      expect(screen.getByLabelText(/나이/i)).toHaveValue('');
    });

    it('initializes with existing dog data for editing', () => {
      render(<DogForm {...defaultProps} dog={mockDogData} />);

      expect(screen.getByLabelText(/이름/i)).toHaveValue('멍멍이');
      expect(screen.getByLabelText(/견종/i)).toHaveValue('골든 리트리버');
      expect(screen.getByLabelText(/나이/i)).toHaveValue('3');
      expect(screen.getByLabelText(/체중/i)).toHaveValue('25.5');
    });

    it('displays existing profile image correctly', () => {
      render(<DogForm {...defaultProps} dog={mockDogData} />);

      expect(screen.getByTestId('existing-image')).toHaveAttribute(
        'src',
        mockDogData.profileImage
      );
    });
  });

  // === AI 자동화 룰: 폼 검증 테스트 ===
  describe('Form Validation', () => {
    it('shows validation error for empty required fields', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /등록하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/이름을 입력해주세요/i)).toBeInTheDocument();
        expect(screen.getByText(/견종을 입력해주세요/i)).toBeInTheDocument();
      });
    });

    it('validates age field correctly', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const ageInput = screen.getByLabelText(/나이/i);

      // 음수 나이 입력
      await user.type(ageInput, '-1');
      await user.tab(); // blur 이벤트 트리거

      await waitFor(() => {
        expect(
          screen.getByText(/나이는 0 이상이어야 합니다/i)
        ).toBeInTheDocument();
      });
    });

    it('validates weight field correctly', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const weightInput = screen.getByLabelText(/체중/i);

      // 음수 체중 입력
      await user.type(weightInput, '-5');
      await user.tab(); // blur 이벤트 트리거

      await waitFor(() => {
        expect(
          screen.getByText(/체중은 0 이상이어야 합니다/i)
        ).toBeInTheDocument();
      });
    });

    it('validates chip ID format', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const chipInput = screen.getByLabelText(/칩 번호/i);

      // 잘못된 형식의 칩 ID 입력
      await user.type(chipInput, '123');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/칩 번호 형식이 올바르지 않습니다/i)
        ).toBeInTheDocument();
      });
    });
  });

  // === AI 자동화 룰: 폼 상호작용 테스트 ===
  describe('Form Interactions', () => {
    it('updates form fields correctly', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/이름/i);
      const breedInput = screen.getByLabelText(/견종/i);

      await user.type(nameInput, '새로운멍멍이');
      await user.type(breedInput, '시베리안 허스키');

      expect(nameInput).toHaveValue('새로운멍멍이');
      expect(breedInput).toHaveValue('시베리안 허스키');
    });

    it('handles select field changes', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const genderSelect = screen.getByLabelText(/성별/i);
      await user.selectOptions(genderSelect, 'female');

      expect(genderSelect).toHaveValue('female');
    });

    it('handles checkbox changes', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const neuteredCheckbox = screen.getByLabelText(/중성화/i);
      await user.click(neuteredCheckbox);

      expect(neuteredCheckbox).toBeChecked();
    });

    it('handles image upload', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await user.upload(fileInput, file);

      expect((fileInput as HTMLInputElement).files).toHaveLength(1);
      expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
    });
  });

  // === AI 자동화 룰: 폼 제출 테스트 ===
  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      // 필수 필드 입력
      await user.type(screen.getByLabelText(/이름/i), '테스트멍멍이');
      await user.type(screen.getByLabelText(/견종/i), '리트리버');
      await user.type(screen.getByLabelText(/나이/i), '2');
      await user.selectOptions(screen.getByLabelText(/성별/i), 'male');

      const submitButton = screen.getByRole('button', { name: /등록하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '테스트멍멍이',
            breed: '리트리버',
            age: 2,
            gender: 'male',
          })
        );
      });
    });

    it('does not submit form with invalid data', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      // 이름만 입력하고 다른 필수 필드는 비움
      await user.type(screen.getByLabelText(/이름/i), '테스트멍멍이');

      const submitButton = screen.getByRole('button', { name: /등록하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
        expect(screen.getByText(/견종을 입력해주세요/i)).toBeInTheDocument();
      });
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /취소/i });
      await user.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  // === AI 자동화 룰: 로딩 상태 테스트 ===
  describe('Loading States', () => {
    it('disables form when loading', () => {
      render(<DogForm {...defaultProps} isLoading={true} />);

      expect(screen.getByLabelText(/이름/i)).toBeDisabled();
      expect(screen.getByLabelText(/견종/i)).toBeDisabled();
      expect(
        screen.getByRole('button', { name: /저장 중.../i })
      ).toBeDisabled();
    });

    it('shows loading text on submit button when loading', () => {
      render(<DogForm {...defaultProps} isLoading={true} />);

      expect(
        screen.getByRole('button', { name: /저장 중.../i })
      ).toBeInTheDocument();
    });

    it('enables form when not loading', () => {
      render(<DogForm {...defaultProps} isLoading={false} />);

      expect(screen.getByLabelText(/이름/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/견종/i)).not.toBeDisabled();
      expect(
        screen.getByRole('button', { name: /등록하기/i })
      ).not.toBeDisabled();
    });
  });

  // === AI 자동화 룰: 접근성 테스트 ===
  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(<DogForm {...defaultProps} />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('noValidate');
    });

    it('has proper labels for all inputs', () => {
      render(<DogForm {...defaultProps} />);

      // 모든 필수 필드에 레이블이 있는지 확인
      expect(screen.getByLabelText(/이름/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/견종/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/나이/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/성별/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/체중/i)).toBeInTheDocument();
    });

    it('associates error messages with form fields', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /등록하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/이름/i);
        const errorMessage = screen.getByText(/이름을 입력해주세요/i);

        expect(nameInput).toHaveAttribute('aria-describedby');
        expect(errorMessage).toHaveAttribute('id');
      });
    });

    it('has proper ARIA attributes', () => {
      render(<DogForm {...defaultProps} />);

      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label', '강아지 정보 입력 폼');
    });
  });

  // === AI 자동화 룰: 키보드 내비게이션 테스트 ===
  describe('Keyboard Navigation', () => {
    it('supports tab navigation through form fields', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/이름/i);
      const breedInput = screen.getByLabelText(/견종/i);

      nameInput.focus();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(breedInput).toHaveFocus();
    });

    it('supports Enter key to submit form', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      // 필수 필드 입력
      await user.type(screen.getByLabelText(/이름/i), '키보드테스트');
      await user.type(screen.getByLabelText(/견종/i), '테스트견종');
      await user.type(screen.getByLabelText(/나이/i), '1');
      await user.selectOptions(screen.getByLabelText(/성별/i), 'female');

      // Enter 키로 제출
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalled();
      });
    });

    it('supports Escape key to cancel', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      await user.keyboard('{Escape}');

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  // === AI 자동화 룰: 데이터 처리 테스트 ===
  describe('Data Processing', () => {
    it('correctly formats submitted data', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      // 폼 데이터 입력
      await user.type(screen.getByLabelText(/이름/i), '데이터테스트');
      await user.type(screen.getByLabelText(/견종/i), '테스트견종');
      await user.type(screen.getByLabelText(/나이/i), '5');
      await user.type(screen.getByLabelText(/체중/i), '12.3');
      await user.selectOptions(screen.getByLabelText(/성별/i), 'male');

      const submitButton = screen.getByRole('button', { name: /등록하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '데이터테스트',
            breed: '테스트견종',
            age: 5, // 숫자로 변환
            weight: 12.3, // 숫자로 변환
            gender: 'male',
          })
        );
      });
    });

    it('handles date fields correctly', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      const birthDateInput = screen.getByLabelText(/생년월일/i);
      await user.type(birthDateInput, '2022-01-15');

      const submitButton = screen.getByRole('button', { name: /등록하기/i });

      // 다른 필수 필드도 입력
      await user.type(screen.getByLabelText(/이름/i), '날짜테스트');
      await user.type(screen.getByLabelText(/견종/i), '테스트견종');
      await user.type(screen.getByLabelText(/나이/i), '2');
      await user.selectOptions(screen.getByLabelText(/성별/i), 'female');

      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            birthDate: expect.any(Date),
          })
        );
      });
    });
  });

  // === AI 자동화 룰: 에러 처리 테스트 ===
  describe('Error Handling', () => {
    it('handles form submission errors gracefully', async () => {
      const user = userEvent.setup();
      const errorOnSubmit = vi.fn().mockRejectedValue(new Error('제출 실패'));

      render(<DogForm {...defaultProps} onSubmit={errorOnSubmit} />);

      // 유효한 데이터 입력
      await user.type(screen.getByLabelText(/이름/i), '에러테스트');
      await user.type(screen.getByLabelText(/견종/i), '테스트견종');
      await user.type(screen.getByLabelText(/나이/i), '3');
      await user.selectOptions(screen.getByLabelText(/성별/i), 'male');

      const submitButton = screen.getByRole('button', { name: /등록하기/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/폼 제출 중 오류가 발생했습니다/i)
        ).toBeInTheDocument();
      });
    });

    it('clears errors when form data changes', async () => {
      const user = userEvent.setup();
      render(<DogForm {...defaultProps} />);

      // 빈 폼으로 제출하여 에러 발생
      await user.click(screen.getByRole('button', { name: /등록하기/i }));

      await waitFor(() => {
        expect(screen.getByText(/이름을 입력해주세요/i)).toBeInTheDocument();
      });

      // 이름 입력하면 에러 사라짐
      await user.type(screen.getByLabelText(/이름/i), '에러클리어테스트');

      await waitFor(() => {
        expect(
          screen.queryByText(/이름을 입력해주세요/i)
        ).not.toBeInTheDocument();
      });
    });
  });
});
