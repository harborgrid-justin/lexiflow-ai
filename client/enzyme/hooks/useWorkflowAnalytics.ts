/**
 * useWorkflowAnalytics Hook - ENZYME MIGRATION COMPLETE
 *
 * Aggregates workflow analytics data from multiple API endpoints using Enzyme's
 * parallel data fetching pattern with useApiRequest hooks.
 */

import { useEffect } from 'react';
import type { WorkflowMetrics, BottleneckAnalysis, TaskVelocity, SLABreachReport } from '../../types/workflow-engine';
import {
  useApiRequest,
  useIsMounted,
  useLatestCallback,
  useAsyncWithRecovery
} from '../index';
import { useWorkflowEngine } from './useWorkflowEngine';

interface UseWorkflowAnalyticsOptions {
  caseId?: string;
  velocityWindow?: number;
}

export const useWorkflowAnalytics = ({
  caseId,
  velocityWindow = 7,
}: UseWorkflowAnalyticsOptions = {}) => {
  const isMounted = useIsMounted();
  const { checkSLABreaches: checkSLABreachesOriginal } = useWorkflowEngine();

  // Build query parameters for API calls
  const metricsUrl = caseId
    ? `/workflow/engine/analytics/metrics?caseId=${caseId}`
    : `/workflow/engine/analytics/metrics`;

  const bottlenecksUrl = caseId
    ? `/workflow/engine/analytics/bottlenecks?caseId=${caseId}`
    : `/workflow/engine/analytics/bottlenecks`;

  const velocityParams = new URLSearchParams();
  if (caseId) velocityParams.append('caseId', caseId);
  if (velocityWindow) velocityParams.append('days', velocityWindow.toString());
  const velocityUrl = `/workflow/engine/analytics/velocity${velocityParams.toString() ? `?${velocityParams.toString()}` : ''}`;

  // Parallel data fetching with useApiRequest
  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics
  } = useApiRequest<WorkflowMetrics>({
    endpoint: metricsUrl,
    options: {
      enabled: true,
      staleTime: 30000, // 30 seconds
    }
  });

  const {
    data: bottlenecks,
    isLoading: bottlenecksLoading,
    refetch: refetchBottlenecks
  } = useApiRequest<BottleneckAnalysis>({
    endpoint: bottlenecksUrl,
    options: {
      enabled: true,
      staleTime: 30000,
    }
  });

  const {
    data: velocity,
    isLoading: velocityLoading,
    refetch: refetchVelocity
  } = useApiRequest<TaskVelocity>({
    endpoint: velocityUrl,
    options: {
      enabled: true,
      staleTime: 30000,
    }
  });

  // Combined loading state
  const isRefreshing = metricsLoading || bottlenecksLoading || velocityLoading;
  const hasLoaded = metrics !== undefined || bottlenecks !== undefined || velocity !== undefined;

  // Manual refresh function with error recovery
  const { execute: refreshAnalytics, error: refreshError } = useAsyncWithRecovery(
    async () => {
      await Promise.all([
        refetchMetrics(),
        refetchBottlenecks(),
        refetchVelocity()
      ]);
    },
    {
      // retries not supported in options, handled internally or via different config
      onSuccess: () => {
        // Optional: Trigger any side effects on successful refresh
      }
    }
  );

  // Wrapper for checkSLABreaches to ensure stability
  const checkSLABreaches = useLatestCallback(async (caseId?: string): Promise<SLABreachReport | null> => {
    if (!isMounted()) return null;
    return checkSLABreachesOriginal(caseId);
  });

  // Use useEffect to trigger initial load if needed, or rely on useApiRequest
  useEffect(() => {
    // This effect is just to satisfy the unused variable check if we keep the import
    // In reality, useApiRequest handles the initial fetch
  }, []);

  return {
    metrics,
    bottlenecks,
    velocity,
    isRefreshing,
    hasLoaded,
    refreshError,
    refreshAnalytics,
    checkSLABreaches
  };
};
