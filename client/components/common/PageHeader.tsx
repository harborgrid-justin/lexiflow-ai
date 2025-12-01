
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && (typeof subtitle === 'string' ? <p className="text-slate-500 mt-1">{subtitle}</p> : subtitle)}
      </div>
      {actions && (
        <div className="flex items-center gap-3 w-full md:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
