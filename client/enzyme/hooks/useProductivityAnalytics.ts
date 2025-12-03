/**
 * useProductivityAnalytics Hook
 * Productivity metrics and team performance
 */

import { useApiRequest } from '../services/hooks';
import { useTrackEvent } from '../index';
import { AnalyticsFilters } from '../../types/analytics';

export const useProductivityAnalytics = (filters?: AnalyticsFilters) => {
  const trackEvent = useTrackEvent();

  // Productivity overview
  const { data: overview, isLoading: loadingOverview } = useApiRequest({
    endpoint: '/analytics/productivity',
    options: { 
      staleTime: 5 * 60 * 1000,
      params: filters as any,
    },
  });

  // Productivity by attorney
  const { data: byAttorney, isLoading: loadingByAttorney } = useApiRequest({
    endpoint: '/analytics/productivity/by-attorney',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Productivity by department
  const { data: byDepartment, isLoading: loadingByDepartment } = useApiRequest({
    endpoint: '/analytics/productivity/by-department',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Utilization rates
  const { data: utilizationRates, isLoading: loadingUtilization } = useApiRequest({
    endpoint: '/analytics/productivity/utilization',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Task metrics
  const { data: taskMetrics, isLoading: loadingTasks } = useApiRequest({
    endpoint: '/analytics/productivity/tasks',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Document metrics
  const { data: documentMetrics, isLoading: loadingDocuments } = useApiRequest({
    endpoint: '/analytics/productivity/documents',
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
