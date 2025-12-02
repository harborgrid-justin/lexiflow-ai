/**
 * PriorityBadge Component
 * Visual indicator for task priority levels
 */

import React from 'react';
import { TaskPriority } from '../types';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const priorityConfig = {
  Critical: {
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: '🔴',
    label: 'Critical',
  },
  High: {
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: '🟠',
    label: 'High',
  },
  Medium: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '🟡',
    label: 'Medium',
  },
  Low: {
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: '🟢',
    label: 'Low',
  },
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.color} ${sizeClasses[size]} ${className}`}
      title={`Priority: ${config.label}`}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
