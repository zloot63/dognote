import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className,
  children,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue || '');

  const handleTabChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onChange?.(newValue);
  };

  const contextValue: TabsContextType = {
    activeTab: value || activeTab,
    setActiveTab: handleTabChange,
    orientation,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          'w-full',
          orientation === 'vertical' && 'flex gap-4',
          className
        )}
        data-orientation={orientation}
        data-variant={variant}
        data-size={size}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  const { orientation } = useTabsContext();

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        orientation === 'horizontal' ? 'h-10 w-full' : 'h-auto w-auto flex-col',
        className
      )}
      role="tablist"
      aria-orientation={orientation}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  disabled = false,
  className,
  children,
}) => {
  const { activeTab, setActiveTab, orientation } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        orientation === 'horizontal' ? 'w-full' : 'w-full',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children,
}) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      id={`tabpanel-${value}`}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};

// 고급 탭 컴포넌트 (아이콘, 배지 지원)
export interface AdvancedTabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
}

const AdvancedTabs: React.FC<AdvancedTabsProps> = ({
  items,
  defaultValue,
  value,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className,
  children,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue || items[0]?.value || '');

  const handleTabChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onChange?.(newValue);
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const variantStyles = {
    default: 'border-b border-border',
    pills: 'bg-muted rounded-lg p-1',
    underline: 'border-b border-border',
  };

  const activeStyles = {
    default: 'border-b-2 border-primary text-primary',
    pills: 'bg-background text-foreground shadow-sm',
    underline: 'border-b-2 border-primary text-primary',
  };

  return (
    <div
      className={cn(
        'w-full',
        orientation === 'vertical' && 'flex gap-4',
        className
      )}
    >
      {/* 탭 헤더 */}
      <div
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'w-full' : 'flex-col w-auto',
          variantStyles[variant]
        )}
        role="tablist"
        aria-orientation={orientation}
      >
        {items.map((item) => {
          const isActive = (value || activeTab) === item.value;
          
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => !item.disabled && handleTabChange(item.value)}
              className={cn(
                'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                sizeStyles[size],
                orientation === 'horizontal' ? 'flex-1' : 'w-full justify-start',
                variant === 'pills' ? 'rounded-md' : '',
                isActive
                  ? activeStyles[variant]
                  : 'text-muted-foreground hover:text-foreground',
                variant === 'pills' && !isActive && 'hover:bg-background/50'
              )}
            >
              {item.icon && (
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <div className={cn(
        'mt-4',
        orientation === 'vertical' && 'flex-1 mt-0'
      )}>
        {children}
      </div>
    </div>
  );
};

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AdvancedTabs,
};

export default Tabs;
