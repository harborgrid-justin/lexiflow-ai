/**
 * BarChart Component
 * Bar chart for categorical data visualization
 */

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: any[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  horizontal?: boolean;
  stacked?: boolean;
  formatValue?: (value: number) => string;
  colors?: string[];
}

const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#f43f5e',
];

const CustomTooltip = ({ active, payload, label, formatValue }: any) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
      <p className="font-medium text-slate-900 mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-medium text-slate-900">
            {formatValue ? formatValue(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  horizontal = false,
  stacked = false,
  formatValue,
  colors = COLORS,
}) => {

  const ChartComponent = (
    <RechartsBarChart
      data={data}
      layout={horizontal ? 'vertical' : 'horizontal'}
      margin={{ top: 10, right: 30, left: horizontal ? 60 : 0, bottom: 0 }}
    >
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
      {horizontal ? (
        <>
          <XAxis
            type="number"
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={formatValue}
          />
          <YAxis
            type="category"
            dataKey={xAxisKey}
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
        </>
      ) : (
        <>
          <XAxis
            dataKey={xAxisKey}
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={formatValue}
          />
        </>
      )}
      <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
      {showLegend && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
      {dataKeys.map((item, index) => (
        <Bar
          key={item.key}
          dataKey={item.key}
          name={item.name || item.key}
          fill={item.color}
          stackId={stacked ? '1' : undefined}
          animationDuration={500}
          radius={[4, 4, 0, 0]}
        >
          {!stacked &&
            dataKeys.length === 1 &&
            data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
        </Bar>
      ))}
    </RechartsBarChart>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      {ChartComponent}
    </ResponsiveContainer>
  );
};
