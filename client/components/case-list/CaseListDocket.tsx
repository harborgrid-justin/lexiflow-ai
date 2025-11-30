
import React, { useMemo, useState, useEffect } from 'react';
import { RefreshCcw, Plus, Calendar, AlertTriangle } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { Case, Motion } from '../../types';
import { Button } from '../common/Button';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';

export const CaseListDocket: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [motions, setMotions] = useState<Motion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [c, m] = await Promise.all([
                ApiService.getCases(),
                ApiService.getMotions()
            ]);
            setCases(c || []);
            setMotions(m || []);
        } catch (e) {
            console.error("Failed to fetch docket data", e);
            setCases([]);
            setMotions([]);
        }
    };
    fetchData();
  }, []);

  // Aggregate docket items from cases and motions
  const docketItems = useMemo(() => {
    const items: any[] = [];

    // Add Hearings from Motions
    (motions || []).forEach(m => {
      if (m.hearingDate) {
        const relatedCase = cases.find(c => c.id === m.caseId);
        items.push({
          id: `h-${m.id}`,
          date: m.hearingDate,
          time: '09:00 AM', // Mock time
          matter: relatedCase?.title || m.caseId,
          event: `Hearing: ${m.title}`,
          type: 'Hearing',
          location: relatedCase?.court || 'TBD',
          priority: 'High'
        });
      }
    });

    // Add Mock Deadlines (Simulated sync)
    items.push(
      { id: 'd-1', date: '2024-03-30', time: '11:59 PM', matter: 'Martinez v. TechCorp', event: 'Discovery Cutoff', type: 'Deadline', location: 'N/A', priority: 'Critical' },
      { id: 'd-2', date: '2024-04-15', time: '05:00 PM', matter: 'In Re: OmniGlobal', event: 'Expert Disclosure', type: 'Filing', location: 'E-File', priority: 'Medium' }
    );

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [cases, motions]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm animate-fade-in">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Master Docket</h3>
          <p className="text-xs text-slate-500 flex items-center mt-1">
            <RefreshCcw className="h-3 w-3 mr-1"/> Synced with Court ECF & Internal Calendars
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCcw}>Force Sync</Button>
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
          <TableHead>Type</TableHead>
        </TableHeader>
        <TableBody>
          {docketItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold text-slate-900 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400"/>
                  {item.date}
                </div>
              </TableCell>
              <TableCell className="text-slate-500 font-mono text-xs">{item.time}</TableCell>
              <TableCell className="text-blue-600 font-medium max-w-xs truncate">{item.matter}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {item.priority === 'Critical' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2"/>}
                  {item.event}
                </div>
              </TableCell>
              <TableCell className="text-slate-500 text-xs">{item.location}</TableCell>
              <TableCell>
                <Badge variant={item.type === 'Hearing' ? 'error' : item.type === 'Deadline' ? 'warning' : 'info'}>
                  {item.type}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {docketItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-400">No upcoming docket events.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableContainer>
    </div>
  );
};
