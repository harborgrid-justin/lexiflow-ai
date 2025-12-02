# LexiFlow AI - Analytics & Reporting System

## Overview

A comprehensive enterprise analytics and reporting system providing unprecedented insights into legal practice performance. Built with React, TypeScript, Recharts, and TanStack Query.

## Architecture

### Directory Structure

```
/client
├── types/
│   └── analytics.ts                 # TypeScript type definitions
├── services/
│   └── api/
│       └── misc.service.ts          # Enhanced analytics API service
├── hooks/
│   ├── useAnalyticsMetrics.ts       # Main analytics metrics hook
│   ├── useCaseAnalytics.ts          # Case analytics hook
│   ├── useFinancialAnalytics.ts     # Financial analytics hook
│   ├── useProductivityAnalytics.ts  # Productivity analytics hook
│   └── useReportBuilder.ts          # Report builder hook
├── components/
│   └── analytics/
│       ├── SparklineChart.tsx       # Mini inline trend chart
│       ├── AreaChart.tsx            # Time series area chart
│       ├── BarChart.tsx             # Categorical bar chart
│       ├── DonutChart.tsx           # Proportional donut chart
│       ├── GaugeChart.tsx           # Progress gauge chart
│       ├── MetricCard.tsx           # KPI card with trend
│       ├── TrendIndicator.tsx       # Trend arrow & percentage
│       ├── DataTable.tsx            # Sortable data table
│       ├── DateRangeFilter.tsx      # Date range picker
│       ├── ExportButton.tsx         # Export to PDF/Excel/CSV
│       ├── ChartLegend.tsx          # Custom chart legend
│       ├── DrilldownPanel.tsx       # Drill-down data panel
│       └── index.ts                 # Component exports
├── pages/
│   └── analytics/
│       ├── ExecutiveDashboard.tsx   # Executive summary dashboard
│       ├── CaseAnalyticsPage.tsx    # Case metrics & drill-downs
│       ├── FinancialAnalyticsPage.tsx # Revenue & billing metrics
│       ├── ProductivityPage.tsx     # Team productivity & leaderboards
│       ├── ReportBuilderPage.tsx    # Custom report creator
│       └── index.ts                 # Page exports
└── store/
    └── analytics.store.ts           # Analytics state management
```

## Key Features

### 1. Executive Dashboard
- **6 KPI Cards** with trends and sparklines:
  - Active Cases
  - Hours Billed (MTD)
  - Revenue (MTD)
  - Outstanding Balance
  - Tasks Due Today
  - Upcoming Deadlines
- **Interactive Charts**:
  - Case Status Distribution (Donut)
  - Revenue vs Expenses (Area)
  - Hours by Practice Area (Bar)
  - Task Completion Rate (Gauge)
- **Date Range Filtering** with 11 presets
- **Real-time Alerts** panel
- **Auto-refresh** capability

### 2. Case Analytics
- **Case Overview Metrics**:
  - Total Cases
  - Active Cases
  - Average Duration
  - Win Rate
- **Multi-dimensional Analysis**:
  - By Status
  - By Practice Area
  - By Attorney
  - By Court
  - Age Distribution
  - Win/Loss Ratio
- **Drill-down Capabilities** for detailed analysis
- **Attorney Performance Table** with sortable columns

### 3. Financial Analytics
- **Financial KPIs**:
  - Total Revenue (YTD)
  - Billed Amount
  - Outstanding AR
  - Collection Rate (91.2%)
  - Realization Rate (87.5%)
  - Write-offs
- **Revenue Analysis**:
  - Monthly trends
  - By Client (Top 10)
  - By Practice Area
  - By Attorney
- **AR Aging Report** with visual breakdown
- **Top Clients Table** with revenue metrics

### 4. Productivity Analytics
- **Productivity Metrics**:
  - Total Hours
  - Billable Hours
  - Utilization Rate (82.2%)
  - Tasks Completed
  - Completion Rate
  - Documents Created
