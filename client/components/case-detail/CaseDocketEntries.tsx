
import React, { useState, useEffect } from 'react';
import { DocketEntry } from '../../types';
import { ApiService } from '../../services/apiService';
import { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Button } from '../common/Button';
import { Plus, ExternalLink, FileText, Calendar, Download, Search } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { SearchInput } from '../common/SearchInput';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CaseDocketEntriesProps {
  caseId: string;
}

export const CaseDocketEntries: React.FC<CaseDocketEntriesProps> = ({ caseId }) => {
  const [entries, setEntries] = useState<DocketEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'number'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchDocketEntries();
  }, [caseId]);

  const fetchDocketEntries = async () => {
    try {
      setLoading(true);
      // This will be implemented in the backend
      const data = await ApiService.getDocketEntries(caseId);
      setEntries(data || []);
    } catch (error) {
      console.error('Failed to fetch docket entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.entryNumber.toString().includes(searchTerm);
      const matchesType = filterType === 'all' || entry.documentType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.dateFiled).getTime();
        const dateB = new Date(b.dateFiled).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' 
          ? a.entryNumber - b.entryNumber 
          : b.entryNumber - a.entryNumber;
      }
    });

  const documentTypes = Array.from(new Set(entries.map(e => e.documentType).filter(Boolean)));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeColor = (type?: string) => {
    if (!type) return 'neutral';
    const lower = type.toLowerCase();
    if (lower.includes('order')) return 'success';
    if (lower.includes('motion')) return 'info';
    if (lower.includes('notice')) return 'warning';
    if (lower.includes('complaint') || lower.includes('petition')) return 'danger';
    return 'neutral';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Docket Entries</h3>
          <p className="text-sm text-slate-500">{entries.length} total entries from PACER/CM-ECF</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => {}}>Add Manual Entry</Button>
      </Card>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search docket text or entry number..."
            />
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'number')}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="number">Sort by Entry #</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white hover:bg-slate-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </Card>

      {/* Docket Entries Table */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto border border-slate-200 rounded-lg shadow-sm bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <TableHeader>
              <TableHead className="w-20">Entry #</TableHead>
              <TableHead className="w-32">Date Filed</TableHead>
              <TableHead>Docket Text</TableHead>
              <TableHead className="w-40">Type</TableHead>
              <TableHead className="w-24 text-center">Pages</TableHead>
              <TableHead className="w-32 text-center">Actions</TableHead>
            </TableHeader>
            <TableBody>
              {filteredEntries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono font-semibold text-blue-600">
                    {entry.entryNumber}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {formatDate(entry.dateFiled)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-900">{entry.text}</p>
                      {entry.clerkInitials && (
                        <p className="text-xs text-slate-400">
                          Clerk: {entry.clerkInitials}
                          {entry.cmecfId && ` • CM/ECF: ${entry.cmecfId}`}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {entry.documentType ? (
                      <Badge variant={getTypeColor(entry.documentType)}>
                        {entry.documentType}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-slate-600">
                    {entry.pages ? (
                      <span className="flex items-center justify-center gap-1">
                        <FileText className="h-3 w-3 text-slate-400" />
                        {entry.pages}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {entry.docLink && (
                        <a
                          href={entry.docLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View in PACER"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {entry.fileSize && (
                        <button
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title={`Download (${entry.fileSize})`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400 italic">
                    {searchTerm || filterType !== 'all' 
                      ? 'No docket entries match your filters.'
                      : 'No docket entries recorded yet. Import from PACER to populate.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {filteredEntries.length > 0 && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex justify-between items-center text-sm shrink-0">
          <div className="text-slate-600">
            Showing {filteredEntries.length} of {entries.length} entries
          </div>
          <div className="flex gap-4 text-slate-500">
            <span>Total Pages: {filteredEntries.reduce((sum, e) => sum + (e.pages || 0), 0)}</span>
            <span>•</span>
            <span>With Documents: {filteredEntries.filter(e => e.docLink).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};
