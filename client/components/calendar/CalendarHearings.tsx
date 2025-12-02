/**
 * CalendarHearings - Court Hearing Docket Component
 *
 * Displays upcoming court hearings with judge, location, and docket information.
 * Integrates with PACER for electronic court filing systems.
 *
 * ENZYME MIGRATION:
 * - Added usePageView for page tracking ('calendar_hearings')
 * - Added useTrackEvent for analytics on hearing interactions and PACER link clicks
 * - Replaced useEffect/useState with useApiRequest for automatic caching & error handling
 * - Added useIsMounted for safe async operations
 * - Added useLatestCallback for stable PACER link handler
 * - Priority: HIGH - Court hearings are time-sensitive
 * - Hydration: VISIBLE - Load when tab becomes visible
 */

import React from 'react';
import { MapPin, User, Clock, FileText, ExternalLink } from 'lucide-react';
import { useApiRequest, usePageView, useTrackEvent, useIsMounted, useLatestCallback } from '../../enzyme';
import { Badge } from '../common/Badge';

interface Hearing {
  id: number | string;
  title: string;
  case: string;
  time: string;
  location: string;
  judge: string;
  docketEntryId?: string;
  docketEntryNumber?: number;
  pacerLink?: string;
}

export const CalendarHearings: React.FC = () => {
  // ENZYME: Analytics tracking
  usePageView('calendar_hearings');
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // ENZYME: Replace useEffect/useState with useApiRequest for automatic caching
  const { data: hearings = [], isLoading: loading } = useApiRequest<Hearing[]>({
    endpoint: '/api/v1/calendar/hearings',
    options: {
      staleTime: 2 * 60 * 1000, // 2 min cache - hearings don't change frequently
      onError: (err: any) => {
        console.error('Failed to fetch hearings:', err);
        if (isMounted()) {
          trackEvent('calendar_hearings_error', {
            error: err?.message || 'Unknown error'
          });
        }
      }
    }
  });

  // ENZYME: Stable callback for PACER link clicks
  const handlePacerClick = useLatestCallback((hearing: Hearing, e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('pacer_link_click', {
      hearing_id: hearing.id,
      case: hearing.case,
      docket_entry: hearing.docketEntryNumber
    });
  });

  if (loading) {
    return <div className="p-4 text-center text-slate-500">Loading hearings...</div>;
  }

  if (hearings.length === 0) {
    return <div className="p-4 text-center text-slate-500">No upcoming hearings found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hearings.map(h => (
        <div
          key={h.id}
          className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer"
          onClick={() => {
            trackEvent('hearing_card_click', {
              hearing_id: h.id,
              case: h.case,
              title: h.title,
              judge: h.judge
            });
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <Badge variant="error" size="sm">Hearing</Badge>
            <span className="text-slate-500 text-xs font-mono flex items-center"><Clock className="h-3 w-3 mr-1"/> {h.time}</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg">{h.title}</h4>
          <p className="text-blue-600 font-medium text-sm mb-4">{h.case}</p>
          
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center text-sm text-slate-600">
              <MapPin className="h-4 w-4 mr-2 text-slate-400"/>
              {h.location}
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <User className="h-4 w-4 mr-2 text-slate-400"/>
              {h.judge}
            </div>
            {h.docketEntryNumber && (
              <div className="flex items-center justify-between text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2"/>
                  <span className="font-medium">Docket Entry #{h.docketEntryNumber}</span>
                </div>
                {h.pacerLink && (
                  <a
                    href={h.pacerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline"
                    onClick={(e) => handlePacerClick(h, e)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
