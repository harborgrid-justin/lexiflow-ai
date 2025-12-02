/**
 * useWorkflowAnalytics Hook - ENZYME MIGRATION COMPLETE
 *
 * Aggregates workflow analytics data from multiple API endpoints using Enzyme's
 * parallel data fetching pattern with useApiRequest hooks.
 *
 * ENZYME FEATURES APPLIED:
 * ✅ useApiRequest - Parallel data fetching for metrics, bottlenecks, and velocity
 * ✅ useAsyncWithRecovery - Error recovery for manual refresh operations
 * ✅ useIsMounted - Safe state updates after async refresh
 * ✅ useLatestCallback - Stable callback reference for refreshAnalytics
 *
 * MIGRATION NOTES:
 * - Replaced Promise.all pattern with multiple useApiRequest hooks
 * - Each analytics endpoint has its own query with automatic caching/refetching
 * - refreshAnalytics uses useAsyncWithRecovery for manual refresh with error handling
 * - Added isMounted guard to prevent state updates on unmounted component
 * - checkSLABreaches passed through from useWorkflowEngine for SLA monitoring
 *
 * @see /client/enzyme/MIGRATION_PLAN.md - Wave 5 Hooks Migration
 * @see /client/enzyme/LESSONS_LEARNED.md - Agent 35 learnings
 */

import { useEffect } from 'react';
import type { WorkflowMetrics, BottleneckAnalysis, TaskVelocity, SLABreachReport } from '../types/workflow-engine';
import {
  useApiRequest,
  useIsMounted,
  useLatestCallback,
  useAsyncWithRecovery
} from '../enzyme';
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
    ? `/api/v1/workflow/engine/analytics/metrics?caseId=${caseId}`
    : `/api/v1/workflow/engine/analytics/metrics`;

  const bottlenecksUrl = caseId
    ? `/api/v1/workflow/engine/analytics/bottlenecks?caseId=${caseId}`
    : `/api/v1/workflow/engine/analytics/bottlenecks`;

  const velocityParams = new URLSearchParams();
  if (caseId) velocityParams.append('caseId', caseId);
  if (velocityWindow) velocityParams.append('days', velocityWindow.toString());
  const velocityUrl = `/api/v1/workflow/engine/analytics/velocity${velocityParams.toString() ? `?${velocityParams.toString()}` : ''}`;

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

  // Manual refresh with error recovery
  const { execute: refreshAnalytics } = useAsyncWithRecovery(
    useLatestCallback(async () => {
      // Trigger refetch for all three queries in parallel
      const refetchPromises = [
        refetchMetrics(),
        refetchBottlenecks(),
        refetchVelocity(),
      ];

      await Promise.all(refetchPromises);

      // Safe state update check (useAsyncWithRecovery handles state, but we guard for completeness)
      if (!isMounted()) {
        return;
      }
    }),
    {
      onError: (error) => {
        console.error('Failed to refresh workflow analytics:', error);
      },
      retryCount: 1,
      retryDelay: 1000,
    }
  );

  // Wrap checkSLABreaches with useLatestCallback for stable reference
  const checkSLABreaches = useLatestCallback(async (caseIdParam?: string): Promise<SLABreachReport | null> => {
    return checkSLABreachesOriginal(caseIdParam);
  });

  return {
    metrics: metrics ?? null,
    bottlenecks: bottlenecks ?? null,
    velocity: velocity ?? null,
    refreshAnalytics,
    isRefreshing,
    hasLoaded,
    checkSLABreaches,
  };
};

export default useWorkflowAnalytics;
