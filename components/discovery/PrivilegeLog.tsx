
import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Wand2, Plus } from 'lucide-react';
import { MOCK_PRIVILEGE_LOG } from '../../data/mockDiscovery';

export const PrivilegeLog: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900">Privilege Log (FRCP 26(b)(5))</h3>
          <p className="text-sm text-slate-500">Index of withheld documents claiming Attorney-Client or Work Product privilege.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" icon={Wand2}>AI Scan for Privilege</Button>
           <Button variant="primary" icon={Plus}>Manual Entry</Button>
        </div>
      </div>
      <TableContainer>
        <TableHeader>
          <TableHead>Doc ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Privilege Claim</TableHead>
          <TableHead>Author/Recipient</TableHead>
          <TableHead>Description (Rule 26)</TableHead>
        </TableHeader>
        <TableBody>
          {MOCK_PRIVILEGE_LOG.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs">{item.id}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell><Badge variant="warning">{item.basis}</Badge></TableCell>
              <TableCell>
                <div className="text-xs">
                  <p><span className="text-slate-500">From:</span> {item.author}</p>
                  <p><span className="text-slate-500">To:</span> {item.recipient}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate" title={item.desc}>{item.desc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
};
