import React from 'react';
import { Badge } from './Badge';

type StatusVariant = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'active' | 'inactive';

interface StatusIndicatorProps {
  status: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

const statusConfig = {
  success: { color: 'text-green-600', bg: 'bg-green-100', label: 'Success' },
  error: { color: 'text-red-600', bg: 'bg-red-100', label: 'Error' },
  warning: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Warning' },
  info: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Info' },
  pending: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
  active: { color: 'text-green-600', bg: 'bg-green-100', label: 'Active' },
  inactive: { color: 'text-slate-600', bg: 'bg-slate-100', label: 'Inactive' }
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  variant,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  // Auto-detect variant from status text if not provided
  const detectedVariant = variant || (status.toLowerCase().includes('success') || status.toLowerCase().includes('completed') ? 'success' :
    status.toLowerCase().includes('error') || status.toLowerCase().includes('failed') ? 'error' :
    status.toLowerCase().includes('warning') || status.toLowerCase().includes('pending') ? 'warning' :
    status.toLowerCase().includes('active') ? 'active' :
    status.toLowerCase().includes('inactive') ? 'inactive' : 'info') as StatusVariant;

  const config = statusConfig[detectedVariant];
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showDot && (
        <div className={`rounded-full ${dotSize} ${config.bg} flex items-center justify-center`}>
          <div className={`rounded-full ${size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${config.color.replace('text-', 'bg-')}`} />
        </div>
      )}
      <span className={`text-sm font-medium ${config.color}`}>
        {status}
      </span>
    </div>
  );
};

// StatusBadge component using the existing Badge component
export const StatusBadge: React.FC<StatusIndicatorProps> = ({
  status,
  variant,
  className = ''
}) => {
  const detectedVariant = variant || (status.toLowerCase().includes('success') || status.toLowerCase().includes('completed') ? 'success' :
    status.toLowerCase().includes('error') || status.toLowerCase().includes('failed') ? 'error' :
    status.toLowerCase().includes('warning') || status.toLowerCase().includes('pending') ? 'warning' :
    status.toLowerCase().includes('active') ? 'active' :
    status.toLowerCase().includes('inactive') ? 'inactive' : 'info');

  return (
    <Badge variant={detectedVariant} className={className}>
      {status}
    </Badge>
  );
};