/**
 * NotificationCenter Component
 *
 * Dropdown notification panel with filtering and quick actions
 */

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Settings, X, Filter } from 'lucide-react';
import { NotificationType } from '../api/communication.types';
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllNotificationsRead, useClearNotification } from '../api/notifications.api';
import { CompactNotificationItem } from './NotificationItem';
import { NotificationBadge } from './NotificationBadge';
import { LoadingSpinner } from '../../../components/common';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onOpenSettings?: () => void;
  triggerElement?: React.ReactNode;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onToggle,
  onOpenSettings,
  triggerElement,
  className = '',
}) => {
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: unreadData } = useUnreadCount();
  const { data: notificationsData, isLoading } = useNotifications({
    type: selectedType === 'all' ? undefined : [selectedType],
    unreadOnly: showUnreadOnly,
    limit: 20,
  });

  // Mutations
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const clearMutation = useClearNotification();

  const unreadCount = unreadData?.count || 0;
  const notifications = notificationsData?.notifications || [];

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    markReadMutation.mutate(notificationId);
    if (actionUrl) {
      window.location.href = actionUrl;
    }
    onClose();
  };

  const typeFilters: Array<{ value: NotificationType | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'task_assigned', label: 'Tasks' },
    { value: 'mention', label: 'Mentions' },
    { value: 'deadline_reminder', label: 'Deadlines' },
    { value: 'case_update', label: 'Cases' },
    { value: 'document_shared', label: 'Documents' },
    { value: 'approval_request', label: 'Approvals' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      {triggerElement || (
        <button
          onClick={onToggle}
          className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <NotificationBadge
              count={unreadCount}
              position="absolute"
              className="-top-1 -right-1"
            />
          )}
        </button>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({unreadCount} unread)
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markAllReadMutation.isPending}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-5 h-5" />
                  </button>
                )}
                {onOpenSettings && (
                  <button
                    onClick={() => {
                      onOpenSettings();
                      onClose();
                    }}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              {/* Type Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {typeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedType(filter.value)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                      ${selectedType === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }
                    `}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Unread Filter */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Show unread only</span>
              </label>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 px-4 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 mb-1">No notifications</p>
                <p className="text-sm text-slate-500">
                  {showUnreadOnly || selectedType !== 'all'
                    ? 'Try adjusting your filters'
                    : "You're all caught up!"
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className="relative group">
                    <CompactNotificationItem
                      notification={notification}
                      onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                    />
                    {/* Delete button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearMutation.mutate(notification.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-all"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex-shrink-0 p-3 border-t border-slate-200 text-center">
              <button
                onClick={() => {
                  // Navigate to full notifications page
                  window.location.href = '/notifications';
                  onClose();
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface NotificationIconProps {
  unreadCount?: number;
  onClick: () => void;
  className?: string;
}

/**
 * Simple notification bell icon with badge (for use in header/navbar)
 */
export const NotificationIcon: React.FC<NotificationIconProps> = ({
  unreadCount = 0,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ${className}`}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <NotificationBadge
          count={unreadCount}
          position="absolute"
          size="sm"
          className="-top-1 -right-1"
        />
      )}
    </button>
  );
};
