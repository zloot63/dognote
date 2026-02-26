# 📚 DogNote 프로젝트 문서

_반려견과 함께하는 소중한 순간을 기록하고 관리하는 웹 애플리케이션_

---

## 🎯 프로젝트 개요

DogNote는 반려견의 산책, 건강, 일상을 체계적으로 기록하고 관리할 수 있는 현대적인 웹
애플리케이션입니다. 직관적인 사용자 경험과 안정적인 데이터 관리를 통해 반려견과의 소중한 추억을 더욱
특별하게 만들어줍니다.

### **핵심 기능**

- 🚶‍♂️ **실시간 산책 추적**: GPS 기반 경로 및 시간 기록
- 📸 **추억 저장소**: 사진과 메모로 특별한 순간 보관
- 🏥 **건강 관리**: 체중, 병원 기록, 예방접종 관리
- 📊 **데이터 분석**: 산책 패턴 및 건강 지표 시각화
- 👥 **공유 기능**: 가족 구성원과 반려견 정보 공유

---

## 📖 문서 구조

이 프로젝트는 **GlobalRules** 표준에 따라 체계적으로 문서화되어 있습니다. 각 카테고리별로 상세한
가이드를 제공하여 개발자들이 효율적으로 프로젝트에 기여할 수 있도록 지원합니다.

### 📋 **01. Requirements (요구사항)**

프로젝트의 기능적/기술적 요구사항과 비즈니스 목표를 정의합니다.

- **[📁 Requirements 폴더](./01-requirements/)**
  - **[기능 명세서](./01-requirements/functional-specifications.md)** - 사용자 스토리, 기능
    요구사항, UX 플로우
  - **[기술 명세서](./01-requirements/technical-specifications.md)** - 시스템 아키텍처, 기술 스택,
    성능 요구사항

### 🏗️ **02. Architecture (아키텍처)**

시스템의 전체적인 설계와 구조를 다룹니다.

- **[📁 Architecture 폴더](./02-architecture/)**
  - **[아키텍처 개요](./02-architecture/README.md)** - 설계 원칙, 아키텍처 패턴
  - **[시스템 아키텍처](./02-architecture/system-architecture.md)** - 전체 시스템 구조, 컴포넌트
    관계
  - **[데이터베이스 설계](./02-architecture/database-design.md)** - Firestore 스키마, 데이터 모델

### 🎨 **03. Design (디자인)**

UI/UX 디자인 시스템과 사용자 경험 가이드라인입니다.

- **[📁 Design 폴더](./03-design/)**
  - **[디자인 개요](./03-design/README.md)** - 디자인 철학, 핵심 원칙
  - **[디자인 시스템](./03-design/design-system.md)** - 컬러, 타이포그래피, 컴포넌트 가이드

### 🚀 **04. Development (개발)**

개발 환경 설정부터 코딩 표준까지 개발자를 위한 가이드입니다.

- **[📁 Development 폴더](./04-development/)**
  - **[개발 가이드](./04-development/README.md)** - 개발 철학, 도구 스택, 빠른 시작
  - **[환경 설정](./04-development/environment-setup.md)** - 개발 환경 구축, Firebase 설정
  - **[코딩 컨벤션](./04-development/coding-conventions.md)** - TypeScript, React 코딩 표준

### 🛡️ **05. Quality (품질보증)**

테스팅, 성능 최적화, 코드 품질 관리를 다룹니다.

- **[📁 Quality 폴더](./05-quality/)**
  - **[품질보증 개요](./05-quality/README.md)** - QA 철학, 품질 지표, 프로세스
  - **[테스팅 가이드](./05-quality/testing-guide.md)** - 유닛/통합/E2E 테스트 전략

### ⚙️ **06. Operations (운영)**

배포, 모니터링, 운영 관련 가이드입니다.

- **[📁 Operations 폴더](./06-operations/)**
  - **[운영 가이드](./06-operations/README.md)** - 배포 전략, 모니터링, SRE 원칙

---

## 🛠️ 기술 스택

### **Frontend**

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS + Radix UI + shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Testing**: Vitest + React Testing Library + Cypress

### **Backend**

