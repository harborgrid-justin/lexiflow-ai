
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, CheckSquare, Shield, Calendar, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useCalendarView } from '../../hooks/useCalendarView';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BADGE_VARIANTS } from '../../constants/design-tokens';

interface CalendarMasterProps {
  onNavigateToCase?: (caseId: string) => void;
}

export const CalendarMaster: React.FC<CalendarMasterProps> = ({ onNavigateToCase }) => {
  const {
    getEventsForDay,
    changeMonth,
    monthLabel,
    daysInMonth,
    firstDay
  } = useCalendarView();
  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const getEventStyle = (type: string, priority: string) => {
    if (type === 'case') return BADGE_VARIANTS['event-case'];
    if (type === 'compliance') return BADGE_VARIANTS['event-compliance'];
    return priority === 'High' ? BADGE_VARIANTS['event-task-high'] : BADGE_VARIANTS['event-task-normal'];
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
                    <div 
                      key={`${evt.id}-${idx}`} 
                      onClick={() => setSelectedEvent(evt)}
                      className={`text-xs p-2 md:p-1 rounded border truncate cursor-pointer flex items-center hover:opacity-80 transition-opacity ${getEventStyle(evt.type, evt.priority as string)}`}
                    >
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

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details">
        {selectedEvent && (
          <div className="space-y-6 p-2">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                selectedEvent.type === 'case' ? 'bg-purple-100 text-purple-600' : 
                selectedEvent.type === 'compliance' ? 'bg-amber-100 text-amber-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {selectedEvent.type === 'case' ? <Briefcase className="h-6 w-6"/> : 
                 selectedEvent.type === 'compliance' ? <Shield className="h-6 w-6"/> : 
                 <CheckSquare className="h-6 w-6"/>}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedEvent.priority === 'High' ? 'warning' : 'neutral'}>{selectedEvent.priority} Priority</Badge>
                  <span className="text-xs text-slate-500 uppercase font-bold">{selectedEvent.type}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Date</p>
                <div className="flex items-center gap-2 text-slate-900 font-medium">
                  <Calendar className="h-4 w-4 text-slate-400"/>
                  {selectedEvent.date}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Time</p>
                <div className="flex items-center gap-2 text-slate-900 font-medium">
                  <Clock className="h-4 w-4 text-slate-400"/>
                  All Day
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0"/>
                <p>This event is synced with the Master Calendar. Any changes will be reflected in Outlook and the firm-wide docket.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedEvent(null)}>Close</Button>
              {selectedEvent.caseId && onNavigateToCase && (
                <Button 
                  variant="primary" 
                  icon={ArrowRight} 
                  onClick={() => {
                    onNavigateToCase(selectedEvent.caseId);
                    setSelectedEvent(null);
                  }}
                >
                  Go to Case
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
