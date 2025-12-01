
import React from 'react';
import { COLORS } from '../../constants/design-tokens';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-12 w-12 text-xl'
  };

  const safeName = name || '??';
  const initials = safeName.substring(0, 2).toUpperCase();
  const colorVariants = [
    `${COLORS.status.active.bg} ${COLORS.status.active.text}`,
    `${COLORS.status.inactive.bg} ${COLORS.status.inactive.text}`,
    `${COLORS.status.info.bg} ${COLORS.status.info.text}`,
    `${COLORS.status.success.bg} ${COLORS.status.success.text}`
  ];
  const colorClass = colorVariants[safeName.length % colorVariants.length];

  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-bold shrink-0 ${className}`}>
      {initials}
    </div>
  );
};
