---
trigger: manual
---

# 🐾 DogNote 컴포넌트 관리 지침

DogNote 프로젝트에서 **일관된 컴포넌트 구조와 유지보수성**을 확보하기 위한 가이드입니다. 새로 코드를 작성하거나 리뷰할 때 아래 체크리스트를 따라 주세요.

---

## 1. 디렉터리 구조

```
src/
└─ components/
   ├─ ui/          # 버튼·인풋 등 최소 단위(원자) UI
   ├─ layout/      # Header·Footer·SideMenu 등 레이아웃
   ├─ dogs/        # 반려견(프로필, 카드 등) 도메인 컴포넌트
   ├─ walks/       # 산책(지도, 대시보드 등) 도메인 컴포넌트
   └─ common/      # 여러 도메인에서 재사용되는 복합 컴포넌트
```

* **폴더 이름은 복수형**으로 표시하고, 각 폴더에 `index.ts`로 하위 컴포넌트를 재‐export 합니다.
* **새 디렉터리**를 만들 때는 기존 구조(ui/layout/common/도메인) 중 어디에 속하는지 먼저 판단합니다.

---

## 2. 파일·이름 규칙

| 항목      | 규칙                                                           |
| ------- | ------------------------------------------------------------ |
| 컴포넌트 파일 | `PascalCase.tsx` (`DogProfileCard.tsx`)                      |
| 스타일     | `SameName.module.scss` (`DogProfileCard.module.scss`)        |
| 테스트     | `SameName.test.tsx` (Jest) 또는 `SameName.spec.groovy` (Spock) |
| 스토리북    | `SameName.stories.tsx` (필수 아님, 있는 경우 storybook 자동 적용)        |
| export  | **단일 컴포넌트 → default export**, 다수 유틸/훅 → named export         |

---

## 3. 코드 작성 패턴

### 3-1. 기본 형태

```tsx
// DogAvatar.tsx
import styles from "./DogAvatar.module.scss";

interface Props {
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

export const DogAvatar = ({ src, alt = "강아지 프로필", size = "md" }: Props) => (
  <img className={styles[`avatar_${size}`]} src={src} alt={alt} />
);
```

* **함수형 컴포넌트**만 사용: `const Component = ({ ... }: Props) => {}` 형태
* **구조분해할당 필수** – props, state 모두.

### 3-2. 스타일

* **SCSS Modules + Tailwind** 혼합:

  * **재사용이 빈번**한 공통 스타일 → Tailwind 유틸리티 클래스.
  * **도메인 특화 / 복잡한 레이아웃** → SCSS Modules.
* SCSS 내부에서 반드시 전역 변수 import:

  ```scss
  @import "@/styles/abstracts/variables";
  ```
* 다크모드는 전역 CSS 변수 + Tailwind `dark:` 프리픽스 활용.

### 3-3. 타입/Props

* 필수 prop은 **undefined 허용 금지** (`string | null` 대신 `string`).
* Optional prop은 **기본값(defaultProps)** 대신 함수 파라미터 기본값 사용.
* **불필요한 any 금지** – generics, utility types 적극 활용.

### 3-4. 성능 & 접근성

| 체크                | 설명                                         |
| ----------------- | ------------------------------------------ |
| `React.memo`      | UI 단위가 작더라도 **prop 변동이 적은 컴포넌트**에 적용       |
| `lazy / Suspense` | 지도·차트 등 **용량이 큰 컴포넌트** 코드 분할               |
| aria-\*           | 버튼·폼 요소 등 모든 인터랙티브 컴포넌트에 **aria-label 필수** |
| 키보드 탐색            | 탭 순서, focus 스타일 점검                         |

---

## 4. 상태 관리 방식

| 범위     | 도구          | 예시                             |
| ------ | ----------- | ------------------------------ |
| 전역     | Zustand     | 로그인 세션, 선택 dogId               |
| 원격 데이터 | React-Query | Firestore 컬렉션(`walks`, `dogs`) |
| 로컬 UI  | useState    | 모달 open/close, 인풋 값 등          |

> 전역 스토어로 올리기 전에 **“다른 페이지에서 정말 재사용되는가?”** 를 확인하세요.

---

## 5. 의존성·인터페이스

1. **상위 → 하위 단방향 데이터 흐름** 유지 (props drilling 대신 컨텍스트 고려).
2. 도메인 컴포넌트(dogs, walks)는 **ui/ 또는 common/** 컴포넌트만 의존.
3. 비즈니스 로직(Firebase 호출 등)은 `hooks/` 또는 `lib/api/`에 분리, **UI 레이어에는 API 호출 금지**.

---

## 6. 테스트·문서화

| 항목     | 권장 도구                        | 지침                                 |
| ------ | ---------------------------- | ---------------------------------- |
| 단위 테스트 | React Testing Library + Jest | 렌더 결과·상호작용·상태 변화 확인                |
| 통합 테스트 | Cypress (선택)                 | 로그인·산책 기록 End-to-End               |
| 문서     | JSDoc                        | 공개 API 컴포넌트·커스텀 훅 최상단에 /\*\* … \*/ |

---

## 7. PR & 리뷰 체크리스트

* [ ] 폴더 위치/이름 규칙 준수
* [ ] 컴포넌트 파일 ≤ 300 LoC (초과 시 분리 검토)
* [ ] ESLint/Prettier 오류 0
* [ ] 다크모드·접근성 고려
* [ ] 테스트 코드 포함 또는 명확한 제외 사유 명시
---

