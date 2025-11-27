
import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { AlertCircle, Plus } from 'lucide-react';
import { MOCK_LEGAL_HOLDS } from '../../data/mockDiscovery';

export const LegalHolds: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-4">
       <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4 flex gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600 shrink-0"/>
          <div>
            <h4 className="font-bold text-amber-800 text-sm">Spoliation Warning</h4>
            <p className="text-xs text-amber-700 mt-1">Ensure all custodians are notified. Failure to preserve evidence may result in adverse inference sanctions (FRCP 37(e)).</p>
          </div>
       </div>

       <div className="flex justify-between items-center mb-2">
         <h3 className="font-bold text-slate-900">Active Custodians</h3>
         <Button variant="primary" icon={Plus}>Issue New Hold</Button>
       </div>

       <TableContainer>
          <TableHeader>
            <TableHead>Custodian</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date Issued</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {MOCK_LEGAL_HOLDS.map((hold) => (
               <TableRow key={hold.id}>
                  <TableCell className="font-medium text-slate-900">{hold.custodian}</TableCell>
                  <TableCell>{hold.dept}</TableCell>
                  <TableCell>{hold.issued}</TableCell>
                  <TableCell>
                    {hold.status === 'Acknowledged' 
                      ? <Badge variant="success">Acknowledged</Badge> 
                      : <Badge variant="warning">Pending Ack</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Remind</Button>
                  </TableCell>
               </TableRow>
            ))}
          </TableBody>
       </TableContainer>
    </div>
  );
};
