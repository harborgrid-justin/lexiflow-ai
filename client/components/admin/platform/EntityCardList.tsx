import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface EntityCardListProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export const EntityCardList: React.FC<EntityCardListProps> = ({ items, onEdit, onDelete }) => (
  <div className="md:hidden space-y-3 p-4">
    {items.map((item) => (
      <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono text-slate-500">{item.id}</span>
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="text-blue-600">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(item.id)} className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <h4 className="font-bold text-slate-900 text-sm mb-2">{item.name || item.title}</h4>
        <div className="text-xs text-slate-600 space-y-1">
          {Object.entries(item)
            .filter(([key]) => !['name', 'title', 'id'].includes(key))
            .slice(0, 3)
            .map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-slate-400">{key}:</span>
                <span className="font-medium truncate max-w-[150px]">{String(value)}</span>
              </div>
            ))}
        </div>
      </div>
    ))}
    {items.length === 0 && (
      <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-lg">No records found.</div>
    )}
  </div>
);
