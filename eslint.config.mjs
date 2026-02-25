// AI 자동화 룰: ESLint 설정 자동 생성 (Next.js 15 최적화)
// 입력: 프로젝트 타입 (Next.js + TypeScript), 프레임워크
// 출력: 완전한 ESLint 설정 (코드 품질, 접근성, 성능, 보안)

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const eslintConfig = [
  // 기본 Next.js 설정 (TypeScript 규칙 포함)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // === AI 자동화 룰: 핵심 코드 품질 강화 ===

      // React 최적화
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',

      // 성능 최적화
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // 보안 강화
      'no-eval': 'error',
      'no-implied-eval': 'error',

      // 코드 스타일 일관성
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
    },
  },

  {
    // 테스트 파일 특별 규칙
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },
];

export default eslintConfig;
