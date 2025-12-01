import React, { useState } from 'react';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  icon: Icon,
  defaultExpanded = false,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={className}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between text-left ${headerClassName}`}
      >
        <div className="flex items-center text-slate-600">
          {Icon && <Icon className="h-3 w-3 mr-2 text-slate-400" />}
          <span className="text-sm font-medium">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className={`mt-3 pt-3 border-t border-slate-100 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};