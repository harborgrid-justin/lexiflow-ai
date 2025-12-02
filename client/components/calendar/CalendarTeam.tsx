/**
 * CalendarTeam - Team Availability Component
 *
 * Displays weekly availability schedule for all team members.
 * Helps with coordinating schedules and planning meetings across the legal team.
 *
 * ENZYME MIGRATION:
 * - Added usePageView for page tracking ('calendar_team')
 * - Added useTrackEvent for analytics on team member interactions
 * - Replaced useEffect/useState with useApiRequest for automatic caching & error handling
 * - Added useIsMounted for safe async operations
 * - Priority: NORMAL - Team calendar is important but not critical
 * - Hydration: VISIBLE - Load when tab becomes visible
 * - Cache: 5 minutes - Team schedules are relatively stable
 */

import React from 'react';
import { UserAvatar } from '../common/UserAvatar';
import { useApiRequest, usePageView, useTrackEvent, useIsMounted } from '../../enzyme';

interface TeamMember {
  name: string;
  role: string;
  schedule: number[];
}

export const CalendarTeam: React.FC = () => {
  // ENZYME: Analytics tracking
  usePageView('calendar_team');
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // ENZYME: Replace useEffect/useState with useApiRequest for automatic caching
  const { data: team = [], isLoading: loading } = useApiRequest<TeamMember[]>({
    endpoint: '/api/v1/calendar/team',
    options: {
      staleTime: 5 * 60 * 1000, // 5 min cache - team schedules are relatively stable
      onError: (err: any) => {
        console.error('Failed to fetch team availability:', err);
        if (isMounted()) {
          trackEvent('calendar_team_error', {
            error: err?.message || 'Unknown error'
          });
        }
      },
      onSuccess: (data: TeamMember[]) => {
        if (isMounted()) {
          trackEvent('calendar_team_loaded', {
            team_size: data.length
          });
        }
      }
    }
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading) {
    return <div className="p-4 text-center text-slate-500">Loading team availability...</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-bold text-slate-800">Team Availability (This Week)</h3>
      </div>
      <div className="p-6">
        <div className="hidden md:grid grid-cols-8 gap-4 mb-4 border-b border-slate-100 pb-2">
          <div className="col-span-1 font-semibold text-xs text-slate-500 uppercase">Team Member</div>
          {days.map(d => <div key={d} className="col-span-1 font-semibold text-xs text-slate-500 uppercase text-center">{d}</div>)}
        </div>
        
        <div className="space-y-6 md:space-y-6">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center border-b md:border-b-0 border-slate-100 pb-4 md:pb-0 last:border-0 cursor-pointer hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors"
              onClick={() => {
                trackEvent('team_member_schedule_click', {
                  member_name: member.name,
                  member_role: member.role,
                  available_days: member.schedule.filter(s => s).length,
                  total_days: member.schedule.length
                });
              }}
            >
              <div className="col-span-1 flex items-center gap-2 mb-2 md:mb-0">
                <UserAvatar name={member.name} size="sm"/>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-7 grid grid-cols-7 gap-2">
                {(member.schedule || []).map((status, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">{days[i]?.charAt(0) || ''}</span>
                        <div className={`h-8 w-full rounded-md ${status ? 'bg-green-100 border border-green-200' : 'bg-slate-50 border border-slate-100'} flex items-center justify-center`}>
                            <span className={`text-[10px] md:text-xs font-medium ${status ? 'text-green-700' : 'text-slate-300'}`}>
                            {status ? 'OK' : '-'}
                            </span>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
