import React from 'react';

export interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: 'green' | 'blue' | 'red' | 'purple' | 'amber' | 'slate';
}

const COLOR_CLASSES: Record<MetricCardProps['color'], string> = {
  green: 'bg-green-50 text-green-600 border-green-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  slate: 'bg-slate-50 text-slate-600 border-slate-200',
};

export const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subValue, color }) => (
  <div className={`p-4 rounded-xl border ${COLOR_CLASSES[color]}`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs opacity-75">{subValue}</p>
  </div>
);
