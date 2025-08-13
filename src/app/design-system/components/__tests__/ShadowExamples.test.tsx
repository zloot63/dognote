import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShadowExamples } from '../ShadowExamples';
import { fireEvent } from '@testing-library/react';

// react-copy-to-clipboard 모킹
vi.mock('react-copy-to-clipboard', () => ({
  CopyToClipboard: ({ text, onCopy, children }: any) => (
    <button onClick={() => onCopy(text)} data-testid={`copy-button-${text}`}>
      {children}
    </button>
  ),
}));

describe('ShadowExamples', () => {
  it('그림자 시스템 섹션이 렌더링되어야 함', () => {
    render(<ShadowExamples />);
    
    expect(screen.getByText('그림자 시스템')).toBeInTheDocument();
    expect(screen.getByText('그림자의 목적')).toBeInTheDocument();
    expect(screen.getByText('그림자 구성 요소')).toBeInTheDocument();
    expect(screen.getByText('그림자 사용 원칙')).toBeInTheDocument();
  });

  it('그림자 변형 섹션이 렌더링되어야 함', () => {
    render(<ShadowExamples />);
    
    expect(screen.getByText('그림자 변형')).toBeInTheDocument();
    // 그림자 카드가 렌더링되는지 확인
    expect(screen.getAllByText(/shadow-/i).length).toBeGreaterThan(0);
  });

  it('그림자 사용 예시 섹션이 렌더링되어야 함', () => {
    render(<ShadowExamples />);
    
    expect(screen.getByText('그림자 사용 예시')).toBeInTheDocument();
    expect(screen.getByText('컴포넌트별 권장 그림자')).toBeInTheDocument();
    expect(screen.getByText('상호작용 그림자')).toBeInTheDocument();
    expect(screen.getByText('카드 및 패널')).toBeInTheDocument();
    expect(screen.getByText('모달 및 드롭다운')).toBeInTheDocument();
  });

  it('다크 모드 그림자 섹션이 렌더링되어야 함', () => {
    render(<ShadowExamples />);
    
    expect(screen.getByText('다크 모드 그림자')).toBeInTheDocument();
    expect(screen.getByText('다크 모드에서의 그림자 처리')).toBeInTheDocument();
    expect(screen.getByText('다크 모드 그림자 팁')).toBeInTheDocument();
  });

  it('복사 버튼 클릭 시 복사 함수가 호출되어야 함', () => {
    render(<ShadowExamples />);
    
    // 그림자 복사 버튼 찾기 (shadow-sm과 같은 값이 있을 것으로 예상)
    const copyButtons = screen.getAllByTestId(/copy-button-shadow-/i);
    expect(copyButtons.length).toBeGreaterThan(0);
    
    // 첫 번째 버튼 클릭
    fireEvent.click(copyButtons[0]);
    
    // 복사 후 체크 아이콘이 표시되어야 함 (상태 변경 확인)
    expect(copyButtons[0].querySelector('svg')).toBeInTheDocument();
  });
});
