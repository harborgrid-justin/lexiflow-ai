/**
 * Analytics API Hooks
 * TanStack Query hooks for analytics operations
 */

import { useQuery } from '@tanstack/react-query';
import { enzymeAnalyticsService } from '../../../enzyme/services/misc.service';

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
    queryFn: () => enzymeAnalyticsService.getExecutiveDashboard(dateRange),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCaseMetrics(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...analyticsKeys.caseMetrics(), filters],
    queryFn: () => enzymeAnalyticsService.cases.getAnalytics(filters),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFinancialMetrics(dateRange?: { start: string; end: string }) {
  return useQuery({
    queryKey: [...analyticsKeys.financialMetrics(), dateRange],
    queryFn: () => enzymeAnalyticsService.financial.getAnalytics(dateRange),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProductivityMetrics() {
  return useQuery({
    queryKey: analyticsKeys.productivityMetrics(),
    queryFn: () => enzymeAnalyticsService.productivity.getAnalytics(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useWorkflowMetrics() {
  return useQuery({
    queryKey: analyticsKeys.workflowMetrics(),
    queryFn: () => enzymeAnalyticsService.productivity.getTaskMetrics(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useReports() {
  return useQuery({
    queryKey: analyticsKeys.reports(),
    queryFn: () => enzymeAnalyticsService.reports.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: analyticsKeys.report(id),
    queryFn: () => enzymeAnalyticsService.reports.getById(id),
    enabled: !!id,
  });
}
