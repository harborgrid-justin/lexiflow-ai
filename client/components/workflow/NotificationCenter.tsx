import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, X } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { NotificationEvent } from '../../types/workflow-engine';

interface NotificationCenterProps {
  userId: string;
  compact?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  compact = false
}) => {
  const { getNotifications, markNotificationRead, loading: _loading } = useWorkflowEngine();
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [showAll, setShowAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    const notifs = await getNotifications(userId, !showAll);
    if (notifs) {
      setNotifications(notifs);
    }
  }, [getNotifications, userId, showAll]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleMarkRead = async (notificationId: string) => {
    await markNotificationRead(notificationId);
    await loadNotifications();
  };

  const getNotificationIcon = (type: NotificationEvent['type']) => {
    switch (type) {
      case 'task_assigned':
      case 'approval_required':
        return <Bell className="h-4 w-4 text-blue-600" />;
      case 'task_overdue':
      case 'sla_breach':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'sla_warning':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'stage_completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (compact) {
    return (
      <div className="relative">
        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Unread Only' : 'Show All'}
          </Button>
        </div>
      </div>

      <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        )}

        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-slate-50 transition-colors ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-slate-900">
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                      title="Mark as read"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
