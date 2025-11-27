
import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';

export const CalendarSOL: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-red-600 mx-auto mb-3"/>
        <h3 className="text-lg font-bold text-red-900">Statute of Limitations Watch</h3>
        <p className="text-red-700 max-w-lg mx-auto">Critical dates for filing complaints. Missing these dates will result in malpractice liability. Dates are calculated based on cause of action and jurisdiction.</p>
      </div>

      <TableContainer>
        <TableHeader>
          <TableHead>Expiration Date</TableHead>
          <TableHead>Potential Matter</TableHead>
          <TableHead>Cause of Action</TableHead>
          <TableHead>Jurisdiction</TableHead>
          <TableHead>Days Left</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-red-50/50">
            <TableCell className="font-bold text-red-700">2024-05-15</TableCell>
            <TableCell className="font-medium text-slate-900">Smith Personal Injury</TableCell>
            <TableCell>Negligence (Bodily Injury)</TableCell>
            <TableCell>California (2 Years)</TableCell>
            <TableCell><span className="text-red-600 font-bold flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/> 64 Days</span></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold text-slate-700">2025-01-20</TableCell>
            <TableCell className="font-medium text-slate-900">TechCorp Breach</TableCell>
            <TableCell>Breach of Written Contract</TableCell>
            <TableCell>California (4 Years)</TableCell>
            <TableCell><span className="text-slate-500">300+ Days</span></TableCell>
          </TableRow>
        </TableBody>
      </TableContainer>
    </div>
  );
};
