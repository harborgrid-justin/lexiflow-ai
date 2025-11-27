
import React from 'react';
import { RefreshCcw, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';

export const CaseListDocket: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Upcoming Court Deadlines</h3>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCcw}>Sync with Court</Button>
          <Button variant="primary" size="sm" icon={Plus}>Add Entry</Button>
        </div>
      </div>
      <TableContainer className="rounded-none border-0 shadow-none">
        <TableHeader>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Matter</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Location</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold text-slate-900">Oct 24, 2024</TableCell>
            <TableCell>09:00 AM</TableCell>
            <TableCell className="text-blue-600 font-medium">Martinez v. TechCorp</TableCell>
            <TableCell><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">Hearing</span> Motion to Dismiss</TableCell>
            <TableCell>San Francisco Superior - Dept 504</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold text-slate-900">Nov 01, 2024</TableCell>
            <TableCell>11:59 PM</TableCell>
            <TableCell className="text-blue-600 font-medium">In Re: OmniGlobal</TableCell>
            <TableCell><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">Filing</span> FTC Second Request</TableCell>
            <TableCell>E-Filing</TableCell>
          </TableRow>
        </TableBody>
      </TableContainer>
    </div>
  );
};
