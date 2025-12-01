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

interface WorkflowAnalyticsDashboardProps {
  caseId?: string;
  onNavigateToTask?: (taskId: string) => void;
}

export const WorkflowAnalyticsDashboard: React.FC<WorkflowAnalyticsDashboardProps> = ({
  caseId,
  onNavigateToTask
}) => {
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

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
          <Button variant="outline" icon={RefreshCw} onClick={refreshAnalytics} disabled={isRefreshing}>
            Refresh
          </Button>
        }
      />

      <WorkflowMetricGrid metrics={metrics} velocity={velocity} />

      <EnterpriseCapabilitiesSection
        metrics={metrics}
        isExpanded={expandedSection === 'capabilities'}
        onToggle={() => toggleSection('capabilities')}
      />

      <StageProgressSection
        metrics={metrics}
        isExpanded={expandedSection === 'stages'}
        onToggle={() => toggleSection('stages')}
      />

      <BottleneckInsights
        bottlenecks={bottlenecks}
        isExpanded={expandedSection === 'bottlenecks'}
        onToggle={() => toggleSection('bottlenecks')}
        onNavigateToTask={onNavigateToTask}
      />

      <TaskDistributionSection metrics={metrics} />

      <SLABreachAlert metrics={metrics} onViewDetails={() => checkSLABreaches(caseId)} />
    </div>
  );
};
export default WorkflowAnalyticsDashboard;
