# 🚀 개발 가이드 (Development Guide)

_DogNote 프로젝트의 개발자를 위한 포괄적인 가이드_

---

## 📖 문서 목록

### 🏗️ **개발 환경 및 설정**

- **[환경 설정 가이드](./environment-setup.md)** - 개발 환경 구축 및 의존성 설치
- **[개발 도구 설정](./development-tools.md)** - IDE, 플러그인, 확장프로그램 설정

### 📝 **코딩 표준**

- **[코딩 컨벤션](./coding-conventions.md)** - TypeScript, React 코딩 스타일 가이드
- **[네이밍 규칙](./naming-conventions.md)** - 파일, 변수, 함수, 컴포넌트 명명 규칙
- **[Git 워크플로우](./git-workflow.md)** - 브랜치 전략, 커밋 메시지, PR 가이드

### 🏗️ **아키텍처 및 구조**

- **[프로젝트 구조](./project-structure.md)** - 폴더 구조 및 파일 조직
- **[컴포넌트 가이드](./component-guidelines.md)** - React 컴포넌트 작성 베스트 프랙티스
- **[상태 관리](./state-management.md)** - Zustand 패턴 및 데이터 플로우

### 🔌 **API 및 데이터**

- **[API 설계 가이드](./api-guidelines.md)** - RESTful API 및 GraphQL 설계 원칙
- **[데이터 페칭](./data-fetching.md)** - TanStack Query 패턴 및 캐싱 전략
- **[Firebase 통합](./firebase-integration.md)** - Firestore, Auth, Storage 사용 가이드

### 🎨 **UI/UX 개발**

- **[컴포넌트 라이브러리](./ui-components.md)** - shadcn/ui, Radix UI 활용 가이드
- **[스타일링 가이드](./styling-guide.md)** - Tailwind CSS 베스트 프랙티스
- **[반응형 개발](./responsive-development.md)** - 모바일 퍼스트 개발 접근법

### 🔒 **보안 및 성능**

- **[보안 가이드](./security-guidelines.md)** - 인증, 권한, 데이터 보호
- **[성능 최적화](./performance-optimization.md)** - 번들 최적화, 코드 스플리팅, 캐싱

---

## 🎯 개발 철학

### 1. **클린 코드 원칙**

```typescript
// ✅ Good: 명확하고 의도가 드러나는 코드
const calculateWalkDuration = (startTime: Date, endTime: Date): number => {
  const durationMs = endTime.getTime() - startTime.getTime();
  return Math.floor(durationMs / 1000 / 60); // minutes
};

// ❌ Bad: 의도가 불분명한 코드
const calc = (s: Date, e: Date): number => {
  return Math.floor((e.getTime() - s.getTime()) / 60000);
};
```

### 2. **타입 안전성 우선**

```typescript
// ✅ Good: 엄격한 타입 정의
interface WalkRecord {
  id: string;
  dogId: string;
  startTime: Date;
  endTime?: Date;
  distance: number; // meters
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

// ❌ Bad: any 타입 남용
const walk: any = {
  id: '123',
  dog: 'some-id',
  time: new Date(),
  // ...
};
```

### 3. **컴포넌트 재사용성**

```typescript
// ✅ Good: 재사용 가능한 컴포넌트
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', ...props }) => {
  // 구현...
};
```

### 4. **접근성 우선 설계**

```typescript
// ✅ Good: 접근성을 고려한 컴포넌트
export const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Dialog.Title id="modal-title">{title}</Dialog.Title>
          <div id="modal-description">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

---

## 🛠️ 개발 도구 스택

### **핵심 기술**

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Radix UI + shadcn/ui
- **상태 관리**: Zustand + TanStack Query
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **빌드**: SWC + Turbopack

### **개발 도구**

- **IDE**: VS Code + TypeScript 확장팩
- **린팅**: ESLint + Prettier
- **테스팅**: Vitest + React Testing Library
- **타입 체크**: TypeScript strict mode
- **버전 관리**: Git + GitHub

### **모니터링 & 배포**

- **CI/CD**: GitHub Actions
- **호스팅**: Vercel (Frontend) + Firebase (Backend)
- **모니터링**: Firebase Analytics + Crashlytics
- **성능**: Lighthouse CI + Web Vitals

---

## 🚀 빠른 시작

### 1. **개발 환경 설정**

```bash
# 저장소 클론
git clone https://github.com/your-org/dognote.git
cd dognote

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 Firebase 설정값 입력

# 개발 서버 시작
npm run dev
```

### 2. **개발 서버 접속**

- **Frontend**: http://localhost:3000
- **Storybook**: http://localhost:6006 (optional)

### 3. **기본 명령어**

```bash
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 시작
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 검사
npm run test         # 테스트 실행
```

---

## 📚 학습 자료

### **필수 학습**

1. **[Next.js 공식 문서](https://nextjs.org/docs)**
2. **[React 공식 문서](https://react.dev/learn)**
3. **[TypeScript 핸드북](https://www.typescriptlang.org/docs/)**
4. **[Tailwind CSS 문서](https://tailwindcss.com/docs)**

### **권장 학습**

- **[Radix UI 문서](https://www.radix-ui.com/primitives)**
- **[TanStack Query 가이드](https://tanstack.com/query/latest)**
- **[Firebase 문서](https://firebase.google.com/docs)**
- **[Web Accessibility 가이드](https://web.dev/accessibility/)**

---

## 🤝 컨트리뷰션 가이드

### **코드 기여 프로세스**

1. **이슈 확인**: GitHub Issues에서 작업할 이슈 선택
2. **브랜치 생성**: `feature/issue-number-description` 형식
3. **개발 진행**: 코딩 컨벤션 및 테스트 작성
4. **PR 생성**: PR 템플릿에 따라 상세 설명 작성
5. **코드 리뷰**: 팀원 리뷰 및 피드백 반영
6. **머지**: 승인 후 메인 브랜치에 머지

### **코드 리뷰 체크리스트**

- [ ] 코딩 컨벤션 준수
- [ ] 타입 안전성 보장
- [ ] 테스트 코드 작성
- [ ] 접근성 고려
- [ ] 성능 최적화
- [ ] 문서화 완료

---

## 🔍 문제 해결

### **자주 발생하는 문제**

- **[환경 설정 문제](./troubleshooting.md#환경-설정)**
- **[빌드 오류](./troubleshooting.md#빌드-오류)**
- **[Firebase 연동 문제](./troubleshooting.md#firebase-연동)**
- **[성능 이슈](./troubleshooting.md#성능-이슈)**

### **도움 요청**

- **GitHub Issues**: 버그 리포트 및 기능 제안
- **팀 채널**: 개발 관련 질문 및 토론
- **위키**: 프로젝트 관련 문서 및 가이드

---

## 📞 연락처

- **프로젝트 리더**: @project-lead
- **프론트엔드 리더**: @frontend-lead
- **백엔드 리더**: @backend-lead
- **DevOps 리더**: @devops-lead

---

_본 가이드는 프로젝트 발전에 따라 지속적으로 업데이트됩니다._

**문서 히스토리:**

- v1.0: 2025-08-31 (개발 가이드 체계 구축, GlobalRules 표준 적용)
