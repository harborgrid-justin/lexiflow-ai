import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from './Badge';

interface DataListItemProps {
  title: string;
  subtitle?: string;
  metadata?: Array<{ label: string; value: string | number; icon?: LucideIcon }>;
  badges?: Array<{ label: string; variant?: string }>;
  actions?: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export const DataListItem: React.FC<DataListItemProps> = ({
  title,
  subtitle,
  metadata = [],
  badges = [],
  actions,
  icon: Icon,
  onClick,
  className = '',
  compact = false
}) => {
  const containerClasses = onClick
    ? 'cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors'
    : '';

  const paddingClasses = compact ? 'p-3' : 'p-4';

  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg shadow-sm ${containerClasses} ${paddingClasses} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />}
            <h4 className="font-semibold text-slate-900 truncate">{title}</h4>
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant as any}>
                {badge.label}
              </Badge>
            ))}
          </div>

          {subtitle && (
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{subtitle}</p>
          )}

          {metadata.length > 0 && (
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              {metadata.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  {item.icon && <item.icon className="h-3 w-3" />}
                  <span className="font-medium">{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};