
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  title?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, title, action, icon, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {(title || action || icon) && (
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            {icon && <div className="text-slate-500">{icon}</div>}
            {title && <h3 className="font-bold text-slate-900">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};
