import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  label?: string;
  error?: string;
  helperText?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: string) => void;
}

const Radio: React.FC<RadioProps> = ({
  name,
  options,
  value,
  defaultValue,
  label,
  error,
  helperText,
  orientation = 'vertical',
  size = 'md',
  onChange,
}) => {
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

  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      
      <div className={cn(
        'space-y-2',
        orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0'
      )}>
        {options?.map((option) => (
          <div key={option.value} className="flex items-start space-x-2">
            <div className="relative flex items-center">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value ? value === option.value : defaultValue === option.value}
                disabled={option.disabled}
                onChange={() => handleChange(option.value)}
                className={cn(
                  'peer shrink-0 rounded-full border border-primary text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  sizeStyles[size],
                  error && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {/* Custom radio indicator */}
              <div className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center',
                sizeStyles[size]
              )}>
                <div className={cn(
                  'rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity',
                  size === 'sm' ? 'h-1.5 w-1.5' : size === 'md' ? 'h-2 w-2' : 'h-2.5 w-2.5'
                )} />
              </div>
            </div>
            
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
                  labelSizeStyles[size],
                  error && 'text-destructive',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option.label}
              </label>
              {option.description && (
                <p className={cn(
                  'text-muted-foreground',
                  size === 'sm' ? 'text-xs' : 'text-sm'
                )}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default Radio;

// Named exports for compatibility
export { Radio };

// Additional radio components for different use cases
export const RadioCard = Radio;
export const RadioButton = Radio;
