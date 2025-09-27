"use client"

import * as React from "react"
import { format } from "date-fns"
import { ko, enUS, ja, zhCN, es, fr, de } from "date-fns/locale"
import { CalendarIcon, X as XIcon, ChevronRightIcon, Clock as ClockIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/Badge"
import { motion, AnimatePresence } from "framer-motion"

// 로케일 매핑
const locales = {
  ko: ko,
  en: enUS,
  ja: ja,
  zh: zhCN,
  es: es,
  fr: fr,
  de: de,
} as const

type LocaleKey = keyof typeof locales

// 날짜 프리셋 타입
interface DatePreset {
  label: string
  getValue: () => Date
}

// 기본 날짜 프리셋
const getDatePresets = (locale: LocaleKey = 'ko'): DatePreset[] => {
  const labels = {
    ko: {
      today: '오늘',
      yesterday: '어제',
      tomorrow: '내일',
      thisWeek: '이번 주',
      lastWeek: '지난 주',
      thisMonth: '이번 달',
      lastMonth: '지난 달',
    },
    en: {
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      lastWeek: 'Last Week',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
    },
    ja: {
      today: '今日',
      yesterday: '昨日',
      tomorrow: '明日',
      thisWeek: '今週',
      lastWeek: '先週',
      thisMonth: '今月',
      lastMonth: '先月',
    },
    zh: {
      today: '今天',
      yesterday: '昨天',
      tomorrow: '明天',
      thisWeek: '本周',
      lastWeek: '上周',
      thisMonth: '本月',
      lastMonth: '上月',
    },
    es: {
      today: 'Hoy',
      yesterday: 'Ayer',
      tomorrow: 'Mañana',
      thisWeek: 'Esta semana',
      lastWeek: 'Semana pasada',
      thisMonth: 'Este mes',
      lastMonth: 'Mes pasado',
    },
    fr: {
      today: "Aujourd'hui",
      yesterday: 'Hier',
      tomorrow: 'Demain',
      thisWeek: 'Cette semaine',
      lastWeek: 'Semaine dernière',
      thisMonth: 'Ce mois',
      lastMonth: 'Mois dernier',
    },
    de: {
      today: 'Heute',
      yesterday: 'Gestern',
      tomorrow: 'Morgen',
      thisWeek: 'Diese Woche',
      lastWeek: 'Letzte Woche',
      thisMonth: 'Dieser Monat',
      lastMonth: 'Letzter Monat',
    },
  } as const

  const currentLabels = labels[locale] || labels.en

  return [
    {
      label: currentLabels.today,
      getValue: () => new Date(),
    },
    {
      label: currentLabels.yesterday,
      getValue: () => {
        const date = new Date()
        date.setDate(date.getDate() - 1)
        return date
      },
    },
    {
      label: currentLabels.tomorrow,
      getValue: () => {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        return date
      },
    },
  ]
}

export interface DatePickerProps {
  value?: Date | null
  defaultValue?: Date
  placeholder?: string
  label?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  minDate?: Date
  maxDate?: Date
  formatString?: string
  locale?: LocaleKey
  showPresets?: boolean
  showTimePicker?: boolean
  clearable?: boolean
  autoFocus?: boolean
  className?: string
  popoverClassName?: string
  calendarClassName?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  onChange?: (date: Date | null) => void
  onBlur?: () => void
  onFocus?: () => void
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({
    value,
    defaultValue,
    placeholder,
    label,
    error,
    helperText,
    disabled = false,
    required = false,
    minDate,
    maxDate,
    formatString = "PPP",
    locale = 'ko',
    showPresets = false,
    showTimePicker = false,
    clearable = true,
    autoFocus = false,
    className,
    popoverClassName,
    calendarClassName,
    size = 'default',
    variant = 'outline',
    onChange,
    onBlur,
    onFocus,
    ...props
  }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>(
      value === null ? undefined : (value || defaultValue)
    )
    const [open, setOpen] = React.useState(false)
    const [selectedHour, setSelectedHour] = React.useState('00')
    const [selectedMinute, setSelectedMinute] = React.useState('00')
    const inputId = React.useId()
    const errorId = React.useId()

    const currentLocale = locales[locale] || locales.ko
    const presets = React.useMemo(() => getDatePresets(locale), [locale])

    // 플레이스홀더 설정
    const getPlaceholder = React.useCallback(() => {
      if (placeholder) return placeholder
      const placeholders = {
        ko: '날짜를 선택하세요',
        en: 'Select a date',
        ja: '日付を選択',
        zh: '选择日期',
        es: 'Seleccionar fecha',
        fr: 'Sélectionner une date',
        de: 'Datum auswählen',
      }
      return placeholders[locale] || placeholders.en
    }, [placeholder, locale])

    // value prop 동기화
    React.useEffect(() => {
      if (value !== undefined) {
        setDate(value === null ? undefined : value)
        if (value && showTimePicker) {
          const hours = format(value, 'HH')
          const minutes = format(value, 'mm')
          setSelectedHour(hours)
          setSelectedMinute(minutes)
        }
      }
    }, [value, showTimePicker])

    // 날짜 포맷팅
    const formatDate = React.useCallback((date: Date | undefined) => {
      if (!date) return ''
      const formatStr = showTimePicker ? `${formatString} HH:mm` : formatString
      return format(date, formatStr, { locale: currentLocale })
    }, [formatString, showTimePicker, currentLocale])

    // 날짜 선택 핸들러
    const handleSelect = React.useCallback((selectedDate: Date | undefined) => {
      let finalDate = selectedDate
      
      if (selectedDate && showTimePicker) {
        finalDate = new Date(selectedDate)
        finalDate.setHours(parseInt(selectedHour))
        finalDate.setMinutes(parseInt(selectedMinute))
      }
      
      setDate(finalDate)
      onChange?.(finalDate || null)
      
      if (!showTimePicker) {
        setOpen(false)
      }
    }, [onChange, showTimePicker, selectedHour, selectedMinute])

    // 프리셋 선택 핸들러
    const handlePresetClick = React.useCallback((preset: DatePreset) => {
      const presetDate = preset.getValue()
      handleSelect(presetDate)
    }, [handleSelect])

    // 시간 변경 핸들러
    const handleTimeChange = React.useCallback((hour: string, minute: string) => {
      setSelectedHour(hour)
      setSelectedMinute(minute)
      
      if (date) {
        const newDate = new Date(date)
        newDate.setHours(parseInt(hour))
        newDate.setMinutes(parseInt(minute))
        setDate(newDate)
        onChange?.(newDate)
      }
    }, [date, onChange])

    // 날짜 클리어
    const handleClear = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      setDate(undefined)
      setSelectedHour('00')
      setSelectedMinute('00')
      onChange?.(null)
    }, [onChange])

  // 날짜 비활성화 체크
  const isDateDisabled = React.useCallback((date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }, [minDate, maxDate])

    // 키보드 네비게이션
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      } else if (e.key === 'Enter' && open) {
        e.preventDefault()
        if (date) {
          handleSelect(date)
        }
      }
    }, [open, date, handleSelect])

  // 버튼 사이즈 매핑
  const sizeClasses = {
    sm: 'h-8 text-sm',
    default: 'h-10',
    lg: 'h-12 text-lg',
  }

  return (
    <div 
      ref={ref} 
      className={cn("grid gap-2", className)} 
      onKeyDown={handleKeyDown}
      {...props}
    >
        {label && (
          <Label 
            className={cn(
              "text-sm font-medium",
              error && "text-destructive",
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
            htmlFor={inputId}
          >
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              variant={variant}
              role="combobox"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={date ? formatDate(date) : getPlaceholder()}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                "w-full justify-between text-left font-normal",
                sizeClasses[size],
                !date && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive",
                "group relative"
              )}
              disabled={disabled}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                {date ? formatDate(date) : getPlaceholder()}
              </span>
              {clearable && date && !disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                  aria-label="Clear date"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className={cn(
              "w-auto p-0",
              showPresets && "min-w-[520px]",
              popoverClassName
            )} 
            align="start"
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {/* 프리셋 섹션 */}
                {showPresets && (
                  <div className="border-r p-3 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {locale === 'ko' ? '빠른 선택' : 'Quick Select'}
                    </p>
                    {presets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handlePresetClick(preset)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* 캘린더 섹션 */}
                <div className="flex flex-col">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    disabled={isDateDisabled}
                    autoFocus={autoFocus}
                    className={calendarClassName}
                    locale={currentLocale}
                  />
                  
                  {/* 시간 선택기 */}
                  {showTimePicker && (
                    <div className="border-t p-3">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-1">
                          <Select
                            value={selectedHour}
                            onValueChange={(hour) => handleTimeChange(hour, selectedMinute)}
                          >
                            <SelectTrigger className="w-16 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0')
                                return (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          <span className="text-sm font-medium">:</span>
                          <Select
                            value={selectedMinute}
                            onValueChange={(minute) => handleTimeChange(selectedHour, minute)}
                          >
                            <SelectTrigger className="w-16 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 60 }, (_, i) => {
                                const minute = i.toString().padStart(2, '0')
                                return (
                                  <SelectItem key={minute} value={minute}>
                                    {minute}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 액션 버튼 */}
                  {showTimePicker && (
                    <div className="border-t p-3 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(false)}
                      >
                        {locale === 'ko' ? '취소' : 'Cancel'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (date) handleSelect(date)
                          setOpen(false)
                        }}
                      >
                        {locale === 'ko' ? '확인' : 'OK'}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </PopoverContent>
        </Popover>
        {(error || helperText) && (
          <p 
            id={error ? errorId : undefined}
            className={cn(
              "text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
            role={error ? "alert" : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = "DatePicker"

// Date Range Picker 컴포넌트
export interface DateRangePickerProps {
  value?: DateRange | null
  defaultValue?: DateRange
  placeholder?: string
  placeholderStart?: string
  placeholderEnd?: string
  label?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  minDate?: Date
  maxDate?: Date
  formatString?: string
  locale?: LocaleKey
  showPresets?: boolean
  customPresets?: Array<{ label: string; getValue: () => DateRange }>
  clearable?: boolean
  autoFocus?: boolean
  className?: string
  popoverClassName?: string
  calendarClassName?: string
  buttonClassName?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  maxRange?: number // Maximum days between start and end
  onChange?: (range: DateRange | null) => void
  onBlur?: () => void
  onFocus?: () => void
}

// 날짜 범위 프리셋
interface DateRangePreset {
  label: string
  getValue: () => DateRange
}

const getDateRangePresets = (locale: LocaleKey = 'ko'): DateRangePreset[] => {
  const labels = {
    ko: {
      last7Days: '지난 7일',
      last30Days: '지난 30일',
      last90Days: '지난 90일',
      thisMonth: '이번 달',
      lastMonth: '지난 달',
      thisYear: '올해',
      lastYear: '작년',
    },
    en: {
      last7Days: 'Last 7 days',
      last30Days: 'Last 30 days',
      last90Days: 'Last 90 days',
      thisMonth: 'This month',
      lastMonth: 'Last month',
      thisYear: 'This year',
      lastYear: 'Last year',
    },
    ja: {
      last7Days: '過去7日間',
      last30Days: '過去30日間',
      last90Days: '過去90日間',
      thisMonth: '今月',
      lastMonth: '先月',
      thisYear: '今年',
      lastYear: '昨年',
    },
    zh: {
      last7Days: '过去7天',
      last30Days: '过去30天',
      last90Days: '过去90天',
      thisMonth: '本月',
      lastMonth: '上月',
      thisYear: '今年',
      lastYear: '去年',
    },
    es: {
      last7Days: 'Últimos 7 días',
      last30Days: 'Últimos 30 días',
      last90Days: 'Últimos 90 días',
      thisMonth: 'Este mes',
      lastMonth: 'Mes pasado',
      thisYear: 'Este año',
      lastYear: 'Año pasado',
    },
    fr: {
      last7Days: '7 derniers jours',
      last30Days: '30 derniers jours',
      last90Days: '90 derniers jours',
      thisMonth: 'Ce mois',
      lastMonth: 'Mois dernier',
      thisYear: 'Cette année',
      lastYear: 'Année dernière',
    },
    de: {
      last7Days: 'Letzte 7 Tage',
      last30Days: 'Letzte 30 Tage',
      last90Days: 'Letzte 90 Tage',
      thisMonth: 'Dieser Monat',
      lastMonth: 'Letzter Monat',
      thisYear: 'Dieses Jahr',
      lastYear: 'Letztes Jahr',
    },
  } as const

  const currentLabels = labels[locale] || labels.en
  const today = new Date()

  return [
    {
      label: currentLabels.last7Days,
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 7)
        return { from: start, to: end }
      },
    },
    {
      label: currentLabels.last30Days,
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)
        return { from: start, to: end }
      },
    },
    {
      label: currentLabels.thisMonth,
      getValue: () => {
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        return { from: start, to: end }
      },
    },
    {
      label: currentLabels.lastMonth,
      getValue: () => {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const end = new Date(today.getFullYear(), today.getMonth(), 0)
        return { from: start, to: end }
      },
    },
  ]
}

const DateRangePicker = React.forwardRef<
  HTMLDivElement,
  DateRangePickerProps
>(({
  value,
  defaultValue,
  placeholder,
  placeholderStart,
  placeholderEnd,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  formatString = "PPP",
  locale = 'ko',
  showPresets = false,
  customPresets = [],
  clearable = true,
  autoFocus = false,
  className,
  popoverClassName,
  calendarClassName,
  size = 'default',
  variant = 'outline',
  maxRange,
  onChange,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    value === null ? undefined : (value || defaultValue)
  )
  const [open, setOpen] = React.useState(false)
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>()
  const inputId = React.useId()
  const errorId = React.useId()

  const currentLocale = locales[locale] || locales.ko
  const defaultPresets = React.useMemo(() => getDateRangePresets(locale), [locale])
  const presets = customPresets.length > 0 ? customPresets : defaultPresets

  // 플레이스홀더 설정
  const getPlaceholders = React.useCallback(() => {
    const defaultPlaceholders = {
      ko: { start: '시작일', end: '종료일' },
      en: { start: 'Start date', end: 'End date' },
      ja: { start: '開始日', end: '終了日' },
      zh: { start: '开始日期', end: '结束日期' },
      es: { start: 'Fecha inicio', end: 'Fecha fin' },
      fr: { start: 'Date début', end: 'Date fin' },
      de: { start: 'Startdatum', end: 'Enddatum' },
    }
    const defaults = defaultPlaceholders[locale] || defaultPlaceholders.en
    return {
      start: placeholderStart || defaults.start,
      end: placeholderEnd || defaults.end,
      full: placeholder || `${defaults.start} ~ ${defaults.end}`,
    }
  }, [placeholder, placeholderStart, placeholderEnd, locale])

  // value prop 동기화
  React.useEffect(() => {
    if (value !== undefined) {
      setDateRange(value === null ? undefined : value)
    }
  }, [value])

  // 날짜 범위 포맷팅
  const formatDateRange = React.useCallback((range: DateRange | undefined) => {
    if (!range?.from) return ''
    if (!range.to) {
      return format(range.from, formatString, { locale: currentLocale })
    }
    return `${format(range.from, formatString, { locale: currentLocale })} - ${format(range.to, formatString, { locale: currentLocale })}`
  }, [formatString, currentLocale])

  // 날짜 선택 핸들러
  const handleSelect = React.useCallback((selectedRange: DateRange | undefined) => {
    // maxRange 체크
    if (selectedRange?.from && selectedRange?.to && maxRange) {
      const daysDiff = Math.abs(
        (selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysDiff > maxRange) {
        // 범위 초과 시 알림
        return
      }
    }
    
    setDateRange(selectedRange)
    onChange?.(selectedRange || null)
    
    if (selectedRange?.from && selectedRange?.to) {
      setOpen(false)
    }
  }, [onChange, maxRange])

  // 프리셋 선택 핸들러
  const handlePresetClick = React.useCallback((preset: DateRangePreset) => {
    const presetRange = preset.getValue()
    handleSelect(presetRange)
  }, [handleSelect])

  // 날짜 클리어
  const handleClear = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setDateRange(undefined)
    onChange?.(null)
  }, [onChange])

  // 날짜 비활성화 체크
  const isDateDisabled = React.useCallback((date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }, [minDate, maxDate])

  // 키보드 네비게이션
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  // 버튼 사이즈 매핑
  const sizeClasses = {
    sm: 'h-8 text-sm',
    default: 'h-10',
    lg: 'h-12 text-lg',
  }

  const placeholders = getPlaceholders()

  return (
    <div 
      ref={ref} 
      className={cn("grid gap-2", className)} 
      onKeyDown={handleKeyDown}
      {...props}
    >
        {label && (
          <Label 
            className={cn(
              "text-sm font-medium",
              error && "text-destructive",
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
            htmlFor={inputId}
          >
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              variant={variant}
              role="combobox"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={dateRange ? formatDateRange(dateRange) : placeholders.full}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                "w-full justify-between text-left font-normal",
                sizeClasses[size],
                !dateRange && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive",
                "group relative"
              )}
              disabled={disabled}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y", { locale: currentLocale })}
                      {" - "}
                      {format(dateRange.to, "LLL dd, y", { locale: currentLocale })}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y", { locale: currentLocale })
                  )
                ) : (
                  <span>{placeholders.full}</span>
                )}
              </span>
              {clearable && dateRange && !disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                  aria-label="Clear dates"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className={cn(
              "w-auto p-0",
              showPresets && "min-w-[700px]",
              popoverClassName
            )} 
            align="start"
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {/* 프리셋 섹션 */}
                {showPresets && (
                  <div className="border-r p-3 space-y-2 min-w-[150px]">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {locale === 'ko' ? '빠른 선택' : 'Quick Select'}
                    </p>
                    {presets.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => handlePresetClick(preset)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* 캘린더 섹션 */}
                <div className="flex flex-col">
                  <Calendar
                    initialFocus={autoFocus}
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    disabled={isDateDisabled}
                    className={calendarClassName}
                    locale={currentLocale}
                    modifiers={{
                      hovered: hoveredDate ? [hoveredDate] : [],
                    }}
                    onDayMouseEnter={(day: Date) => setHoveredDate(day)}
                    onDayMouseLeave={() => setHoveredDate(undefined)}
                  />
                  
                  {/* 선택 정보 표시 */}
                  {dateRange?.from && (
                    <div className="border-t p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-muted-foreground">
                              {locale === 'ko' ? '시작:' : 'Start:'}
                            </span>
                            <span className="ml-1 font-medium">
                              {format(dateRange.from, "PPP", { locale: currentLocale })}
                            </span>
                          </div>
                          {dateRange.to && (
                            <>
                              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="text-muted-foreground">
                                  {locale === 'ko' ? '종료:' : 'End:'}
                                </span>
                                <span className="ml-1 font-medium">
                                  {format(dateRange.to, "PPP", { locale: currentLocale })}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                        {dateRange.to && (
                          <Badge variant="secondary">
                            {
                              Math.ceil(
                                (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
                              ) + 1
                            }
                            {locale === 'ko' ? '일' : ' days'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </PopoverContent>
        </Popover>
        {(error || helperText) && (
          <p 
            id={error ? errorId : undefined}
            className={cn(
              "text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
            role={error ? "alert" : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker };
