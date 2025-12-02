/**
 * DateRangeFilter Component
 * Date range picker with presets
 */

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { DateRange } from '../../types/analytics';

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: 'last-7-days' },
  { label: 'Last 30 Days', value: 'last-30-days' },
  { label: 'This Month', value: 'this-month' },
  { label: 'Last Month', value: 'last-month' },
  { label: 'This Quarter', value: 'this-quarter' },
  { label: 'Last Quarter', value: 'last-quarter' },
  { label: 'This Year', value: 'this-year' },
  { label: 'Last Year', value: 'last-year' },
  { label: 'Custom', value: 'custom' },
] as const;

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [showCustom, setShowCustom] = useState(value.preset === 'custom');

  const getDateRange = (preset: string): DateRange => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (preset) {
      case 'today':
        return { start: today.toISOString().split('T')[0], end: today.toISOString().split('T')[0], preset: 'today' };
      case 'yesterday':
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0], preset: 'yesterday' };
      case 'last-7-days':
        start.setDate(today.getDate() - 7);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0], preset: 'last-7-days' };
      case 'last-30-days':
        start.setDate(today.getDate() - 30);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0], preset: 'last-30-days' };
      case 'this-month':
        start.setDate(1);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0], preset: 'this-month' };
      case 'last-month':
        start.setMonth(today.getMonth() - 1, 1);
        end.setMonth(today.getMonth(), 0);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0], preset: 'last-month' };
      case 'this-quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0], preset: 'this-quarter' };
      case 'last-quarter':
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
        start.setMonth(lastQuarter * 3, 1);
        end.setMonth((lastQuarter + 1) * 3, 0);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0], preset: 'last-quarter' };
      case 'this-year':
        start.setMonth(0, 1);
        return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0], preset: 'this-year' };
      case 'last-year':
        start.setFullYear(today.getFullYear() - 1, 0, 1);
        end.setFullYear(today.getFullYear() - 1, 11, 31);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0], preset: 'last-year' };
      default:
        return value;
    }
  };

  const handlePresetChange = (preset: string) => {
    if (preset === 'custom') {
      setShowCustom(true);
      onChange({ ...value, preset: 'custom' });
    } else {
      setShowCustom(false);
      onChange(getDateRange(preset));
    }
  };

  const handleCustomDateChange = (field: 'start' | 'end', date: string) => {
    onChange({
      ...value,
      [field]: date,
      preset: 'custom',
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        <Calendar size={16} className="text-slate-400" />
        <span className="font-medium text-slate-700">Date Range</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetChange(preset.value)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              value.preset === preset.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={value.start}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={value.end}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};
