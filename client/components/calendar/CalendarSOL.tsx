
import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, MapPin } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { ApiService } from '../../services/apiService';
import { Badge } from '../common/Badge';

interface SOLData {
  date: string;
  matter: string;
  cause: string;
  jurisdiction: string;
  daysLeft: number;
  critical: boolean;
}

export const CalendarSOL: React.FC = () => {
  const [solData, setSolData] = useState<SOLData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSOL = async () => {
      try {
        const data = await ApiService.getCalendarSOL();
        setSolData(data || []);
      } catch (error) {
        console.error('Failed to fetch SOL data:', error);
        setSolData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSOL();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-slate-500">Loading SOL data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-red-600 mx-auto mb-3"/>
        <h3 className="text-lg font-bold text-red-900">Statute of Limitations Watch</h3>
        <p className="text-red-700 max-w-lg mx-auto text-sm">Critical dates for filing complaints. Missing these dates will result in malpractice liability. Dates are calculated based on cause of action and jurisdiction.</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <TableContainer>
            <TableHeader>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Potential Matter</TableHead>
            <TableHead>Cause of Action</TableHead>
            <TableHead>Jurisdiction</TableHead>
            <TableHead>Days Left</TableHead>
            </TableHeader>
            <TableBody>
            {solData.map((row, i) => (
                <TableRow key={i} className={row.critical ? 'bg-red-50/50' : ''}>
                    <TableCell className={`font-bold ${row.critical ? 'text-red-700' : 'text-slate-700'}`}>{row.date}</TableCell>
                    <TableCell className="font-medium text-slate-900">{row.matter}</TableCell>
                    <TableCell>{row.cause}</TableCell>
                    <TableCell>{row.jurisdiction}</TableCell>
                    <TableCell>
                        <span className={`${row.critical ? 'text-red-600 font-bold' : 'text-slate-500'} flex items-center`}>
                            {row.critical && <AlertTriangle className="h-3 w-3 mr-1"/>}
                            {row.daysLeft} Days
                        </span>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </TableContainer>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {solData.map((row, i) => (
            <div key={i} className={`p-4 rounded-lg border shadow-sm ${row.critical ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-lg font-bold ${row.critical ? 'text-red-700' : 'text-slate-700'}`}>{row.date}</span>
                    <Badge variant={row.critical ? 'error' : 'inactive'} size="sm">
                        {row.daysLeft} Days Left
                    </Badge>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{row.matter}</h4>
                <p className="text-xs text-slate-600 mb-3">{row.cause}</p>
                <div className="flex items-center text-xs text-slate-500 border-t pt-2 border-slate-200/50">
                    <MapPin className="h-3 w-3 mr-1"/> {row.jurisdiction}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
