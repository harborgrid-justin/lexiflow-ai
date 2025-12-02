/**
 * Case Timeline Component
 * Chronological activity feed for case events and changes
 */

import React from 'react';
import { TimelineEvent, TimelineEventType } from '../api/cases.types';
import {
  FileText,
  UserPlus,
  UserMinus,
  Calendar,
  Bell,
  Edit,
  Flag,
  CheckCircle,
  FileCheck,
  Search,
  DollarSign,
  Circle,
} from 'lucide-react';

interface CaseTimelineProps {
  timeline: TimelineEvent[];
  isLoading?: boolean;
}

// Icon mapping for different event types
const EVENT_ICONS: Record<TimelineEventType, React.ReactNode> = {
  created: <Circle className="w-4 h-4" />,
  updated: <Edit className="w-4 h-4" />,
  status_changed: <Flag className="w-4 h-4" />,
  document_added: <FileText className="w-4 h-4" />,
  party_added: <UserPlus className="w-4 h-4" />,
  party_removed: <UserMinus className="w-4 h-4" />,
  hearing_scheduled: <Calendar className="w-4 h-4" />,
  deadline_added: <Bell className="w-4 h-4" />,
  note_added: <FileText className="w-4 h-4" />,
  task_completed: <CheckCircle className="w-4 h-4" />,
  motion_filed: <FileCheck className="w-4 h-4" />,
  discovery_request: <Search className="w-4 h-4" />,
  settlement_offer: <DollarSign className="w-4 h-4" />,
};

// Color classes for different event types
const EVENT_COLORS: Record<TimelineEventType, string> = {
  created: 'bg-blue-100 text-blue-700',
  updated: 'bg-slate-100 text-slate-700',
  status_changed: 'bg-purple-100 text-purple-700',
  document_added: 'bg-green-100 text-green-700',
  party_added: 'bg-teal-100 text-teal-700',
  party_removed: 'bg-red-100 text-red-700',
  hearing_scheduled: 'bg-orange-100 text-orange-700',
  deadline_added: 'bg-amber-100 text-amber-700',
  note_added: 'bg-indigo-100 text-indigo-700',
  task_completed: 'bg-green-100 text-green-700',
  motion_filed: 'bg-blue-100 text-blue-700',
  discovery_request: 'bg-cyan-100 text-cyan-700',
  settlement_offer: 'bg-emerald-100 text-emerald-700',
};

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ timeline, isLoading }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-2">
          <Calendar className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-slate-500 text-sm">No timeline events yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => {
        const icon = EVENT_ICONS[event.type] || <Circle className="w-4 h-4" />;
        const colorClass = EVENT_COLORS[event.type] || 'bg-slate-100 text-slate-700';
        const isLast = index === timeline.length - 1;

        return (
          <div key={event.id} className="flex gap-3">
            {/* Timeline line with icon */}
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${colorClass}`}>{icon}</div>
              {!isLast && <div className="flex-1 w-0.5 bg-slate-200 mt-2"></div>}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-6">
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(event.createdAt)}
                  </span>
                </div>

                {event.description && (
                  <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                )}

                {/* User info */}
                {event.user && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>By {event.user.name}</span>
                    {event.user.role && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {event.user.role}
                      </span>
                    )}
                  </div>
                )}

                {/* Metadata */}
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-slate-500">{key}: </span>
                          <span className="text-slate-700 font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
