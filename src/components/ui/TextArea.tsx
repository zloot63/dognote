import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/Label"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
      size: {
        sm: "min-h-[60px] text-xs",
        md: "min-h-[80px] text-sm",
        lg: "min-h-[120px] text-base",
      },
    },
    defaultVariants: {
      resize: "vertical",
      size: "md",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, resize, size, label, error, helperText, ...props }, ref) => {
    return (
      <div className="grid gap-2">
        {label && (
          <Label className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <textarea
          className={cn(
            textareaVariants({ resize, size }),
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// Enhanced TextArea with additional features
export interface EnhancedTextareaProps extends TextareaProps {
  maxLength?: number;
  showCount?: boolean;
  autoResize?: boolean;
}

const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({ 
    className, 
    resize, 
    size, 
    label, 
    error, 
    helperText, 
    maxLength,
    showCount = false,
    autoResize = false,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [currentLength, setCurrentLength] = React.useState(0);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!);

    React.useEffect(() => {
      if (typeof value === 'string') {
        setCurrentLength(value.length);
      }
    }, [value]);

    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      
      if (maxLength && newValue.length > maxLength) {
        return;
      }
      
      setCurrentLength(newValue.length);
      
      if (autoResize) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
      
      onChange?.(e);
    };

    const isOverLimit = maxLength && currentLength > maxLength;

    return (
      <div className="grid gap-2">
        {label && (
          <Label className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        <div className="relative">
          <textarea
            ref={textareaRef}
            className={cn(
              textareaVariants({ 
                resize: autoResize ? "none" : resize, 
                size 
              }),
              error && "border-destructive focus-visible:ring-destructive",
              isOverLimit && "border-destructive focus-visible:ring-destructive",
              autoResize && "overflow-hidden",
              className
            )}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />
          {showCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1 rounded">
              <span className={cn(isOverLimit && "text-destructive")}>
                {currentLength}
              </span>
              /{maxLength}
            </div>
          )}
        </div>
        {(error || helperText || isOverLimit) && (
          <p className={cn(
            "text-sm",
            (error || isOverLimit) ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || (isOverLimit ? `최대 ${maxLength}자까지 입력 가능합니다.` : helperText)}
          </p>
        )}
      </div>
    )
  }
)
EnhancedTextarea.displayName = "EnhancedTextarea"

export { Textarea, Textarea as TextArea, EnhancedTextarea, textareaVariants }
