
import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: any) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex space-x-2 bg-white p-1 rounded-lg border border-slate-200 inline-flex ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === tab 
              ? 'bg-blue-50 text-blue-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {tab ? (tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()) : ''}
        </button>
      ))}
    </div>
  );
};
