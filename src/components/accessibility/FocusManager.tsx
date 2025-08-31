/**
 * 포커스 관리 컴포넌트
 * 
 * 키보드 네비게이션과 포커스 트랩을 관리합니다.
 * WCAG 2.1 AA - 2.1.1 (Keyboard) 및 2.4.3 (Focus Order) 준수
 */

import React, { useEffect, useRef, useCallback } from 'react';

interface FocusManagerProps {
  children: React.ReactNode;
  enabled?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

/**
 * 포커스 가능한 요소들을 선택하기 위한 셀렉터
 */
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'details',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(', ');

/**
 * FocusManager 컴포넌트
 * 모달이나 드롭다운에서 포커스를 트랩하고 관리합니다.
 * 
 * @example
 * ```tsx
 * <FocusManager enabled={isModalOpen} autoFocus restoreFocus>
 *   <div role="dialog">
 *     <button>첫 번째 버튼</button>
 *     <button>두 번째 버튼</button>
 *   </div>
 * </FocusManager>
 * ```
 */
export const FocusManager = ({ 
  children, 
  enabled = true,
  autoFocus = false,
  restoreFocus = true,
  className 
}: FocusManagerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  /**
   * 컨테이너 내의 포커스 가능한 모든 요소를 찾습니다.
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll(FOCUSABLE_ELEMENTS);
    return Array.from(elements).filter(
      (element): element is HTMLElement => 
        element instanceof HTMLElement && element.tabIndex !== -1
    );
  }, []);

  /**
   * Tab 키 이벤트를 처리하여 포커스를 트랩합니다.
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const currentElement = document.activeElement as HTMLElement;

    // Shift + Tab (역방향)
    if (event.shiftKey) {
      if (currentElement === firstElement || !containerRef.current?.contains(currentElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } 
    // Tab (순방향)
    else {
      if (currentElement === lastElement || !containerRef.current?.contains(currentElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [enabled, getFocusableElements]);

  /**
   * Escape 키로 포커스 트랩에서 벗어날 수 있도록 합니다.
   */
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (enabled && event.key === 'Escape' && restoreFocus && previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  }, [enabled, restoreFocus]);

  useEffect(() => {
    if (!enabled) return;

    // 현재 포커스된 요소를 저장
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // 자동 포커스가 활성화된 경우 첫 번째 요소에 포커스
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    // 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      // 이벤트 리스너 제거
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleEscapeKey);

      // 포커스 복원
      if (restoreFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [enabled, autoFocus, restoreFocus, handleKeyDown, handleEscapeKey, getFocusableElements]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
