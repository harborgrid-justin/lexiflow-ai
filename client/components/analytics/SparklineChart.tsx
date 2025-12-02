/**
 * SparklineChart Component
 * Compact inline chart for showing trends in metric cards
 */

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = '#3b82f6',
  height = 40,
  className = '',
}) => {
  // Transform data into format Recharts expects
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
