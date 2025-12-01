
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'underline'
}) => {
  if (variant === 'pills') {
    return (
      <div className={`bg-slate-100 p-1 rounded-lg ${className}`}>
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && onTabChange(tab.id)}
                disabled={tab.disabled}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 min-w-fit
                  ${isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 disabled:text-slate-300 disabled:cursor-not-allowed'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {Icon && <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Default underline variant
  return (
    <div className={`border-b border-slate-200 ${className}`}>
      <nav className="flex space-x-2 overflow-x-auto no-scrollbar px-2" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors min-w-fit
                ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 disabled:text-slate-300 disabled:cursor-not-allowed'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {Icon && <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
