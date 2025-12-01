import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '../../common/Button';

interface EntityToolbarProps {
  searchTerm: string;
  placeholder: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
}

export const EntityToolbar: React.FC<EntityToolbarProps> = ({
  searchTerm,
  placeholder,
  onSearchChange,
  onCreate,
}) => (
  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
    <div className="relative flex-1 md:max-w-xs mr-2">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <Button variant="primary" size="sm" icon={Plus} onClick={onCreate} className="whitespace-nowrap">
      Add New
    </Button>
  </div>
);
