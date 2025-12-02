/**
 * Analytics Feature Module
 */

// API Hooks
export {
  analyticsKeys,
  useCaseMetrics,
  useFinancialMetrics,
  useProductivityMetrics,
  useWorkflowMetrics,
  useReports,
  useReport,
} from './api/analytics.api';

// Feature Hooks
export { useAnalyticsDashboard } from './hooks/useAnalyticsDashboard';

// Types
export type {
  AnalyticsDateRange,
  AnalyticsDashboard,
  CaseAnalytics,
  FinancialAnalytics,
  ProductivityAnalytics,
  WorkflowAnalytics,
  TrendData,
  MonthlyData,
  ClientMetric,
  AttorneyHours,
  Bottleneck,
  SavedReport,
  ReportSchedule,
  AnalyticsViewMode,
} from './api/analytics.types';

// Store
export { useAnalyticsStore } from './store/analytics.store';

// Pages
export { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
