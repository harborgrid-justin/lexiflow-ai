import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      disabled = false,
      required = false,
      searchable = false,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const selectRef = React.useRef<HTMLDivElement>(null);
    const selectId = React.useId();

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery, searchable]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    };

    return (
      <div className={cn('w-full', containerClassName)} ref={ref}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'block text-sm font-medium mb-2',
              error ? 'text-destructive' : 'text-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative" ref={selectRef}>
          <button
            id={selectId}
            type="button"
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input',
              'bg-background px-3 py-2 text-sm ring-offset-background',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            {...props}
          >
            <span className={cn(!selectedOption && 'text-muted-foreground')}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={cn(
                  'absolute z-50 mt-2 w-full rounded-md border border-border',
                  'bg-popover shadow-lg'
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {searchable && (
                  <div className="p-2 border-b border-border">
                    <input
                      type="text"
                      className={cn(
                        'w-full h-8 px-2 text-sm rounded border border-input bg-background',
                        'focus:outline-none focus:ring-1 focus:ring-ring'
                      )}
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}
                <div
                  className="max-h-[300px] overflow-y-auto p-1"
                  role="listbox"
                >
                  {filteredOptions.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No options found
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          'relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm',
                          'cursor-pointer select-none outline-none transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          option.value === value && 'bg-accent/50',
                          option.disabled &&
                            'pointer-events-none opacity-50'
                        )}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        role="option"
                        aria-selected={option.value === value}
                      >
                        <span className="flex-1">{option.label}</span>
                        {option.value === value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {error && (
          <motion.p
            className="mt-2 text-sm text-destructive"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {error}
          </motion.p>
        )}
        {!error && helperText && (
          <p className="mt-2 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
