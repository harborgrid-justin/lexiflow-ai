
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
        <div className="grid grid-cols-8 gap-4 mb-4 border-b border-slate-100 pb-2">
          <div className="col-span-1 font-semibold text-xs text-slate-500 uppercase">Team Member</div>
          {days.map(d => <div key={d} className="col-span-1 font-semibold text-xs text-slate-500 uppercase text-center">{d}</div>)}
        </div>
        <div className="space-y-6">
          {team.map((member, idx) => (
            <div key={idx} className="grid grid-cols-8 gap-4 items-center">
              <div className="col-span-1 flex items-center gap-2">
                <UserAvatar name={member.name} size="sm"/>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                </div>
              </div>
              {member.schedule.map((status, i) => (
                <div key={i} className="col-span-1 flex justify-center">
                  <div className={`h-8 w-full rounded-md ${status ? 'bg-green-100 border border-green-200' : 'bg-slate-50 border border-slate-100'} flex items-center justify-center`}>
                    <span className={`text-xs font-medium ${status ? 'text-green-700' : 'text-slate-300'}`}>
                      {status ? 'Avail' : 'Off'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
