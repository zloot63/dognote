# 📝 코딩 컨벤션 (Coding Conventions)

*DogNote 프로젝트의 일관된 코드 품질을 위한 코딩 표준*

---

## 📖 목차

1. [TypeScript 컨벤션](#typescript-컨벤션)
2. [React 컨벤션](#react-컨벤션)
3. [파일 및 폴더 구조](#파일-및-폴더-구조)
4. [네이밍 컨벤션](#네이밍-컨벤션)
5. [주석 및 문서화](#주석-및-문서화)
6. [ESLint & Prettier 설정](#eslint--prettier-설정)

---

## 1. TypeScript 컨벤션

### 1.1 타입 정의

#### **인터페이스 vs 타입**
```typescript
// ✅ Good: 확장 가능한 구조는 인터페이스 사용
interface User {
  id: string;
  name: string;
  email: string;
}

interface Dog extends User {
  breed: string;
  age: number;
}

// ✅ Good: 유니온 타입이나 계산된 타입은 type 사용
type WalkStatus = 'active' | 'paused' | 'completed' | 'cancelled';
type WalkRecord = Omit<Walk, 'id'> & { duration: number };
```

#### **제네릭 타입**
```typescript
// ✅ Good: 재사용 가능한 제네릭 타입
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// 사용 예시
const dogsResponse: PaginatedResponse<Dog> = await fetchDogs();
```

#### **유틸리티 타입 활용**
```typescript
// ✅ Good: 기존 타입에서 파생된 타입 생성
interface CreateUserDto extends Pick<User, 'name' | 'email'> {
  password: string;
}

interface UpdateUserDto extends Partial<Pick<User, 'name' | 'email'>> {
  id: string;
}

// ❌ Bad: 중복된 타입 정의
interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```

### 1.2 함수 타입 정의

#### **함수 시그니처**
```typescript
// ✅ Good: 명시적인 반환 타입
const calculateWalkDistance = async (
  coordinates: GeoCoordinate[]
): Promise<number> => {
  // 구현...
  return distance;
};

// ✅ Good: 옵셔널 파라미터와 기본값
const formatDuration = (
  minutes: number,
  format: 'short' | 'long' = 'short'
): string => {
  // 구현...
};
```

#### **콜백 및 이벤트 핸들러**
```typescript
// ✅ Good: 이벤트 핸들러 타입 정의
interface WalkControlsProps {
  onStart: () => void;
  onPause: () => void;
  onStop: (reason: 'user' | 'timeout' | 'error') => void;
  onLocationUpdate?: (location: GeoCoordinate) => void;
}
```

### 1.3 Strict Mode 규칙

```typescript
// tsconfig.json - 엄격한 타입 검사 활성화
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}

// ✅ Good: null/undefined 안전 처리
const getDogName = (dog: Dog | null): string => {
  return dog?.name ?? 'Unknown Dog';
};

// ✅ Good: 타입 가드 사용
const isDog = (animal: Animal): animal is Dog => {
  return 'breed' in animal;
};
```

---

## 2. React 컨벤션

### 2.1 컴포넌트 구조

#### **함수형 컴포넌트 기본 구조**
```typescript
// ✅ Good: 표준 컴포넌트 구조
import React, { memo, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WalkTimerProps {
  initialTime?: number;
  isActive: boolean;
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

export const WalkTimer = memo<WalkTimerProps>(({ 
  initialTime = 0,
  isActive,
  onTimeUpdate,
  className 
}) => {
  // 1. 상태 선언
  const [seconds, setSeconds] = useState(initialTime);
  
  // 2. 이펙트
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  // 3. 콜백 및 이벤트 핸들러
  const handleReset = useCallback(() => {
    setSeconds(0);
    onTimeUpdate?.(0);
  }, [onTimeUpdate]);
  
  // 4. 계산된 값
  const formattedTime = formatTime(seconds);
  
  // 5. Early returns
  if (!isActive && seconds === 0) {
    return null;
  }
  
  // 6. 렌더링
  return (
    <div className={cn('timer-container', className)}>
      <span className="timer-display">{formattedTime}</span>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
});

WalkTimer.displayName = 'WalkTimer';
```

### 2.2 Hooks 사용 규칙

#### **커스텀 훅 패턴**
```typescript
// ✅ Good: 커스텀 훅 구조
interface UseWalkTimerReturn {
  seconds: number;
  formattedTime: string;
  isActive: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const useWalkTimer = (initialTime = 0): UseWalkTimerReturn => {
  const [seconds, setSeconds] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback(() => {
    setSeconds(0);
    setIsActive(false);
  }, []);
  
  const formattedTime = useMemo(() => formatTime(seconds), [seconds]);
  
  return {
    seconds,
    formattedTime,
    isActive,
    start,
    pause,
    reset,
  };
};
```

### 2.3 Props 및 상태 관리

#### **Props 타입 정의**
```typescript
// ✅ Good: 명확한 Props 인터페이스
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ✅ Good: forwardRef와 함께 사용
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading}
        className={buttonVariants({ variant, size })}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);
```

#### **상태 업데이트 패턴**
```typescript
// ✅ Good: 함수형 상태 업데이트
const [walks, setWalks] = useState<Walk[]>([]);

const addWalk = useCallback((newWalk: Walk) => {
  setWalks(prev => [...prev, newWalk]);
}, []);

const updateWalk = useCallback((id: string, updates: Partial<Walk>) => {
  setWalks(prev => prev.map(walk => 
    walk.id === id ? { ...walk, ...updates } : walk
  ));
}, []);

// ✅ Good: 복잡한 상태는 useReducer 사용
interface WalkState {
  walks: Walk[];
  activeWalk: Walk | null;
  loading: boolean;
  error: string | null;
}

const walkReducer = (state: WalkState, action: WalkAction): WalkState => {
  switch (action.type) {
    case 'START_WALK':
      return {
        ...state,
        activeWalk: action.payload,
        loading: false,
      };
    // 다른 액션들...
    default:
      return state;
  }
};
```

---

## 3. 파일 및 폴더 구조

### 3.1 파일 네이밍

```
// 컴포넌트 파일 - PascalCase
src/components/ui/Button.tsx
src/components/features/WalkTimer.tsx

// 페이지 파일 - kebab-case
src/app/dashboard/page.tsx
src/app/dog-profile/page.tsx

// 훅 파일 - camelCase (use 접두사)
src/hooks/useWalkTimer.ts
src/hooks/useFirebaseAuth.ts

// 유틸리티 파일 - camelCase
src/lib/formatters.ts
src/lib/firebaseConfig.ts

// 타입 파일 - camelCase
src/types/user.ts
src/types/api.ts
```

### 3.2 import/export 규칙

#### **Import 순서**
```typescript
// 1. React 및 Next.js
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

// 2. 외부 라이브러리
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

// 3. 내부 모듈 (절대 경로)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDuration } from '@/lib/formatters';

// 4. 타입 import (마지막)
import type { Walk, Dog } from '@/types';
```

#### **Export 패턴**
```typescript
// ✅ Good: Named export (권장)
export const WalkTimer = () => {
  // 구현...
};

// ✅ Good: 타입과 함께 export
export type { WalkTimerProps };
export { WalkTimer };

// ✅ Good: index 파일에서 re-export
// src/components/ui/index.ts
export { Button } from './Button';
export { Modal } from './Modal';
export { Input } from './Input';
export type { ButtonProps, ModalProps, InputProps } from './types';
```

---

## 4. 네이밍 컨벤션

### 4.1 변수 및 함수명

```typescript
// ✅ Good: 명확하고 설명적인 이름
const isWalkActive = true;
const totalWalkDistance = 3.2; // km
const userPreferences = getUserPreferences();

// 함수명은 동사로 시작
const calculateDistance = (start: Point, end: Point) => { };
const formatWalkDuration = (minutes: number) => { };
const validateEmail = (email: string) => { };

// Boolean 변수는 is/has/can/should 접두사
const isLoggedIn = checkAuthStatus();
const hasPermission = checkUserPermission();
const canEdit = user.role === 'admin';
const shouldShowNotification = !user.notificationsDisabled;

// ❌ Bad: 모호한 이름
const data = getWalks(); // walks가 더 명확
const temp = user.name; // userName 또는 currentUserName
const flag = true; // isEnabled, isActive 등 구체적으로
```

### 4.2 상수 및 열거형

```typescript
// ✅ Good: 상수는 SCREAMING_SNAKE_CASE
const MAX_WALK_DURATION_MINUTES = 240;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_PAGE_SIZE = 20;

// ✅ Good: 열거형 대신 const assertion 사용
const WalkStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

type WalkStatus = typeof WalkStatus[keyof typeof WalkStatus];
```

### 4.3 컴포넌트 및 클래스명

```typescript
// ✅ Good: 컴포넌트는 PascalCase
export const WalkTrackingMap = () => { };
export const UserProfileCard = () => { };
export const DogSelectionModal = () => { };

// ✅ Good: 커스텀 훅은 camelCase + use 접두사
export const useWalkTimer = () => { };
export const useGeolocation = () => { };
export const useFirebaseAuth = () => { };

// ✅ Good: Context는 PascalCase + Context 접미사  
export const AuthContext = createContext();
export const WalkContext = createContext();
```

---

## 5. 주석 및 문서화

### 5.1 JSDoc 주석

```typescript
/**
 * 산책 시간을 사람이 읽기 쉬운 형태로 포맷팅합니다.
 * 
 * @param minutes - 산책 시간 (분 단위)
 * @param format - 포맷 형식 ('short' | 'long')
 * @returns 포맷팅된 시간 문자열
 * 
 * @example
 * ```typescript
 * formatWalkDuration(75) // "1h 15m"
 * formatWalkDuration(75, 'long') // "1시간 15분"
 * ```
 */
export const formatWalkDuration = (
  minutes: number,
  format: 'short' | 'long' = 'short'
): string => {
  // 구현...
};
```

### 5.2 컴포넌트 문서화

```typescript
/**
 * 산책 타이머 컴포넌트
 * 
 * 산책 시간을 추적하고 실시간으로 표시하는 타이머 컴포넌트입니다.
 * 시작, 일시정지, 리셋 기능을 제공합니다.
 */
interface WalkTimerProps {
  /** 초기 시간 (초 단위) */
  initialTime?: number;
  /** 타이머 활성 상태 */
  isActive: boolean;
  /** 시간 업데이트 콜백 */
  onTimeUpdate?: (time: number) => void;
  /** 추가 CSS 클래스명 */
  className?: string;
}

export const WalkTimer: React.FC<WalkTimerProps> = ({ ... }) => {
  // 구현...
};
```

### 5.3 인라인 주석

```typescript
// ✅ Good: 복잡한 로직 설명
const calculateDistance = (coordinates: GeoCoordinate[]): number => {
  if (coordinates.length < 2) return 0;
  
  let totalDistance = 0;
  
  // Haversine 공식을 사용하여 지구상의 두 점 사이 거리 계산
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    
    // 위도와 경도를 라디안으로 변환
    const lat1Rad = (prev.latitude * Math.PI) / 180;
    const lat2Rad = (curr.latitude * Math.PI) / 180;
    // ... 복잡한 수학 계산
  }
  
  return totalDistance;
};

// ✅ Good: TODO/FIXME/NOTE 주석
// TODO: 오프라인 모드 지원 추가
// FIXME: 메모리 누수 가능성 있는 useEffect 정리 필요
// NOTE: Firebase v10에서 API 변경으로 인한 임시 해결책
```

---

## 6. ESLint & Prettier 설정

### 6.1 ESLint 설정 (.eslintrc.json)

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    // TypeScript 규칙
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    
    // React 규칙
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "warn",
    
    // 일반 규칙
    "prefer-const": "error",
    "no-console": "warn",
    "no-debugger": "error"
  }
}
```

### 6.2 Prettier 설정 (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

### 6.3 pre-commit 훅 설정

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 📚 참고 자료

- **[TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)**
- **[React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)**
- **[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)**

---

*일관된 코드 스타일 유지를 위해 모든 팀원이 이 컨벤션을 준수해 주세요.*

**문서 히스토리:**
- v1.0: 2025-08-31 (코딩 컨벤션 가이드 작성)
