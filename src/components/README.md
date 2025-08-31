# 🎯 DogNote 컴포넌트 생성 & 관리 가이드

## 📁 컴포넌트 구조 개요

```
src/components/
├── ui/                 # 재사용 가능한 기본 UI 컴포넌트
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── index.ts        # 통합 export
├── dog/               # 강아지 관련 비즈니스 로직 컴포넌트
│   ├── DogForm.tsx
│   ├── DogList.tsx
│   └── DogCard.tsx
├── layout/            # 레이아웃 및 네비게이션 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── auth/              # 인증 관련 컴포넌트
├── dashboard/         # 대시보드 컴포넌트들
├── walk/              # 산책 관련 컴포넌트들
├── common/            # 공통 유틸리티 컴포넌트
├── accessibility/     # 접근성 관련 컴포넌트
└── Providers.tsx      # Context Providers
```

---

## 🏗️ 컴포넌트 아키텍처 패턴

### 1. **UI 컴포넌트 (Atomic Design 기반)**

가장 기본적인 재사용 가능한 컴포넌트들입니다.

```tsx
// ✅ UI 컴포넌트 패턴 (Button.tsx 예제)
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Variant 스타일 정의
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Props 인터페이스 정의
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// forwardRef를 사용한 컴포넌트 정의
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 2. **비즈니스 로직 컴포넌트**

도메인별 로직을 포함하는 컴포넌트들입니다.

```tsx
// ✅ 비즈니스 컴포넌트 패턴 (DogForm.tsx 예제)
'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dog, DogFormData, DOG_BREEDS } from '@/types/dog';
import {
  Button,
  Input,
  Label,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui';
import { cn } from '@/lib/utils';

// Props 인터페이스 정의 (필수)
export interface DogFormProps {
  dog?: Dog; // 수정 모드일 때 기존 데이터
  onSubmit: (data: DogFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

const DogForm: React.FC<DogFormProps> = ({
  dog,
  onSubmit,
  onCancel,
  isLoading = false,
  className
}) => {
  // 1. Hooks 선언부
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors } } = useForm<DogFormData>();

  // 2. 이벤트 핸들러 정의
  const handleFormSubmit = async (data: DogFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // 3. 렌더링
  return (
    <Card className={cn("max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>{dog ? '강아지 정보 수정' : '새 강아지 등록'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Form content */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DogForm;
```

### 3. **레이아웃 컴포넌트**

페이지 구조와 네비게이션을 담당하는 컴포넌트들입니다.

```tsx
// ✅ 레이아웃 컴포넌트 패턴 (Header.tsx 예제)
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Header() {
  // 1. State 관리
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. Effects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      // Additional logic...
    });
    
    return unsubscribe;
  }, []);

  // 3. 렌더링
  return (
    <header className="bg-white shadow-sm border-b">
      {/* Header content */}
    </header>
  );
}
```

---

## 📝 컴포넌트 생성 규칙

### **1. 네이밍 컨벤션**

```tsx
// ✅ 올바른 파일명 & 컴포넌트명
DogForm.tsx          → const DogForm: React.FC<Props>
UserProfile.tsx      → const UserProfile: React.FC<Props>
WalkHistoryList.tsx  → const WalkHistoryList: React.FC<Props>

// ❌ 잘못된 네이밍
dogform.tsx          → X (케밥케이스)
dog-form.tsx         → X (케밥케이스)
Dogform.tsx          → X (단어 구분 없음)
```

### **2. 필수 TypeScript 패턴**

```tsx
// ✅ Props 인터페이스는 항상 정의
export interface ComponentProps {
  // 필수 props
  title: string;
  onSubmit: (data: FormData) => Promise<void>;
  
  // 선택적 props
  className?: string;
  isLoading?: boolean;
  variant?: 'default' | 'compact';
}

// ✅ Generic 타입 활용
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
}

const List = <T,>({ items, renderItem, onItemClick }: ListProps<T>) => {
  // 컴포넌트 로직
};
```

### **3. 컴포넌트 구조 템플릿**

```tsx
// ✅ 표준 컴포넌트 템플릿
'use client'; // 클라이언트 컴포넌트인 경우에만

import React, { useState, useEffect } from 'react';
import { SomeType } from '@/types/domain';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

// 1. Props 인터페이스 정의
export interface ComponentNameProps {
  // Props 정의
}

// 2. 컴포넌트 정의
const ComponentName: React.FC<ComponentNameProps> = ({
  // Props 구조분해할당
}) => {
  // 3. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState();

  // 4. 이벤트 핸들러
  const handleClick = () => {
    // 로직
  };

  // 5. Effects
  useEffect(() => {
    // 부수 효과
  }, []);

  // 6. 조건부 렌더링 (Early return)
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // 7. 메인 렌더링
  return (
    <div className={cn("base-classes", className)}>
      {/* 컴포넌트 내용 */}
    </div>
  );
};

// 8. displayName 설정 (forwardRef 사용 시)
ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

---

## 🎨 스타일링 가이드

### **1. Tailwind CSS 활용**

```tsx
// ✅ 조건부 스타일링
const Button = ({ variant, size, disabled }: ButtonProps) => {
  return (
    <button
      className={cn(
        // 기본 스타일
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        // 조건부 스타일
        {
          "bg-primary text-white hover:bg-primary/90": variant === 'primary',
          "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === 'secondary',
          "opacity-50 cursor-not-allowed": disabled,
          "h-8 px-3 text-xs": size === 'sm',
          "h-10 px-4 text-sm": size === 'md',
          "h-12 px-6 text-base": size === 'lg',
        },
        className
      )}
    >
      {children}
    </button>
  );
};
```

### **2. CSS Variables 활용**

```tsx
// ✅ 테마 색상 활용
className="bg-primary text-primary-foreground"  // 테마 색상
className="bg-card text-card-foreground"        // 카드 색상
className="border-border"                       // 테마 보더
```

---

## 🚀 성능 최적화 패턴

### **1. React.memo 활용**

```tsx
// ✅ 메모이제이션이 필요한 컴포넌트
const DogCard = React.memo<DogCardProps>(({ dog, onEdit, onDelete }) => {
  return (
    <Card>
      {/* 카드 내용 */}
    </Card>
  );
});
```

### **2. useCallback & useMemo**

```tsx
const DogList: React.FC<DogListProps> = ({ dogs, onEdit, onDelete }) => {
  // ✅ 콜백 함수 메모이제이션
  const handleEdit = useCallback((id: string) => {
    onEdit(id);
  }, [onEdit]);

  // ✅ 비싼 계산 메모이제이션
  const sortedDogs = useMemo(() => {
    return dogs.sort((a, b) => a.name.localeCompare(b.name));
  }, [dogs]);

  return (
    <div>
      {sortedDogs.map(dog => (
        <DogCard 
          key={dog.id} 
          dog={dog} 
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
```

---

## 🛡️ 에러 처리 패턴

### **1. 에러 바운더리**

```tsx
// ✅ 에러 바운더리 컴포넌트
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <h2 className="text-red-800 font-semibold">오류가 발생했습니다</h2>
          <p className="text-red-600">페이지를 새로고침해주세요.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **2. 로딩 및 에러 상태 관리**

```tsx
const DataComponent: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 조건부 렌더링으로 상태 관리
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (data.length === 0) return <EmptyState />;

  return (
    <div>
      {data.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
```

---

## 📦 컴포넌트 Export 패턴

### **1. UI 컴포넌트 통합 Export**

```tsx
// src/components/ui/index.ts
export { Button, type ButtonProps } from './Button';
export { Card, CardHeader, CardTitle, CardContent } from './Card';
export { Input, type InputProps } from './Input';
export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';

// 사용 시
import { Button, Card, CardHeader, Input } from '@/components/ui';
```

### **2. 도메인별 컴포넌트 Export**

```tsx
// src/components/dog/index.ts
export { default as DogForm } from './DogForm';
export { default as DogList } from './DogList';
export { default as DogCard } from './DogCard';
export type { DogFormProps } from './DogForm';

// 사용 시
import { DogForm, DogList, DogCard } from '@/components/dog';
```

---

## ✅ 테스팅 가이드

### **1. 컴포넌트 테스트 예제**

```tsx
// DogCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DogCard } from './DogCard';

const mockDog = {
  id: '1',
  name: '멍멍이',
  breed: '골든 리트리버',
  age: 3,
};

describe('DogCard', () => {
  it('강아지 정보를 올바르게 렌더링한다', () => {
    render(<DogCard dog={mockDog} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('멍멍이')).toBeInTheDocument();
    expect(screen.getByText('골든 리트리버')).toBeInTheDocument();
    expect(screen.getByText('3살')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 onEdit 콜백이 호출된다', () => {
    const mockOnEdit = jest.fn();
    render(<DogCard dog={mockDog} onEdit={mockOnEdit} onDelete={jest.fn()} />);
    
    fireEvent.click(screen.getByText('수정'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockDog.id);
  });
});
```

---

## 🎯 접근성 (A11y) 가이드

### **1. 키보드 네비게이션**

```tsx
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ 포커스 트래핑
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // ✅ ESC 키 처리
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {children}
    </div>
  );
};
```

### **2. 스크린 리더 지원**

```tsx
const Button: React.FC<ButtonProps> = ({ 
  children, 
  ariaLabel, 
  isLoading,
  ...props 
}) => {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      disabled={isLoading}
    >
      {isLoading && (
        <span aria-hidden="true" className="loader" />
      )}
      <span className={isLoading ? 'sr-only' : undefined}>
        {children}
      </span>
    </button>
  );
};
```

---

## 📋 컴포넌트 체크리스트

새로운 컴포넌트를 작성할 때 다음 체크리스트를 확인하세요:

### **코드 품질**
- [ ] TypeScript Props 인터페이스 정의
- [ ] ESLint/Prettier 규칙 준수
- [ ] 적절한 네이밍 컨벤션 사용
- [ ] displayName 설정 (forwardRef 사용 시)

### **성능**
- [ ] 불필요한 리렌더링 방지 (memo, useCallback, useMemo)
- [ ] 적절한 key props 사용
- [ ] 이벤트 핸들러 최적화

### **접근성**
- [ ] 적절한 ARIA 속성 사용
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 호환성
- [ ] 색상 대비 및 포커스 표시

### **테스팅**
- [ ] 주요 기능에 대한 유닛 테스트
- [ ] 사용자 인터랙션 테스트
- [ ] 접근성 테스트

### **문서화**
- [ ] JSDoc 주석 (복잡한 로직의 경우)
- [ ] Props 문서화
- [ ] 사용 예제 제공

---

## 🚀 시작하기

새로운 컴포넌트를 만들 때는 다음 명령어를 사용하세요:

```bash
# 새 컴포넌트 생성 (예: NewComponent)
mkdir -p src/components/domain
touch src/components/domain/NewComponent.tsx

# 테스트 파일 생성
touch src/components/domain/NewComponent.test.tsx
```

이 가이드라인을 따라 일관성 있고 유지보수하기 쉬운 컴포넌트를 작성해보세요! 🎉

---

**📝 업데이트:** 2024년 8월 31일  
**👥 기여자:** DogNote 개발팀
