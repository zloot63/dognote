# 🏛️ 시스템 아키텍처 (System Architecture)

_버전: 3.0_  
_최종 업데이트: 2025-04-05_  
_기술 스택: Next.js + Supabase_

---

## 📖 목차

1. [개요](#개요)
2. [아키텍처 원칙](#아키텍처-원칙)
3. [시스템 전체 구조](#시스템-전체-구조)
4. [기술 스택](#기술-스택)
5. [데이터 플로우](#데이터-플로우)
6. [보안 아키텍처](#보안-아키텍처)
7. [배포 아키텍처](#배포-아키텍처)

---

## 1. 개요

### 1.1 시스템 개요

DogNote는 **Supabase BaaS + Next.js** 기반의 모던 웹 애플리케이션으로 서버리스 아키텍처를
채택합니다. PostgreSQL 기반의 관계형 데이터베이스와 Edge Functions를 활용하여 확장성과 성능을 동시에
추구합니다.

### 1.2 아키텍처 목표

- **빠른 개발**: Supabase BaaS로 백엔드 개발 시간 단축
- **타입 안정성**: TypeScript + PostgreSQL 타입 일관성
- **자동 확장**: 서버리스 인프라의 탄력적 확장
- **고가용성**: 99.9% 이상의 서비스 가용성

### 1.3 마이그레이션 이력

- **v3.0**: Firebase → Supabase 마이그레이션 (PostgreSQL + Auth + Storage)
- **v2.0**: Firestore 기반 서버리스 아키텍처
- **v1.0**: 초기 MVP 설계

---

## 2. 아키텍처 원칙

### 2.1 설계 원칙

#### **단일 책임 원칙 (Single Responsibility)**

```typescript
// ✅ 각 서비스가 단일 책임을 가짐
class WalkService {
  async startWalk(userId: string, dogIds: string[]) {
    /* ... */
  }
  async endWalk(walkId: string, walkData: WalkEndData) {
    /* ... */
  }
}

class PointService {
  async calculateWalkPoints(distance: number) {
    /* ... */
  }
  async updateUserPoints(userId: string, points: number) {
    /* ... */
  }
}
```

#### **계층 분리 (Layered Architecture)**

```
┌─────────────────────────────────────┐
│         Presentation Layer          │ ← UI Components, Pages
├─────────────────────────────────────┤
│         Application Layer           │ ← Custom Hooks, Zustand Store
├─────────────────────────────────────┤
│          Domain Layer               │ ← Business Logic, Services
├─────────────────────────────────────┤
│        Infrastructure Layer         │ ← Supabase Client, API Clients
└─────────────────────────────────────┘
```

---

## 3. 시스템 전체 구조

### 3.1 High-Level 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Web App   │  │   Mobile     │  │     PWA      │        │
│  │   (Next.js)  │  │  (Responsive)│  │  (Installable)│        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                      │
│                 (CDN + Edge Functions)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Platform                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  PostgreSQL │  │    Auth     │  │   Storage   │         │
│  │  (Primary)  │  │  (GoTrue)   │  │   (S3 API)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐                            │
│  │ Edge Func   │  │  Realtime   │                            │
│  │  (Deno)     │  │  (WebSocket)│                            │
│  └─────────────┘  └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 핵심 서비스 구성

| 서비스         | 기술                    | 용도                             |
| -------------- | ----------------------- | -------------------------------- |
| Frontend       | Next.js 14 (App Router) | SSR/SSG, React Server Components |
| Database       | Supabase PostgreSQL     | 관계형 데이터 저장               |
| Auth           | Supabase Auth (GoTrue)  | JWT 기반 인증, OAuth             |
| Storage        | Supabase Storage        | 이미지/파일 저장                 |
| Edge Functions | Supabase Edge Functions | 서버리스 백엔드 로직             |
| Caching        | TanStack Query          | 클라이언트 사이드 캐싱           |
| State          | Zustand                 | 글로벌 상태 관리                 |

---

## 4. 기술 스택

### 4.1 프론트엔드

```typescript
// 주요 의존성
{
  "next": "^14.0.0",           // App Router, Server Components
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "@supabase/supabase-js": "^2.39.0",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-dialog": "^1.0.0"
}
```

### 4.2 백엔드 (BaaS)

```typescript
// Supabase 서비스
{
  "database": "PostgreSQL 15",     // 메인 데이터베이스
  "auth": "GoTrue",               // JWT 인증
  "storage": "S3-compatible",     // 파일 저장소
  "edge_functions": "Deno",       // 서버리스 함수
  "realtime": "WebSocket"         // 실시간 구독
}
```

### 4.3 개발 도구

| 도구       | 버전     | 용도          |
| ---------- | -------- | ------------- |
| Node.js    | 20.x LTS | 런타임        |
| npm        | 9.x      | 패키지 매니저 |
| TypeScript | 5.x      | 타입 시스템   |
| ESLint     | 8.x      | 코드 품질     |
| Prettier   | 3.x      | 코드 포맷팅   |
| Vitest     | 1.x      | 테스팅        |

---

## 5. 데이터 플로우

### 5.1 인증 플로우

```
사용자 ──► Next.js App ──► Supabase Auth ──► OAuth Provider
                                    │
                                    ▼
                              JWT Token 발급
                                    │
                                    ▼
                         RLS 정책 기반 데이터 접근
```

### 5.2 데이터 CRUD 플로우

```typescript
// 1. Client Layer
const { data, isLoading } = useWalks(dogId);

// 2. TanStack Query Layer (Caching)
// - Stale-while-revalidate 전략
// - Optimistic Updates 지원

// 3. Supabase Client Layer
const { data, error } = await supabase
  .from('walks')
  .select('*')
  .eq('dog_id', dogId)
  .order('start_time', { ascending: false });

// 4. Database Layer (RLS 적용)
// - 사용자 인증 확인
// - 권한에 따른 데이터 필터링
```

### 5.3 실시간 구독 (선택적)

```typescript
// Supabase Realtime 활용
const subscription = supabase
  .channel('walks_channel')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'walks' }, payload => {
    /* 실시간 업데이트 처리 */
  })
  .subscribe();
```

---

## 6. 보안 아키텍처

### 6.1 인증 흐름

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │ ──►  │   Next.js   │ ──►  │  Supabase   │
│   (Browser) │      │   Middleware│      │    Auth     │
└─────────────┘      └─────────────┘      └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   JWT 토큰  │
                       │  검증/갱신  │
                       └─────────────┘
```

### 6.2 데이터 보안

| 레이어   | 보안 메커니즘            |
| -------- | ------------------------ |
| Database | Row Level Security (RLS) |
| API      | JWT 토큰 검증            |
| Storage  | 버킷 레벨 권한 설정      |
| Edge     | 인증 컨텍스트 전달       |

### 6.3 RLS 정책 예시

```sql
-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can only access their own dogs"
  ON dogs FOR ALL
  USING (auth.uid() = user_id);
```

---

## 7. 배포 아키텍처

### 7.1 환경 구성

| 환경               | 플랫폼            | 도메인                |
| ------------------ | ----------------- | --------------------- |
| 개발 (Dev)         | Vercel Preview    | `*.vercel.app`        |
| 스테이징 (Staging) | Vercel + Supabase | `staging.dognote.app` |
| 프로덕션 (Prod)    | Vercel + Supabase | `dognote.app`         |

### 7.2 CI/CD 파이프라인

```
개발자 Push ──► GitHub Actions ──► Vercel Build ──► Preview Deploy
                                        │
                                        ▼ (main 브랜치)
                              Production Deploy
                                        │
                                        ▼
                              Database Migration (선택적)
```

### 7.3 모니터링

| 대상     | 도구               | 지표                      |
| -------- | ------------------ | ------------------------- |
| Frontend | Vercel Analytics   | Web Vitals, Traffic       |
| Database | Supabase Dashboard | Query Performance, RLS    |
| Errors   | Vercel + Supabase  | Error Logs, Edge Function |

---

## 8. 확장성 고려사항

### 8.1 수평 확장

- PostgreSQL Read Replicas (Supabase 자동 지원)
- Edge Functions 자동 스케일링
- CDN 캐싱 (Vercel Edge Network)

### 8.2 미래 고려사항

| 항목           | 현재            | 향후                                 |
| -------------- | --------------- | ------------------------------------ |
| Database       | Supabase hosted | Self-hosted 고려                     |
| Edge Functions | Supabase        | Cloudflare Workers 마이그레이션 검토 |
| Real-time      | Supabase        | WebSocket 스케일링 검토              |

---

**문서 히스토리:**

- v3.0: 2025-04-05 - Supabase 아키텍처로 업데이트
- v2.0: 2025-08-31 - Firebase 기반 아키텍처
- v1.0: 2025-01-16 - 초기 설계
