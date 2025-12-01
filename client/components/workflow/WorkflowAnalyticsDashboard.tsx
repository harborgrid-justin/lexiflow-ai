import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, TrendingUp, AlertTriangle, Clock, Users, CheckCircle,
  ArrowRight, Activity, Zap, Shield, GitBranch, Bell, History,
  Layers, RefreshCw, ChevronDown, ChevronUp, Target
} from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import type { WorkflowMetrics, BottleneckAnalysis, TaskVelocity } from '../../types/workflow-engine';

interface WorkflowAnalyticsDashboardProps {
  caseId?: string;
  onNavigateToTask?: (taskId: string) => void;
}

export const WorkflowAnalyticsDashboard: React.FC<WorkflowAnalyticsDashboardProps> = ({
  caseId,
  onNavigateToTask
}) => {
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null);
  const [bottlenecks, setBottlenecks] = useState<BottleneckAnalysis | null>(null);
  const [velocity, setVelocity] = useState<TaskVelocity | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  
  const { 
    getWorkflowMetrics, 
    getBottlenecks, 
    getTaskVelocity,
    checkSLABreaches,
    loading 
  } = useWorkflowEngine();

  const loadAnalytics = useCallback(async () => {
    const [m, b, v] = await Promise.all([
      getWorkflowMetrics(caseId),
      getBottlenecks(caseId),
      getTaskVelocity(caseId, 7)
    ]);
    if (m) setMetrics(m);
    if (b) setBottlenecks(b);
    if (v) setVelocity(v);
  }, [getWorkflowMetrics, getBottlenecks, getTaskVelocity, caseId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalytics();
  }, [loadAnalytics]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const completionRate = metrics ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) || 0 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Workflow Analytics
          </h2>
          <p className="text-sm text-slate-500">Enterprise workflow performance insights</p>
        </div>
        <Button variant="outline" icon={RefreshCw} onClick={loadAnalytics} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<CheckCircle className="h-5 w-5" />}
          label="Completion Rate"
          value={`${completionRate}%`}
          subValue={`${metrics?.completedTasks || 0}/${metrics?.totalTasks || 0} tasks`}
          color="green"
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Velocity"
          value={`${velocity?.velocity || 0}`}
          subValue="tasks/day (7d avg)"
          color="blue"
        />
        <MetricCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Overdue"
          value={`${metrics?.overdueTasks || 0}`}
          subValue="tasks overdue"
          color={metrics?.overdueTasks ? 'red' : 'slate'}
        />
        <MetricCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg Completion"
          value={`${metrics?.averageCompletionTime || 0}h`}
          subValue="per task"
          color="purple"
        />
      </div>

      {/* Enterprise Capabilities Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <CollapsibleSection
          title="Enterprise Capabilities"
          icon={<Zap className="h-5 w-5 text-amber-500" />}
          isExpanded={expandedSection === 'capabilities'}
          onToggle={() => toggleSection('capabilities')}
          badge={<Badge variant="success">10 Active</Badge>}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4">
            <CapabilityCard icon={<GitBranch />} title="Dependencies" status="active" />
            <CapabilityCard icon={<Shield />} title="SLA Management" status="active" count={metrics?.slaBreaches} />
            <CapabilityCard icon={<CheckCircle />} title="Approvals" status="active" />
            <CapabilityCard icon={<ArrowRight />} title="Conditions" status="active" />
            <CapabilityCard icon={<Clock />} title="Time Tracking" status="active" />
            <CapabilityCard icon={<Bell />} title="Notifications" status="active" />
            <CapabilityCard icon={<History />} title="Audit Trail" status="active" />
            <CapabilityCard icon={<Layers />} title="Parallel Tasks" status="active" />
            <CapabilityCard icon={<Users />} title="Reassignment" status="active" />
            <CapabilityCard icon={<BarChart3 />} title="Analytics" status="active" />
          </div>
        </CollapsibleSection>
      </div>

      {/* Stage Progress */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <CollapsibleSection
          title="Stage Progress"
          icon={<Target className="h-5 w-5 text-blue-500" />}
          isExpanded={expandedSection === 'stages'}
          onToggle={() => toggleSection('stages')}
        >
          <div className="p-4 space-y-4">
            {metrics?.stageProgress.map((stage, idx) => (
              <div key={stage.stageId} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">{stage.stageName}</span>
                    <span className="text-sm font-bold text-slate-900">{stage.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        stage.progress === 100 ? 'bg-green-500' :
                        stage.progress > 50 ? 'bg-blue-500' :
                        stage.progress > 0 ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Bottleneck Analysis */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <CollapsibleSection
          title="Bottleneck Analysis"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          isExpanded={expandedSection === 'bottlenecks'}
          onToggle={() => toggleSection('bottlenecks')}
          badge={bottlenecks?.blockedTasks.length ? 
            <Badge variant="error">{bottlenecks.blockedTasks.length} Blocked</Badge> : null
          }
        >
          <div className="p-4 space-y-6">
            {/* Slowest Stages */}
            {bottlenecks?.slowestStages.length ? (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Slowest Stages
                </h4>
                <div className="space-y-2">
                  {bottlenecks.slowestStages.slice(0, 3).map((stage, _idx) => (
                    <div key={stage.stageId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">{stage.name}</span>
                      <span className="text-sm font-bold text-slate-900">{stage.avgDays} days avg</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Blocked Tasks */}
            {bottlenecks?.blockedTasks.length ? (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" /> Blocked Tasks
                </h4>
                <div className="space-y-2">
                  {bottlenecks.blockedTasks.map(task => (
                    <div 
                      key={task.taskId} 
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => onNavigateToTask?.(task.taskId)}
                    >
                      <div>
                        <span className="text-sm font-medium text-red-900">{task.title}</span>
                        <p className="text-xs text-red-600">Blocked by {task.blockedBy.length} task(s)</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-red-400" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No blocked tasks</p>
              </div>
            )}

            {/* Overloaded Users */}
            {bottlenecks?.overloadedUsers.length ? (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Overloaded Team Members
                </h4>
                <div className="space-y-2">
                  {bottlenecks.overloadedUsers.map(user => (
                    <div key={user.userId} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <span className="text-sm text-amber-900">{user.userId}</span>
                      <Badge variant="warning">{user.taskCount} tasks</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </CollapsibleSection>
      </div>

      {/* Task Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* By Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Tasks by Status
          </h4>
          <div className="space-y-3">
            {metrics && Object.entries(metrics.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                <span className="flex-1 text-sm text-slate-600 capitalize">{status.replace('-', ' ')}</span>
                <span className="text-sm font-bold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Tasks by Priority
          </h4>
          <div className="space-y-3">
            {metrics && Object.entries(metrics.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                <span className="flex-1 text-sm text-slate-600 capitalize">{priority}</span>
                <span className="text-sm font-bold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Breaches Alert */}
      {metrics && metrics.slaBreaches > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-900">SLA Breaches Detected</h4>
            <p className="text-sm text-red-700">{metrics.slaBreaches} task(s) have exceeded their SLA deadlines</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => checkSLABreaches(caseId)}>
            View Details
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper Components

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: 'green' | 'blue' | 'red' | 'purple' | 'amber' | 'slate';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subValue, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-75">{subValue}</p>
    </div>
  );
};

interface CapabilityCardProps {
  icon: React.ReactNode;
  title: string;
  status: 'active' | 'inactive';
  count?: number;
}

const CapabilityCard: React.FC<CapabilityCardProps> = ({ icon, title, status, count }) => (
  <div className={`p-3 rounded-lg border text-center ${
    status === 'active' ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
  }`}>
    <div className={`mb-1 ${status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
      {icon}
    </div>
    <p className="text-xs font-medium text-slate-700">{title}</p>
    {count !== undefined && count > 0 && (
      <Badge variant="error" className="mt-1 text-[10px]">{count}</Badge>
    )}
  </div>
);

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  badge
}) => (
  <>
    <div 
      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold text-slate-900">{title}</span>
        {badge}
      </div>
      {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
    </div>
    {isExpanded && <div className="border-t border-slate-100">{children}</div>}
  </>
);

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'done':
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
    case 'active':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-slate-400';
    case 'review':
      return 'bg-amber-500';
    default:
      return 'bg-slate-300';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'bg-red-600';
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-slate-300';
  }
};

export default WorkflowAnalyticsDashboard;
