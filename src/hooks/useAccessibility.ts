/**
 * 접근성 관련 커스텀 훅들
 *
 * WCAG 2.1 AA 준수를 위한 다양한 접근성 기능을 제공합니다.
 */

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * 색상 대비 계산 훅
 * WCAG 2.1 AA - 1.4.3 (Contrast Minimum) 준수
 */
export function useColorContrast() {
  /**
   * 16진수 색상을 RGB로 변환
   */
  const hexToRgb = useCallback(
    (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    },
    []
  );

  /**
   * 상대 휘도 계산
   */
  const getLuminance = useCallback(
    (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    },
    []
  );

  /**
   * 색상 대비율 계산
   */
  const getContrastRatio = useCallback(
    (color1: string, color2: string): number => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);

      if (!rgb1 || !rgb2) return 0;

      const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);

      return (brightest + 0.05) / (darkest + 0.05);
    },
    [hexToRgb, getLuminance]
  );

  /**
   * WCAG AA 준수 여부 확인
   */
  const isWCAGCompliant = useCallback(
    (
      color1: string,
      color2: string,
      isLargeText = false
    ): {
      isCompliant: boolean;
      ratio: number;
      level: 'AA' | 'AAA' | 'FAIL';
    } => {
      const ratio = getContrastRatio(color1, color2);
      const aaThreshold = isLargeText ? 3 : 4.5;
      const aaaThreshold = isLargeText ? 4.5 : 7;

      let level: 'AA' | 'AAA' | 'FAIL' = 'FAIL';
      if (ratio >= aaaThreshold) level = 'AAA';
      else if (ratio >= aaThreshold) level = 'AA';

      return {
        isCompliant: ratio >= aaThreshold,
        ratio: Math.round(ratio * 100) / 100,
        level,
      };
    },
    [getContrastRatio]
  );

  return { getContrastRatio, isWCAGCompliant };
}

/**
 * 키보드 네비게이션 훅
 * WCAG 2.1 AA - 2.1.1 (Keyboard) 준수
 */
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    let keyboardTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab, Shift+Tab, Arrow keys, Enter, Space 등 네비게이션 키 감지
      if (
        [
          'Tab',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Enter',
          ' ',
        ].includes(e.key)
      ) {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-navigation');

        // 일정 시간 후 키보드 모드 해제
        clearTimeout(keyboardTimeout);
        keyboardTimeout = setTimeout(() => {
          setIsKeyboardUser(false);
          document.body.classList.remove('keyboard-navigation');
        }, 3000);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-navigation');
      clearTimeout(keyboardTimeout);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      clearTimeout(keyboardTimeout);
    };
  }, []);

  return { isKeyboardUser };
}

/**
 * ARIA 어트리뷰트 관리 훅
 * WCAG 2.1 AA - 4.1.2 (Name, Role, Value) 준수
 */
export function useAriaAnnouncement() {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 스크린 리더 알림용 요소 생성
    const announceElement = document.createElement('div');
    announceElement.setAttribute('aria-live', 'polite');
    announceElement.setAttribute('aria-atomic', 'true');
    announceElement.className = 'sr-only';
    document.body.appendChild(announceElement);
    announcementRef.current = announceElement;

    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  /**
   * 스크린 리더에게 메시지 알림
   */
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (announcementRef.current) {
        announcementRef.current.setAttribute('aria-live', priority);
        announcementRef.current.textContent = message;

        // 같은 메시지 반복 알림을 위해 잠시 후 초기화
        setTimeout(() => {
          if (announcementRef.current) {
            announcementRef.current.textContent = '';
          }
        }, 1000);
      }
    },
    []
  );

  return { announce };
}

/**
 * 화면 크기별 접근성 설정 훅
 * WCAG 2.1 AA - 1.4.4 (Resize text) 준수
 */
export function useResponsiveAccessibility() {
  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      // 모바일에서 더 큰 터치 타겟 권장
      if (width < 768) {
        document.documentElement.style.setProperty(
          '--touch-target-min-size',
          '48px'
        );
      } else {
        document.documentElement.style.setProperty(
          '--touch-target-min-size',
          '32px'
        );
      }
    };

    const handleFontSizeChange = () => {
      const rootFontSize = window.getComputedStyle(
        document.documentElement
      ).fontSize;
      const baseFontSize = 16; // 기본 폰트 크기
      const currentSize = parseInt(rootFontSize);

      if (currentSize > baseFontSize * 1.2) {
        setFontSize('large');
      } else if (currentSize < baseFontSize * 0.9) {
        setFontSize('small');
      } else {
        setFontSize('medium');
      }
    };

    checkScreenSize();
    handleFontSizeChange();

    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('resize', handleFontSizeChange);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('resize', handleFontSizeChange);
    };
  }, []);

  return { isMobile, fontSize };
}

/**
 * 접근성 검증 훅
 * 개발 환경에서 접근성 문제를 감지합니다.
 */
export function useAccessibilityValidator() {
  const [violations, setViolations] = useState<string[]>([]);

  const validateElement = useCallback((element: HTMLElement) => {
    if (process.env.NODE_ENV !== 'development') return;

    const newViolations: string[] = [];

    // 이미지 alt 텍스트 검증
    const images = element.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        newViolations.push(`Image missing alt attribute: ${img.src}`);
      }
    });

    // 버튼 텍스트 검증
    const buttons = element.querySelectorAll('button');
    buttons.forEach(button => {
      const text = button.textContent?.trim() || '';
      const ariaLabel = button.getAttribute('aria-label');
      const ariaLabelledBy = button.getAttribute('aria-labelledby');

      if (!text && !ariaLabel && !ariaLabelledBy) {
        newViolations.push('Button missing accessible text');
      }
    });

    // 링크 텍스트 검증
    const links = element.querySelectorAll('a');
    links.forEach(link => {
      const text = link.textContent?.trim() || '';
      const ariaLabel = link.getAttribute('aria-label');

      if (!text && !ariaLabel) {
        newViolations.push(`Link missing accessible text: ${link.href}`);
      }
    });

    // 폼 라벨 검증
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const id = input.id;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);

      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        newViolations.push(`Form control missing label: ${input.tagName}`);
      }
    });

    setViolations(newViolations);

    // 콘솔에 위반 사항 출력
    if (newViolations.length > 0) {
      console.warn('🚨 Accessibility Violations:', newViolations);
    }
  }, []);

  return { violations, validateElement };
}
