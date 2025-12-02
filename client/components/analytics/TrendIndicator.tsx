/**
 * TrendIndicator Component
 * Shows trend direction with arrow and percentage change
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  isPositive?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  isPositive = value > 0,
  showPercentage = true,
  size = 'md',
  className = '',
}) => {
  const direction = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  const absValue = Math.abs(value);

  // Determine color based on isPositive flag
  const colorClass =
    direction === 'flat'
      ? 'text-slate-400'
      : isPositive
      ? 'text-green-600'
      : 'text-red-600';

  const bgColorClass =
    direction === 'flat'
      ? 'bg-slate-100'
      : isPositive
      ? 'bg-green-50'
      : 'bg-red-50';

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const Icon =
    direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full ${bgColorClass} ${colorClass} ${sizeClasses[size]} font-medium ${className}`}
    >
      <Icon size={iconSizes[size]} />
      <span>
        {showPercentage ? `${absValue.toFixed(1)}%` : absValue.toFixed(1)}
      </span>
    </div>
  );
};
