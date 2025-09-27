import React from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { VisuallyHidden } from './VisuallyHidden';

export type ModalCloseReason = 'escapeKeyDown' | 'backdropClick' | 'closeButton';

export interface ModalProps {
  /** If true, the component is shown */
  open: boolean;
  /** Callback fired when the component requests to be closed */
  onClose?: (event: Event | React.MouseEvent, reason: ModalCloseReason) => void;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Modal children content */
  children: React.ReactNode;
  /** Size of the modal */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** If true, clicking the backdrop will close the modal */
  closeOnBackdropClick?: boolean;
  /** If true, show the close button */
  showCloseButton?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** If true, the modal is full-screen */
  fullScreen?: boolean;
  /** If true, the modal stretches to full width */
  fullWidth?: boolean;
}

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    fullScreen?: boolean;
    fullWidth?: boolean;
    showCloseButton?: boolean;
    title?: string;
    onClose?: (event: Event | React.MouseEvent, reason: ModalCloseReason) => void;
  }
>(({ 
  className, 
  children, 
  size = 'md',
  fullScreen = false,
  fullWidth = false,
  showCloseButton = true,
  title,
  onClose,
  ...props 
}, ref) => {
  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const handleCloseButtonClick = (e: React.MouseEvent) => {
    if (onClose) {
      onClose(e, 'closeButton');
    }
  };

  const contentClasses = cn(
    "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
    // Full-screen styles
    fullScreen ? 'h-screen w-screen max-w-none rounded-none p-0' : 'rounded-lg p-6',
    // Size and width styles
    !fullScreen && sizeStyles[size],
    fullWidth && !fullScreen && 'w-full',
    // Scroll styles
    !fullScreen && 'max-h-[90vh] overflow-y-auto',
    className
  );

  return (
    <DialogPrimitive.Portal>
      <ModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={contentClasses}
        onEscapeKeyDown={(e) => {
          if (onClose) {
            onClose(e, 'escapeKeyDown');
          }
        }}
        {...props}
      >
        {/* ✅ Always include DialogTitle for accessibility */}
        {title ? (
          <ModalTitle>{title}</ModalTitle>
        ) : (
          <VisuallyHidden>
            <ModalTitle>Modal</ModalTitle>
          </VisuallyHidden>
        )}
        
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close 
            className={cn(
              "absolute rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
              fullScreen ? "right-4 top-4 p-2" : "right-4 top-4"
            )}
            onClick={handleCloseButtonClick}
            aria-label="Close modal"
          >
            <X className={cn(fullScreen ? "h-5 w-5" : "h-4 w-4")} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
ModalContent.displayName = "ModalContent";

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    fullScreen?: boolean;
  }
>(({ className, fullScreen = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      fullScreen ? "border-b p-4" : "text-center sm:text-left",
      className
    )}
    {...props}
  />
));
ModalHeader.displayName = "ModalHeader";

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
));
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
    fullScreen?: boolean;
  }
>(({ className, fullScreen = false, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight",
      fullScreen ? "text-xl" : "text-lg",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true,
  className,
  fullScreen = false,
  fullWidth = false,
}) => {
  // Generate unique IDs for accessibility
  const titleId = React.useId();
  const descriptionId = React.useId();

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      // When the dialog closes via backdrop click or escape key
      onClose(new Event('close'), closeOnBackdropClick ? 'backdropClick' : 'escapeKeyDown');
    }
  };

  const handleClose = (event: Event | React.MouseEvent, reason: ModalCloseReason) => {
    if (onClose) {
      onClose(event, reason);
    }
  };

  return (
    <DialogPrimitive.Root 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <ModalContent
        size={size}
        fullScreen={fullScreen}
        fullWidth={fullWidth}
        showCloseButton={showCloseButton}
        title={title}
        onClose={handleClose}
        className={className}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        {/* Header - Only show if title or description exists */}
        {(title || description) && (
          <ModalHeader fullScreen={fullScreen}>
            {description && (
              <ModalDescription id={descriptionId}>
                {description}
              </ModalDescription>
            )}
          </ModalHeader>
        )}

        {/* Content */}
        <div className={cn(
          fullScreen ? 'flex-1 overflow-y-auto p-4' : ''
        )}>
          {children}
        </div>
      </ModalContent>
    </DialogPrimitive.Root>
  );
};

// Export individual components for advanced usage
export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalOverlay,
};

// Default export
export default Modal;

// Types are already exported above
