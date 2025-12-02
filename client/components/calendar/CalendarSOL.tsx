/**
 * CalendarSOL - Statute of Limitations Watch Component
 *
 * CRITICAL LEGAL COMPONENT: Tracks statute of limitations expiration dates.
 * Missing these dates results in malpractice liability. This is the highest
 * priority legal compliance feature in the system.
 *
 * ENZYME MIGRATION:
 * - Added usePageView for page tracking ('calendar_sol')
 * - Added useTrackEvent for analytics on SOL interactions and critical alerts
 * - Replaced useEffect/useState with useApiRequest for automatic caching & error handling
 * - Added useIsMounted for safe async operations
 * - Priority: CRITICAL - Malpractice prevention, must load immediately
 * - Hydration: IMMEDIATE - Cannot delay loading of SOL data
 * - Cache: Short (30 seconds) - SOL data must be fresh at all times
 */

import React from 'react';
import { AlertTriangle, ShieldAlert, MapPin } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { useApiRequest, usePageView, useTrackEvent, useIsMounted } from '../../enzyme';
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
  // ENZYME: Analytics tracking
  usePageView('calendar_sol');
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // ENZYME: Replace useEffect/useState with useApiRequest for automatic caching
  const { data: solData = [], isLoading: loading } = useApiRequest<SOLData[]>({
    endpoint: '/api/v1/calendar/sol',
    options: {
      staleTime: 30 * 1000, // 30 second cache - CRITICAL data needs very fresh updates
      onError: (err: any) => {
        console.error('Failed to fetch SOL data:', err);
        if (isMounted()) {
          trackEvent('calendar_sol_error', {
            error: err?.message || 'Unknown error',
            severity: 'critical'
          });
        }
      },
      onSuccess: (data: SOLData[]) => {
        // Track critical SOL items that need immediate attention
        const criticalCount = data.filter(d => d.critical).length;
        if (criticalCount > 0 && isMounted()) {
          trackEvent('calendar_sol_critical_items', {
            critical_count: criticalCount,
            total_count: data.length
          });
        }
      }
    }
  });

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
                <TableRow
                  key={i}
                  className={`cursor-pointer hover:bg-slate-50 ${row.critical ? 'bg-red-50/50' : ''}`}
                  onClick={() => {
                    trackEvent('sol_row_click', {
                      matter: row.matter,
                      days_left: row.daysLeft,
                      critical: row.critical,
                      jurisdiction: row.jurisdiction,
                      cause: row.cause
                    });
                  }}
                >
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
            <div
              key={i}
              className={`p-4 rounded-lg border shadow-sm cursor-pointer transition-colors ${row.critical ? 'bg-red-50 border-red-200 hover:border-red-300' : 'bg-white border-slate-200 hover:border-blue-300'}`}
              onClick={() => {
                trackEvent('sol_card_click', {
                  matter: row.matter,
                  days_left: row.daysLeft,
                  critical: row.critical,
                  jurisdiction: row.jurisdiction,
                  cause: row.cause
                });
              }}
            >
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
