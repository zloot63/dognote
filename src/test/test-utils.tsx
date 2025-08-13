import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// 테스트에 필요한 모든 프로바이더를 여기에 추가
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

// 커스텀 렌더 함수
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// 테스트 유틸리티 함수 내보내기
export * from '@testing-library/react';
export { customRender as render };
