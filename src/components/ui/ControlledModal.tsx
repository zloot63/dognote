'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ControlledModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  fullScreen?: boolean;
  fullWidth?: boolean;
}

const ControlledModal: React.FC<ControlledModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
  fullScreen = false,
  fullWidth = false,
}) => {
  // Only render when open is true to prevent unnecessary re-renders
  if (!open) return null;

  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const modalClasses = cn(
    'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 rounded-lg p-6',
    fullScreen && 'h-screen w-screen max-w-none rounded-none p-0',
    !fullScreen && sizeStyles[size],
    fullWidth && !fullScreen && 'w-full',
    !fullScreen && 'max-h-[90vh] overflow-y-auto',
    className
  );

  const overlayClasses = cn(
    'fixed inset-0 z-50 bg-black/80 animate-in fade-in-0'
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className={overlayClasses} onClick={onClose} />

      {/* Modal */}
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <h2 className="font-semibold leading-none tracking-tight text-lg">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close modal"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className={cn(fullScreen ? 'flex-1 overflow-y-auto p-4' : '')}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ControlledModal;
