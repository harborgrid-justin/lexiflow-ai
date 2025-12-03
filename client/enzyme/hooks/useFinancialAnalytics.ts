/**
 * useFinancialAnalytics Hook
 * Financial metrics and revenue analytics
 */

import { useApiRequest } from '../services/hooks';
import { useTrackEvent } from '../index';
import { DateRange } from '../../types/analytics';

export const useFinancialAnalytics = (dateRange?: DateRange) => {
  const trackEvent = useTrackEvent();

  // Revenue metrics
  const { data: revenueMetrics, isLoading: loadingRevenue } = useApiRequest({
    endpoint: '/analytics/financial/revenue',
    options: { 
      staleTime: 5 * 60 * 1000,
      params: dateRange as any,
    },
  });

  // Revenue by month
  const { data: revenueByMonth, isLoading: loadingByMonth } = useApiRequest({
    endpoint: '/analytics/financial/revenue/by-month',
    options: { 
      staleTime: 5 * 60 * 1000,
      params: { year: new Date().getFullYear() } as any,
    },
  });

  // Revenue by client (top 10)
  const { data: revenueByClient, isLoading: loadingByClient } = useApiRequest({
    endpoint: '/analytics/financial/revenue/by-client',
    options: { 
      staleTime: 5 * 60 * 1000,
      params: { topN: 10 } as any,
    },
  });

  // Revenue by practice area
  const { data: revenueByPracticeArea, isLoading: loadingByPracticeArea } = useApiRequest({
    endpoint: '/analytics/financial/revenue/by-practice-area',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Revenue by attorney
  const { data: revenueByAttorney, isLoading: loadingByAttorney } = useApiRequest({
    endpoint: '/analytics/financial/revenue/by-attorney',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Billing metrics
  const { data: billingMetrics, isLoading: loadingBilling } = useApiRequest({
    endpoint: '/analytics/financial/billing',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // AR Aging
  const { data: arAging, isLoading: loadingARAging } = useApiRequest({
    endpoint: '/analytics/financial/ar-aging',
    options: { staleTime: 5 * 60 * 1000 },
  });

  // Collection metrics
  const { data: collectionMetrics, isLoading: loadingCollections } = useApiRequest({
    endpoint: '/analytics/financial/collections',
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
