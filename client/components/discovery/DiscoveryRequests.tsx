
import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { DiscoveryRequest } from '../../types';
import { Wand2, Upload, Clock } from 'lucide-react';

interface DiscoveryRequestsProps {
  onNavigate: (view: any, id?: string) => void;
  items?: DiscoveryRequest[];
}

export const DiscoveryRequests: React.FC<DiscoveryRequestsProps> = ({ onNavigate, items }) => {
  const requestsToRender = items || [];

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="animate-fade-in space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block">
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {requestsToRender.map((req) => {
                const daysLeft = getDaysRemaining(req.dueDate);
                return (
                    <div key={req.id} onClick={() => onNavigate('response', req.id)} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer active:bg-slate-50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono text-slate-500">{req.id}</span>
                            <Badge variant={req.status === 'Overdue' ? 'error' : req.status === 'Responded' ? 'success' : 'info'}>
                                {req.status}
                            </Badge>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{req.title}</h4>
                        <div className="flex gap-2 mb-3">
                            <Badge variant="neutral">{req.type}</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-slate-600 bg-slate-50 p-2 rounded mb-3">
                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> Due: {req.dueDate}</span>
                            {req.status !== 'Responded' && (
                                <span className={`font-bold ${daysLeft < 5 ? 'text-red-600' : 'text-slate-500'}`}>
                                    {daysLeft < 0 ? 'OVERDUE' : `${daysLeft}d left`}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                            {req.type === 'Production' && (
                                <Button size="sm" variant="outline" icon={Upload} onClick={() => onNavigate('production', req.id)} className="w-full">
                                Produce
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" icon={Wand2} onClick={() => onNavigate('response', req.id)} className="w-full">
                                Draft Response
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};
