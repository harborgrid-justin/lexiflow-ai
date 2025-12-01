
import React, { useState, useEffect } from 'react';
import { Clause } from '../types';
import { ApiService } from '../services/apiService';
import { Search, BarChart2, ShieldAlert, FileText, History } from 'lucide-react';
import { ClauseHistoryModal } from './ClauseHistoryModal';
import { PageHeader } from './common/PageHeader';
import { Card } from './common/Card';

export const ClauseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);

  useEffect(() => {
    const fetchClauses = async () => {
        try {
            const data = await ApiService.getClauses();
            setClauses(data);
        } catch (e) {
            console.error("Failed to fetch clauses", e);
        }
    };
    fetchClauses();
  }, []);

  const filtered = clauses.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.category || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {selectedClause && (
        <ClauseHistoryModal clause={selectedClause} onClose={() => setSelectedClause(null)} />
      )}

      <PageHeader 
        title="Clause Library"
        subtitle="Manage standard clauses, track versions, and monitor usage statistics."
      />

      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search clauses by name or category..."
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(clause => (
          <Card key={clause.id} noPadding className="flex flex-col hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-lg">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{clause.category}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{clause.name}</h3>
              </div>
              {clause.riskRating === 'High' && (
                <div title="High Risk">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            <div className="p-4 flex-1">
              <p className="text-sm text-slate-600 line-clamp-3 font-serif bg-slate-50 p-3 rounded italic border border-slate-100 mb-4">
                "{clause.content}"
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                <div className="flex items-center"><FileText className="h-3 w-3 mr-1"/> Ver: {clause.version}</div>
                <div className="flex items-center"><BarChart2 className="h-3 w-3 mr-1"/> Used: {clause.usageCount}x</div>
                <div className="col-span-2">Updated: {clause.lastUpdated}</div>
              </div>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-end">
              <button 
                onClick={() => setSelectedClause(clause)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
              >
                <History className="h-3 w-3 mr-1"/> View History
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
