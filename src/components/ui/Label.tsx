import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 레이블 텍스트 */
  children: React.ReactNode;
  /** 필수 필드 표시 여부 */
  required?: boolean;
}

/**
 * 폼 요소에 대한 접근성 있는 레이블 컴포넌트
 * 
 * @example
 * ```tsx
 * <Label htmlFor="email" required>이메일</Label>
 * <Input id="email" type="email" />
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required = false, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-neutral-700 dark:text-neutral-300',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-error-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
