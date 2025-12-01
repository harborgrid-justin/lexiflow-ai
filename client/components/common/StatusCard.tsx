import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  status?: StatusType;
  className?: string;
}

const statusStyles = {
  success: 'bg-green-50 border-green-200',
  warning: 'bg-amber-50 border-amber-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  neutral: 'bg-slate-50 border-slate-200'
};

const iconColors = {
  success: 'text-green-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  neutral: 'text-slate-400'
};

const textColors = {
  success: 'text-green-700',
  warning: 'text-amber-700',
  error: 'text-red-700',
  info: 'text-blue-700',
  neutral: 'text-slate-700'
};

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  status = 'neutral',
  className = ''
}) => {
  return (
    <Card className={`${statusStyles[status]} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-600 mt-1">{title}</p>
          {subtitle && (
            <p className={`text-xs mt-2 ${textColors[status]}`}>{subtitle}</p>
          )}
        </div>
        {Icon && (
          <Icon className={`h-12 w-12 ${iconColors[status]} opacity-50`} />
        )}
      </div>
    </Card>
  );
};