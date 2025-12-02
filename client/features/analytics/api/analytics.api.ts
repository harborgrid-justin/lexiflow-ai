/**
 * Analytics API Hooks
 * TanStack Query hooks for analytics operations
 */

import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  caseMetrics: () => [...analyticsKeys.all, 'cases'] as const,
  financialMetrics: () => [...analyticsKeys.all, 'financial'] as const,
  productivityMetrics: () => [...analyticsKeys.all, 'productivity'] as const,
  workflowMetrics: () => [...analyticsKeys.all, 'workflow'] as const,
  reports: () => [...analyticsKeys.all, 'reports'] as const,
  report: (id: string) => [...analyticsKeys.reports(), id] as const,
};

// Queries
export function useAnalyticsDashboard(dateRange?: { start: string; end: string }) {
  return useQuery({
    queryKey: [...analyticsKeys.dashboard(), dateRange],
    queryFn: () => ApiService.analytics.getExecutiveDashboard(dateRange),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCaseMetrics(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...analyticsKeys.caseMetrics(), filters],
    queryFn: () => ApiService.analytics.getCaseAnalytics(filters),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFinancialMetrics(dateRange?: { start: string; end: string }) {
  return useQuery({
    queryKey: [...analyticsKeys.financialMetrics(), dateRange],
    queryFn: () => ApiService.analytics.getFinancialAnalytics(dateRange),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProductivityMetrics() {
  return useQuery({
    queryKey: analyticsKeys.productivityMetrics(),
    queryFn: () => ApiService.analytics.getProductivityAnalytics(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useWorkflowMetrics() {
  return useQuery({
    queryKey: analyticsKeys.workflowMetrics(),
    queryFn: () => ApiService.analytics.getTaskMetrics(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useReports() {
  return useQuery({
    queryKey: analyticsKeys.reports(),
    queryFn: () => ApiService.analytics.getReports(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: analyticsKeys.report(id),
    queryFn: () => ApiService.analytics.getReport(id),
    enabled: !!id,
  });
}
