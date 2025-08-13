/**
 * DogNote Design System Theme Configuration
 * Centralized color palette, typography, spacing, and component styling
 * Based on indigo-600 primary color from logo
 */

// Primary color palette based on indigo-600
export const colors = {
  // Primary brand colors (indigo-based)
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5', // Main brand color
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
    DEFAULT: '#4f46e5', // 600 값을 기본값으로 설정
  },

  // Secondary colors (complementary warm tones)
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },

  // Neutral grays (warm-tinted for better harmony)
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
    DEFAULT: '#57534e',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
    DEFAULT: '#16a34a',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
    DEFAULT: '#d97706',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
    DEFAULT: '#dc2626',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
    DEFAULT: '#2563eb',
  },
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'] as string[],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'] as string[],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }] as [string, { lineHeight: string }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }] as [string, { lineHeight: string }],
    base: ['1rem', { lineHeight: '1.5rem' }] as [string, { lineHeight: string }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }] as [string, { lineHeight: string }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }] as [string, { lineHeight: string }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }] as [string, { lineHeight: string }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }] as [string, { lineHeight: string }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }] as [string, { lineHeight: string }],
    '5xl': ['3rem', { lineHeight: '1' }] as [string, { lineHeight: string }],
    '6xl': ['3.75rem', { lineHeight: '1' }] as [string, { lineHeight: string }],
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// Spacing scale (based on 4px grid)
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Border radius scale
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Shadow scale
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

// Component-specific design tokens
export const components = {
  button: {
    height: {
      xs: spacing[7],    // 28px
      sm: spacing[8],    // 32px
      md: spacing[10],   // 40px
      lg: spacing[11],   // 44px
      xl: spacing[12],   // 48px
    },
    padding: {
      xs: `${spacing[1]} ${spacing[2]}`,      // 4px 8px
      sm: `${spacing[1.5]} ${spacing[3]}`,    // 6px 12px
      md: `${spacing[2]} ${spacing[4]}`,      // 8px 16px
      lg: `${spacing[2.5]} ${spacing[6]}`,    // 10px 24px
      xl: `${spacing[3]} ${spacing[8]}`,      // 12px 32px
    },
    fontSize: {
      xs: typography.fontSize.xs,
      sm: typography.fontSize.sm,
      md: typography.fontSize.sm,
      lg: typography.fontSize.base,
      xl: typography.fontSize.lg,
    },
    borderRadius: {
      xs: borderRadius.sm,
      sm: borderRadius.base,
      md: borderRadius.md,
      lg: borderRadius.lg,
      xl: borderRadius.xl,
    },
  },
  
  input: {
    height: {
      sm: spacing[8],    // 32px
      md: spacing[10],   // 40px
      lg: spacing[12],   // 48px
    },
    padding: {
      sm: `${spacing[1.5]} ${spacing[3]}`,    // 6px 12px
      md: `${spacing[2]} ${spacing[4]}`,      // 8px 16px
      lg: `${spacing[3]} ${spacing[4]}`,      // 12px 16px
    },
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
    borderRadius: {
      sm: borderRadius.base,
      md: borderRadius.md,
      lg: borderRadius.lg,
    },
  },
  
  card: {
    padding: {
      sm: spacing[4],    // 16px
      md: spacing[6],    // 24px
      lg: spacing[8],    // 32px
    },
    borderRadius: {
      sm: borderRadius.lg,
      md: borderRadius.xl,
      lg: borderRadius['2xl'],
    },
    shadow: {
      sm: boxShadow.sm,
      md: boxShadow.base,
      lg: boxShadow.md,
    },
  },
} as const;

// Animation and transition
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Export the complete theme
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  components,
  animation,
  zIndex,
  breakpoints,
} as const;

export default theme;
