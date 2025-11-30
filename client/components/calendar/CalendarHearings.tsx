
import React, { useEffect, useState } from 'react';
import { MapPin, User, Clock } from 'lucide-react';
import { ApiService } from '../../services/apiService';

interface Hearing {
  id: number | string;
  title: string;
  case: string;
  time: string;
  location: string;
  judge: string;
}

export const CalendarHearings: React.FC = () => {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHearings = async () => {
      try {
        const data = await ApiService.getCalendarHearings();
        setHearings(data || []);
      } catch (error) {
        console.error('Failed to fetch hearings:', error);
        setHearings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHearings();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-slate-500">Loading hearings...</div>;
  }

  if (hearings.length === 0) {
    return <div className="p-4 text-center text-slate-500">No upcoming hearings found.</div>;
  }

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
