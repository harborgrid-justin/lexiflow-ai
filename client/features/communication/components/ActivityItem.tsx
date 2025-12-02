/**
 * ActivityItem Component
 *
 * Single activity entry in the activity feed
 */

import React from 'react';
import {
  FileText,
  Upload,
  Edit,
  Trash2,
  CheckSquare,
  Clock,
  MessageCircle,
  User,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Activity, ActivityType } from '../api/communication.types';
import { UserAvatar } from '../../../components/common';

interface ActivityItemProps {
  activity: Activity;
  onClick?: () => void;
  className?: string;
}

const activityIcons: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  case_created: Briefcase,
  case_updated: Edit,
  case_status_changed: AlertCircle,
  document_uploaded: Upload,
  document_updated: Edit,
  document_deleted: Trash2,
  task_created: CheckSquare,
  task_completed: CheckSquare,
  task_assigned: CheckSquare,
  time_entry_created: Clock,
  comment_added: MessageCircle,
  mention: MessageCircle,
  user_joined: User,
  user_left: User,
};

const activityColors: Record<ActivityType, string> = {
  case_created: 'bg-blue-100 text-blue-600',
  case_updated: 'bg-blue-100 text-blue-600',
  case_status_changed: 'bg-purple-100 text-purple-600',
  document_uploaded: 'bg-green-100 text-green-600',
  document_updated: 'bg-amber-100 text-amber-600',
  document_deleted: 'bg-red-100 text-red-600',
  task_created: 'bg-blue-100 text-blue-600',
  task_completed: 'bg-green-100 text-green-600',
  task_assigned: 'bg-purple-100 text-purple-600',
  time_entry_created: 'bg-slate-100 text-slate-600',
  comment_added: 'bg-blue-100 text-blue-600',
  mention: 'bg-amber-100 text-amber-600',
  user_joined: 'bg-green-100 text-green-600',
  user_left: 'bg-slate-100 text-slate-600',
};

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onClick,
  className = '',
}) => {
  const Icon = activityIcons[activity.type];
  const colorClass = activityColors[activity.type];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`
        relative flex gap-3 p-3 hover:bg-slate-50 transition-colors
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Timeline connector */}
      <div className="absolute left-[30px] top-[52px] bottom-0 w-px bg-slate-200" />

      {/* Icon */}
      <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">
              {activity.title}
            </p>
            <p className="text-sm text-slate-600 mt-0.5">
              {activity.description}
            </p>
          </div>
          <span className="text-xs text-slate-500 flex-shrink-0">
            {formatTime(activity.createdAt)}
          </span>
        </div>

        {/* Actor */}
        <div className="flex items-center gap-2 mt-2">
          <UserAvatar
            name={activity.actorName}
            src={activity.actorAvatar}
            size="sm"
          />
          <div className="text-xs text-slate-600">
            <span className="font-medium">{activity.actorName}</span>
            {activity.actorRole && (
              <span className="text-slate-500"> • {activity.actorRole}</span>
            )}
          </div>
        </div>

        {/* Resource Link */}
        {activity.resourceName && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
            <FileText className="w-3 h-3" />
            <span>{activity.resourceName}</span>
          </div>
        )}

        {/* Case Link */}
        {activity.caseName && (
          <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
            <Briefcase className="w-3 h-3" />
            <span>{activity.caseName}</span>
          </div>
        )}

        {/* Changes */}
        {activity.changes && activity.changes.length > 0 && (
          <div className="mt-2 space-y-1">
            {activity.changes.map((change, index) => (
              <div key={index} className="text-xs text-slate-600 flex items-center gap-2">
                <span className="font-medium capitalize">{change.field}:</span>
                <span className="text-slate-500">{String(change.oldValue)}</span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-700 font-medium">{String(change.newValue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CompactActivityItemProps {
  activity: Activity;
  onClick?: () => void;
  className?: string;
}

/**
 * Compact activity item for smaller spaces
 */
export const CompactActivityItem: React.FC<CompactActivityItemProps> = ({
  activity,
  onClick,
  className = '',
}) => {
  const Icon = activityIcons[activity.type];
  const colorClass = activityColors[activity.type];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  return (
    <div
      className={`
        flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 truncate">{activity.title}</p>
        <p className="text-xs text-slate-500">
          {activity.actorName} • {formatTime(activity.createdAt)}
        </p>
      </div>
    </div>
  );
};