- **Team Leaderboards**:
  - By Hours
  - By Utilization
  - By Revenue
- **Department Comparison** charts
- **Individual Performance Cards** with rankings

### 5. Report Builder
- **Custom Report Creation**:
  - Select data sources (Cases, Billing, Time Entries, Documents, Clients)
  - Choose visualization types (Bar, Line, Area, Pie, Donut)
  - Apply filters and dimensions
- **Report Management**:
  - Save report templates
  - Execute reports on-demand
  - Schedule automated reports (Daily, Weekly, Monthly, Quarterly)
  - Edit and delete reports
- **Export Options**: PDF, Excel, CSV, JSON

## Components

### Chart Components

#### SparklineChart
Compact inline chart for showing trends in metric cards.
```tsx
<SparklineChart
  data={[100, 110, 115, 120, 125]}
  color="#3b82f6"
  height={40}
/>
```

#### AreaChart
Time series data visualization with multiple data series.
```tsx
<AreaChart
  data={monthlyData}
  dataKeys={[
    { key: 'revenue', color: '#10b981', name: 'Revenue' },
    { key: 'expenses', color: '#ef4444', name: 'Expenses' }
  ]}
  height={300}
/>
```

#### BarChart
Categorical data visualization with horizontal/vertical layouts.
```tsx
<BarChart
  data={practiceAreaData}
  dataKeys={[{ key: 'value', color: '#8b5cf6', name: 'Hours' }]}
  horizontal={true}
  height={300}
/>
```

#### DonutChart
Proportional data visualization with customizable colors.
```tsx
<DonutChart
  data={caseStatusData}
  height={300}
  showLegend={true}
  showLabels={true}
/>
```

#### GaugeChart
Progress/percentage visualization.
```tsx
<GaugeChart
  value={87.5}
  max={100}
  label="Utilization Rate"
  height={200}
/>
```

### UI Components

#### MetricCard
KPI card with trend indicator and optional sparkline.
```tsx
<MetricCard
  title="Active Cases"
  value={127}
  change={12.5}
  icon={Briefcase}
  iconColor="#3b82f6"
  sparklineData={[105, 110, 115, 120, 125, 127]}
  format="number"
/>
```

#### DataTable
Sortable and paginated data table.
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'value', label: 'Value', sortable: true, format: (v) => `$${v}` }
  ]}
  data={tableData}
  pageSize={10}
/>
```

#### DateRangeFilter
Date range picker with 11 presets.
```tsx
<DateRangeFilter
  value={dateRange}
  onChange={setDateRange}
/>
```

#### ExportButton
Export data in multiple formats.
```tsx
<ExportButton
  onExport={(format) => handleExport(format)}
  formats={['pdf', 'excel', 'csv']}
/>
```

## Custom Hooks

### useAnalyticsMetrics
Comprehensive hook for fetching all analytics metrics.
```tsx
const {
  executiveDashboard,
  kpiMetrics,
  caseAnalytics,
  financialAnalytics,
  productivityAnalytics,
  isLoading,
  refreshAll
} = useAnalyticsMetrics({ dateRange, autoRefresh: true });
```

### useCaseAnalytics
Case-specific analytics with drill-down.
```tsx
const {
  overview,
  byStatus,
  byPracticeArea,
  byAttorney,
  winLossRatio,
  isLoading
} = useCaseAnalytics(filters);
```

### useFinancialAnalytics
Financial metrics and revenue analytics.
```tsx
const {
  revenueMetrics,
  revenueByMonth,
  billingMetrics,
  arAging,
  isLoading
} = useFinancialAnalytics(dateRange);
```

### useProductivityAnalytics
Productivity and team performance metrics.
```tsx
const {
  overview,
  byAttorney,
  utilizationRates,
  taskMetrics,
  isLoading
} = useProductivityAnalytics(filters);
```

### useReportBuilder
Custom report creation and management.
```tsx
const {
  reports,
  createReport,
  updateReport,
  executeReport,
  scheduleReport,
  isCreating
} = useReportBuilder();
```

## State Management

The analytics store provides centralized state management using React hooks and localStorage persistence.

```tsx
const {
  dateRange,
  setDateRange,
  layout,
  setLayout,
  filters,
  setFilters,
  preferences,
  setPreferences
} = useAnalyticsStore();
```

## API Integration

All analytics data is fetched through the enhanced `analyticsService`:

```typescript
// Executive Dashboard
analyticsService.getExecutiveDashboard(dateRange)
analyticsService.getDashboardMetrics(dateRange)

