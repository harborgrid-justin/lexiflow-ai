import React from 'react';
import { Database } from 'lucide-react';

type Category = 'users' | 'cases' | 'clients' | 'clauses' | 'documents';

interface CategoryOption {
  id: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface EntitySidebarProps {
  categories: CategoryOption[];
  activeCategory: Category;
  data: Record<Category, any[]>;
  onSelect: (category: Category) => void;
}

export const EntitySidebar: React.FC<EntitySidebarProps> = ({
  categories,
  activeCategory,
  data,
  onSelect,
}) => (
  <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
    <div className="p-4 border-b border-slate-100 hidden md:block">
      <h3 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-wide">
        <Database className="h-4 w-4 mr-2 text-blue-600" /> Data Entities
      </h3>
    </div>
    <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 space-x-2 md:space-x-0 md:space-y-1">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const count = data[cat.id]?.length || 0;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 w-auto md:w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <div className="flex items-center">
              <Icon
                className={`h-4 w-4 mr-2 md:mr-3 ${
                  activeCategory === cat.id ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              {cat.label}
            </div>
            <span className="hidden md:inline-block bg-white text-slate-500 px-2 py-0.5 rounded-full text-xs border border-slate-100 shadow-sm">
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  </div>
);
