
import React, { useEffect, useState } from 'react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { ApiService } from '../../services/apiService';

interface Deadline {
  id: number | string;
  date: string;
  matter: string;
  event: string;
  type: string;
  status: string;
}

export const CalendarDeadlines: React.FC = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const data = await ApiService.getCalendarDeadlines();
        setDeadlines(data);
      } catch (error) {
        console.error('Failed to fetch deadlines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-slate-500">Loading deadlines...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0"/>
        <div>
          <h4 className="font-bold text-amber-800 text-sm">Deadline Calculation Rules Active</h4>
          <p className="text-xs text-amber-700">Dates calculated based on FRCP and Local Rules (CA Superior). Weekends/Holidays excluded where applicable.</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <TableContainer>
            <TableHeader>
            <TableHead>Due Date</TableHead>
            <TableHead>Matter</TableHead>
            <TableHead>Event Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            </TableHeader>
            <TableBody>
            {deadlines.map(d => (
                <TableRow key={d.id}>
                <TableCell className="font-bold text-slate-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400"/> {d.date}
                </TableCell>
                <TableCell className="text-blue-600 font-medium">{d.matter}</TableCell>
                <TableCell>{d.event}</TableCell>
                <TableCell><Badge variant="neutral">{d.type}</Badge></TableCell>
                <TableCell>
                    <Badge variant={d.status === 'Critical' ? 'error' : d.status === 'Done' ? 'success' : 'warning'}>
                    {d.status}
                    </Badge>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </TableContainer>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {deadlines.map(d => (
            <div key={d.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                    <span className="flex items-center text-sm font-bold text-slate-900">
                        <Calendar className="h-4 w-4 mr-2 text-slate-500"/> {d.date}
                    </span>
                    <Badge variant={d.status === 'Critical' ? 'error' : d.status === 'Done' ? 'success' : 'warning'}>
                        {d.status}
                    </Badge>
                </div>
                <h4 className="text-sm font-semibold text-blue-600 mb-1">{d.matter}</h4>
                <p className="text-sm text-slate-700 mb-3">{d.event}</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <span className="text-slate-500">Type: <strong>{d.type}</strong></span>
                    {d.status !== 'Done' && <span className="text-slate-400 flex items-center"><Clock className="h-3 w-3 mr-1"/> Pending</span>}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
