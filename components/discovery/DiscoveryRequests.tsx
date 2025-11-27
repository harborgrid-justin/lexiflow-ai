
import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { MOCK_DISCOVERY } from '../../data/mockDiscovery';
import { DiscoveryRequest } from '../../types';
import { Wand2, Upload } from 'lucide-react';

interface DiscoveryRequestsProps {
  onNavigate: (view: any, id?: string) => void;
  items?: DiscoveryRequest[];
}

export const DiscoveryRequests: React.FC<DiscoveryRequestsProps> = ({ onNavigate, items }) => {
  const requestsToRender = items || MOCK_DISCOVERY;

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="animate-fade-in space-y-4">
        <TableContainer>
          <TableHeader>
            <TableHead>Request</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Service Date</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableHeader>
          <TableBody>
            {requestsToRender.map((req) => {
              const daysLeft = getDaysRemaining(req.dueDate);
              return (
              <TableRow key={req.id} onClick={() => onNavigate('response', req.id)} className="cursor-pointer group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{req.title}</span>
                    <span className="text-xs text-slate-500">{req.id}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="neutral">{req.type}</Badge></TableCell>
                <TableCell>{req.serviceDate}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                     <span className="font-medium">{req.dueDate}</span>
                     {req.status !== 'Responded' && (
                       <span className={`text-[10px] font-bold ${daysLeft < 5 ? 'text-red-600' : 'text-slate-500'}`}>
                         {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
                       </span>
                     )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={req.status === 'Overdue' ? 'error' : req.status === 'Responded' ? 'success' : 'info'}>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                    {req.type === 'Production' && (
                        <Button size="sm" variant="outline" icon={Upload} onClick={() => onNavigate('production', req.id)}>
                        Produce
                        </Button>
                    )}
                    <Button size="sm" variant="ghost" icon={Wand2} onClick={() => onNavigate('response', req.id)}>
                        Draft
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </TableContainer>
    </div>
  );
};
