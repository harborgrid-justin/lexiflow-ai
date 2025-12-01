import React from 'react';
import { BADGE_VARIANTS } from '../../constants/design-tokens';

type BadgeVariant = keyof typeof BADGE_VARIANTS;

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant, 
  children, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  };
  
  const baseClasses = BADGE_VARIANTS[variant] || BADGE_VARIANTS.info;
  
  return (
    <span className={`inline-flex items-center font-bold rounded-full ${sizeClasses[size]} ${baseClasses} ${className}`}>
      {children}
    </span>
  );
};
