import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      icon,
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors';

    const variants = {
      default: 'bg-muted text-muted-foreground',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      danger: 'bg-destructive text-destructive-foreground',
      outline: 'border border-border bg-background text-foreground',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              variant === 'default' && 'bg-muted-foreground',
              variant === 'primary' && 'bg-primary-foreground',
              variant === 'secondary' && 'bg-secondary-foreground',
              variant === 'success' && 'bg-success-foreground',
              variant === 'warning' && 'bg-warning-foreground',
              variant === 'danger' && 'bg-destructive-foreground',
              variant === 'outline' && 'bg-foreground'
            )}
          />
        )}
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </motion.div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
