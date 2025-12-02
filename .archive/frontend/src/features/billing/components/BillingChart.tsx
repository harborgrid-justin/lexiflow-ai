// Billing Chart - Simple chart component for billing metrics
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BillingChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie';
  className?: string;
}

export const BillingChart: React.FC<BillingChartProps> = ({
  title,
  data,
  type = 'bar',
  className = '',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  if (type === 'bar') {
    return (
      <div className={`bg-white border border-slate-200 rounded-lg p-5 ${className}`}>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            const color = item.color || 'bg-blue-500';

            return (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">{item.label}</span>
                  <span className="text-slate-900 font-bold">{item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className={`bg-white border border-slate-200 rounded-lg p-5 ${className}`}>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;

            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-500">
                    ({item.value.toLocaleString()})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Line chart (simplified)
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-5 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const prevValue = index > 0 ? data[index - 1].value : item.value;
          const change = item.value - prevValue;
          const changePercent =
            prevValue > 0 ? ((change / prevValue) * 100).toFixed(1) : '0';

          return (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {item.value.toLocaleString()}
                </span>
                {index > 0 && (
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{changePercent}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
