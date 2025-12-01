import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../common/Table';
import { Badge } from '../../common/Badge';

type Category = 'users' | 'cases' | 'clients' | 'clauses' | 'documents';

interface EntityTableProps {
  items: any[];
  activeCategory: Category;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const renderCategoryCells = (category: Category, item: any) => {
  switch (category) {
    case 'users':
      return (
        <>
          <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
          <TableCell>
            <Badge variant="neutral">{item.role}</Badge>
          </TableCell>
          <TableCell>{item.office}</TableCell>
        </>
      );
    case 'cases':
      return (
        <>
          <TableCell className="font-medium text-slate-900 max-w-xs truncate">{item.title}</TableCell>
          <TableCell>{item.client}</TableCell>
          <TableCell>
            <Badge variant="info">{item.status}</Badge>
          </TableCell>
          <TableCell className="font-mono">${item.value?.toLocaleString()}</TableCell>
        </>
      );
    case 'clients':
      return (
        <>
          <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
          <TableCell>{item.industry}</TableCell>
          <TableCell>
            <Badge variant={item.status === 'Active' ? 'success' : 'neutral'}>{item.status}</Badge>
          </TableCell>
        </>
      );
    case 'clauses':
      return (
        <>
          <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
          <TableCell>{item.category}</TableCell>
          <TableCell>
            <Badge variant={item.riskRating === 'High' ? 'error' : 'success'}>{item.riskRating}</Badge>
          </TableCell>
        </>
      );
    case 'documents':
    default:
      return (
        <>
          <TableCell className="font-medium text-slate-900 max-w-xs truncate">{item.title}</TableCell>
          <TableCell>{item.type}</TableCell>
          <TableCell>{item.uploadDate}</TableCell>
        </>
      );
  }
};

export const EntityTable: React.FC<EntityTableProps> = ({ items, activeCategory, onEdit, onDelete }) => (
  <div className="hidden md:block">
    <TableContainer>
      <TableHeader>
        <TableHead>ID</TableHead>
        {activeCategory === 'users' && (
          <>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Office</TableHead>
          </>
        )}
        {activeCategory === 'cases' && (
          <>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Value</TableHead>
          </>
        )}
        {activeCategory === 'clients' && (
          <>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
          </>
        )}
        {activeCategory === 'clauses' && (
          <>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Risk</TableHead>
          </>
        )}
        {activeCategory === 'documents' && (
          <>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
          </>
        )}
        <TableHead className="text-right">Actions</TableHead>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono text-xs text-slate-500">{item.id}</TableCell>
            {renderCategoryCells(activeCategory, item)}
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-slate-400 italic">
              No records found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableContainer>
  </div>
);
