
import React from 'react';
import { Filter, Layers, CheckSquare } from 'lucide-react';

interface DocumentFiltersProps {
  activeModuleFilter: string;
  setActiveModuleFilter: (filter: string) => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({ activeModuleFilter, setActiveModuleFilter }) => {
  return (
    <div className="w-full lg:w-64 bg-white rounded-lg border border-slate-200 p-4 h-fit">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Filter className="h-4 w-4 mr-2"/> Source Module</h3>
        <div className="space-y-1">
            {['All', 'General', 'Evidence', 'Discovery', 'Billing'].map(mod => (
                <button 
                key={mod}
                onClick={() => setActiveModuleFilter(mod)}
                className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${activeModuleFilter === mod ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    {mod}
                </button>
            ))}
        </div>

        <h3 className="font-bold text-slate-800 mt-6 mb-4 flex items-center"><Layers className="h-4 w-4 mr-2"/> Smart Categories</h3>
            <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-600"><CheckSquare className="h-3 w-3 mr-2"/> Contracts</div>
            <div className="flex items-center text-sm text-slate-600"><CheckSquare className="h-3 w-3 mr-2"/> Pleadings</div>
            <div className="flex items-center text-sm text-slate-600"><CheckSquare className="h-3 w-3 mr-2"/> Correspondence</div>
        </div>
    </div>
  );
};
