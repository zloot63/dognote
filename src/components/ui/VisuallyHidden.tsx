import * as React from 'react';
import { cn } from '@/lib/utils';

export type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * VisuallyHidden 컴포넌트
 * 스크린 리더에는 접근 가능하지만 시각적으로는 숨겨진 텍스트를 제공합니다.
 * 접근성을 위해 필수적인 정보를 제공하되 UI에는 표시하지 않을 때 사용합니다.
 */
const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0',
        className
      )}
      {...props}
    />
  )
);
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
export default VisuallyHidden;
