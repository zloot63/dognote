import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { Sidebar, ComponentCategory } from '../Sidebar';

describe('Sidebar', () => {
  // 테스트용 카테고리 데이터
  const mockCategories: ComponentCategory[] = [
    {
      id: 'foundations',
      title: '기초',
      icon: <span data-testid="foundation-icon">아이콘</span>,
      items: ['colors', 'typography', 'spacing'],
    },
    {
      id: 'components',
      title: '컴포넌트',
      icon: <span data-testid="component-icon">아이콘</span>,
      items: ['buttons', 'inputs'],
    },
  ];

  // 모의 함수
  const mockSetActiveCategory = vi.fn();
  const mockSetActiveComponent = vi.fn();

  it('모든 카테고리와 항목이 렌더링되어야 함', () => {
    render(
      <Sidebar
        categories={mockCategories}
        activeCategory="foundations"
        activeComponent="colors"
        setActiveCategory={mockSetActiveCategory}
        setActiveComponent={mockSetActiveComponent}
      />
    );

    // 카테고리 제목 확인
    expect(screen.getByText('기초')).toBeInTheDocument();
    expect(screen.getByText('컴포넌트')).toBeInTheDocument();

    // 첫 번째 카테고리의 항목 확인 (첫 글자가 대문자로 변환됨)
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Typography')).toBeInTheDocument();
    expect(screen.getByText('Spacing')).toBeInTheDocument();
  });

  it('컴포넌트 카테고리 클릭 시 해당 항목이 표시되어야 함', () => {
    const { rerender } = render(
      <Sidebar
        categories={mockCategories}
        activeCategory="foundations"
        activeComponent="colors"
        setActiveCategory={mockSetActiveCategory}
        setActiveComponent={mockSetActiveComponent}
      />
    );

    // 컴포넌트 카테고리 클릭
    fireEvent.click(screen.getByText('컴포넌트'));

    // setActiveCategory가 호출되었는지 확인
    expect(mockSetActiveCategory).toHaveBeenCalledWith('components');

    // 실제 UI에서는 상태 변경 후 리렌더링이 필요하므로 수동으로 리렌더링
    rerender(
      <Sidebar
        categories={mockCategories}
        activeCategory="components"
        activeComponent="buttons"
        setActiveCategory={mockSetActiveCategory}
        setActiveComponent={mockSetActiveComponent}
      />
    );

    // 이제 컴포넌트 카테고리의 항목들이 보여야 함
    expect(screen.getByText('Buttons')).toBeInTheDocument();
    expect(screen.getByText('Inputs')).toBeInTheDocument();
  });

  it('활성 카테고리와 컴포넌트가 강조 표시되어야 함', () => {
    render(
      <Sidebar
        categories={mockCategories}
        activeCategory="foundations"
        activeComponent="typography"
        setActiveCategory={mockSetActiveCategory}
        setActiveComponent={mockSetActiveComponent}
      />
    );

    // Typography 항목이 활성화되어 있는지 확인 (첫 글자가 대문자로 변환됨)
    const typographyItem = screen.getByText('Typography').closest('button');
    expect(typographyItem).toHaveClass('bg-primary-50');
  });

  it('카테고리 클릭 시 setActiveCategory가 호출되어야 함', () => {
    render(
      <Sidebar
        categories={mockCategories}
        activeCategory="foundations"
        activeComponent="colors"
        setActiveCategory={mockSetActiveCategory}
        setActiveComponent={mockSetActiveComponent}
      />
    );

    // 컴포넌트 카테고리 클릭
    fireEvent.click(screen.getByText('컴포넌트'));

    // setActiveCategory가 'components'로 호출되었는지 확인
    expect(mockSetActiveCategory).toHaveBeenCalledWith('components');
  });

  it('컴포넌트 항목 클릭 시 setActiveComponent가 호출되어야 함', () => {
    render(
      <Sidebar
        categories={mockCategories}
        activeCategory="foundations"
        activeComponent="colors"
        setActiveCategory={mockSetActiveCategory}
        setActiveComponent={mockSetActiveComponent}
      />
    );

    // Typography 항목 클릭 (첫 글자가 대문자로 변환됨)
    fireEvent.click(screen.getByText('Typography'));

    // setActiveComponent가 'typography'로 호출되었는지 확인
    expect(mockSetActiveComponent).toHaveBeenCalledWith('typography');
  });
});