- **BaaS**: Firebase (Firestore, Auth, Storage, Functions)
- **Hosting**: Vercel (Frontend) + Firebase (Backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Firebase Analytics + Performance

### **Development Tools**

- **IDE**: VS Code + Extensions
- **Code Quality**: ESLint + Prettier + TypeScript
- **Version Control**: Git + GitHub
- **Package Manager**: npm

---

## 🚀 빠른 시작

### **1. 개발 환경 설정**

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

### **2. 프로젝트 구조 이해**

```
dognote/
├── 📁 docs/                    # 📚 프로젝트 문서
│   ├── 01-requirements/        # 요구사항 명세
│   ├── 02-architecture/        # 시스템 아키텍처
│   ├── 03-design/             # 디자인 시스템
│   ├── 04-development/        # 개발 가이드
│   ├── 05-quality/            # 품질보증
│   └── 06-operations/         # 운영 가이드
├── 📁 src/                     # 소스 코드
│   ├── app/                   # Next.js App Router
│   ├── components/            # React 컴포넌트
│   ├── hooks/                 # 커스텀 훅
│   ├── lib/                   # 유틸리티 함수
│   └── types/                 # TypeScript 타입 정의
├── 📁 public/                  # 정적 자산
└── 📁 tests/                   # 테스트 파일
```

### **3. 필수 명령어**

```bash
# 개발
npm run dev              # 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버 시작

# 테스트
npm run test             # 유닛 테스트 실행
npm run test:e2e         # E2E 테스트 실행
npm run test:coverage    # 커버리지 리포트

# 코드 품질
npm run lint             # ESLint 검사
npm run type-check       # TypeScript 타입 체크
npm run format           # Prettier 포맷팅
```

---

## 📊 프로젝트 현황

### **개발 진행률**

```
🎯 요구사항 정의     ████████████████████ 100%
🏗️ 아키텍처 설계     ████████████████████ 100%
🎨 디자인 시스템     ████████████████████ 100%
🚀 핵심 기능 개발    ████████████████░░░░  80%
🛡️ 품질 보증       ████████████████░░░░  80%
⚙️ 운영 준비       ████████████░░░░░░░░  60%
```

### **품질 지표**

- ✅ **테스트 커버리지**: 87.3%
- ✅ **타입 안전성**: TypeScript strict mode
- ✅ **접근성**: WCAG 2.1 AA 준수
- ✅ **성능**: Core Web Vitals 최적화
- ✅ **보안**: Firebase Security Rules 적용

---

## 🤝 기여 가이드

### **개발 참여 방법**

1. **이슈 확인**: [GitHub Issues](https://github.com/your-org/dognote/issues)에서 작업할 이슈 선택
2. **브랜치 생성**: `feature/issue-number-description` 형식으로 브랜치 생성
3. **개발 진행**: [코딩 컨벤션](./04-development/coding-conventions.md) 준수
4. **테스트 작성**: [테스팅 가이드](./05-quality/testing-guide.md)에 따라 테스트 추가
5. **PR 생성**: PR 템플릿에 따라 상세한 설명 작성
6. **코드 리뷰**: 팀원 리뷰 받고 피드백 반영
7. **머지**: 모든 검증 통과 후 메인 브랜치에 머지

### **문서 개선**

문서에 오류나 개선점을 발견하시면 언제든 이슈 등록이나 PR을 통해 기여해 주세요. 모든 기여를
환영합니다!

---

## 📚 학습 자료

### **필수 학습**

- **[Next.js 공식 문서](https://nextjs.org/docs)** - 프레임워크 기본기
- **[React 공식 문서](https://react.dev/learn)** - 컴포넌트 작성법
- **[TypeScript 핸드북](https://www.typescriptlang.org/docs/)** - 타입 시스템
- **[Firebase 가이드](https://firebase.google.com/docs)** - 백엔드 서비스

### **심화 학습**

- **[Tailwind CSS](https://tailwindcss.com/docs)** - 스타일링
- **[Radix UI](https://www.radix-ui.com/primitives)** - 접근성 컴포넌트
- **[TanStack Query](https://tanstack.com/query/latest)** - 데이터 페칭
- **[Vitest](https://vitest.dev/)** - 테스팅 프레임워크

### **디자인 리소스**

- **[Material Design 3](https://m3.material.io/)** - 디자인 가이드라인
- **[WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)** - 접근성 표준
- **[Figma Community](https://www.figma.com/community)** - UI/UX 리소스

---

## 🔗 유용한 링크

### **프로젝트 관련**

- **[GitHub 저장소](https://github.com/your-org/dognote)** - 소스 코드
- **[개발 환경](https://dognote-dev.vercel.app)** - 개발 버전
- **[스테이징 환경](https://dognote-staging.vercel.app)** - 테스트 버전
- **[프로덕션 환경](https://dognote.app)** - 실제 서비스

### **도구 및 서비스**

- **[Vercel Dashboard](https://vercel.com/dashboard)** - 배포 관리
- **[Firebase Console](https://console.firebase.google.com/)** - 백엔드 관리
- **[GitHub Actions](https://github.com/your-org/dognote/actions)** - CI/CD 상태

---

## 🏆 팀 및 기여자

### **핵심 팀**

- **프로젝트 리더**: @project-lead
- **프론트엔드 리드**: @frontend-lead
- **백엔드 리드**: @backend-lead
- **디자인 리드**: @design-lead
- **QA 리드**: @qa-lead

### **기여자들**

이 프로젝트는 많은 개발자들의 열정과 기여로 만들어지고 있습니다. 모든 기여자분들께 깊은 감사를
표합니다.

---

## 📄 라이센스

이 프로젝트는 [MIT License](../LICENSE) 하에 배포됩니다.

---

## 📞 문의 및 지원

### **개발 관련 문의**

- **GitHub Issues**: 버그 리포트 및 기능 제안
- **팀 채널**: 개발 관련 실시간 소통
- **메일**: dev-team@dognote.app

### **사용자 지원**

- **사용자 가이드**: [User Manual](./user-guide.md)
- **FAQ**: [자주 묻는 질문](./faq.md)
- **고객 지원**: support@dognote.app

---

## 🔄 문서 업데이트 이력

**최신 업데이트**: 2025-08-31

- **v2.0**: 전면 개편 - GlobalRules 표준 적용, 카테고리별 구조화
- **v1.5**: 품질보증 문서 추가, 테스팅 가이드 보강
- **v1.0**: 초기 문서 구조 구축

---

_이 문서는 프로젝트 발전에 따라 지속적으로 업데이트됩니다. 언제든 개선 제안을 환영합니다!_

---

**💡 Tip**: 각 폴더의 README.md 파일부터 읽기 시작하면 전체 구조를 빠르게 파악할 수 있습니다.
