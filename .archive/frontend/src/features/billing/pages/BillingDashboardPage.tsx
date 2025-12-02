// Billing Dashboard Page - Main billing overview with metrics and charts
import React, { useState } from 'react';
import {
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useBillingMetrics } from '../api/invoices.api';
import { BillingChart } from '../components/BillingChart';
import { formatCurrency, formatHours } from '../utils/formatters';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export const BillingDashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  const { data: metrics, isLoading } = useBillingMetrics(dateRange);

  const quickDateRanges = [
    {
      label: 'This Month',
      start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
    {
      label: 'Last Month',
      start: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
      end: format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    },
    {
      label: 'Last 3 Months',
      start: format(startOfMonth(subMonths(new Date(), 3)), 'yyyy-MM-dd'),
      end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
    {
      label: 'Year to Date',
      start: format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'),
      end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
  ];

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading billing metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Billing Dashboard</h1>
            <p className="text-slate-600 mt-1">Financial performance and metrics</p>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {quickDateRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() =>
                    setDateRange({ startDate: range.start, endDate: range.end })
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    dateRange.startDate === range.start && dateRange.endDate === range.end
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Billable Hours */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Billable Hours</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">
              {formatHours(metrics.totalBillableHours)}
            </p>
            <p className="text-xs text-slate-500">This period</p>
          </div>

          {/* Revenue */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-700 mb-2">
              {formatCurrency(metrics.totalRevenue, false)}
            </p>
            <p className="text-xs text-slate-500">This period</p>
          </div>

          {/* Outstanding Receivables */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Outstanding</p>
            <p className="text-3xl font-bold text-orange-700 mb-2">
              {formatCurrency(metrics.outstandingReceivables, false)}
            </p>
            <p className="text-xs text-slate-500">Unpaid invoices</p>
          </div>

          {/* Realization Rate */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Realization Rate</p>
            <p className="text-3xl font-bold text-purple-700 mb-2">
              {metrics.averageRealizationRate.toFixed(0)}%
            </p>
            <p className="text-xs text-slate-500">Billing efficiency</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billable vs Non-Billable */}
          <BillingChart
            title="Billable vs Non-Billable Hours"
            type="pie"
            data={[
              {
                label: 'Billable',
                value: metrics.billableVsNonBillable.billable,
                color: '#10b981',
              },
              {
                label: 'Non-Billable',
                value: metrics.billableVsNonBillable.nonBillable,
                color: '#94a3b8',
              },
            ]}
          />

          {/* Revenue by Practice Area */}
          <BillingChart
            title="Revenue by Practice Area"
            type="bar"
            data={metrics.revenueByPracticeArea.map((item, index) => ({
              label: item.practiceArea,
              value: item.revenue,
              color: `hsl(${(index * 360) / metrics.revenueByPracticeArea.length}, 70%, 50%)`,
            }))}
          />
        </div>
      </div>

      {/* Top Matters & Aging Receivables */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Matters by Revenue */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Top Matters by Revenue
            </h3>
            <div className="space-y-3">
              {metrics.topMattersByRevenue.slice(0, 5).map((matter, index) => (
                <div
                  key={matter.caseId}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 truncate max-w-xs">
                        {matter.caseName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatHours(matter.hours)} hours
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">
                      {formatCurrency(matter.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aging Receivables */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Aging Receivables
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-slate-900">Current</span>
                </div>
                <span className="text-sm font-bold text-green-700">
                  {formatCurrency(metrics.agingReceivables.current)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-900">1-30 Days</span>
                </div>
                <span className="text-sm font-bold text-blue-700">
                  {formatCurrency(metrics.agingReceivables.days30)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-slate-900">31-60 Days</span>
                </div>
                <span className="text-sm font-bold text-yellow-700">
                  {formatCurrency(metrics.agingReceivables.days60)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-slate-900">61-90 Days</span>
                </div>
                <span className="text-sm font-bold text-orange-700">
                  {formatCurrency(metrics.agingReceivables.days90)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-slate-900">90+ Days</span>
                </div>
                <span className="text-sm font-bold text-red-700">
                  {formatCurrency(metrics.agingReceivables.days90Plus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="px-8 pb-8">
        <BillingChart
          title="Revenue Trend"
          type="line"
          data={metrics.revenueByMonth.map((item) => ({
            label: item.month,
            value: item.revenue,
          }))}
        />
      </div>
    </div>
  );
};
