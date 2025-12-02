/**
 * Executive Dashboard Page
 * Comprehensive executive summary with KPIs, charts, and alerts
 */

import React, { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useAnalyticsMetrics } from '../../hooks/useAnalyticsMetrics';
import { usePageView, useLatestCallback } from '../../enzyme';
import { MetricCard } from '../../components/analytics/MetricCard';
import { AreaChart } from '../../components/analytics/AreaChart';
import { DonutChart } from '../../components/analytics/DonutChart';
import { BarChart } from '../../components/analytics/BarChart';
import { GaugeChart } from '../../components/analytics/GaugeChart';
import { DateRangeFilter } from '../../components/analytics/DateRangeFilter';
import { ExportButton } from '../../components/analytics/ExportButton';
import { DateRange } from '../../types/analytics';

export const ExecutiveDashboard: React.FC = () => {
  usePageView('executive_dashboard');

  // State for date range filter
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
    preset: 'last-30-days',
  });

  // Fetch analytics data
  const {
    kpiMetrics,
    executiveDashboard,
    isLoading,
    loadingDashboard,
    refreshAll,
  } = useAnalyticsMetrics({ dateRange, autoRefresh: true });

  // Mock data for demonstration (replace with actual API data)
  const mockKPIs = [
    {
      title: 'Active Cases',
      value: kpiMetrics?.activeCases || 127,
      change: 12.5,
      icon: Briefcase,
      iconColor: '#3b82f6',
      sparklineData: [105, 110, 115, 118, 122, 125, 127],
      format: 'number' as const,
    },
    {
      title: 'Hours Billed (MTD)',
      value: kpiMetrics?.hoursBilled || 1842,
      change: 8.3,
      icon: Clock,
      iconColor: '#8b5cf6',
      sparklineData: [1500, 1600, 1650, 1700, 1780, 1820, 1842],
      format: 'number' as const,
    },
    {
      title: 'Revenue (MTD)',
      value: kpiMetrics?.revenue || 487500,
      change: 15.2,
      icon: DollarSign,
      iconColor: '#10b981',
      sparklineData: [420000, 430000, 445000, 460000, 470000, 480000, 487500],
      format: 'currency' as const,
    },
    {
      title: 'Outstanding Balance',
      value: kpiMetrics?.outstanding || 285000,
      change: -5.4,
      isPositive: true,
      icon: AlertTriangle,
      iconColor: '#f59e0b',
      sparklineData: [320000, 310000, 305000, 295000, 290000, 287000, 285000],
      format: 'currency' as const,
    },
    {
      title: 'Tasks Due Today',
      value: kpiMetrics?.tasksDueToday || 23,
      change: 0,
      icon: CheckCircle,
      iconColor: '#06b6d4',
      format: 'number' as const,
    },
    {
      title: 'Upcoming Deadlines (7d)',
      value: kpiMetrics?.upcomingDeadlines || 18,
      change: 12.5,
      isPositive: false,
      icon: Calendar,
      iconColor: '#ef4444',
      format: 'number' as const,
    },
  ];

  // Mock chart data
  const caseStatusData = [
    { name: 'Active', value: 127, color: '#3b82f6' },
    { name: 'Pending', value: 45, color: '#f59e0b' },
    { name: 'Closed', value: 89, color: '#10b981' },
    { name: 'On Hold', value: 12, color: '#6b7280' },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 425000, expenses: 185000 },
    { name: 'Feb', revenue: 445000, expenses: 192000 },
    { name: 'Mar', revenue: 465000, expenses: 198000 },
    { name: 'Apr', revenue: 485000, expenses: 205000 },
    { name: 'May', revenue: 475000, expenses: 201000 },
    { name: 'Jun', revenue: 487500, expenses: 208000 },
  ];

  const hoursByPracticeArea = [
    { name: 'Corporate', value: 520 },
    { name: 'Litigation', value: 480 },
    { name: 'Real Estate', value: 325 },
    { name: 'IP', value: 280 },
    { name: 'Employment', value: 237 },
  ];

  const taskCompletionRate = 87.5;

  const alerts = executiveDashboard?.alerts || [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Deadline Approaching',
      message: 'Motion filing due in Johnson v. State in 2 days',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'error' as const,
      title: 'Overdue Invoice',
      message: 'Invoice #2847 is 60 days overdue ($12,500)',
      timestamp: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'New Case Assignment',
      message: '3 new cases assigned this week',
      timestamp: new Date().toISOString(),
    },
  ];

  const handleRefresh = useLatestCallback(() => {
    refreshAll();
  });

  const handleExport = useLatestCallback((format: string) => {
    console.log('Exporting to', format);
    // Implement export logic
  });

  const alertColors = {
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
  };

  const alertIcons = {
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
    success: '✅',
  };

  if (loadingDashboard && !executiveDashboard) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Executive Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Comprehensive firm performance overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
          <ExportButton onExport={handleExport} />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockKPIs.map((kpi, index) => (
          <MetricCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            icon={kpi.icon}
            iconColor={kpi.iconColor}
            sparklineData={kpi.sparklineData}
            sparklineColor={kpi.iconColor}
            format={kpi.format}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Status Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Case Status Distribution
          </h3>
          <DonutChart
            data={caseStatusData}
            height={300}
            showLegend={true}
            showLabels={true}
          />
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Revenue vs Expenses
          </h3>
          <AreaChart
            data={revenueData}
            dataKeys={[
              { key: 'revenue', color: '#10b981', name: 'Revenue' },
              { key: 'expenses', color: '#ef4444', name: 'Expenses' },
            ]}
            xAxisKey="name"
            height={300}
            formatValue={(val: number) =>
              `$${(val / 1000).toFixed(0)}k`
            }
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours by Practice Area */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Hours by Practice Area
          </h3>
          <BarChart
            data={hoursByPracticeArea}
            dataKeys={[{ key: 'value', color: '#8b5cf6', name: 'Hours' }]}
            xAxisKey="name"
            height={300}
            horizontal={true}
          />
        </div>

        {/* Task Completion Rate */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Task Completion Rate
          </h3>
          <GaugeChart
            value={taskCompletionRate}
            max={100}
            label="Completion Rate"
            height={300}
            showPercentage={true}
          />
        </div>
      </div>

      {/* Alerts Panel */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Alerts
        </h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${alertColors[alert.type]}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{alertIcons[alert.type]}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{alert.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(alert.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
