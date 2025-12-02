import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      error,
      disabled,
      id,
      checked,
      onCheckedChange,
      onChange,
      ...props
    },
    ref
  ) => {
    const switchId = id || `switch-${React.useId()}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'text-sm font-medium cursor-pointer select-none',
                error ? 'text-destructive' : 'text-foreground',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={cn(
                'text-sm text-muted-foreground mt-1',
                disabled && 'opacity-50'
              )}
            >
              {description}
            </p>
          )}
          {error && (
            <p
              id={`${switchId}-error`}
              className="mt-1 text-sm text-destructive"
            >
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <input
            id={switchId}
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            disabled={disabled}
            checked={checked}
            onChange={handleChange}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${switchId}-error` : undefined}
            {...props}
          />
          <motion.div
            className={cn(
              'relative h-6 w-11 rounded-full transition-all duration-200',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
              error
                ? 'bg-destructive/20'
                : checked
                ? 'bg-primary'
                : 'bg-input',
              disabled && 'cursor-not-allowed opacity-50',
              !disabled && 'cursor-pointer',
              className
            )}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            <motion.div
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-md',
                'transition-all duration-200'
              )}
              animate={{
                x: checked ? 20 : 2,
              }}
              transition={{
                type: 'spring',
                stiffness: 700,
                damping: 30,
              }}
            />
          </motion.div>
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
