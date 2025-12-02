/**
 * Analytics & Reporting Types
 * Comprehensive type definitions for enterprise analytics and reporting features
 */

// ============================================================================
// Core Metric Types
// ============================================================================

export interface Metric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: TrendData;
  icon?: string;
  color?: string;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
}

export interface TrendData {
  direction: 'up' | 'down' | 'flat';
  percentage: number;
  comparisonPeriod: string;
  isPositive: boolean;
}

export interface SparklineData {
  values: number[];
  labels?: string[];
}

// ============================================================================
// Chart Data Types
// ============================================================================

export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
  fill?: string;
  [key: string]: any;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
  [key: string]: any;
}

export interface MultiSeriesDataPoint {
  name: string;
  [key: string]: string | number;
}

export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'gauge' | 'sparkline';

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardMetrics {
  kpis: KPIMetric[];
  charts: ChartWidget[];
  alerts: Alert[];
  summary: {
    period: string;
    generatedAt: string;
  };
}

export interface KPIMetric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeDirection: 'up' | 'down' | 'flat';
  isPositive: boolean;
  icon: string;
  sparkline?: number[];
  format: 'number' | 'currency' | 'percentage';
}

export interface ChartWidget {
  id: string;
  title: string;
  type: ChartType;
  data: any[];
  description?: string;
  height?: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  actionUrl?: string;
}

// ============================================================================
// Case Analytics Types
// ============================================================================

export interface CaseAnalytics {
  overview: {
    totalCases: number;
    activeCases: number;
    closedCases: number;
    averageDuration: number;
  };
  byStatus: ChartDataPoint[];
  byPracticeArea: ChartDataPoint[];
  byAttorney: AttorneyMetric[];
  byCourt: ChartDataPoint[];
  caseAge: {
    ranges: AgeRange[];
    average: number;
  };
  winLossRatio: {
    wins: number;
    losses: number;
    settled: number;
    pending: number;
  };
}

export interface AttorneyMetric {
  id: string;
  name: string;
  caseCount: number;
  activeCases: number;
  winRate: number;
  averageDuration: number;
}

export interface AgeRange {
  range: string;
  count: number;
  percentage: number;
}

// ============================================================================
// Financial Analytics Types
// ============================================================================

export interface FinancialAnalytics {
  revenue: RevenueMetrics;
  billing: BillingMetrics;
  collections: CollectionMetrics;
  trends: TimeSeriesDataPoint[];
}

export interface RevenueMetrics {
  total: number;
  change: number;
  byMonth: TimeSeriesDataPoint[];
  byClient: ChartDataPoint[];
  byPracticeArea: ChartDataPoint[];
  byAttorney: ChartDataPoint[];
}

export interface BillingMetrics {
  billed: number;
  collected: number;
  outstanding: number;
  writeOffs: number;
  realizationRate: number;
  collectionRate: number;
}

export interface CollectionMetrics {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days90Plus: number;
}

export interface ARAgingData {
  ranges: ARAgingRange[];
  total: number;
}

export interface ARAgingRange {
  range: string;
  amount: number;
  percentage: number;
  clientCount: number;
}

// ============================================================================
// Productivity Analytics Types
// ============================================================================

export interface ProductivityAnalytics {
  overview: ProductivityOverview;
  byAttorney: AttorneyProductivity[];
  byDepartment: DepartmentProductivity[];
  tasks: TaskMetrics;
  documents: DocumentMetrics;
}

export interface ProductivityOverview {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  utilizationRate: number;
  averageHoursPerDay: number;
}

export interface AttorneyProductivity {
  id: string;
  name: string;
  totalHours: number;
  billableHours: number;
  utilizationRate: number;
  tasksCompleted: number;
  documentsCreated: number;
  rank: number;
}

export interface DepartmentProductivity {
  id: string;
  name: string;
  totalHours: number;
  billableHours: number;
  utilizationRate: number;
  staffCount: number;
}

export interface TaskMetrics {
  total: number;
  completed: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime: number;
}

export interface DocumentMetrics {
  total: number;
  created: number;
  reviewed: number;
  averagePerDay: number;
}

// ============================================================================
// Client Analytics Types
// ============================================================================

export interface ClientAnalytics {
  overview: ClientOverview;
  topClients: ClientMetric[];
  byIndustry: ChartDataPoint[];
  retention: ClientRetention;
}

export interface ClientOverview {
  totalClients: number;
  activeClients: number;
  newClients: number;
  retentionRate: number;
}

export interface ClientMetric {
  id: string;
  name: string;
  revenue: number;
  cases: number;
  hoursSpent: number;
  lastActivity: string;
}

export interface ClientRetention {
  rate: number;
  trend: TimeSeriesDataPoint[];
  churnRate: number;
}

// ============================================================================
// Team Analytics Types
// ============================================================================

export interface TeamAnalytics {
  overview: TeamOverview;
  members: TeamMemberMetric[];
  performance: PerformanceMetrics;
  collaboration: CollaborationMetrics;
}

export interface TeamOverview {
  totalMembers: number;
  activeMembers: number;
  averageUtilization: number;
  totalRevenue: number;
}

export interface TeamMemberMetric {
  id: string;
  name: string;
  role: string;
  casesHandled: number;
  hoursLogged: number;
  utilizationRate: number;
  revenue: number;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  taskCompletionRate: number;
  clientSatisfaction: number;
}

export interface CollaborationMetrics {
  sharedCases: number;
  crossDepartmentWork: number;
  teamMeetings: number;
}

// ============================================================================
// Report Types
// ============================================================================

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  config: ReportConfig;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  schedule?: ReportSchedule;
  isTemplate: boolean;
}

export type ReportType =
  | 'executive-summary'
  | 'financial'
  | 'case-analysis'
  | 'productivity'
  | 'client-report'
  | 'custom';

export interface ReportConfig {
  dataSources: DataSource[];
  dimensions: string[];
  metrics: string[];
  filters: ReportFilter[];
  visualization: VisualizationConfig;
  dateRange: DateRange;
}

export interface DataSource {
  type: 'cases' | 'billing' | 'time-entries' | 'documents' | 'clients';
  fields: string[];
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface VisualizationConfig {
  chartType: ChartType;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  colors?: string[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
}

export interface DateRange {
  start: string;
  end: string;
  preset?: 'today' | 'yesterday' | 'last-7-days' | 'last-30-days' | 'this-month' | 'last-month' | 'this-quarter' | 'last-quarter' | 'this-year' | 'last-year' | 'custom';
}

// ============================================================================
// Filter & Query Types
// ============================================================================

export interface AnalyticsFilters {
  dateRange: DateRange;
  practiceAreas?: string[];
  attorneys?: string[];
  clients?: string[];
  status?: string[];
  courts?: string[];
}

export interface AnalyticsQuery {
  metric: string;
  filters?: AnalyticsFilters;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// ============================================================================
// Export & Data Types
// ============================================================================

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeCharts?: boolean;
  includeRawData?: boolean;
}

export interface DrilldownData {
  level: number;
  dimension: string;
  value: any;
  data: any[];
}

// ============================================================================
// Widget Layout Types (for Dashboard Customization)
// ============================================================================

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetPosition[];
  isDefault: boolean;
}

export interface WidgetPosition {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  config?: any;
}
