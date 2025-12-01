import React from 'react';
import { Bell, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import type { NotificationEvent, TaskSLAStatus } from '../../types/workflow-engine';

interface WorkflowQuickActionsProps {
  userId: string;
  caseId?: string;
  taskId?: string;
  compact?: boolean;
}

export const WorkflowQuickActions: React.FC<WorkflowQuickActionsProps> = ({
  userId,
  caseId,
  taskId,
  compact = false
}) => {
  const {
    getNotifications,
    getTaskSLAStatus,
    checkSLABreaches,
    startTimeTracking,
    stopTimeTracking
  } = useWorkflowEngine();

  const [notifications, setNotifications] = React.useState<NotificationEvent[]>([]);
  const [slaStatus, setSlaStatus] = React.useState<TaskSLAStatus | null>(null);
  const [isTracking, setIsTracking] = React.useState(false);

  React.useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [userId, taskId]);

  const loadData = async () => {
    const notifs = await getNotifications(userId, true);
    if (notifs) setNotifications(notifs);

    if (taskId) {
      const status = await getTaskSLAStatus(taskId);
      if (status) setSlaStatus(status);
    }
  };

  const handleTimeTracking = async () => {
    if (!taskId) return;
    
    if (isTracking) {
      await stopTimeTracking(taskId, userId);
      setIsTracking(false);
    } else {
      await startTimeTracking(taskId, userId);
      setIsTracking(true);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="h-4 w-4 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* SLA Status */}
        {slaStatus && slaStatus.status !== 'ok' && (
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            slaStatus.status === 'breached'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {slaStatus.status === 'breached' ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
          </div>
        )}

        {/* Time Tracking */}
        {taskId && (
          <button
            onClick={handleTimeTracking}
            className={`p-2 rounded-lg transition-colors ${
              isTracking
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Clock className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Notifications */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* SLA Status */}
      {slaStatus && (
        <div className={`p-4 rounded-lg shadow-sm border ${
          slaStatus.status === 'breached'
            ? 'bg-red-50 border-red-200'
            : slaStatus.status === 'warning'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2">
            {slaStatus.status === 'breached' ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : slaStatus.status === 'warning' ? (
              <Clock className="h-5 w-5 text-amber-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            <span className="text-sm font-medium">
              {slaStatus.status === 'breached'
                ? 'SLA Breached'
                : slaStatus.status === 'warning'
                ? 'SLA Warning'
                : 'Within SLA'}
            </span>
          </div>
        </div>
      )}

      {/* Time Tracking */}
      {taskId && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <button
            onClick={handleTimeTracking}
            className={`w-full flex items-center justify-between transition-colors ${
              isTracking ? 'text-blue-600' : 'text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </span>
            </div>
            {isTracking && (
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-slate-700">Workflow Active</span>
        </div>
      </div>
    </div>
  );
};
