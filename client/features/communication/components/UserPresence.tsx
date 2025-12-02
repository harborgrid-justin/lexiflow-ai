/**
 * UserPresence Component
 *
 * Displays user online/offline status indicator
 */

import React from 'react';

interface UserPresenceProps {
  status: 'online' | 'away' | 'busy' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    color: 'bg-green-500',
    label: 'Online',
  },
  away: {
    color: 'bg-yellow-500',
    label: 'Away',
  },
  busy: {
    color: 'bg-red-500',
    label: 'Busy',
  },
  offline: {
    color: 'bg-slate-400',
    label: 'Offline',
  },
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const UserPresence: React.FC<UserPresenceProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`${sizeClass} rounded-full ${config.color} ${status === 'online' ? 'animate-pulse' : ''}`}
        title={config.label}
        aria-label={`Status: ${config.label}`}
      />
      {showLabel && (
        <span className="text-xs text-slate-600">
          {config.label}
        </span>
      )}
    </div>
  );
};

interface UserPresenceBadgeProps {
  status: 'online' | 'away' | 'busy' | 'offline';
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  size?: 'sm' | 'md';
}

/**
 * User Presence Badge
 *
 * Absolutely positioned presence indicator for avatars
 */
export const UserPresenceBadge: React.FC<UserPresenceBadgeProps> = ({
  status,
  position = 'bottom-right',
  size = 'md',
}) => {
  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'bottom-right': 'bottom-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-left': 'bottom-0 left-0',
  };

  return (
    <span
      className={`absolute ${positionClasses[position]} ${sizeClass} rounded-full ${config.color} ring-2 ring-white ${
        status === 'online' ? 'animate-pulse' : ''
      }`}
      title={config.label}
      aria-label={`Status: ${config.label}`}
    />
  );
};