// Case Analytics
analyticsService.getCaseAnalytics(filters)
analyticsService.getCasesByStatus()
analyticsService.getWinLossRatio()

// Financial Analytics
analyticsService.getRevenueMetrics(dateRange)
analyticsService.getBillingMetrics()
analyticsService.getARAgingReport()

// Productivity Analytics
analyticsService.getProductivityAnalytics(filters)
analyticsService.getUtilizationRates()

// Reports
analyticsService.getReports()
analyticsService.createReport(data)
analyticsService.executeReport(id)
analyticsService.scheduleReport(id, schedule)
```

## Usage Examples

### Displaying Executive Dashboard

```tsx
import { ExecutiveDashboard } from './pages/analytics';

function App() {
  return <ExecutiveDashboard />;
}
```

### Creating a Custom Analytics View

```tsx
import { useAnalyticsMetrics } from './hooks/useAnalyticsMetrics';
import { MetricCard, AreaChart } from './components/analytics';

function CustomAnalytics() {
  const { kpiMetrics, isLoading } = useAnalyticsMetrics();

  return (
    <div>
      <MetricCard
        title="Revenue"
        value={kpiMetrics?.revenue}
        icon={DollarSign}
        loading={isLoading}
      />
      <AreaChart data={revenueData} ... />
    </div>
  );
}
```

## Styling

All components use Tailwind CSS for styling with a consistent design system:

- **Primary Colors**: Blue (#3b82f6), Green (#10b981), Purple (#8b5cf6)
- **Status Colors**: Red (#ef4444), Yellow (#f59e0b), Gray (#6b7280)
- **Spacing**: Consistent 8px grid system
- **Typography**: Inter font family
- **Animations**: Smooth transitions (500ms)

## Performance Optimizations

1. **Lazy Loading**: Charts are loaded on-demand
2. **Data Caching**: 5-minute stale time for API requests
3. **Memoization**: React.useMemo for expensive calculations
4. **Debouncing**: User input debounced for 500ms
5. **Pagination**: Large datasets paginated at 10 items/page
6. **Virtual Scrolling**: For very large lists

## Testing

Components are built with testability in mind:

```tsx
// Mock data for testing
const mockMetrics = {
  activeCases: 127,
  revenue: 487500,
  // ...
};

// Test with mock data
<MetricCard {...mockMetrics} />
```

## Best Practices

1. **Always use date ranges** for time-based queries
2. **Implement error boundaries** around analytics pages
3. **Show loading states** during data fetching
4. **Cache API responses** with appropriate stale times
5. **Track user interactions** with analytics events
6. **Export reports** for offline analysis
7. **Schedule automated reports** for stakeholders

## Future Enhancements

- [ ] Real-time data streaming with WebSockets
- [ ] AI-powered insights and recommendations
- [ ] Custom dashboard builder with drag-drop widgets
- [ ] Advanced filtering with saved filter sets
- [ ] Comparative analysis (YoY, MoM)
- [ ] Predictive analytics using ML models
- [ ] Mobile-optimized responsive views
- [ ] Collaboration features (share reports, annotations)

## Support

For issues or questions about the analytics system:
- Review the TypeScript types in `/client/types/analytics.ts`
- Check the API documentation
- Review component examples in this README
- Contact the development team

---

Built with by Enterprise Frontend Engineering Agent #8: Analytics & Reporting Specialist
