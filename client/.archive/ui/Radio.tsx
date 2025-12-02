import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      label,
      description,
      error,
      disabled,
      id,
      checked,
      ...props
    },
    ref
  ) => {
    const radioId = id || `radio-${React.useId()}`;

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              id={radioId}
              ref={ref}
              type="radio"
              className="sr-only peer"
              disabled={disabled}
              checked={checked}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${radioId}-error` : undefined}
              {...props}
            />
            <motion.div
              className={cn(
                'h-5 w-5 rounded-full border-2 transition-all duration-200',
                'flex items-center justify-center',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
                error
                  ? 'border-destructive'
                  : checked
                  ? 'border-primary'
                  : 'border-input',
                disabled && 'cursor-not-allowed opacity-50',
                !disabled && 'cursor-pointer',
                className
              )}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
            >
              {checked && (
                <motion.div
                  className="h-2.5 w-2.5 rounded-full bg-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </motion.div>
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label
                htmlFor={radioId}
                className={cn(
                  'font-medium cursor-pointer select-none',
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
                  'text-muted-foreground',
                  disabled && 'opacity-50'
                )}
              >
                {description}
              </p>
            )}
            {error && (
              <p
                id={`${radioId}-error`}
                className="mt-1 text-destructive"
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export { Radio };
