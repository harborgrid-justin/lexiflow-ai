/**
 * useAnalyticsMetrics Hook
 * Comprehensive hook for fetching various analytics metrics with Enzyme
 */

import { useApiRequest, useTrackEvent, useIsMounted } from '../enzyme';
import { ApiService } from '../services/apiService';
import { DateRange } from '../types/analytics';
import { useEffect } from 'react';

interface UseAnalyticsMetricsOptions {
  dateRange?: DateRange;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useAnalyticsMetrics = (options: UseAnalyticsMetricsOptions = {}) => {
  const { dateRange, autoRefresh = false, refreshInterval = 5 * 60 * 1000 } = options;
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // Executive Dashboard Metrics
  const {
    data: executiveDashboard,
    isLoading: loadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useApiRequest({
    endpoint: '/api/v1/analytics/executive/dashboard',
    params: dateRange,
    options: {
      staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
      enabled: true,
    },
  });

  // KPI Metrics
  const {
    data: kpiMetrics,
    isLoading: loadingKPIs,
    refetch: refetchKPIs,
  } = useApiRequest({
    endpoint: '/api/v1/analytics/executive/metrics',
    params: dateRange,
    options: {
      staleTime: 2 * 60 * 1000,
    },
  });

  // Case Analytics
  const {
    data: caseAnalytics,
    isLoading: loadingCases,
    refetch: refetchCases,
  } = useApiRequest({
    endpoint: '/api/v1/analytics/cases',
    params: dateRange,
    options: {
      staleTime: 5 * 60 * 1000,
    },
  });

  // Financial Analytics
  const {
    data: financialAnalytics,
    isLoading: loadingFinancial,
    refetch: refetchFinancial,
  } = useApiRequest({
    endpoint: '/api/v1/analytics/financial',
    params: dateRange,
    options: {
      staleTime: 5 * 60 * 1000,
    },
  });

  // Productivity Analytics
  const {
    data: productivityAnalytics,
    isLoading: loadingProductivity,
    refetch: refetchProductivity,
  } = useApiRequest({
    endpoint: '/api/v1/analytics/productivity',
    params: dateRange,
    options: {
      staleTime: 5 * 60 * 1000,
    },
  });

  // Track analytics page views
  useEffect(() => {
    if (isMounted() && executiveDashboard) {
      trackEvent('analytics_metrics_loaded', {
        dateRange: dateRange ? `${dateRange.start} to ${dateRange.end}` : 'default',
        hasData: !!executiveDashboard,
      });
    }
  }, [executiveDashboard, dateRange, trackEvent, isMounted]);

  // Refresh all metrics
  const refreshAll = () => {
    if (!isMounted()) return;

    trackEvent('analytics_refresh_all', {
      timestamp: new Date().toISOString(),
    });

    refetchDashboard();
    refetchKPIs();
    refetchCases();
    refetchFinancial();
    refetchProductivity();
  };

  return {
    // Data
    executiveDashboard,
    kpiMetrics,
    caseAnalytics,
    financialAnalytics,
    productivityAnalytics,

    // Loading states
    isLoading:
      loadingDashboard ||
      loadingKPIs ||
      loadingCases ||
      loadingFinancial ||
      loadingProductivity,
    loadingDashboard,
    loadingKPIs,
    loadingCases,
    loadingFinancial,
    loadingProductivity,

    // Errors
    dashboardError,

    // Actions
    refreshAll,
    refetchDashboard,
    refetchKPIs,
    refetchCases,
    refetchFinancial,
    refetchProductivity,
  };
};
