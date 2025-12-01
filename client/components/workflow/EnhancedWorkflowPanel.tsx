import React, { useState } from 'react';
import { Layers, Settings, Play, Pause, BarChart3, RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TaskDependencyManager } from './TaskDependencyManager';
import { SLAMonitor } from './SLAMonitor';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { TimeTrackingPanel } from './TimeTrackingPanel';
import { ParallelTasksManager } from './ParallelTasksManager';
import { TaskReassignmentPanel } from './TaskReassignmentPanel';
import { NotificationCenter } from './NotificationCenter';
import { AuditTrailViewer } from './AuditTrailViewer';
import { WorkflowMetricGrid } from './analytics/WorkflowMetricGrid';
import { TaskDistributionSection } from './analytics/TaskDistributionSection';
import { SLABreachAlert } from './analytics/SLABreachAlert';
import { EnterpriseCapabilitiesSection } from './analytics/EnterpriseCapabilitiesSection';
import { StageProgressSection } from './analytics/StageProgressSection';
import { BottleneckInsights } from './analytics/BottleneckInsights';
import { useWorkflowAnalytics } from '../../hooks/useWorkflowAnalytics';

interface EnhancedWorkflowPanelProps {
  caseId: string;
  stageId?: string;
  taskId?: string;
  currentUserId: string;
  users: Array<{ id: string; name: string; role: string }>;
  tasks: Array<{ id: string; title: string; status: string; assignedTo?: string }>;
  onUpdate?: () => void;
}

export const EnhancedWorkflowPanel: React.FC<EnhancedWorkflowPanelProps> = ({
  caseId,
  stageId,
  taskId,
  currentUserId,
  users,
  tasks,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedAnalyticsSection, setExpandedAnalyticsSection] = useState<string | null>('capabilities');
  const {
    metrics,
    velocity,
    bottlenecks,
    refreshAnalytics,
    isRefreshing,
    checkSLABreaches,
  } = useWorkflowAnalytics({ caseId });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'dependencies', label: 'Dependencies', icon: Settings },
    { id: 'sla', label: 'SLA', icon: BarChart3 },
    { id: 'approvals', label: 'Approvals', icon: Play },
    { id: 'time', label: 'Time Tracking', icon: Pause },
    { id: 'parallel', label: 'Parallel Tasks', icon: Layers },
    { id: 'reassign', label: 'Reassignment', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Settings },
    { id: 'audit', label: 'Audit Trail', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const toggleAnalyticsSection = (section: string) => {
    setExpandedAnalyticsSection(prev => (prev === section ? null : section));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Master Workflow Engine
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Complete workflow orchestration with all enterprise features
              </p>
            </div>
            <Button variant="primary" onClick={onUpdate} icon={Play}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SLA Status Summary */}
                <SLAMonitor caseId={caseId} showBreachReport />
                
                {/* Notifications */}
                <NotificationCenter userId={currentUserId} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-slate-500" /> Workflow Snapshot
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RefreshCw}
                    onClick={refreshAnalytics}
                    disabled={isRefreshing}
                  >
                    Refresh
                  </Button>
                </div>
                <WorkflowMetricGrid metrics={metrics} velocity={velocity} />
                <TaskDistributionSection metrics={metrics} />
                <SLABreachAlert metrics={metrics} onViewDetails={() => checkSLABreaches(caseId)} />
              </div>
            </div>
          )}

          {/* Dependencies Tab */}
          {activeTab === 'dependencies' && taskId && (
            <TaskDependencyManager
              taskId={taskId}
              taskTitle={tasks.find(t => t.id === taskId)?.title || 'Task'}
              availableTasks={tasks}
              onUpdate={onUpdate}
            />
          )}

          {/* SLA Tab */}
          {activeTab === 'sla' && (
            <div className="space-y-6">
              {taskId && <SLAMonitor taskId={taskId} />}
              <SLAMonitor caseId={caseId} showBreachReport />
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === 'approvals' && taskId && (
            <ApprovalWorkflow
              taskId={taskId}
              taskTitle={tasks.find(t => t.id === taskId)?.title || 'Task'}
              currentUserId={currentUserId}
              users={users}
              onUpdate={onUpdate}
            />
          )}

          {/* Time Tracking Tab */}
          {activeTab === 'time' && taskId && (
            <TimeTrackingPanel
              taskId={taskId}
              taskTitle={tasks.find(t => t.id === taskId)?.title || 'Task'}
              userId={currentUserId}
              onUpdate={onUpdate}
            />
          )}

          {/* Parallel Tasks Tab */}
          {activeTab === 'parallel' && stageId && (
            <ParallelTasksManager
              stageId={stageId}
              tasks={tasks}
              onUpdate={onUpdate}
            />
          )}

          {/* Reassignment Tab */}
          {activeTab === 'reassign' && (
            <TaskReassignmentPanel
              caseId={caseId}
              currentUserId={currentUserId}
              users={users}
              tasks={tasks}
              onUpdate={onUpdate}
            />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <NotificationCenter userId={currentUserId} />
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <AuditTrailViewer caseId={caseId} limit={100} />
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-slate-500" /> Workflow Analytics
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={refreshAnalytics}
                  disabled={isRefreshing}
                >
                  Refresh
                </Button>
              </div>
              <WorkflowMetricGrid metrics={metrics} velocity={velocity} />
              <EnterpriseCapabilitiesSection
                metrics={metrics}
                isExpanded={expandedAnalyticsSection === 'capabilities'}
                onToggle={() => toggleAnalyticsSection('capabilities')}
              />
              <StageProgressSection
                metrics={metrics}
                isExpanded={expandedAnalyticsSection === 'stages'}
                onToggle={() => toggleAnalyticsSection('stages')}
              />
              <BottleneckInsights
                bottlenecks={bottlenecks}
                isExpanded={expandedAnalyticsSection === 'bottlenecks'}
                onToggle={() => toggleAnalyticsSection('bottlenecks')}
              />
              <TaskDistributionSection metrics={metrics} />
              <SLABreachAlert metrics={metrics} onViewDetails={() => checkSLABreaches(caseId)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
