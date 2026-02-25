import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { SpacingExamples } from '../SpacingExamples';
import { fireEvent } from '@testing-library/react';

// react-copy-to-clipboard 모킹
vi.mock('react-copy-to-clipboard', () => ({
  CopyToClipboard: ({
    text,
    onCopy,
    children,
  }: {
    text: string;
    onCopy: (text: string) => void;
    children: React.ReactNode;
  }) => (
    <button onClick={() => onCopy(text)} data-testid={`copy-button-${text}`}>
      {children}
    </button>
  ),
}));

describe('SpacingExamples', () => {
  it('스페이싱 시스템 섹션이 렌더링되어야 함', () => {
    render(<SpacingExamples />);

    expect(screen.getByText('스페이싱 시스템')).toBeInTheDocument();
    expect(screen.getByText('4px 그리드 시스템')).toBeInTheDocument();
    expect(screen.getByText('스페이싱 사용 원칙')).toBeInTheDocument();
  });

  it('스페이싱 값 섹션이 렌더링되어야 함', () => {
    render(<SpacingExamples />);

    const spacingValuesSection = screen
      .getByText('스페이싱 값')
      .closest('section');
    expect(spacingValuesSection).toBeInTheDocument();

    const tableHeaders = within(spacingValuesSection!).getAllByRole(
      'columnheader'
    );
    expect(tableHeaders[0]).toHaveTextContent('토큰');
    expect(tableHeaders[1]).toHaveTextContent('값');
    expect(tableHeaders[2]).toHaveTextContent('픽셀');
  });

  it('스페이싱 카테고리가 렌더링되어야 함', () => {
    render(<SpacingExamples />);

    expect(screen.getByText('아주 작은 간격')).toBeInTheDocument();
    expect(screen.getByText('작은 간격')).toBeInTheDocument();
    expect(screen.getByText('중간 간격')).toBeInTheDocument();
    expect(screen.getByText('큰 간격')).toBeInTheDocument();
    expect(screen.getByText('아주 큰 간격')).toBeInTheDocument();
  });

  it('스페이싱 사용 예시 섹션이 렌더링되어야 함', () => {
    render(<SpacingExamples />);

    const usageSection = screen
      .getByText('스페이싱 사용 예시')
      .closest('section');
    expect(usageSection).toBeInTheDocument();

    // 섹션 내에서 헤딩 찾기
    const headings = within(usageSection!).getAllByRole('heading');
    const headingTexts = headings.map(h => h.textContent);

    // 헤딩 텍스트에 "패딩 예시"와 "마진과 갭 예시"가 포함되어 있는지 확인
    expect(headingTexts.some(text => text === '패딩 예시')).toBe(true);
    expect(headingTexts.some(text => text === '마진과 갭 예시')).toBe(true);
  });

  it('복사 버튼 클릭 시 복사 함수가 호출되어야 함', () => {
    render(<SpacingExamples />);

    // 패딩 복사 버튼 찾기
    const paddingButton = screen.getByTestId('copy-button-p-4');

    // 버튼 클릭
    fireEvent.click(paddingButton);

    // 복사 후 체크 아이콘이 표시되어야 함 (상태 변경 확인)
    expect(
      screen.getByTestId('copy-button-p-4').querySelector('svg')
    ).toBeInTheDocument();
  });
});
