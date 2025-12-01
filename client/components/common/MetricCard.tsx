import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: 'blue' | 'green' | 'red' | 'amber' | 'slate';
  className?: string;
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: 'text-green-600'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: 'text-red-600'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    icon: 'text-amber-600'
  },
  slate: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    icon: 'text-slate-600'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className = ''
}) => {
  const config = colorConfig[color];

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        <div className={`p-3 rounded-lg ${config.bg}`}>
          {Icon && <Icon className={`h-6 w-6 ${config.icon}`} />}
        </div>
      </div>

      {trend && (
        <div className="flex items-center mt-4">
          <div className={`flex items-center text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
          {trend.label && (
            <span className="text-xs text-slate-500 ml-2">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Compact version for smaller spaces
export const CompactMetricCard: React.FC<Omit<MetricCardProps, 'subtitle' | 'trend'>> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  className = ''
}) => {
  const config = colorConfig[color];

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          {Icon && <Icon className={`h-5 w-5 ${config.icon}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-600 truncate">{title}</p>
          <p className="text-lg font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
};