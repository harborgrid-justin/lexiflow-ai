
import React from 'react';
import { Case, CaseStatus } from '../../types';
import { Filter, Briefcase, RefreshCcw, ChevronRight, User, DollarSign } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

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
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 ml-1"/>
          <select className="text-sm border-none bg-transparent outline-none text-slate-700 font-medium cursor-pointer hover:text-blue-600" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="hidden sm:block h-4 w-px bg-slate-300 mx-2"></div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Briefcase className="h-4 w-4 text-slate-400"/>
          <select className="text-sm border-none bg-transparent outline-none text-slate-700 font-medium cursor-pointer hover:text-blue-600" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Litigation">Litigation</option>
            <option value="M&A">M&A</option>
            <option value="IP">IP</option>
            <option value="Real Estate">Real Estate</option>
          </select>
        </div>

        <div className="flex-1"></div>
        <Button variant="ghost" size="sm" icon={RefreshCcw} onClick={resetFilters} className="text-slate-400 hover:text-slate-600">Reset</Button>
      </div>

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
                <TableCell><span className="font-mono text-slate-700">${c.value.toLocaleString()}</span></TableCell>
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
                <DollarSign className="h-3 w-3 mr-1 text-green-600"/> {c.value.toLocaleString()}
              </div>
              <Button size="sm" variant="ghost" className="text-blue-600">Open <ChevronRight className="h-3 w-3 ml-1"/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
