import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavigationProps {
  items: NavigationItem[];
  activeItem: string;
  onItemChange: (itemId: string) => void;
  className?: string;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  items,
  activeItem,
  onItemChange,
  className = ''
}) => {
  return (
    <div className={`w-full md:w-64 flex flex-col space-y-2 shrink-0 ${className}`}>
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`p-3 rounded-lg text-left font-medium flex items-center transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Icon className="h-4 w-4 mr-3" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};