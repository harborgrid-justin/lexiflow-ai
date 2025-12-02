// Activity Type Select - Dropdown for selecting activity types
import React from 'react';
import { ActivityType, ACTIVITY_TYPE_LABELS } from '../api/billing.types';

interface ActivityTypeSelectProps {
  value: ActivityType;
  onChange: (value: ActivityType) => void;
  className?: string;
}

export const ActivityTypeSelect: React.FC<ActivityTypeSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ActivityType)}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {Object.entries(ACTIVITY_TYPE_LABELS).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
};
