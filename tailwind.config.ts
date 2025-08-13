import type { Config } from "tailwindcss";
import { theme } from "./src/styles/theme";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // 모든 색상 변형을 safelist에 추가
    {
      pattern: /^(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 기본 색상 (숫자 없는 버전)
    {
      pattern: /^(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)$/,
    },
    // 호버 상태
    {
      pattern: /^hover:(bg|text|border)-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 호버 상태 (기본 색상)
    {
      pattern: /^hover:(bg|text|border)-(primary|secondary|neutral|success|warning|error|info)$/,
    },
    // 포커스 상태
    {
      pattern: /^focus-visible:ring-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 포커스 상태 (기본 색상)
    {
      pattern: /^focus-visible:ring-(primary|secondary|neutral|success|warning|error|info)$/,
    },
    // 다크모드 변형
    {
      pattern: /^dark:(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 다크모드 변형 (기본 색상)
    {
      pattern: /^dark:(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        ...theme.colors,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      screens: theme.breakpoints,
      transitionDuration: {
        fast: theme.animation.duration.fast,
        normal: theme.animation.duration.normal,
        slow: theme.animation.duration.slow,
      },
      transitionTimingFunction: theme.animation.easing,
    },
  },
  plugins: [],
} satisfies Config;
