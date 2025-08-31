"use client"

import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon } from "@radix-ui/react-icons"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/Label"

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
  formatString?: string;
  className?: string;
  onChange?: (date: Date | null) => void;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({
    value,
    defaultValue,
    placeholder = "날짜를 선택하세요",
    label,
    error,
    helperText,
    disabled = false,
    minDate,
    maxDate,
    formatString = "PPP",
    className,
    onChange,
    ...props
  }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>(value || defaultValue);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setDate(value);
      }
    }, [value]);

    const handleSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      onChange?.(selectedDate || null);
      setOpen(false);
    };

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    return (
      <div ref={ref} className={cn("grid gap-2", className)} {...props}>
        {label && (
          <Label className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, formatString, { locale: ko })
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              disabled={isDateDisabled}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

// Date Range Picker 컴포넌트
export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  formatString?: string;
  className?: string;
  onChange?: (range: DateRange | null) => void;
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  ({
    value,
    defaultValue,
    placeholder = "날짜 범위를 선택하세요",
    label,
    error,
    helperText,
    disabled = false,
    minDate,
    maxDate,
    formatString = "PPP",
    className,
    onChange,
    ...props
  }, ref) => {
    const [dateRange, setDateRange] = React.useState<DateRange>(
      value || defaultValue || { from: undefined }
    );
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setDateRange(value);
      }
    }, [value]);

    const handleSelect = (range: DateRange | undefined) => {
      const newRange = range || { from: undefined };
      setDateRange(newRange as DateRange);
      onChange?.(newRange as DateRange);
      
      // 범위가 완전히 선택되면 팝오버 닫기
      if (newRange.from && newRange.to) {
        setOpen(false);
      }
    };

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const formatDateRange = () => {
      if (dateRange.from) {
        if (dateRange.to) {
          return `${format(dateRange.from, formatString, { locale: ko })} - ${format(dateRange.to, formatString, { locale: ko })}`;
        }
        return format(dateRange.from, formatString, { locale: ko });
      }
      return placeholder;
    };

    return (
      <div ref={ref} className={cn("grid gap-2", className)} {...props}>
        {label && (
          <Label className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleSelect}
              disabled={isDateDisabled}
              numberOfMonths={2}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker };
