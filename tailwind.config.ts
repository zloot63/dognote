import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // 모든 색상 변형을 safelist에 추가
    {
      pattern:
        /^(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 기본 색상 (숫자 없는 버전)
    {
      pattern:
        /^(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)$/,
    },
    // 호버 상태
    {
      pattern:
        /^hover:(bg|text|border)-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 호버 상태 (기본 색상)
    {
      pattern:
        /^hover:(bg|text|border)-(primary|secondary|neutral|success|warning|error|info)$/,
    },
    // 포커스 상태
    {
      pattern:
        /^focus-visible:ring-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 포커스 상태 (기본 색상)
    {
      pattern:
        /^focus-visible:ring-(primary|secondary|neutral|success|warning|error|info)$/,
    },
    // 다크모드 변형
    {
      pattern:
        /^dark:(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    // 다크모드 변형 (기본 색상)
    {
      pattern:
        /^dark:(bg|text|border|ring)-(primary|secondary|neutral|success|warning|error|info)$/,
    },
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // shadcn/ui 색상 변수들
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
