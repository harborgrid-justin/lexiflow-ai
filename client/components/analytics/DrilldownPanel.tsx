/**
 * DrilldownPanel Component
 * Drill down into analytics data
 */

import React from 'react';
import { ChevronRight, X } from 'lucide-react';

interface DrilldownLevel {
  label: string;
  value: string;
}

interface DrilldownPanelProps {
  levels: DrilldownLevel[];
  onLevelClick: (index: number) => void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const DrilldownPanel: React.FC<DrilldownPanelProps> = ({
  levels,
  onLevelClick,
  onClose,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg ${className}`}>
      {/* Breadcrumb navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm">
          {levels.map((level, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight size={14} className="text-slate-400" />}
              <button
                onClick={() => onLevelClick(index)}
                className={`hover:text-blue-600 transition-colors ${
                  index === levels.length - 1
                    ? 'font-medium text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                {level.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          <X size={18} className="text-slate-500" />
        </button>
      </div>

      {/* Drilldown content */}
      <div className="p-6">{children}</div>
    </div>
  );
};
