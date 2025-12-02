/**
 * EnhancedWorkflowPanel - Master Workflow Engine
 *
 * ENZYME MIGRATION:
 * - Progressive hydration with HydrationBoundary for tab content
 * - Lazy loading for 8 heavy sub-components (TaskDependencyManager, SLAMonitor, ApprovalWorkflow,
 *   TimeTrackingPanel, ParallelTasksManager, TaskReassignmentPanel, NotificationCenter, AuditTrailViewer)
 * - usePageView('enhanced_workflow_panel') for page tracking
 * - useTrackEvent() for tab change and analytics interactions
 * - useLatestCallback for stable event handlers
 *
 * Tab Content Strategy:
 * - Overview: Immediate load (most common view)
 * - Dependencies, SLA, Approvals: High priority lazy load
 * - Time, Parallel, Reassign, Notifications, Audit: Normal priority lazy load
 * - Analytics: High priority (data-heavy)
 */

import React, { useState, Suspense } from 'react';
import { Layers, Settings, Play, Pause, BarChart3, RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { WorkflowMetricGrid } from './analytics/WorkflowMetricGrid';
import { TaskDistributionSection } from './analytics/TaskDistributionSection';
import { SLABreachAlert } from './analytics/SLABreachAlert';
import { EnterpriseCapabilitiesSection } from './analytics/EnterpriseCapabilitiesSection';
import { StageProgressSection } from './analytics/StageProgressSection';
import { BottleneckInsights } from './analytics/BottleneckInsights';
import { useWorkflowAnalytics } from '../../hooks/useWorkflowAnalytics';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  HydrationBoundary,
} from '../../enzyme';

