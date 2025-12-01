import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'slate' | 'blue' | 'green' | 'purple' | 'amber' | 'rose';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  size = 'md', 
  color = 'blue',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  const colorClasses = {
    slate: 'bg-slate-600 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    purple: 'bg-purple-600 text-white',
    amber: 'bg-amber-600 text-white',
    rose: 'bg-rose-600 text-white',
  };
  
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };
  
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        font-semibold 
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
};
