/**
 * Case Status Badge Component
 * Visual indicator for case status with appropriate colors
 */

import React from 'react';
import { CaseStatusType } from '../api/cases.types';

interface CaseStatusBadgeProps {
  status: CaseStatusType | string;
  size?: 'sm' | 'md';
  className?: string;
}

// Map case statuses to visual styles
const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Discovery: 'bg-blue-100 text-blue-700 border-blue-200',
  Trial: 'bg-purple-100 text-purple-700 border-purple-200',
  Settled: 'bg-teal-100 text-teal-700 border-teal-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
  Archived: 'bg-slate-200 text-slate-500 border-slate-300',
  Appeal: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'On Hold': 'bg-orange-100 text-orange-700 border-orange-200',
};

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const statusClass = STATUS_STYLES[status] || STATUS_STYLES.Active;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClasses[size]} ${statusClass} ${className}`}
    >
      {status}
    </span>
  );
};
