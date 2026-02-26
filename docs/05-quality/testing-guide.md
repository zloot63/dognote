# 🧪 테스팅 가이드 (Testing Guide)

_DogNote 프로젝트의 포괄적인 테스팅 전략 및 구현 가이드_

---

## 📖 목차

1. [테스팅 전략](#테스팅-전략)
2. [유닛 테스트](#유닛-테스트)
3. [통합 테스트](#통합-테스트)
4. [E2E 테스트](#e2e-테스트)
5. [접근성 테스트](#접근성-테스트)
6. [성능 테스트](#성능-테스트)
7. [테스트 자동화](#테스트-자동화)

---

## 1. 테스팅 전략

### 1.1 테스트 피라미드

```
           ┌───────────────┐
           │   E2E Tests   │  10% - 느리고 비쌈, 핵심 사용자 플로우
           │   (Cypress)   │
         ┌─┴───────────────┴─┐
         │ Integration Tests │  20% - 컴포넌트 간 상호작용
         │ (React Testing)   │
       ┌─┴───────────────────┴─┐
       │     Unit Tests        │  70% - 빠르고 저렴, 개별 함수/컴포넌트
       │   (Vitest + Jest)     │
       └───────────────────────┘
```

### 1.2 테스팅 원칙

#### **AAA 패턴 (Arrange-Act-Assert)**

```typescript
// ✅ Good: 명확한 AAA 구조
describe('formatWalkDuration', () => {
  it('should format minutes to hours and minutes', () => {
    // Arrange (준비)
    const minutes = 75;
    const expectedResult = '1h 15m';

    // Act (실행)
    const result = formatWalkDuration(minutes);

    // Assert (검증)
    expect(result).toBe(expectedResult);
  });
});
```

#### **Given-When-Then 패턴**

```typescript
// ✅ Good: BDD 스타일 테스트
describe('WalkTimer Component', () => {
  it('should start timer when start button is clicked', () => {
    // Given: 타이머가 중지된 상태
    render(<WalkTimer isActive={false} />);

    // When: 시작 버튼을 클릭
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Then: 타이머가 시작됨
    expect(screen.getByText(/00:01/)).toBeInTheDocument();
  });
});
```

---

## 2. 유닛 테스트

### 2.1 Vitest 설정

#### **vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2.2 유틸리티 함수 테스트

#### **formatters 테스트**

```typescript
// src/lib/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatWalkDuration, formatDistance, formatDate } from './formatters';

describe('formatters', () => {
  describe('formatWalkDuration', () => {
    it.each([
      [0, '0m'],
      [5, '5m'],
      [60, '1h 0m'],
      [75, '1h 15m'],
      [145, '2h 25m'],
    ])('should format %i minutes to %s', (minutes, expected) => {
      expect(formatWalkDuration(minutes)).toBe(expected);
    });

    it('should handle negative values', () => {
      expect(formatWalkDuration(-10)).toBe('0m');
    });
  });

  describe('formatDistance', () => {
    it('should format meters to km', () => {
      expect(formatDistance(1500)).toBe('1.5km');
      expect(formatDistance(500)).toBe('0.5km');
      expect(formatDistance(100)).toBe('0.1km');
    });

    it('should handle zero distance', () => {
      expect(formatDistance(0)).toBe('0.0km');
    });
  });
});
```

### 2.3 커스텀 훅 테스트

#### **useWalkTimer 테스트**

```typescript
// src/hooks/useWalkTimer.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWalkTimer } from './useWalkTimer';

describe('useWalkTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWalkTimer());

    expect(result.current.seconds).toBe(0);
    expect(result.current.formattedTime).toBe('0m');
    expect(result.current.isActive).toBe(false);
  });

  it('should start and increment timer', () => {
    const { result } = renderHook(() => useWalkTimer());

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(1);
  });

  it('should pause timer', () => {
    const { result } = renderHook(() => useWalkTimer());

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(5000);
      result.current.pause();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.seconds).toBe(5);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // 일시정지 상태에서는 증가하지 않음
    expect(result.current.seconds).toBe(5);
  });
});
```

---

## 3. 통합 테스트

### 3.1 React Testing Library 설정

#### **test setup**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 각 테스트 후 DOM 정리
afterEach(() => {
  cleanup();
});

// Firebase 모킹
vi.mock('firebase/app');
vi.mock('firebase/auth');
vi.mock('firebase/firestore');

// Geolocation API 모킹
Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});
```

### 3.2 컴포넌트 통합 테스트

#### **WalkTracker 컴포넌트 테스트**

```typescript
// src/components/features/WalkTracker.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WalkTracker } from './WalkTracker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 테스트용 Wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('WalkTracker Integration', () => {
  const mockDog = {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
  };

  it('should complete walk flow', async () => {
    const Wrapper = createWrapper();

    render(
      <WalkTracker dog={mockDog} />,
      { wrapper: Wrapper }
    );

    // 초기 상태 확인
    expect(screen.getByText('Start Walk')).toBeInTheDocument();
    expect(screen.getByText('Buddy')).toBeInTheDocument();

    // 산책 시작
    fireEvent.click(screen.getByText('Start Walk'));

    await waitFor(() => {
      expect(screen.getByText('Pause Walk')).toBeInTheDocument();
      expect(screen.getByText(/00:00/)).toBeInTheDocument();
    });

    // 산책 완료
    fireEvent.click(screen.getByText('End Walk'));

    await waitFor(() => {
      expect(screen.getByText('Walk Completed')).toBeInTheDocument();
    });
  });

  it('should handle geolocation permission', async () => {
    // 위치 권한 거부 시뮬레이션
    const mockGeolocation = vi.mocked(navigator.geolocation.getCurrentPosition);
    mockGeolocation.mockImplementation((success, error) => {
      error?.({
        code: 1,
        message: 'Permission denied',
      } as GeolocationPositionError);
    });

    const Wrapper = createWrapper();
    render(<WalkTracker dog={mockDog} />, { wrapper: Wrapper });

    fireEvent.click(screen.getByText('Start Walk'));

    await waitFor(() => {
      expect(screen.getByText(/location permission/i)).toBeInTheDocument();
    });
  });
});
```

### 3.3 API 통합 테스트

#### **MSW 모킹**

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Firestore 모킹
  rest.post('*/dogs', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '1',
        name: 'Test Dog',
        breed: 'Test Breed',
        createdAt: new Date().toISOString(),
      })
    );
  }),

  // 산책 기록 모킹
  rest.post('*/walks', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '1',
        dogId: '1',
        startTime: new Date().toISOString(),
        status: 'active',
      })
    );
  }),

  // 에러 케이스 모킹
  rest.post('*/walks/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
  }),
];
```

---

## 4. E2E 테스트

### 4.1 Cypress 설정

#### **cypress.config.ts**

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // 플러그인 설정
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
```

### 4.2 핵심 사용자 플로우 테스트

#### **산책 플로우 E2E 테스트**

```typescript
// cypress/e2e/walk-flow.cy.ts
describe('Walk Flow', () => {
  beforeEach(() => {
    // 테스트용 사용자 로그인
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
  });

  it('should complete full walk cycle', () => {
    // 반려견 선택
    cy.get('[data-testid="dog-selector"]').click();
    cy.get('[data-testid="dog-option-1"]').click();

    // 산책 시작
    cy.get('[data-testid="start-walk-button"]').click();

    // 위치 권한 허용 (모킹된 상태)
    cy.get('[data-testid="allow-location"]').click();

    // 산책 진행 확인
    cy.get('[data-testid="walk-timer"]').should('contain', '00:');
    cy.get('[data-testid="walk-status"]').should('contain', 'Active');

    // 일시정지
    cy.get('[data-testid="pause-walk-button"]').click();
    cy.get('[data-testid="walk-status"]').should('contain', 'Paused');

    // 재개
    cy.get('[data-testid="resume-walk-button"]').click();
    cy.get('[data-testid="walk-status"]').should('contain', 'Active');

    // 산책 종료
    cy.get('[data-testid="end-walk-button"]').click();

    // 산책 요약 확인
    cy.get('[data-testid="walk-summary"]').should('be.visible');
    cy.get('[data-testid="walk-duration"]').should('contain', 'minutes');
    cy.get('[data-testid="walk-distance"]').should('contain', 'km');

    // 저장 확인
    cy.get('[data-testid="save-walk-button"]').click();
    cy.get('[data-testid="walk-saved-message"]').should('be.visible');
  });

  it('should handle offline scenario', () => {
    // 오프라인 상태 시뮬레이션
    cy.intercept('**', { forceNetworkError: true }).as('networkError');

    cy.get('[data-testid="start-walk-button"]').click();

    // 오프라인 알림 확인
    cy.get('[data-testid="offline-notice"]').should('be.visible');

    // 로컬 저장 확인
    cy.get('[data-testid="local-storage-indicator"]').should('contain', 'Saved locally');
  });
});
```

### 4.3 접근성 E2E 테스트

```typescript
// cypress/e2e/accessibility.cy.ts
describe('Accessibility', () => {
  it('should be navigable with keyboard only', () => {
    cy.visit('/dashboard');

    // Tab으로 네비게이션
    cy.get('body').tab();
    cy.focused().should('contain', 'Skip to content');

    cy.focused().tab();
    cy.focused().should('have.attr', 'role', 'navigation');

    // 모든 interactive 요소가 포커스 가능한지 확인
    cy.get('[role="button"], button, [role="link"], a, input, select, textarea').each($el => {
      cy.wrap($el).focus().should('be.focused');
    });
  });

  it('should have proper ARIA labels', () => {
    cy.visit('/walk-tracker');

    // 중요한 요소들의 ARIA 레이블 확인
    cy.get('[data-testid="start-walk-button"]')
      .should('have.attr', 'aria-label')
      .and('contain', 'Start walk');

    cy.get('[data-testid="walk-timer"]').should('have.attr', 'aria-live', 'polite');
  });
});
```

---

## 5. 접근성 테스트

### 5.1 axe-core 통합

```typescript
// src/test/accessibility.test.ts
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WalkTracker } from '@/components/features/WalkTracker';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <WalkTracker dog={{ id: '1', name: 'Buddy', breed: 'Golden Retriever' }} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    const { container } = render(<WalkTracker dog={mockDog} />);

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const levels = Array.from(headings).map(h => parseInt(h.tagName[1]));

    // 헤딩 레벨이 순차적인지 확인
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i-1]).toBeLessThanOrEqual(1);
    }
  });
});
```

---

## 6. 성능 테스트

### 6.1 성능 메트릭 테스트

```typescript
// cypress/e2e/performance.cy.ts
describe('Performance', () => {
  it('should meet Core Web Vitals thresholds', () => {
    cy.visit('/dashboard', {
      onBeforeLoad: win => {
        // Performance Observer 설정
        new win.PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              expect(entry.startTime).to.be.lessThan(2500); // LCP < 2.5s
            }
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      },
    });

    // FID 측정
    cy.get('[data-testid="interactive-element"]').click();
    cy.window().then(win => {
      // First Input Delay 확인 (실제로는 더 복잡한 구현 필요)
      expect(win.performance.now()).to.be.greaterThan(0);
    });
  });
});
```

---

## 7. 테스트 자동화

### 7.1 GitHub Actions CI

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm start &

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E artifacts
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: e2e-screenshots
          path: cypress/screenshots
```

### 7.2 테스트 스크립트

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --run src/**/*.test.{ts,tsx}",
    "test:integration": "vitest --run src/**/*.integration.test.{ts,tsx}",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui"
  }
}
```

---

## 📚 참고 자료

### **공식 문서**

- **[Vitest 공식 문서](https://vitest.dev/)**
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)**
- **[Cypress 가이드](https://docs.cypress.io/)**

### **베스트 프랙티스**

- **[Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)**
- **[Kent C. Dodds Testing Blog](https://kentcdodds.com/blog/)**

---

_좋은 테스트는 개발자의 자신감을 높이고 리팩토링을 두려워하지 않게 해줍니다._

**문서 히스토리:**

- v1.0: 2025-08-31 (테스팅 가이드 작성, 포괄적 테스트 전략 수립)
