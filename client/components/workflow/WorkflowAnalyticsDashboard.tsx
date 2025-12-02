/**
 * ENZYME MIGRATION - WorkflowAnalyticsDashboard Component
 *
 * Migration completed: December 1, 2025 (Wave 2, Agent 11)
 *
 * Enzyme Features Applied:
 * - usePageView('workflow_analytics_dashboard') - Page tracking
 * - useTrackEvent() - Event tracking for section toggles and analytics refresh
 * - useLatestCallback() - Stable callbacks for toggleSection with tracking
 * - HydrationBoundary - Progressive hydration for analytics sections:
 *   - HIGH priority: WorkflowMetricGrid (above fold, critical metrics)
 *   - NORMAL priority: EnterpriseCapabilities, StageProgress, BottleneckInsights
 *   - LOW priority: TaskDistribution, SLABreachAlert
 *
 * Tracked Events:
 * - workflow_analytics_section_toggled: { section: string, expanded: boolean }
 * - workflow_analytics_refreshed: { caseId?: string }
 *
 * @see /client/enzyme/MIGRATION_SCRATCHPAD.md
 */

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../common/Button';
import { useWorkflowAnalytics } from '../../hooks/useWorkflowAnalytics';
import { WorkflowMetricGrid } from './analytics/WorkflowMetricGrid';
import { EnterpriseCapabilitiesSection } from './analytics/EnterpriseCapabilitiesSection';
import { StageProgressSection } from './analytics/StageProgressSection';
import { BottleneckInsights } from './analytics/BottleneckInsights';
import { TaskDistributionSection } from './analytics/TaskDistributionSection';
import { SLABreachAlert } from './analytics/SLABreachAlert';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  HydrationBoundary,
} from '../../enzyme';

interface WorkflowAnalyticsDashboardProps {
  caseId?: string;
  onNavigateToTask?: (taskId: string) => void;
}

export const WorkflowAnalyticsDashboard: React.FC<WorkflowAnalyticsDashboardProps> = ({
  caseId,
  onNavigateToTask
}) => {
  // Enzyme: Page tracking
  usePageView('workflow_analytics_dashboard');

  // Enzyme: Event tracking
  const trackEvent = useTrackEvent();

  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const {
    metrics,
    bottlenecks,
    velocity,
    refreshAnalytics,
    isRefreshing,
    hasLoaded,
    checkSLABreaches,
  } = useWorkflowAnalytics({ caseId });

  // Enzyme: Stable callback for section toggling with analytics tracking
  const toggleSection = useLatestCallback((section: string) => {
    const willExpand = expandedSection !== section;
    setExpandedSection(willExpand ? section : null);

    trackEvent('workflow_analytics_section_toggled', {
      section,
      expanded: willExpand
    });
  });

  // Enzyme: Wrapped refresh handler with tracking
  const handleRefresh = useLatestCallback(() => {
    refreshAnalytics();
    trackEvent('workflow_analytics_refreshed', { caseId });
  });

  if (!hasLoaded && isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Workflow Analytics"
        subtitle="Enterprise workflow performance insights"
        actions={
          <Button variant="outline" icon={RefreshCw} onClick={handleRefresh} disabled={isRefreshing}>
            Refresh
          </Button>
        }
      />

      {/* Enzyme: HIGH priority - Critical metrics above the fold */}
      <HydrationBoundary id="workflow-metrics" priority="high" trigger="immediate">
        <WorkflowMetricGrid metrics={metrics} velocity={velocity} />
      </HydrationBoundary>

      {/* Enzyme: NORMAL priority - Important expandable sections */}
      <HydrationBoundary id="workflow-capabilities" priority="normal" trigger="visible">
        <EnterpriseCapabilitiesSection
          metrics={metrics}
          isExpanded={expandedSection === 'capabilities'}
          onToggle={() => toggleSection('capabilities')}
        />
      </HydrationBoundary>

      <HydrationBoundary id="workflow-stages" priority="normal" trigger="visible">
        <StageProgressSection
          metrics={metrics}
          isExpanded={expandedSection === 'stages'}
          onToggle={() => toggleSection('stages')}
        />
      </HydrationBoundary>

      <HydrationBoundary id="workflow-bottlenecks" priority="normal" trigger="visible">
        <BottleneckInsights
          bottlenecks={bottlenecks}
          isExpanded={expandedSection === 'bottlenecks'}
          onToggle={() => toggleSection('bottlenecks')}
          onNavigateToTask={onNavigateToTask}
        />
      </HydrationBoundary>

      {/* Enzyme: LOW priority - Below-the-fold analytics */}
      <HydrationBoundary id="workflow-distribution" priority="low" trigger="idle">
        <TaskDistributionSection metrics={metrics} />
      </HydrationBoundary>

      <HydrationBoundary id="workflow-sla" priority="low" trigger="idle">
        <SLABreachAlert metrics={metrics} onViewDetails={() => checkSLABreaches(caseId)} />
      </HydrationBoundary>
    </div>
  );
};
export default WorkflowAnalyticsDashboard;
