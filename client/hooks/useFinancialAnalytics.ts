/**
 * useFinancialAnalytics Hook
 * Financial metrics and revenue analytics
 */

import { useApiRequest, useTrackEvent } from '../enzyme';
import { DateRange } from '../types/analytics';

export const useFinancialAnalytics = (dateRange?: DateRange) => {
  const trackEvent = useTrackEvent();

  // Revenue metrics
  const { data: revenueMetrics, isLoading: loadingRevenue } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/revenue',
    params: dateRange,
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Revenue by month
  const { data: revenueByMonth, isLoading: loadingByMonth } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/revenue/by-month',
    params: { year: new Date().getFullYear() },
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Revenue by client (top 10)
  const { data: revenueByClient, isLoading: loadingByClient } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/revenue/by-client',
    params: { topN: 10 },
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Revenue by practice area
  const { data: revenueByPracticeArea, isLoading: loadingByPracticeArea } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/revenue/by-practice-area',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Revenue by attorney
  const { data: revenueByAttorney, isLoading: loadingByAttorney } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/revenue/by-attorney',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Billing metrics
  const { data: billingMetrics, isLoading: loadingBilling } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/billing',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // AR Aging
  const { data: arAging, isLoading: loadingARAging } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/ar-aging',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Collection metrics
  const { data: collectionMetrics, isLoading: loadingCollections } = useApiRequest({
    endpoint: '/api/v1/analytics/financial/collections',
    options: { staleTime: 5 * 60 * 1000 },
  });

  const trackExport = (format: string) => {
    trackEvent('financial_analytics_export', {
      format,
      dateRange: dateRange ? `${dateRange.start} to ${dateRange.end}` : 'all',
      timestamp: new Date().toISOString(),
    });
  };

  return {
    revenueMetrics,
    revenueByMonth,
    revenueByClient,
    revenueByPracticeArea,
    revenueByAttorney,
    billingMetrics,
    arAging,
    collectionMetrics,
    isLoading:
      loadingRevenue ||
      loadingByMonth ||
      loadingByClient ||
      loadingByPracticeArea ||
      loadingByAttorney ||
      loadingBilling ||
      loadingARAging ||
      loadingCollections,
    trackExport,
  };
};
