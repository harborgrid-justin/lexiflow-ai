
import React from 'react';
import { UserAvatar } from '../common/UserAvatar';

export const CalendarTeam: React.FC = () => {
  const team = [
    { name: 'Alexandra H.', role: 'Senior Partner', schedule: [1, 1, 0, 1, 1, 0, 0] },
    { name: 'James Doe', role: 'Associate', schedule: [1, 1, 1, 1, 1, 0, 0] },
    { name: 'Sarah Jenkins', role: 'Paralegal', schedule: [1, 1, 1, 1, 0, 0, 0] },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
            <div key={idx} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center border-b md:border-b-0 border-slate-100 pb-4 md:pb-0 last:border-0">
              <div className="col-span-1 flex items-center gap-2 mb-2 md:mb-0">
                <UserAvatar name={member.name} size="sm"/>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-7 grid grid-cols-7 gap-2">
                {member.schedule.map((status, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="md:hidden text-[10px] text-slate-400 uppercase font-bold">{days[i].charAt(0)}</span>
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
