/**
 * Analytics Module Types
 */

export interface AnalyticsDateRange {
  from: string;
  to: string;
}

export interface AnalyticsDashboard {
  caseMetrics: CaseAnalytics;
  financialMetrics: FinancialAnalytics;
  productivityMetrics: ProductivityAnalytics;
  workflowMetrics: WorkflowAnalytics;
}

export interface CaseAnalytics {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  casesByStatus: Record<string, number>;
  casesByMatterType: Record<string, number>;
  casesByJurisdiction: Record<string, number>;
  avgCaseDuration: number;
  casesTrend: TrendData[];
}

export interface FinancialAnalytics {
  totalRevenue: number;
  totalBilled: number;
  totalCollected: number;
  outstandingBalance: number;
  revenueByMonth: MonthlyData[];
  revenueByPracticeArea: Record<string, number>;
  topClients: ClientMetric[];
  realizationRate: number;
  collectionRate: number;
}

export interface ProductivityAnalytics {
  billableHours: number;
  nonBillableHours: number;
  utilizationRate: number;
  hoursPerAttorney: AttorneyHours[];
  taskCompletionRate: number;
  avgResponseTime: number;
}

export interface WorkflowAnalytics {
  activeWorkflows: number;
  completedWorkflows: number;
  avgCompletionTime: number;
  bottlenecks: Bottleneck[];
  tasksByStatus: Record<string, number>;
  slaCompliance: number;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  value: number;
}

export interface ClientMetric {
  clientId: string;
  clientName: string;
  revenue: number;
  hours: number;
  cases: number;
}

export interface AttorneyHours {
  userId: string;
  name: string;
  billableHours: number;
  nonBillableHours: number;
  utilizationRate: number;
}

export interface Bottleneck {
  stage: string;
  avgDuration: number;
  count: number;
}

export interface SavedReport {
  id: string;
  name: string;
  type: 'case' | 'financial' | 'productivity' | 'custom';
  filters: Record<string, unknown>;
  schedule?: ReportSchedule;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  recipients: string[];
  format: 'pdf' | 'csv' | 'xlsx';
}

export type AnalyticsViewMode = 'dashboard' | 'cases' | 'financial' | 'productivity' | 'reports';
