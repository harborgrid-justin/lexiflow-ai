import { useState, useCallback, useEffect } from 'react';
import type { WorkflowMetrics, BottleneckAnalysis, TaskVelocity } from '../types/workflow-engine';
import { useWorkflowEngine } from './useWorkflowEngine';

interface UseWorkflowAnalyticsOptions {
  caseId?: string;
  velocityWindow?: number;
}

export const useWorkflowAnalytics = ({
  caseId,
  velocityWindow = 7,
}: UseWorkflowAnalyticsOptions = {}) => {
  const { getWorkflowMetrics, getBottlenecks, getTaskVelocity, checkSLABreaches } = useWorkflowEngine();
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null);
  const [bottlenecks, setBottlenecks] = useState<BottleneckAnalysis | null>(null);
  const [velocity, setVelocity] = useState<TaskVelocity | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const refreshAnalytics = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [metricsData, bottleneckData, velocityData] = await Promise.all([
        getWorkflowMetrics(caseId),
        getBottlenecks(caseId),
        getTaskVelocity(caseId, velocityWindow),
      ]);

      setMetrics(metricsData ?? null);
      setBottlenecks(bottleneckData ?? null);
      setVelocity(velocityData ?? null);
      setHasLoaded(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [caseId, getWorkflowMetrics, getBottlenecks, getTaskVelocity, velocityWindow]);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  return {
    metrics,
    bottlenecks,
    velocity,
    refreshAnalytics,
    isRefreshing,
    hasLoaded,
    checkSLABreaches,
  };
};

export default useWorkflowAnalytics;
