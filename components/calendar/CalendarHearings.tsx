
import React from 'react';
import { MapPin, User, Clock } from 'lucide-react';

export const CalendarHearings: React.FC = () => {
  const hearings = [
    { id: 1, title: 'Case Management Conference', case: 'Martinez v. TechCorp', time: '09:00 AM', location: 'Dept 504, SF Superior', judge: 'Hon. S. Miller' },
    { id: 2, title: 'Motion Summary Judgment', case: 'State v. GreenEnergy', time: '01:30 PM', location: 'Courtroom 4B, NV District', judge: 'Hon. A. Wright' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hearings.map(h => (
        <div key={h.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded border border-red-200">Hearing</span>
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
          </div>
        </div>
      ))}
    </div>
  );
};
