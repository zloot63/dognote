import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate = false, size = 'md', disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const labelSizeStyles = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const baseStyles = 'peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground';
    const errorStyles = error ? 'border-destructive focus-visible:ring-destructive' : '';

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              ref={ref}
              className={cn(
                baseStyles,
                sizeStyles[size],
                errorStyles,
                className
              )}
              disabled={disabled}
              {...props}
            />
            {/* Custom checkbox indicator */}
            <div className={cn(
              'pointer-events-none absolute inset-0 flex items-center justify-center text-current',
              sizeStyles[size]
            )}>
              {indeterminate ? (
                <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="6" y="9" width="8" height="2" rx="1" />
                </svg>
              ) : (
                <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          
          {(label || description) && (
            <div className="grid gap-1.5 leading-none">
              {label && (
                <label
                  htmlFor={props.id}
                  className={cn(
                    'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    labelSizeStyles[size],
                    error && 'text-destructive'
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className={cn(
                  'text-muted-foreground',
                  size === 'sm' ? 'text-xs' : 'text-sm'
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
