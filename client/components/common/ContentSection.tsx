import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'card' | 'bordered';
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
  className = '',
  headerClassName = '',
  contentClassName = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: '',
    card: 'bg-white rounded-lg shadow-sm border border-slate-200',
    bordered: 'border border-slate-200 rounded-lg'
  };

  return (
    <section className={`${variantClasses[variant]} ${className}`}>
      {(title || subtitle || actions) && (
        <div className={`flex items-center justify-between ${variant === 'card' ? 'p-6 pb-4 border-b border-slate-100' : 'mb-4'} ${headerClassName}`}>
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-5 w-5 text-slate-500" />}
            <div>
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={`${variant === 'card' ? 'p-6 pt-4' : ''} ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
};