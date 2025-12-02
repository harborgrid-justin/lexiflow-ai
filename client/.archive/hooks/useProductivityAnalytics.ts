/**
 * useProductivityAnalytics Hook
 * Productivity metrics and team performance
 */

import { useApiRequest, useTrackEvent } from '../enzyme';
import { AnalyticsFilters } from '../types/analytics';

export const useProductivityAnalytics = (filters?: AnalyticsFilters) => {
  const trackEvent = useTrackEvent();

  // Productivity overview
  const { data: overview, isLoading: loadingOverview } = useApiRequest({
    endpoint: '/api/v1/analytics/productivity',
    params: filters,
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Productivity by attorney
  const { data: byAttorney, isLoading: loadingByAttorney } = useApiRequest({
    endpoint: '/api/v1/analytics/productivity/by-attorney',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Productivity by department
  const { data: byDepartment, isLoading: loadingByDepartment } = useApiRequest({
    endpoint: '/api/v1/analytics/productivity/by-department',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Utilization rates
  const { data: utilizationRates, isLoading: loadingUtilization } = useApiRequest({
    endpoint: '/api/v1/analytics/productivity/utilization',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Task metrics
  const { data: taskMetrics, isLoading: loadingTasks } = useApiRequest({
    endpoint: '/api/v1/analytics/productivity/tasks',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Document metrics
  const { data: documentMetrics, isLoading: loadingDocuments } = useApiRequest({
    endpoint: '/api/v1/analytics/productivity/documents',
    options: { staleTime: 5 * 60 * 1000 },
  });

  const trackLeaderboardView = (category: string) => {
    trackEvent('productivity_leaderboard_view', {
      category,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    overview,
    byAttorney,
    byDepartment,
    utilizationRates,
    taskMetrics,
    documentMetrics,
    isLoading:
      loadingOverview ||
      loadingByAttorney ||
      loadingByDepartment ||
      loadingUtilization ||
      loadingTasks ||
      loadingDocuments,
    trackLeaderboardView,
  };
};
