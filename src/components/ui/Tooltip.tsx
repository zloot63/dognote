import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  className?: string;
  contentClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  disabled = false,
  arrow = true,
  className,
  contentClassName,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 툴팁 위치 계산
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPosition = position;

    // 화면 경계 체크 및 위치 조정
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 0) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 0) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  }, [position]);

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const toggleTooltip = () => {
    if (disabled) return;
    setIsVisible(!isVisible);
  };

  // 이벤트 핸들러
  const getEventHandlers = () => {
    const handlers: Record<string, (event: React.MouseEvent<HTMLDivElement>) => void> = {};

    if (trigger === 'hover') {
      handlers.onMouseEnter = showTooltip;
      handlers.onMouseLeave = hideTooltip;
    } else if (trigger === 'click') {
      handlers.onClick = toggleTooltip;
    } else if (trigger === 'focus') {
      handlers.onFocus = showTooltip;
      handlers.onBlur = hideTooltip;
    }

    return handlers;
  };

  // 위치 업데이트
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, position, calculatePosition]);

  // 외부 클릭 감지 (click 트리거용)
  useEffect(() => {
    if (trigger !== 'click') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        tooltipRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, trigger, hideTooltip]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-popover',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-popover',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-popover',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-popover',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        ref={triggerRef}
        {...getEventHandlers()}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-popover-foreground bg-popover border rounded-md shadow-md animate-in fade-in-0 zoom-in-95',
            positionStyles[actualPosition],
            contentClassName
          )}
          role="tooltip"
        >
          {content}
          
          {arrow && (
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowStyles[actualPosition]
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
