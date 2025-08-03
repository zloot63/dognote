# 🎨 DogNote Tailwind-전용 Style Guide

> **목표** : SCSS Modules를 최소화하고 **Tailwind 유틸리티 + 커스텀 프리셋**만으로 빠른 개발 · 일관성 · 유지보수를 모두 확보합니다.

---

## 1. 파일 & 디렉터리 구조

```
project-root/
├─ tailwind.config.ts          # 디자인 토큰·플러그인 정의
├─ postcss.config.cjs          # autoprefixer / tailwindcss
└─ src/
   ├─ app/                     # Next.js App Router
   ├─ components/
   │   └─ ui/…                # Tailwind 클래스만 사용
   ├─ styles/
   │   ├─ globals.css         # @tailwind base|components|utilities
   │   └─ theme.css           # CSS 변수(다크모드 토큰) 정의
   └─ pages/…
```

### 핵심 원칙

1. **컴포넌트 한 파일 안에서만** `className="…"`, 외부 CSS(Modules) 사용 X.
2. 공통 레이아웃(헤더·사이드바 등)은 **layout/** 안 별도 컴포넌트로 분리.
3. 전역 CSS는 **`globals.css` + CSS 변수**만 유지(리셋·웹폰트·키프레임 등).

---

## 2. Tailwind 설정 (`tailwind.config.ts`)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'], // 다크 모드 토글
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        // …
      },
      spacing: {
        18: "4.5rem",
      },
      borderRadius: {
        inherit: "inherit",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-in-out forwards",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-animate"),
  ],
};
export default config;
```

> **Tip**: 설계 토큰(색상·간격·폰트)은 `theme.css`에 HSL 변수로 정의하고 Tailwind에 `hsl(var(--…))`로 매핑하면 **다크모드·테마 교체**가 즉시 가능.

---

## 3. 클래스 작성 규칙

| 항목          | 가이드                                  | 예시                                                             |
| ----------- | ------------------------------------ | -------------------------------------------------------------- |
| **정렬**      | 모바일-우선: 기본 → `sm:` `md:` `lg:` `xl:` | `p-4 md:p-6`                                                   |
| **순서**      | **레이아웃 > 박스모델 > 배경 / 타이포 > 효과**      | `flex flex-col items-center gap-4 bg-surface/70 backdrop-blur` |
| **다크모드**    | `dark:` **혹은** `[data-theme="dark"]` | `text-primary dark:text-primary/80`                            |
| **조건부 클래스** | `clsx`(권장) → 불필요한 템플릿 문자열 제거         | `className={clsx("btn", isActive && "btn-primary")}`           |
| **길이 제한**   | 한 줄 120자 넘으면 **줄바꿈**                 |                                                                |

---

## 4. 디자인 토큰 & CSS 변수

`src/styles/theme.css`

```css
/* Light */
:root {
  --color-primary: 220 90% 56%;
  --color-surface: 0 0% 100%;
  --spacing-4: 1rem;
}
/* Dark */
[data-theme="dark"] {
  --color-primary: 220 90% 68%;
  --color-surface: 222 47% 11%;
}
```

### 활용 예

```html
<button class="bg-primary text-white hover:bg-primary/80">
  산책 시작
</button>
```

* HSL + `<alpha-value>` 패턴으로 **투명도 변형**을 유틸리티 하나로 처리.

---

## 5. 전역 스타일(Global CSS)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Reset (base layer) */
@layer base {
  html { scroll-behavior: smooth; }
  a   { @apply text-primary hover:underline; }
}

/* 재사용 컴포넌트 (components layer) */
@layer components {
  .btn {
    @apply inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors;
  }
  .btn-primary {
    @apply bg-primary text-white hover:bg-primary/80;
  }
}
```

> **components layer**는 실제 코드베이스에서 **원자·분자급 UI**를 `@apply`로 선언해 반복을 줄입니다.

---

## 6. 접근성 & 반응형

1. **aria-label** 필수: `aria-label="Walk start"`
2. Focus 스타일: `focus-visible:outline` + Tailwind 색상 변수.
3. Media Query는 **Tailwind 브레이크포인트**만 사용(`md:` 이상).
4. `prefers-reduced-motion` 자동 지원: `tailwindcss-animate` 플러그인 사용 시 내부 처리.

---

## 7. 애니메이션

* Keyframes → `tailwind.config.ts` 의 `extend.keyframes`.
* 재사용은 `animate-fade-in` 식으로 선언.
* 400 ms 이하, `ease-in-out`.

```html
<div class="animate-fade-in">
  …
</div>
```

---

## 8. 클래스 중복·정리

### 자동화

| 도구                                      | 역할           |
| --------------------------------------- | ------------ |
| **eslint-plugin-tailwindcss**           | 잘못된 순서/오타 체크 |
| **prettier-plugin-tailwindcss**         | 클래스 알파벳 순 정렬 |
| **@ianvs/prettier-plugin-sort-imports** | import 순서 통일 |

### CI 체크리스트

* `npm run lint` & `npm run format` 0 error.
* Purge 결과(`npx tailwindcss –-content`) 확인 → **사용되지 않는 클래스 제거**.

---

## 9. 예시 컴포넌트

```tsx
// components/ui/Button.tsx
import clsx from "clsx";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

export const Button = ({
  variant = "primary",
  className,
  ...rest
}: Props) => (
  <button
    className={clsx(
      "btn",
      {
        primary: "btn-primary",
        outline: "border border-primary text-primary hover:bg-primary/10",
        ghost: "text-primary hover:bg-primary/5",
      }[variant],
      className,
    )}
    {...rest}
  />
);
```

---

## 10. PR 스타일 체크리스트

* [ ] Tailwind 클래스만으로 구현? (`@apply` 허용)
* [ ] 클래스 한 줄 120 자 이하, 정렬 자동화 완료?
* [ ] 다크모드·접근성·반응형 테스트?
* [ ] 디자인 토큰 변수 사용(직접 HEX 값 X)?
* [ ] ESLint·Prettier 통과?

---

위 가이드로 **SCSS 없이도** 테마 변경과 재사용성을 모두 확보합니다.
