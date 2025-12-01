import React from 'react';
import { GitBranch, Clock, UserCheck, Users } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';

interface TaskWorkflowBadgesProps {
  taskId: string;
  showDependencies?: boolean;
  showSLA?: boolean;
  showApproval?: boolean;
  showParallel?: boolean;
}

export const TaskWorkflowBadges: React.FC<TaskWorkflowBadgesProps> = ({
  taskId,
  showDependencies = true,
  showSLA = true,
  showApproval = true,
  showParallel: _showParallel = true
}) => {
  const {
    getTaskDependencies,
    canStartTask,
    getTaskSLAStatus,
    getApprovalChain,
    loading
  } = useWorkflowEngine();

  const [badges, setBadges] = React.useState<{
    dependencies?: number;
    blocked?: boolean;
    slaStatus?: 'ok' | 'warning' | 'breached';
    approval?: 'pending' | 'approved' | 'rejected';
    parallel?: boolean;
  }>({});

  React.useEffect(() => {
    loadBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const loadBadges = async () => {
    const newBadges: typeof badges = {};

    if (showDependencies) {
      const deps = await getTaskDependencies(taskId);
      if (deps) {
        newBadges.dependencies = deps.dependsOn.length;
        const canStart = await canStartTask(taskId);
        if (canStart && !canStart.canStart) {
          newBadges.blocked = true;
        }
      }
    }

    if (showSLA) {
      const sla = await getTaskSLAStatus(taskId);
      if (sla) {
        newBadges.slaStatus = sla.status;
      }
    }

    if (showApproval) {
      const approval = await getApprovalChain(taskId);
      if (approval) {
        newBadges.approval = approval.status;
      }
    }

    setBadges(newBadges);
  };

  if (loading || Object.keys(badges).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {/* Dependencies */}
      {badges.dependencies !== undefined && badges.dependencies > 0 && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
          badges.blocked
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          <GitBranch className="h-3 w-3" />
          {badges.blocked ? 'Blocked' : `${badges.dependencies} deps`}
        </span>
      )}

      {/* SLA Status */}
      {badges.slaStatus && badges.slaStatus !== 'ok' && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
          badges.slaStatus === 'breached'
            ? 'bg-red-100 text-red-800'
            : 'bg-amber-100 text-amber-800'
        }`}>
          <Clock className="h-3 w-3" />
          {badges.slaStatus === 'breached' ? 'Breached' : 'Warning'}
        </span>
      )}

      {/* Approval Status */}
      {badges.approval && (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
          badges.approval === 'approved'
            ? 'bg-green-100 text-green-800'
            : badges.approval === 'rejected'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <UserCheck className="h-3 w-3" />
          {badges.approval}
        </span>
      )}

      {/* Parallel */}
      {badges.parallel && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
          <Users className="h-3 w-3" />
          Parallel
        </span>
      )}
    </div>
  );
};
