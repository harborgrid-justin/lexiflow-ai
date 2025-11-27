
import React from 'react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';
import { Calendar, AlertCircle } from 'lucide-react';

export const CalendarDeadlines: React.FC = () => {
  const deadlines = [
    { id: 1, date: '2024-03-15', matter: 'Martinez v. TechCorp', event: 'Motion to Dismiss', type: 'Filing', status: 'Pending' },
    { id: 2, date: '2024-03-22', matter: 'OmniGlobal Merger', event: 'Discovery Cutoff', type: 'Cutoff', status: 'Critical' },
    { id: 3, date: '2024-04-01', matter: 'Estate of Smith', event: 'Tax Filing', type: 'Admin', status: 'Done' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5"/>
        <div>
          <h4 className="font-bold text-amber-800 text-sm">Deadline Calculation Rules Active</h4>
          <p className="text-xs text-amber-700">Dates calculated based on FRCP and Local Rules (CA Superior). Weekends/Holidays excluded where applicable.</p>
        </div>
      </div>

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
  );
};