// Lazy load heavy sub-components for better performance
const TaskDependencyManager = React.lazy(() => import('./TaskDependencyManager').then(m => ({ default: m.TaskDependencyManager })));
const SLAMonitor = React.lazy(() => import('./SLAMonitor').then(m => ({ default: m.SLAMonitor })));
const ApprovalWorkflow = React.lazy(() => import('./ApprovalWorkflow').then(m => ({ default: m.ApprovalWorkflow })));
const TimeTrackingPanel = React.lazy(() => import('./TimeTrackingPanel').then(m => ({ default: m.TimeTrackingPanel })));
const ParallelTasksManager = React.lazy(() => import('./ParallelTasksManager').then(m => ({ default: m.ParallelTasksManager })));
const TaskReassignmentPanel = React.lazy(() => import('./TaskReassignmentPanel').then(m => ({ default: m.TaskReassignmentPanel })));
const NotificationCenter = React.lazy(() => import('./NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const AuditTrailViewer = React.lazy(() => import('./AuditTrailViewer').then(m => ({ default: m.AuditTrailViewer })));

// Loading fallback for tab content
const TabLoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-pulse text-slate-400">Loading tab content...</div>
  </div>
);

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
  // Enzyme: Page tracking
  usePageView('enhanced_workflow_panel');
  const trackEvent = useTrackEvent();

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

  // Enzyme: Stable callback for tab changes with tracking
  const handleTabChange = useLatestCallback((tabId: string) => {
    const previousTab = activeTab;
    setActiveTab(tabId);
    trackEvent('workflow_panel_tab_changed', { tab: tabId, previousTab });
  });

  // Enzyme: Stable callback for analytics section toggle with tracking
  const handleToggleAnalyticsSection = useLatestCallback((section: string) => {
    const isExpanding = expandedAnalyticsSection !== section;
    setExpandedAnalyticsSection(prev => (prev === section ? null : section));
    trackEvent('workflow_panel_analytics_toggled', { section, expanded: isExpanding });
  });

  // Enzyme: Stable callback for refresh with tracking
  const handleRefreshAnalytics = useLatestCallback(() => {
    refreshAnalytics();
    trackEvent('workflow_panel_refreshed', { activeTab });
  });

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
                onClick={() => handleTabChange(tab.id)}
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
            <HydrationBoundary id="workflow-overview" priority="high" trigger="immediate">
              <Suspense fallback={<TabLoadingFallback />}>
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
                        onClick={handleRefreshAnalytics}
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
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Dependencies Tab */}
          {activeTab === 'dependencies' && taskId && (
            <HydrationBoundary id="workflow-dependencies" priority="high" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <TaskDependencyManager
                  taskId={taskId}
                  taskTitle={tasks.find(t => t.id === taskId)?.title || 'Task'}
                  availableTasks={tasks}
                  onUpdate={onUpdate}
                />
              </Suspense>
            </HydrationBoundary>
          )}

          {/* SLA Tab */}
          {activeTab === 'sla' && (
            <HydrationBoundary id="workflow-sla" priority="high" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <div className="space-y-6">
                  {taskId && <SLAMonitor taskId={taskId} />}
                  <SLAMonitor caseId={caseId} showBreachReport />
                </div>
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Approvals Tab */}
          {activeTab === 'approvals' && taskId && (
            <HydrationBoundary id="workflow-approvals" priority="high" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <ApprovalWorkflow
                  taskId={taskId}
                  taskTitle={tasks.find(t => t.id === taskId)?.title || 'Task'}
                  currentUserId={currentUserId}
                  users={users}
                  onUpdate={onUpdate}
                />
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Time Tracking Tab */}
          {activeTab === 'time' && taskId && (
            <HydrationBoundary id="workflow-time" priority="normal" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <TimeTrackingPanel
                  taskId={taskId}
                  taskTitle={tasks.find(t => t.id === taskId)?.title || 'Task'}
                  userId={currentUserId}
                  onUpdate={onUpdate}
                />
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Parallel Tasks Tab */}
          {activeTab === 'parallel' && stageId && (
            <HydrationBoundary id="workflow-parallel" priority="normal" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <ParallelTasksManager
                  stageId={stageId}
                  tasks={tasks}
                  onUpdate={onUpdate}
                />
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Reassignment Tab */}
          {activeTab === 'reassign' && (
            <HydrationBoundary id="workflow-reassign" priority="normal" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <TaskReassignmentPanel
                  caseId={caseId}
                  currentUserId={currentUserId}
                  users={users}
                  tasks={tasks}
                  onUpdate={onUpdate}
                />
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <HydrationBoundary id="workflow-notifications" priority="normal" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <NotificationCenter userId={currentUserId} />
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <HydrationBoundary id="workflow-audit" priority="normal" trigger="visible">
              <Suspense fallback={<TabLoadingFallback />}>
                <AuditTrailViewer caseId={caseId} limit={100} />
              </Suspense>
            </HydrationBoundary>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <HydrationBoundary id="workflow-analytics" priority="high" trigger="visible">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-slate-500" /> Workflow Analytics
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RefreshCw}
                    onClick={handleRefreshAnalytics}
                    disabled={isRefreshing}
                  >
                    Refresh
                  </Button>
                </div>
                <WorkflowMetricGrid metrics={metrics} velocity={velocity} />
                <EnterpriseCapabilitiesSection
                  metrics={metrics}
                  isExpanded={expandedAnalyticsSection === 'capabilities'}
                  onToggle={() => handleToggleAnalyticsSection('capabilities')}
                />
                <StageProgressSection
                  metrics={metrics}
                  isExpanded={expandedAnalyticsSection === 'stages'}
                  onToggle={() => handleToggleAnalyticsSection('stages')}
                />
                <BottleneckInsights
                  bottlenecks={bottlenecks}
                  isExpanded={expandedAnalyticsSection === 'bottlenecks'}
                  onToggle={() => handleToggleAnalyticsSection('bottlenecks')}
                />
                <TaskDistributionSection metrics={metrics} />
                <SLABreachAlert metrics={metrics} onViewDetails={() => checkSLABreaches(caseId)} />
              </div>
            </HydrationBoundary>
          )}
        </div>
      </div>
    </div>
  );
};
