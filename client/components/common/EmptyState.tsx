
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'minimal' | 'card' | 'inline';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className = ''
}) => {
  const baseClasses = 'flex flex-col items-center justify-center text-center';
  const variantClasses = {
    default: 'py-12 px-6',
    minimal: 'py-8 px-4',
    card: 'py-10 px-6 bg-white rounded-lg border border-slate-200 border-dashed',
    inline: 'py-6 px-4'
  };

  const iconWrapperClasses = {
    default: 'bg-slate-100 p-4 rounded-full mb-4',
    minimal: 'bg-slate-50 p-3 rounded-full mb-3',
    card: 'mb-4 opacity-60',
    inline: 'bg-slate-50 p-2 rounded-full mb-2'
  };

  const iconClasses = {
    default: 'h-8 w-8 text-slate-400',
    minimal: 'h-6 w-6 text-slate-400',
    card: 'h-12 w-12 text-slate-300',
    inline: 'h-5 w-5 text-slate-400'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {Icon && (
        <div className={iconWrapperClasses[variant]}>
          <Icon className={iconClasses[variant]} />
        </div>
      )}
      <h3 className={`font-medium text-slate-900 mb-1 ${
        variant === 'inline' ? 'text-sm' : 'text-lg'
      }`}>
        {title}
      </h3>
      {description && (
        <p className={`text-slate-500 mb-6 max-w-md ${
          variant === 'inline' ? 'text-xs' : 'text-sm'
        }`}>
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};
