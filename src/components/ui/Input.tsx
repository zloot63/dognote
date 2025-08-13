import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { variants, animations } from '@/lib/theme-utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'underlined';
  inputSize?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    variant = 'default',
    inputSize = 'md',
    loading = false,
    clearable = false,
    onClear,
    value,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value || '');
    
    React.useEffect(() => {
      setInternalValue(value || '');
    }, [value]);

    const baseStyles = `w-full font-medium ${animations.transition.normal} file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`;
    
    const inputVariants = {
      default: variants.input.default,
      filled: variants.input.filled,
      underlined: variants.input.underlined
    };
    
    const errorVariant = error ? variants.input.error : inputVariants[variant];

    const sizes = {
      sm: 'h-8 px-3 py-1 text-sm',
      md: 'h-10 px-3 py-2 text-sm',
      lg: 'h-12 px-4 py-3 text-base'
    };
    
    const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : '';
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleClear = () => {
      setInternalValue('');
      onClear?.();
    };

    const showClearButton = clearable && internalValue && !loading;
    const showPasswordToggle = type === 'password';
    const hasRightContent = rightIcon || showClearButton || showPasswordToggle || loading;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            value={internalValue}
            onChange={(e) => {
              setInternalValue(e.target.value);
              props.onChange?.(e);
            }}
            className={cn(
              baseStyles,
              errorVariant,
              sizes[inputSize],
              leftIcon && 'pl-10',
              hasRightContent && 'pr-10',
              loading && 'cursor-wait',
              className
            )}
            ref={ref}
            disabled={loading || props.disabled}
            {...props}
          />
          
          {/* 오른쪽 아이콘들 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {loading && (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            )}
            
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
            
            {rightIcon && !showClearButton && !showPasswordToggle && !loading && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// TextArea 컴포넌트
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    variant = 'default',
    resize = 'vertical',
    ...props 
  }, ref) => {
    const baseStyles = 'w-full min-h-[80px] font-medium transition-all duration-200 placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      default: 'border-2 border-gray-200 bg-white rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 px-3 py-2',
      filled: 'border-0 bg-gray-100 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-100 px-3 py-2'
    };

    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };
    
    const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : '';

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          className={cn(
            baseStyles,
            error ? variants.input.error : variants[variant],
            resizeStyles[resize],
            className
          )}
          ref={ref}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { Input };
export default Input;
