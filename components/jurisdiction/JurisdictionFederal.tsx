
import React, { useEffect, useState } from 'react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';
import { ExternalLink } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { Jurisdiction } from '../../types';

export const JurisdictionFederal: React.FC = () => {
  const [courts, setCourts] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ApiService.getJurisdictions('Federal');
        setCourts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-4">Loading federal courts...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 text-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold">Federal Judiciary System</h3>
        <p className="text-slate-400 text-sm mt-1">Access Pacer records, standing orders, and circuit rules.</p>
      </div>

      <TableContainer>
        <TableHeader>
          <TableHead>Court Name</TableHead>
          <TableHead>Circuit / District</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Active Judges</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Rules</TableHead>
        </TableHeader>
        <TableBody>
          {courts.map((court) => (
            <TableRow key={court.id}>
              <TableCell className="font-bold text-slate-900">{court.name}</TableCell>
              <TableCell>{court.metadata.circuit}</TableCell>
              <TableCell><Badge variant="neutral">{court.metadata.courtType}</Badge></TableCell>
              <TableCell>{court.metadata.judges}</TableCell>
              <TableCell>
                <span className={`text-xs font-bold ${court.metadata.status === 'Active' || court.metadata.status === 'Active Session' ? 'text-green-600' : 'text-amber-600'}`}>
                  {court.metadata.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button className="text-blue-600 hover:underline text-xs flex items-center justify-end">
                  View Rules <ExternalLink className="h-3 w-3 ml-1"/>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
};
