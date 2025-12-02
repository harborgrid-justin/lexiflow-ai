/**
 * NotificationBadge Component
 *
 * Displays unread count badges for notifications and messages
 */

import React from 'react';

interface NotificationBadgeProps {
  count: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'absolute';
  className?: string;
}

const variantStyles = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-slate-600 text-white',
  danger: 'bg-red-600 text-white',
};

const sizeStyles = {
  sm: 'text-xs min-w-[16px] h-4 px-1',
  md: 'text-xs min-w-[20px] h-5 px-1.5',
  lg: 'text-sm min-w-[24px] h-6 px-2',
};

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  variant = 'danger',
  size = 'md',
  position = 'inline',
  className = '',
}) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  const positionClass = position === 'absolute'
    ? 'absolute -top-1 -right-1'
    : '';

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-full
        ${variantClass}
        ${sizeClass}
        ${positionClass}
        ${className}
      `}
      aria-label={`${count} unread`}
    >
      {displayCount}
    </span>
  );
};

interface UnreadDotProps {
  visible: boolean;
  position?: 'inline' | 'absolute';
  variant?: 'primary' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Simple unread dot indicator (when count is not shown)
 */
export const UnreadDot: React.FC<UnreadDotProps> = ({
  visible,
  position = 'inline',
  variant = 'danger',
  size = 'md',
  className = '',
}) => {
  if (!visible) return null;

  const variantClass = variant === 'danger' ? 'bg-red-600' : 'bg-blue-600';
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  const positionClass = position === 'absolute' ? 'absolute top-0 right-0' : '';

  return (
    <span
      className={`
        rounded-full
        ${variantClass}
        ${sizeClass}
        ${positionClass}
        ${className}
      `}
      aria-label="Unread"
    />
  );
};
