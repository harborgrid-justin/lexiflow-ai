import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'slate' | 'white';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = '',
  message
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    slate: 'border-slate-600',
    white: 'border-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`inline-block animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {message && (
        <p className={`mt-2 text-sm text-slate-600 ${size === 'sm' ? 'text-xs' : ''}`}>
          {message}
        </p>
      )}
    </div>
  );
};

// LoadingFallback component for Suspense boundaries
export const LoadingFallback: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading...',
  className = ''
}) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <LoadingSpinner message={message} />
  </div>
);