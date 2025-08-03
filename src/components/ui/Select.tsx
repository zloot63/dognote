import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  onChange?: (value: string | string[]) => void;
  onSearch?: (query: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  placeholder = '선택하세요',
  label,
  error,
  helperText,
  disabled = false,
  multiple = false,
  searchable = false,
  clearable = false,
  className,
  onChange,
  onSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | string[]>(
    multiple ? (Array.isArray(value) ? value : []) : (value || defaultValue || '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen, setSearchQuery]);

  // 검색 필터링
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = selectedValue as string[];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      
      setSelectedValue(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = multiple ? [] : '';
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const getDisplayValue = () => {
    if (multiple) {
      const values = selectedValue as string[];
      if (values.length === 0) return placeholder;
      if (values.length === 1) {
        const option = options.find(opt => opt.value === values[0]);
        return option?.label || values[0];
      }
      return `${values.length}개 선택됨`;
    } else {
      const option = options.find(opt => opt.value === selectedValue);
      return option?.label || placeholder;
    }
  };

  const baseStyles = 'relative flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const errorStyles = error ? 'border-destructive focus:ring-destructive' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        <div
          className={cn(
            baseStyles,
            errorStyles,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={cn(
            'truncate',
            (multiple ? (selectedValue as string[]).length === 0 : !selectedValue) && 'text-muted-foreground'
          )}>
            {getDisplayValue()}
          </span>
          
          <div className="flex items-center space-x-1">
            {clearable && (multiple ? (selectedValue as string[]).length > 0 : selectedValue) && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg
              className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {searchable && (
              <div className="mb-2 px-2">
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  className="flex h-8 w-full rounded-sm border border-input bg-background px-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div className="py-2 px-2 text-sm text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = multiple 
                  ? (selectedValue as string[]).includes(option.value)
                  : selectedValue === option.value;
                
                return (
                  <div
                    key={option.value}
                    className={cn(
                      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                      option.disabled
                        ? 'pointer-events-none opacity-50'
                        : 'hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent text-accent-foreground'
                    )}
                    onClick={() => !option.disabled && handleOptionClick(option.value)}
                  >
                    {multiple && (
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        {isSelected && (
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                    <span className="truncate">{option.label}</span>
                    {!multiple && isSelected && (
                      <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
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

export default Select;
