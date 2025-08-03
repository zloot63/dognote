import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  className,
  size = 'lg',
  padding = 'md',
  center = true,
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingStyles = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8',
  };

  return (
    <div
      className={cn(
        'w-full',
        sizeStyles[size],
        paddingStyles[padding],
        center && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// 섹션 컨테이너 컴포넌트
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article' | 'aside';
  size?: ContainerProps['size'];
  padding?: ContainerProps['padding'];
  background?: 'none' | 'muted' | 'card' | 'accent';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  as: Component = 'section',
  className,
  size = 'lg',
  padding = 'lg',
  background = 'none',
  border = false,
  shadow = 'none',
  children,
  ...props
}) => {
  const backgroundStyles = {
    none: '',
    muted: 'bg-muted',
    card: 'bg-card',
    accent: 'bg-accent',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <Component
      className={cn(
        'w-full',
        backgroundStyles[background],
        border && 'border border-border',
        shadowStyles[shadow],
        className
      )}
      {...props}
    >
      <Container size={size} padding={padding}>
        {children}
      </Container>
    </Component>
  );
};

export { Section };
export default Container;
