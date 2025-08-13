import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Layout } from '../Layout';

describe('Layout', () => {
  it('제목과 설명을 올바르게 렌더링해야 함', () => {
    render(
      <Layout title="테스트 제목" description="테스트 설명">
        <div data-testid="test-content">테스트 콘텐츠</div>
      </Layout>
    );
    
    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    expect(screen.getByText('테스트 설명')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('자식 콘텐츠를 올바르게 렌더링해야 함', () => {
    render(
      <Layout title="테스트 제목" description="테스트 설명">
        <div data-testid="test-content">테스트 콘텐츠</div>
      </Layout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
  });

  it('설명이 없을 경우에도 정상적으로 렌더링되어야 함', () => {
    render(
      <Layout title="테스트 제목만 있음">
        <div data-testid="test-content">테스트 콘텐츠</div>
      </Layout>
    );
    
    expect(screen.getByText('테스트 제목만 있음')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    // 설명이 없으므로 description 요소가 없어야 함
    expect(screen.queryByText(/테스트 설명/)).not.toBeInTheDocument();
  });
});
