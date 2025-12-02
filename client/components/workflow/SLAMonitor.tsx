/**
 * ENZYME MIGRATION - SLAMonitor.tsx
 *
 * Enzyme Features Implemented:
 * - useTrackEvent: Analytics tracking for SLA status loads and breach reports
 * - useLatestCallback: Stable callbacks for async SLA data fetching
 * - useIsMounted: Safe state updates after async fetch operations
 *
 * Analytics Events:
 * - sla_status_loaded: Tracks when SLA status is fetched (includes status type)
 * - sla_breach_report_loaded: Tracks breach report loads (includes breach/warning counts)
 *
 * Migration Date: December 2, 2025
 * Agent: Agent 24
 */

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Card } from '../common/Card';
import { COLORS } from '../../constants/design-tokens';
import type { TaskSLAStatus, SLABreachReport } from '../../types/workflow-engine';
import { useTrackEvent, useLatestCallback, useIsMounted } from '../../enzyme';

interface SLAMonitorProps {
  taskId?: string;
  caseId?: string;
  showBreachReport?: boolean;
}

export const SLAMonitor: React.FC<SLAMonitorProps> = ({
  taskId,
  caseId,
  showBreachReport = false
}) => {
  const { getTaskSLAStatus, checkSLABreaches } = useWorkflowEngine();
  const [slaStatus, setSlaStatus] = useState<TaskSLAStatus | null>(null);
  const [breachReport, setBreachReport] = useState<SLABreachReport | null>(null);
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const loadTaskSLA = useLatestCallback(async () => {
    if (!taskId) return;
    const status = await getTaskSLAStatus(taskId);
    if (isMounted() && status) {
      setSlaStatus(status);
      // Track SLA status load with status type
      trackEvent('sla_status_loaded', {
        status: status.status // breached, warning, or on_track
      });
    }
  });

  const loadBreachReport = useLatestCallback(async () => {
    const report = await checkSLABreaches(caseId);
    if (isMounted() && report) {
      setBreachReport(report);
      // Track breach report load with counts
      trackEvent('sla_breach_report_loaded', {
        breachCount: report.breaches.length,
        warningCount: report.warnings.length
      });
    }
  });

  useEffect(() => {
    if (taskId) {
      loadTaskSLA();
    } else if (showBreachReport) {
      loadBreachReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, caseId, showBreachReport]);

  const getSLAIcon = (status: string) => {
    switch (status) {
      case 'breached':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'breached':
        return `${COLORS.status.error.bg} ${COLORS.status.error.border} ${COLORS.status.error.text}`;
      case 'warning':
        return `${COLORS.status.warning.bg} ${COLORS.status.warning.border} ${COLORS.status.warning.text}`;
      default:
        return `${COLORS.status.success.bg} ${COLORS.status.success.border} ${COLORS.status.success.text}`;
    }
  };

  if (showBreachReport && breachReport) {
    return (
      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">SLA Breach Report</h3>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {breachReport.breaches.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Breached ({breachReport.breaches.length})
              </h4>
              <div className="space-y-2">
                {breachReport.breaches.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-red-50 border border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-900">
                        {task.title}
                      </span>
                      <span className="text-xs text-red-700">
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {breachReport.warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-800 mb-2">
                Warnings ({breachReport.warnings.length})
              </h4>
              <div className="space-y-2">
                {breachReport.warnings.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-amber-50 border border-amber-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-900">
                        {task.title}
                      </span>
                      <span className="text-xs text-amber-700">
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {breachReport.breaches.length === 0 && breachReport.warnings.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p className="text-sm">All tasks are within SLA</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (taskId && slaStatus) {
    return (
      <div className={`p-3 rounded-lg border flex items-center gap-3 ${getSLAColor(slaStatus.status)}`}>
        {getSLAIcon(slaStatus.status)}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {slaStatus.status === 'breached'
                ? 'SLA Breached'
                : slaStatus.status === 'warning'
                ? 'SLA Warning'
                : 'Within SLA'}
            </span>
            {slaStatus.rule && (
              <span className="text-xs opacity-75">
                {slaStatus.rule.priority} Priority
              </span>
            )}
          </div>
          {slaStatus.hoursRemaining !== undefined && (
            <p className="text-xs mt-1">
              {Math.round(slaStatus.hoursRemaining)} hours remaining
            </p>
          )}
          {slaStatus.hoursOverdue !== undefined && (
            <p className="text-xs mt-1">
              {Math.round(slaStatus.hoursOverdue)} hours overdue
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
};
