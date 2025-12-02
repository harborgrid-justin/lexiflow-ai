import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContext = React.createContext<{
  type: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string) => void;
  collapsible: boolean;
}>({
  type: 'single',
  collapsible: false,
});

const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
}>({
  value: '',
  isOpen: false,
});

const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
  collapsible = false,
}) => {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === 'multiple' ? [] : '')
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        const newValue =
          value === itemValue && collapsible ? '' : itemValue;
        if (onValueChange) {
          onValueChange(newValue);
        } else {
          setInternalValue(newValue);
        }
      } else {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(itemValue)
          ? currentValues.filter((v) => v !== itemValue)
          : [...currentValues, itemValue];
        if (onValueChange) {
          onValueChange(newValues);
        } else {
          setInternalValue(newValues);
        }
      }
    },
    [type, value, onValueChange, collapsible]
  );

  return (
    <AccordionContext.Provider
      value={{ type, value, onValueChange: handleValueChange, collapsible }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const { type, value } = React.useContext(AccordionContext);

    const isOpen = type === 'single' ? value === itemValue : Array.isArray(value) && value.includes(itemValue);

    return (
      <AccordionItemContext.Provider value={{ value: itemValue, isOpen }}>
        <div
          ref={ref}
          className={cn('border-b border-border', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { onValueChange } = React.useContext(AccordionContext);
    const { value, isOpen } = React.useContext(AccordionItemContext);

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex w-full items-center justify-between py-4 font-medium transition-all',
          'hover:underline text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          '[&[data-state=open]>svg]:rotate-180',
          className
        )}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={() => onValueChange?.(value)}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = React.useContext(AccordionItemContext);

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn('pb-4 pt-0', className)} {...props}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
