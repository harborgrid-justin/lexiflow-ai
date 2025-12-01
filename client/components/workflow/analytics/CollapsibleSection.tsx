import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../../common/Card';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  badge,
}) => (
  <Card noPadding>
    <button
      type="button"
      onClick={onToggle}
      className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3 text-left">
        {icon}
        <span className="font-semibold text-slate-900">{title}</span>
        {badge}
      </div>
      {isExpanded ? (
        <ChevronUp className="h-5 w-5 text-slate-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-slate-400" />
      )}
    </button>
    {isExpanded && <div className="border-t border-slate-100">{children}</div>}
  </Card>
);
