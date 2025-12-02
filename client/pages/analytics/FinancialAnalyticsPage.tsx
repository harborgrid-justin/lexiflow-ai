/**
 * Financial Analytics Page
 * Comprehensive financial metrics and revenue analytics
 */

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useFinancialAnalytics } from '../../hooks/useFinancialAnalytics';
import { usePageView } from '../../enzyme';
import { MetricCard } from '../../components/analytics/MetricCard';
import { AreaChart } from '../../components/analytics/AreaChart';
import { BarChart } from '../../components/analytics/BarChart';
import { DonutChart } from '../../components/analytics/DonutChart';
import { DataTable } from '../../components/analytics/DataTable';
import { DateRangeFilter } from '../../components/analytics/DateRangeFilter';
import { ExportButton } from '../../components/analytics/ExportButton';
import { DateRange } from '../../types/analytics';

export const FinancialAnalyticsPage: React.FC = () => {
  usePageView('financial_analytics');

  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    preset: 'this-year',
  });

  const {
    revenueMetrics,
    revenueByMonth,
    revenueByClient,
    revenueByPracticeArea,
    revenueByAttorney,
    billingMetrics,
    arAging,
    collectionMetrics,
    isLoading,
    trackExport,
  } = useFinancialAnalytics(dateRange);

  // Mock financial metrics
  const financialKPIs = [
    {
      title: 'Total Revenue (YTD)',
      value: 2847500,
      change: 18.5,
      icon: DollarSign,
      iconColor: '#10b981',
      sparklineData: [2100000, 2250000, 2400000, 2550000, 2700000, 2800000, 2847500],
      format: 'currency' as const,
    },
    {
      title: 'Billed Amount',
      value: 3125000,
      change: 15.2,
      icon: TrendingUp,
      iconColor: '#3b82f6',
      format: 'currency' as const,
    },
    {
      title: 'Outstanding AR',
      value: 485000,
      change: -8.3,
      isPositive: true,
      icon: AlertCircle,
      iconColor: '#f59e0b',
      format: 'currency' as const,
    },
    {
      title: 'Collection Rate',
      value: 91.2,
      change: 3.5,
      icon: TrendingUp,
      iconColor: '#8b5cf6',
      format: 'percentage' as const,
    },
    {
      title: 'Realization Rate',
      value: 87.5,
      change: 2.1,
      icon: TrendingUp,
      iconColor: '#06b6d4',
      format: 'percentage' as const,
    },
    {
      title: 'Write-offs',
      value: 125000,
      change: -12.5,
      isPositive: true,
      icon: AlertCircle,
      iconColor: '#ef4444',
      format: 'currency' as const,
    },
  ];

  const monthlyRevenueData = [
    { name: 'Jan', revenue: 425000, billed: 465000, collected: 398000 },
    { name: 'Feb', revenue: 445000, billed: 490000, collected: 410000 },
    { name: 'Mar', revenue: 465000, billed: 515000, collected: 435000 },
    { name: 'Apr', revenue: 485000, billed: 530000, collected: 458000 },
    { name: 'May', revenue: 475000, billed: 520000, collected: 445000 },
    { name: 'Jun', revenue: 487500, billed: 535000, collected: 465000 },
  ];

  const topClientsData = [
    { client: 'Tech Corp Inc.', revenue: 485000, hours: 1250, rate: 388 },
    { client: 'Global Industries', revenue: 425000, hours: 1100, rate: 386 },
    { client: 'Retail Partners LLC', revenue: 385000, hours: 980, rate: 393 },
    { client: 'Manufacturing Co.', revenue: 325000, hours: 850, rate: 382 },
    { client: 'Financial Services Group', revenue: 285000, hours: 720, rate: 396 },
  ];

  const revenueByPracticeData = [
    { name: 'Corporate Law', value: 985000, color: '#3b82f6' },
    { name: 'Litigation', value: 825000, color: '#8b5cf6' },
    { name: 'Real Estate', value: 485000, color: '#10b981' },
    { name: 'IP', value: 352000, color: '#f59e0b' },
    { name: 'Employment', value: 200500, color: '#06b6d4' },
  ];

  const revenueByAttorneyData = [
    { name: 'Sarah Johnson', value: 485000 },
    { name: 'Michael Chen', value: 425000 },
    { name: 'Emily Rodriguez', value: 385000 },
    { name: 'David Kim', value: 325000 },
    { name: 'Jennifer Lee', value: 285000 },
    { name: 'Others', value: 942500 },
  ];

  const arAgingData = [
    { name: 'Current', value: 185000, color: '#10b981' },
    { name: '1-30 days', value: 125000, color: '#3b82f6' },
    { name: '31-60 days', value: 85000, color: '#f59e0b' },
    { name: '61-90 days', value: 52000, color: '#ef4444' },
    { name: '90+ days', value: 38000, color: '#991b1b' },
  ];

  const clientColumns = [
    {
      key: 'client',
      label: 'Client',
      sortable: true,
      align: 'left' as const,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      align: 'right' as const,
      format: (val: number) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(val),
    },
    {
      key: 'hours',
      label: 'Hours',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'rate',
      label: 'Avg Rate',
      sortable: true,
      align: 'right' as const,
      format: (val: number) => `$${val}/hr`,
    },
  ];

  const handleExport = (format: string) => {
    trackExport(format);
    console.log('Exporting financial analytics to', format);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Financial Analytics
          </h1>
          <p className="text-slate-600 mt-1">
            Comprehensive revenue and billing metrics
          </p>
        </div>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialKPIs.map((kpi, index) => (
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

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Revenue, Billed & Collected
        </h3>
        <AreaChart
          data={monthlyRevenueData}
          dataKeys={[
            { key: 'billed', color: '#3b82f6', name: 'Billed' },
            { key: 'revenue', color: '#10b981', name: 'Revenue' },
            { key: 'collected', color: '#8b5cf6', name: 'Collected' },
          ]}
          xAxisKey="name"
          height={350}
          formatValue={(val: number) =>
            `$${(val / 1000).toFixed(0)}k`
          }
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Practice Area */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Revenue by Practice Area
          </h3>
          <DonutChart
            data={revenueByPracticeData}
            height={300}
            showLegend={true}
            showLabels={true}
            formatValue={(val: number) =>
              `$${(val / 1000).toFixed(0)}k`
            }
          />
        </div>

        {/* By Attorney */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Revenue by Attorney
          </h3>
          <BarChart
            data={revenueByAttorneyData}
            dataKeys={[{ key: 'value', color: '#8b5cf6', name: 'Revenue' }]}
            xAxisKey="name"
            height={300}
            horizontal={true}
            formatValue={(val: number) =>
              `$${(val / 1000).toFixed(0)}k`
            }
          />
        </div>
      </div>

      {/* AR Aging */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Accounts Receivable Aging
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DonutChart
            data={arAgingData}
            height={300}
            showLegend={true}
            showLabels={true}
            formatValue={(val: number) =>
              `$${(val / 1000).toFixed(0)}k`
            }
          />
          <div className="flex flex-col justify-center space-y-4">
            {arAgingData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-slate-900">{item.name}</span>
                </div>
                <span className="text-lg font-semibold text-slate-900">
                  ${(item.value / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Top Clients by Revenue
        </h3>
        <DataTable
          columns={clientColumns}
          data={topClientsData}
          pageSize={10}
          showPagination={false}
        />
      </div>
    </div>
  );
};
