/**
 * NotificationItem Component
 *
 * Single notification display with actions
 */

import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  Info,
  Bell,
  FileText,
  MessageSquare,
  Calendar,
  UserPlus,
  Share,
  X,
} from 'lucide-react';
import { Notification, NotificationType } from '../api/communication.types';
import { UserAvatar } from '../../../components/common';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  onMarkRead?: () => void;
  onDismiss?: () => void;
  showActions?: boolean;
  className?: string;
}

const notificationIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  task_assigned: CheckCircle,
  mention: MessageSquare,
  deadline_reminder: Calendar,
  case_update: FileText,
  document_shared: Share,
  approval_request: AlertCircle,
  comment: MessageSquare,
  message: MessageSquare,
  system: Info,
};

const priorityColors = {
  low: 'text-slate-600 bg-slate-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-amber-600 bg-amber-100',
  urgent: 'text-red-600 bg-red-100',
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onMarkRead,
  onDismiss,
  showActions = true,
  className = '',
}) => {
  const Icon = notificationIcons[notification.type];
  const priorityColor = priorityColors[notification.priority];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`
        relative flex gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer group
        ${!notification.isRead ? 'bg-blue-50/50' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-600 rounded-r" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${priorityColor}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium truncate ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
              {notification.title}
            </h4>
            {notification.actorName && (
              <p className="text-xs text-slate-500">
                {notification.actorName}
              </p>
            )}
          </div>
          <span className="text-xs text-slate-500 flex-shrink-0">
            {formatTime(notification.createdAt)}
          </span>
        </div>

        {/* Message */}
        <p className={`text-sm ${notification.isRead ? 'text-slate-600' : 'text-slate-700'} line-clamp-2`}>
          {notification.message}
        </p>

        {/* Action Button */}
        {notification.actionUrl && notification.actionLabel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to action URL
              window.location.href = notification.actionUrl;
            }}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {notification.actionLabel} →
          </button>
        )}

        {/* Resource Info */}
        {notification.resourceName && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
            <FileText className="w-3 h-3" />
            <span>{notification.resourceName}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {!notification.isRead && onMarkRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead();
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Mark as read"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface CompactNotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  className?: string;
}

/**
 * Compact notification for dropdown/panel view
 */
export const CompactNotificationItem: React.FC<CompactNotificationItemProps> = ({
  notification,
  onClick,
  className = '',
}) => {
  const Icon = notificationIcons[notification.type];

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-start gap-3 p-3 text-left hover:bg-slate-50 transition-colors
        ${!notification.isRead ? 'bg-blue-50/50' : ''}
        ${className}
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${priorityColors[notification.priority]}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${notification.isRead ? 'text-slate-700' : 'text-slate-900 font-medium'} line-clamp-2`}>
          {notification.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {formatTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
      )}
    </button>
  );
};

// Helper function (duplicate from NotificationItem for use in CompactNotificationItem)
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;
  return date.toLocaleDateString();
}
