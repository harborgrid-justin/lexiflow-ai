/**
 * GaugeChart Component
 * Gauge chart for showing progress/percentage metrics
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  formatValue?: (value: number) => string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  min = 0,
  label,
  height = 200,
  color = '#3b82f6',
  backgroundColor = '#e2e8f0',
  showPercentage = true,
  formatValue,
}) => {
  // Calculate percentage
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Prepare data for semi-circle gauge
  const data = [
    { value: clampedPercentage, fill: color },
    { value: 100 - clampedPercentage, fill: backgroundColor },
  ];

  // Determine color based on value
  const getColor = () => {
    if (clampedPercentage >= 80) return '#10b981'; // green
    if (clampedPercentage >= 60) return '#3b82f6'; // blue
    if (clampedPercentage >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const gaugeColor = color === '#3b82f6' ? getColor() : color;
  data[0].fill = gaugeColor;

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '45%' }}>
        <div className="text-3xl font-bold text-slate-900">
          {formatValue ? formatValue(value) : value}
        </div>
        {showPercentage && (
          <div className="text-sm text-slate-500 mt-1">
            {clampedPercentage.toFixed(1)}%
          </div>
        )}
        {label && (
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};
