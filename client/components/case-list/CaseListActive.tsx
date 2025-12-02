
import React from 'react';
import { Case, CaseStatus } from '../../types';
import { Filter, Briefcase, ChevronRight, User, DollarSign } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FilterBar, FilterItem } from '../common/FilterBar';

interface CaseListActiveProps {
  filteredCases: Case[];
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  typeFilter: string;
  setTypeFilter: (s: string) => void;
  resetFilters: () => void;
  onSelectCase: (c: Case) => void;
}

export const CaseListActive: React.FC<CaseListActiveProps> = ({
  filteredCases,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  resetFilters,
  onSelectCase
}) => {
  const filterItems: FilterItem[] = [
    {
      id: 'status',
      label: 'Status',
      icon: Filter,
      value: statusFilter,
      options: [
        { value: 'All', label: 'All Statuses' },
        ...Object.values(CaseStatus).map(s => ({ value: s, label: s }))
      ]
    },
    {
      id: 'type',
      label: 'Type',
      icon: Briefcase,
      value: typeFilter,
      options: [
        { value: 'All', label: 'All Types' },
        { value: 'Litigation', label: 'Litigation' },
        { value: 'M&A', label: 'M&A' },
        { value: 'IP', label: 'IP' },
        { value: 'Real Estate', label: 'Real Estate' }
      ]
    }
  ];

  const filterValues = {
    status: statusFilter,
    type: typeFilter
  };

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'status') {
      setStatusFilter(value);
    } else if (filterId === 'type') {
      setTypeFilter(value);
    }
  };

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filterItems}
        values={filterValues}
        onChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <TableContainer>
          <TableHeader>
            <TableHead>Matter</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filteredCases.map((c) => (
              <TableRow key={c.id} onClick={() => onSelectCase(c)} className="cursor-pointer group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{c.title}</span>
                    <span className="text-xs text-slate-500">{c.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral">{c.matterType}</Badge>
                </TableCell>
                <TableCell>{c.client}</TableCell>
                <TableCell><span className="font-mono text-slate-700">${(c.value ?? 0).toLocaleString()}</span></TableCell>
                <TableCell className="text-right">
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredCases.map((c) => (
          <div key={c.id} onClick={() => onSelectCase(c)} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 active:bg-slate-50">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs font-mono text-slate-500">{c.id}</div>
              <Badge variant="neutral">{c.matterType}</Badge>
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight">{c.title}</h4>
            <div className="flex items-center text-sm text-slate-600 mb-3">
              <User className="h-3 w-3 mr-1 text-slate-400"/> {c.client}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="flex items-center font-mono font-medium text-slate-700">
                <DollarSign className="h-3 w-3 mr-1 text-green-600"/> {(c.value ?? 0).toLocaleString()}
              </div>
              <Button size="sm" variant="ghost" className="text-blue-600">Open <ChevronRight className="h-3 w-3 ml-1"/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
