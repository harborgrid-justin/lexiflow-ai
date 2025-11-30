
import React, { useEffect, useState } from 'react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';
import { Search } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { Jurisdiction } from '../../types';

export const JurisdictionState: React.FC = () => {
  const [states, setStates] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ApiService.getJurisdictions('State');
        setStates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-4">Loading state courts...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800">State Court Venues</h3>
        <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
            <input className="w-full pl-9 pr-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search state courts..."/>
        </div>
      </div>

      <TableContainer>
        <TableHeader>
          <TableHead>State</TableHead>
          <TableHead>Court System</TableHead>
          <TableHead>Jurisdiction Level</TableHead>
          <TableHead>e-Filing Policy</TableHead>
          <TableHead>System Provider</TableHead>
        </TableHeader>
        <TableBody>
          {states.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium text-slate-900">{s.metadata.state}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.metadata.level}</TableCell>
              <TableCell>
                <Badge variant={s.metadata.eFiling === 'Required' ? 'error' : 'success'}>{s.metadata.eFiling || 'N/A'}</Badge>
              </TableCell>
              <TableCell className="text-slate-500 text-xs">{s.metadata.system || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
};
