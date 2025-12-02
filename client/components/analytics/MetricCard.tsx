/**
 * MetricCard Component
 * KPI card with trend indicator and optional sparkline
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendIndicator } from './TrendIndicator';
import { SparklineChart } from './SparklineChart';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  format?: 'number' | 'currency' | 'percentage';
  loading?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  isPositive = true,
  icon: Icon,
  iconColor = '#3b82f6',
  sparklineData,
  sparklineColor,
  format = 'number',
  loading = false,
  className = '',
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-slate-600 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {formatValue(value)}
          </h3>
        </div>
        {Icon && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <Icon size={24} style={{ color: iconColor }} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {change !== undefined && (
            <>
              <TrendIndicator value={change} isPositive={isPositive} size="sm" />
              <span className="text-xs text-slate-500">{changeLabel}</span>
            </>
          )}
        </div>
        {sparklineData && (
          <SparklineChart
            data={sparklineData}
            color={sparklineColor || iconColor}
            height={32}
            className="w-24"
          />
        )}
      </div>
    </div>
  );
};
