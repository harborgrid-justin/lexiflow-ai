/**
 * Productivity Analytics Page
 * Team productivity metrics and leaderboards
 */

import React, { useState } from 'react';
import { Clock, TrendingUp, Target, FileText, Trophy, Award } from 'lucide-react';
import { useProductivityAnalytics } from '../../hooks/useProductivityAnalytics';
import { usePageView } from '../../enzyme';
import { MetricCard } from '../../components/analytics/MetricCard';
import { BarChart } from '../../components/analytics/BarChart';
import { GaugeChart } from '../../components/analytics/GaugeChart';
import { DataTable } from '../../components/analytics/DataTable';
import { ExportButton } from '../../components/analytics/ExportButton';

export const ProductivityPage: React.FC = () => {
  usePageView('productivity_analytics');

  const [leaderboardCategory, setLeaderboardCategory] = useState<
    'hours' | 'utilization' | 'revenue'
  >('hours');

  const {
    overview,
    byAttorney,
    byDepartment,
    utilizationRates,
    taskMetrics,
    documentMetrics,
    isLoading,
    trackLeaderboardView,
  } = useProductivityAnalytics();

  // Mock productivity metrics
  const productivityKPIs = [
    {
      title: 'Total Hours (MTD)',
      value: 3842,
      change: 12.5,
      icon: Clock,
      iconColor: '#3b82f6',
      sparklineData: [3200, 3350, 3500, 3600, 3700, 3800, 3842],
      format: 'number' as const,
    },
    {
      title: 'Billable Hours',
      value: 3156,
      change: 15.2,
      icon: TrendingUp,
      iconColor: '#10b981',
      sparklineData: [2600, 2750, 2900, 3000, 3100, 3150, 3156],
      format: 'number' as const,
    },
    {
      title: 'Utilization Rate',
      value: 82.2,
      change: 3.5,
      icon: Target,
      iconColor: '#8b5cf6',
      format: 'percentage' as const,
    },
    {
      title: 'Tasks Completed',
      value: 247,
      change: 8.3,
      icon: Trophy,
      iconColor: '#f59e0b',
      format: 'number' as const,
    },
    {
      title: 'Completion Rate',
      value: 89.5,
      change: 2.1,
      icon: Target,
      iconColor: '#06b6d4',
      format: 'percentage' as const,
    },
    {
      title: 'Documents Created',
      value: 156,
      change: 12.3,
      icon: FileText,
      iconColor: '#ec4899',
      format: 'number' as const,
    },
  ];

  const attorneyLeaderboardData = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      totalHours: 185,
      billableHours: 162,
      utilizationRate: 87.6,
      tasksCompleted: 32,
      revenue: 64800,
    },
    {
      rank: 2,
      name: 'Michael Chen',
      totalHours: 178,
      billableHours: 155,
      utilizationRate: 87.1,
      tasksCompleted: 28,
      revenue: 62000,
    },
    {
      rank: 3,
      name: 'Emily Rodriguez',
      totalHours: 172,
      billableHours: 148,
      utilizationRate: 86.0,
      tasksCompleted: 30,
      revenue: 59200,
    },
    {
      rank: 4,
      name: 'David Kim',
      totalHours: 168,
      billableHours: 142,
      utilizationRate: 84.5,
      tasksCompleted: 25,
      revenue: 56800,
    },
    {
      rank: 5,
      name: 'Jennifer Lee',
      totalHours: 165,
      billableHours: 138,
      utilizationRate: 83.6,
      tasksCompleted: 27,
      revenue: 55200,
    },
    {
      rank: 6,
      name: 'Robert Taylor',
      totalHours: 162,
      billableHours: 135,
      utilizationRate: 83.3,
      tasksCompleted: 24,
      revenue: 54000,
    },
    {
      rank: 7,
      name: 'Lisa Anderson',
      totalHours: 158,
      billableHours: 130,
      utilizationRate: 82.3,
      tasksCompleted: 26,
      revenue: 52000,
    },
    {
      rank: 8,
      name: 'James Wilson',
      totalHours: 155,
      billableHours: 125,
      utilizationRate: 80.6,
      tasksCompleted: 22,
      revenue: 50000,
    },
  ];

  const departmentData = [
    { name: 'Corporate', hours: 985, billable: 825, utilization: 83.8 },
    { name: 'Litigation', hours: 875, billable: 735, utilization: 84.0 },
    { name: 'Real Estate', hours: 652, billable: 545, utilization: 83.6 },
    { name: 'IP', hours: 485, billable: 398, utilization: 82.1 },
    { name: 'Employment', hours: 425, billable: 345, utilization: 81.2 },
  ];

  const hoursByAttorneyData = [
    { name: 'Sarah Johnson', value: 185 },
    { name: 'Michael Chen', value: 178 },
    { name: 'Emily Rodriguez', value: 172 },
    { name: 'David Kim', value: 168 },
    { name: 'Jennifer Lee', value: 165 },
    { name: 'Robert Taylor', value: 162 },
  ];

  const utilizationByDepartmentData = [
    { name: 'Litigation', value: 84.0 },
    { name: 'Corporate', value: 83.8 },
    { name: 'Real Estate', value: 83.6 },
    { name: 'IP', value: 82.1 },
    { name: 'Employment', value: 81.2 },
  ];

  const leaderboardColumns = [
    {
      key: 'rank',
      label: 'Rank',
      align: 'center' as const,
      format: (val: number) => (
        <div className="flex items-center justify-center">
          {val <= 3 ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{val === 1 ? '🥇' : val === 2 ? '🥈' : '🥉'}</span>
              <span className="font-bold">{val}</span>
            </div>
          ) : (
            <span className="font-medium">{val}</span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Attorney',
      sortable: true,
      align: 'left' as const,
      format: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      key: 'totalHours',
      label: 'Total Hours',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'billableHours',
      label: 'Billable',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'utilizationRate',
      label: 'Utilization',
      sortable: true,
      align: 'center' as const,
      format: (val: number) => `${val.toFixed(1)}%`,
    },
    {
      key: 'tasksCompleted',
      label: 'Tasks',
      sortable: true,
      align: 'center' as const,
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
  ];

  const departmentColumns = [
    {
      key: 'name',
      label: 'Department',
      sortable: true,
      align: 'left' as const,
    },
    {
      key: 'hours',
      label: 'Total Hours',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'billable',
      label: 'Billable',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'utilization',
      label: 'Utilization',
      sortable: true,
      align: 'center' as const,
      format: (val: number) => `${val.toFixed(1)}%`,
    },
  ];

  const handleExport = (format: string) => {
    console.log('Exporting productivity analytics to', format);
  };

  const handleLeaderboardCategoryChange = (category: 'hours' | 'utilization' | 'revenue') => {
    setLeaderboardCategory(category);
    trackLeaderboardView(category);
  };

  const averageUtilization = 82.2;

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Productivity Analytics
          </h1>
          <p className="text-slate-600 mt-1">
            Team performance metrics and insights
          </p>
        </div>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Productivity KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productivityKPIs.map((kpi, index) => (
          <MetricCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
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
        {/* Hours by Attorney */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Hours by Attorney (Top 6)
          </h3>
          <BarChart
            data={hoursByAttorneyData}
            dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Hours' }]}
            xAxisKey="name"
            height={300}
            horizontal={true}
          />
        </div>

        {/* Average Utilization Rate */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Average Utilization Rate
          </h3>
          <GaugeChart
            value={averageUtilization}
            max={100}
            label="Utilization"
            height={300}
            showPercentage={true}
          />
        </div>
      </div>

      {/* Utilization by Department */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Utilization Rate by Department
        </h3>
        <BarChart
          data={utilizationByDepartmentData}
          dataKeys={[{ key: 'value', color: '#8b5cf6', name: 'Utilization %' }]}
          xAxisKey="name"
          height={300}
          formatValue={(val: number) => `${val.toFixed(1)}%`}
        />
      </div>

      {/* Team Leaderboard */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Team Leaderboard
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLeaderboardCategoryChange('hours')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                leaderboardCategory === 'hours'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              By Hours
            </button>
            <button
              onClick={() => handleLeaderboardCategoryChange('utilization')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                leaderboardCategory === 'utilization'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              By Utilization
            </button>
            <button
              onClick={() => handleLeaderboardCategoryChange('revenue')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                leaderboardCategory === 'revenue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              By Revenue
            </button>
          </div>
        </div>
        <DataTable
          columns={leaderboardColumns}
          data={attorneyLeaderboardData}
          pageSize={10}
          showPagination={false}
        />
      </div>

      {/* Department Productivity */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Department Productivity
        </h3>
        <DataTable
          columns={departmentColumns}
          data={departmentData}
          pageSize={10}
          showPagination={false}
        />
      </div>
    </div>
  );
};
