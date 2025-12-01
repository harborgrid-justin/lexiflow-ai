import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface FilterItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  value: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterItem[];
  values: Record<string, string>;
  onChange: (filterId: string, value: string) => void;
  onReset?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm ${className}`}>
      {filters.map((filter, index) => {
        const Icon = filter.icon;
        return (
          <React.Fragment key={filter.id}>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {Icon && <Icon className="h-4 w-4 text-slate-400 ml-1" />}
              <select
                className="text-sm border-none bg-transparent outline-none text-slate-700 font-medium cursor-pointer hover:text-blue-600"
                value={values[filter.id] || filter.options[0]?.value || ''}
                onChange={(e) => onChange(filter.id, e.target.value)}
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {index < filters.length - 1 && (
              <div className="hidden sm:block h-4 w-px bg-slate-300 mx-2"></div>
            )}
          </React.Fragment>
        );
      })}

      {onReset && (
        <>
          <div className="flex-1"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-400 hover:text-slate-600"
          >
            Reset
          </Button>
        </>
      )}
    </div>
  );
};