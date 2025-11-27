
import React from 'react';
import { TimelineEvent } from '../../types';
import { FileText, CheckCircle, DollarSign, Flag, Briefcase } from 'lucide-react';

interface CaseTimelineProps {
  events: TimelineEvent[];
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ events }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-3 w-3 text-white" />;
      case 'task': return <CheckCircle className="h-3 w-3 text-white" />;
      case 'billing': return <DollarSign className="h-3 w-3 text-white" />;
      case 'milestone': return <Flag className="h-3 w-3 text-white" />;
      default: return <Briefcase className="h-3 w-3 text-white" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-500';
      case 'task': return 'bg-green-500';
      case 'billing': return 'bg-amber-500';
      case 'milestone': return 'bg-purple-600';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-full max-h-[calc(100vh-12rem)] overflow-hidden sticky top-6">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Case Timeline</h3>
      </div>
      <div className="overflow-y-auto p-4 flex-1">
        {events.length === 0 ? (
          <p className="text-sm text-slate-400 text-center italic py-4">No events recorded.</p>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
            {events.map((event) => (
              <div key={event.id} className="relative pl-6">
                <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${getColor(event.type)}`}>
                  {getIcon(event.type)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-mono mb-0.5">{event.date}</span>
                  <span className="text-sm font-semibold text-slate-800 leading-tight">{event.title}</span>
                  {event.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                  )}
                  {event.type === 'billing' && (
                    <span className="text-[10px] font-bold text-amber-600 mt-1 uppercase">Billable Entry</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
