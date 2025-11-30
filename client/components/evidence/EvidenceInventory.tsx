import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Search, Plus, Box, Activity, FileText, Fingerprint, Filter, X } from 'lucide-react';
import { EvidenceItem } from '../../types';
import { EvidenceFilters } from '../../hooks/useEvidenceVault';

interface EvidenceInventoryProps {
  items: EvidenceItem[];
  filteredItems: EvidenceItem[];
  filters: EvidenceFilters;
  setFilters: React.Dispatch<React.SetStateAction<EvidenceFilters>>;
  onItemClick: (item: EvidenceItem) => void;
  onIntakeClick: () => void;
}

export const EvidenceInventory: React.FC<EvidenceInventoryProps> = ({ 
  items, filteredItems, filters, setFilters, onItemClick, onIntakeClick 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'Physical': return <Box className="h-5 w-5 text-amber-600"/>;
          case 'Digital': return <Activity className="h-5 w-5 text-blue-600"/>;
          case 'Document': return <FileText className="h-5 w-5 text-slate-600"/>;
          default: return <Fingerprint className="h-5 w-5 text-purple-600"/>;
      }
  };

  const handleFilterChange = (key: keyof EvidenceFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '', type: '', admissibility: '', caseId: '', custodian: '',
      dateFrom: '', dateTo: '', location: '', tags: '', collectedBy: '', hasBlockchain: false
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Evidence Vault</h2>
          <p className="text-slate-500 mt-1">Master Index & Chain of Custody Management</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" icon={Filter} onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button variant="primary" icon={Plus} onClick={onIntakeClick}>Log New Item</Button>
        </div>
      </div>

      {showFilters && (
        <Card className="bg-slate-50 border-blue-100">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-700">Advanced Filtering</h4>
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {/* 1. Search */}
                <input className="p-2 border rounded text-sm" placeholder="Search Title/Desc" value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                {/* 2. Type */}
                <select className="p-2 border rounded text-sm" value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Physical">Physical</option>
                    <option value="Digital">Digital</option>
                    <option value="Document">Document</option>
                    <option value="Forensic">Forensic</option>
                </select>
                {/* 3. Admissibility */}
                <select className="p-2 border rounded text-sm" value={filters.admissibility} onChange={e => handleFilterChange('admissibility', e.target.value)}>
                    <option value="">Any Admissibility</option>
                    <option value="Admissible">Admissible</option>
                    <option value="Challenged">Challenged</option>
                    <option value="Pending">Pending</option>
                </select>
                {/* 4. Case ID */}
                <input className="p-2 border rounded text-sm" placeholder="Case ID" value={filters.caseId} onChange={e => handleFilterChange('caseId', e.target.value)} />
                {/* 5. Custodian */}
                <input className="p-2 border rounded text-sm" placeholder="Custodian" value={filters.custodian} onChange={e => handleFilterChange('custodian', e.target.value)} />
                
                {/* 6. Date From */}
                <input type="date" className="p-2 border rounded text-sm" placeholder="Collected From" value={filters.dateFrom} onChange={e => handleFilterChange('dateFrom', e.target.value)} />
                {/* 7. Date To */}
                <input type="date" className="p-2 border rounded text-sm" placeholder="Collected To" value={filters.dateTo} onChange={e => handleFilterChange('dateTo', e.target.value)} />
                
                {/* 8. Location */}
                <input className="p-2 border rounded text-sm" placeholder="Storage Location" value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} />
                {/* 9. Tags */}
                <input className="p-2 border rounded text-sm" placeholder="Filter by Tag" value={filters.tags} onChange={e => handleFilterChange('tags', e.target.value)} />
                {/* 10. Collected By */}
                <input className="p-2 border rounded text-sm" placeholder="Collected By" value={filters.collectedBy} onChange={e => handleFilterChange('collectedBy', e.target.value)} />
            </div>
            <div className="mt-4 flex items-center">
                 {/* 11. Blockchain (Bonus filter) */}
                <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded text-blue-600" checked={filters.hasBlockchain} onChange={e => handleFilterChange('hasBlockchain', e.target.checked)} />
                    Blockchain Verified Only
                </label>
            </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card noPadding className="border-l-4 border-l-blue-500">
            <div className="p-4">
                <p className="text-xs font-bold text-slate-500 uppercase">Filtered Items</p>
                <p className="text-2xl font-bold text-slate-900">{filteredItems.length}</p>
            </div>
        </Card>
        {/* Statistics could be dynamic based on filtered items */}
        <Card noPadding className="border-l-4 border-l-amber-500">
            <div className="p-4">
                <p className="text-xs font-bold text-slate-500 uppercase">Challenged (Visible)</p>
                <p className="text-2xl font-bold text-slate-900">{filteredItems.filter(e => e.admissibility === 'Challenged').length}</p>
            </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-green-500">
            <div className="p-4">
                <p className="text-xs font-bold text-slate-500 uppercase">Secure Storage</p>
                <p className="text-2xl font-bold text-slate-900">100%</p>
            </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-purple-500">
            <div className="p-4">
                <p className="text-xs font-bold text-slate-500 uppercase">Digital Assets</p>
                <p className="text-2xl font-bold text-slate-900">{filteredItems.filter(e => e.type === 'Digital').length}</p>
            </div>
        </Card>
      </div>

      <TableContainer>
          <TableHeader>
              <TableHead>Evidence ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Custodian</TableHead>
              <TableHead>Collection Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
          </TableHeader>
          <TableBody>
            {filteredItems.map(item => (
                <TableRow key={item.id} onClick={() => onItemClick(item)} className="cursor-pointer group">
                    <TableCell className="font-mono font-medium text-slate-600">{item.id}</TableCell>
                    <TableCell>
                        <div className="flex items-center">
                            <div className="mr-3 p-1.5 bg-slate-100 rounded border border-slate-200">{getTypeIcon(item.type)}</div>
                            <div>
                                <div className="font-medium text-slate-900">{item.title}</div>
                                <div className="text-xs text-slate-500 truncate max-w-xs">{item.description}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell><span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">{item.type}</span></TableCell>
                    <TableCell>{item.custodian}</TableCell>
                    <TableCell>{item.collectionDate}</TableCell>
                    <TableCell>
                        <Badge variant={item.admissibility === 'Admissible' ? 'success' : item.admissibility === 'Challenged' ? 'warning' : 'neutral'}>
                            {item.admissibility}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">Manage</Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
      </TableContainer>
    </div>
  );
};