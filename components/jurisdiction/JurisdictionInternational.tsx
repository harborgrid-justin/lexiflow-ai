
import React, { useEffect, useState } from 'react';
import { Globe, Plane } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { ApiService } from '../../services/apiService';
import { Jurisdiction } from '../../types';

export const JurisdictionInternational: React.FC = () => {
  const [treaties, setTreaties] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ApiService.getJurisdictions('International');
        setTreaties(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-4">Loading international treaties...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-8 rounded-lg flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold flex items-center"><Globe className="h-6 w-6 mr-3"/> Cross-Border Jurisdiction</h2>
          <p className="text-blue-200 mt-2">Manage international service, discovery (Hague Evidence), and enforcement.</p>
        </div>
        <Plane className="h-16 w-16 text-blue-500 opacity-20"/>
      </div>

      <TableContainer>
        <TableHeader>
          <TableHead>Treaty / Convention</TableHead>
          <TableHead>Subject Matter</TableHead>
          <TableHead>Status (US)</TableHead>
          <TableHead>Signatory Count</TableHead>
        </TableHeader>
        <TableBody>
          {treaties.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-bold text-slate-900">{t.name}</TableCell>
              <TableCell>{t.metadata.subjectMatter}</TableCell>
              <TableCell><span className="text-green-600 font-bold">{t.metadata.status}</span></TableCell>
              <TableCell>{t.metadata.parties}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
};
