import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  showTime?: boolean;
  className?: string;
  onChange?: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue,
  placeholder = '날짜를 선택하세요',
  label,
  error,
  helperText,
  disabled = false,
  minDate,
  maxDate,
  format = 'YYYY-MM-DD',
  showTime = false,
  className,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || defaultValue || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  // 날짜 포맷팅 함수 - useCallback으로 감싸서 불필요한 재렌더링 방지
  const formatDate = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    switch (format) {
      case 'YYYY/MM/DD':
        return showTime ? `${year}/${month}/${day} ${hours}:${minutes}` : `${year}/${month}/${day}`;
      case 'MM/DD/YYYY':
        return showTime ? `${month}/${day}/${year} ${hours}:${minutes}` : `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return showTime ? `${day}/${month}/${year} ${hours}:${minutes}` : `${day}/${month}/${year}`;
      default:
        return showTime ? `${year}-${month}-${day} ${hours}:${minutes}` : `${year}-${month}-${day}`;
    }
  }, [format, showTime]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 선택된 날짜가 변경될 때 입력값 업데이트
  useEffect(() => {
    if (selectedDate) {
      setInputValue(formatDate(selectedDate));
    } else {
      setInputValue('');
    }
  }, [selectedDate, format, showTime, formatDate]);

  const handleDateSelect = (date: Date) => {
    if (showTime && selectedDate) {
      // 시간 정보 유지
      date.setHours(selectedDate.getHours());
      date.setMinutes(selectedDate.getMinutes());
    }
    
    setSelectedDate(date);
    onChange?.(date);
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    setInputValue('');
    onChange?.(null);
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    // lastDay는 현재 사용되지 않음
    // const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const baseStyles = 'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const errorStyles = error ? 'border-destructive focus:ring-destructive' : '';

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      <div ref={datePickerRef} className="relative">
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
            !inputValue && 'text-muted-foreground'
          )}>
            {inputValue || placeholder}
          </span>
          
          <div className="flex items-center space-x-1">
            {inputValue && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-3 text-popover-foreground shadow-md">
            {/* 월/년 네비게이션 */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="rounded-sm p-1 hover:bg-accent hover:text-accent-foreground"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-sm font-medium">
                {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
              </div>
              
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="rounded-sm p-1 hover:bg-accent hover:text-accent-foreground"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                const isToday = day.toDateString() === new Date().toDateString();
                const isDisabled = isDateDisabled(day);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    className={cn(
                      'p-2 text-center text-sm rounded-sm transition-colors',
                      !isCurrentMonth && 'text-muted-foreground opacity-50',
                      isCurrentMonth && 'hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-primary text-primary-foreground',
                      isToday && !isSelected && 'bg-accent text-accent-foreground',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                    disabled={isDisabled}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* 시간 선택기 */}
            {showTime && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-center space-x-2">
                  <select
                    value={selectedDate?.getHours() || 0}
                    onChange={(e) => handleTimeChange(parseInt(e.target.value), selectedDate?.getMinutes() || 0)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={selectedDate?.getMinutes() || 0}
                    onChange={(e) => handleTimeChange(selectedDate?.getHours() || 0, parseInt(e.target.value))}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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

export default DatePicker;
