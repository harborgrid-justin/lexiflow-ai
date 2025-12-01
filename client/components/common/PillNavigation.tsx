import React from 'react';

export type PillTab = {
  id: string;
  label: string;
  count?: number;
};

interface PillNavigationProps {
  tabs: PillTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const PillNavigation: React.FC<PillNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onChange,
  className = '' 
}) => {
  return (
    <div className={`flex space-x-1 bg-slate-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'}`}>
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
