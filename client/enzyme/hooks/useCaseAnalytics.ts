/**
 * useCaseAnalytics Hook
 * Dedicated hook for case analytics with drill-down capabilities
 */

import { useApiRequest } from '../services/hooks';
import { useTrackEvent } from '../index';
import { AnalyticsFilters } from '../../types/analytics';

export const useCaseAnalytics = (filters?: AnalyticsFilters) => {
  const trackEvent = useTrackEvent();

  // Case overview
  const { data: overview, isLoading: loadingOverview } = useApiRequest({
    endpoint: '/analytics/cases',
    options: { 
      staleTime: 5 * 60 * 1000,
      params: filters as any,
    },
  });

  // Cases by status
  const { data: byStatus, isLoading: loadingByStatus } = useApiRequest({
    endpoint: '/analytics/cases/by-status',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Cases by practice area
  const { data: byPracticeArea, isLoading: loadingByPracticeArea } = useApiRequest({
    endpoint: '/analytics/cases/by-practice-area',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Cases by attorney
  const { data: byAttorney, isLoading: loadingByAttorney } = useApiRequest({
    endpoint: '/analytics/cases/by-attorney',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Cases by court
  const { data: byCourt, isLoading: loadingByCourt } = useApiRequest({
    endpoint: '/analytics/cases/by-court',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Case age distribution
  const { data: ageDistribution, isLoading: loadingAgeDistribution } = useApiRequest({
    endpoint: '/analytics/cases/age-distribution',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Win/Loss ratio
  const { data: winLossRatio, isLoading: loadingWinLoss } = useApiRequest({
    endpoint: '/analytics/cases/win-loss-ratio',
    options: { staleTime: 5 * 60 * 1000 },
  });

  const trackDrilldown = (dimension: string, value: string) => {
    trackEvent('case_analytics_drilldown', {
      dimension,
      value,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    overview,
    byStatus,
    byPracticeArea,
    byAttorney,
    byCourt,
    ageDistribution,
    winLossRatio,
    isLoading:
      loadingOverview ||
      loadingByStatus ||
      loadingByPracticeArea ||
      loadingByAttorney ||
      loadingByCourt ||
      loadingAgeDistribution ||
      loadingWinLoss,
    trackDrilldown,
  };
};
