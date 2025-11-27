
import React from 'react';
import { ChevronLeft, ChevronRight, Briefcase, CheckSquare, Shield } from 'lucide-react';
import { useCalendarView } from '../../hooks/useCalendarView';

export const CalendarMaster: React.FC = () => {
  const {
    getEventsForDay,
    changeMonth,
    monthLabel,
    daysInMonth,
    firstDay
  } = useCalendarView();

  const getEventStyle = (type: string, priority: string) => {
    if (type === 'case') return 'bg-purple-50 border-purple-100 text-purple-700';
    if (type === 'compliance') return 'bg-amber-50 border-amber-100 text-amber-700';
    return priority === 'High' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700';
  };

  const getEventIcon = (type: string) => {
      if (type === 'case') return <Briefcase className="h-3 w-3 mr-1 inline"/>;
      if (type === 'compliance') return <Shield className="h-3 w-3 mr-1 inline"/>;
      return <CheckSquare className="h-3 w-3 mr-1 inline"/>;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
         <h3 className="font-bold text-slate-800 text-sm md:text-base">Monthly Overview</h3>
         <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
             <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-slate-600"/></button>
             <span className="px-2 md:px-4 font-bold text-slate-800 text-xs md:text-sm min-w-[100px] md:min-w-[140px] text-center">{monthLabel}</span>
             <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-slate-600"/></button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-100 md:bg-white">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-px md:bg-slate-200 md:rounded-lg md:overflow-hidden md:border border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="hidden md:block bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="hidden md:block bg-white min-h-[100px]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            return (
              <div key={day} className={`bg-white rounded-lg md:rounded-none shadow-sm md:shadow-none min-h-0 md:min-h-[100px] p-3 md:p-2 border md:border-t border-slate-200 md:border-slate-100 relative group hover:bg-slate-50 transition-colors ${dayEvents.length === 0 ? 'hidden md:block' : ''}`}>
                <div className="flex md:block justify-between items-center mb-2 md:mb-0">
                    <span className={`text-sm font-bold md:font-medium ${dayEvents.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                        <span className="md:hidden mr-1 text-slate-500 font-normal">{monthLabel}</span>
                        {day}
                    </span>
                    <span className="md:hidden text-xs text-slate-400">{dayEvents.length} Events</span>
                </div>
                
                <div className="mt-1 space-y-2 md:space-y-1">
                  {dayEvents.map((evt, idx) => (
                    <div key={`${evt.id}-${idx}`} className={`text-xs p-2 md:p-1 rounded border truncate cursor-pointer flex items-center ${getEventStyle(evt.type, evt.priority as string)}`}>
                      <span className="shrink-0">{getEventIcon(evt.type)}</span>
                      <span className="truncate ml-1">{evt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 px-4 py-3 text-xs text-slate-500 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center"><div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded mr-2"></div> Matters</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div> High Priority</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded mr-2"></div> Compliance</div>
      </div>
    </div>
  );
};
