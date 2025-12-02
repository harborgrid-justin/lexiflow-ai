/**
 * ChartLegend Component
 * Custom legend for charts
 */

import React from 'react';

interface LegendItem {
  name: string;
  color: string;
  value?: string | number;
}

interface ChartLegendProps {
  items: LegendItem[];
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  layout = 'horizontal',
  className = '',
}) => {
  const containerClass =
    layout === 'horizontal'
      ? 'flex items-center flex-wrap gap-4'
      : 'flex flex-col gap-2';

  return (
    <div className={`${containerClass} ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-slate-600">{item.name}</span>
          {item.value !== undefined && (
            <span className="text-sm font-medium text-slate-900">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
