import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  showStatus = false,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };

  const shapeStyles = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-md',
  };

  const statusStyles = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
    '2xl': 'h-5 w-5',
  };

  // 폴백 텍스트 생성 (이름의 첫 글자들)
  const getFallbackText = (): string => {
    if (fallback) {
      return fallback
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '?';
  };

  const shouldShowImage = src && !imageError;

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden bg-muted font-medium text-muted-foreground',
          sizeStyles[size],
          shapeStyles[shape],
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        onClick={onClick}
      >
        {shouldShowImage ? (
          <Image
            src={src!}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="select-none">
            {getFallbackText()}
          </span>
        )}
      </div>

      {/* 상태 표시 */}
      {showStatus && status && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            statusStyles[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};

// 아바타 그룹 컴포넌트
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
  onAvatarClick?: (index: number) => void;
  onMoreClick?: () => void;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  shape = 'circle',
  spacing = 'normal',
  className,
  onAvatarClick,
  onMoreClick,
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const spacingStyles = {
    tight: '-space-x-1',
    normal: '-space-x-2',
    loose: '-space-x-3',
  };

  return (
    <div className={cn('flex items-center', spacingStyles[spacing], className)}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className="relative border-2 border-background"
          style={{ zIndex: displayAvatars.length - index }}
        >
          <Avatar
            {...avatar}
            size={size}
            shape={shape}
            onClick={() => onAvatarClick?.(index)}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className="relative border-2 border-background"
          style={{ zIndex: 0 }}
        >
          <Avatar
            fallback={`+${remainingCount}`}
            size={size}
            shape={shape}
            className="bg-muted-foreground text-background"
            onClick={onMoreClick}
          />
        </div>
      )}
    </div>
  );
};

export { AvatarGroup };
export default Avatar;
