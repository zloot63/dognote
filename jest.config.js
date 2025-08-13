const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.js와 .env 파일이 있는 위치
  dir: './',
});

// Jest에 전달할 커스텀 설정
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // 별칭 설정 (tsconfig.json의 paths와 일치시켜야 함)
    '^@/(.*)$': '<rootDir>/src/$1',
    // 문제가 되는 ESM 모듈 모킹
    '^lucide-react$': '<rootDir>/src/test/__mocks__/lucide-react.js',
    '^react-copy-to-clipboard$': '<rootDir>/src/test/__mocks__/react-copy-to-clipboard.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  // ESM 모듈을 위한 transformIgnorePatterns 설정
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react|react-copy-to-clipboard).+\\.js$'
  ],
};

// createJestConfig는 next/jest가 비동기 설정을 처리할 수 있도록 이 방식으로 내보내야 함
module.exports = createJestConfig(customJestConfig);
