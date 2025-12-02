// Hours Summary - Widget showing hours summary
import React from 'react';
import { Clock, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { TimeEntrySummary } from '../api/billing.types';
import { formatHours, formatCurrency } from '../utils/formatters';

interface HoursSummaryProps {
  summary: TimeEntrySummary;
  isLoading?: boolean;
}

export const HoursSummary: React.FC<HoursSummaryProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-5 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const realizationRate =
    summary.totalHours > 0
      ? (summary.billableHours / summary.totalHours) * 100
      : 0;

  const cards = [
    {
      label: 'Total Hours',
      value: formatHours(summary.totalHours),
      icon: Clock,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Billable Hours',
      value: formatHours(summary.billableHours),
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Revenue',
      value: formatCurrency(summary.totalAmount),
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Realization Rate',
      value: `${realizationRate.toFixed(0)}%`,
      icon: Activity,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 ${card.bgColor} rounded-lg`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};
