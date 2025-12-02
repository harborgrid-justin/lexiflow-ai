/**
 * Case Analytics Page
 * Comprehensive case analytics with drill-down capabilities
 */

import React, { useState } from 'react';
import { Scale, Users, MapPin, TrendingUp, Download } from 'lucide-react';
import { useCaseAnalytics } from '../../hooks/useCaseAnalytics';
import { usePageView } from '../../enzyme';
import { MetricCard } from '../../components/analytics/MetricCard';
import { DonutChart } from '../../components/analytics/DonutChart';
import { BarChart } from '../../components/analytics/BarChart';
import { DataTable } from '../../components/analytics/DataTable';
import { DrilldownPanel } from '../../components/analytics/DrilldownPanel';
import { ExportButton } from '../../components/analytics/ExportButton';

export const CaseAnalyticsPage: React.FC = () => {
  usePageView('case_analytics');

  const [drilldown, setDrilldown] = useState<{
    active: boolean;
    levels: { label: string; value: string }[];
    data: any;
  } | null>(null);

  const {
    overview,
    byStatus,
    byPracticeArea,
    byAttorney,
    byCourt,
    ageDistribution,
    winLossRatio,
    isLoading,
    trackDrilldown,
  } = useCaseAnalytics();

  // Mock data
  const overviewMetrics = [
    {
      title: 'Total Cases',
      value: overview?.totalCases || 273,
      change: 8.5,
      icon: Scale,
      iconColor: '#3b82f6',
      format: 'number' as const,
    },
    {
      title: 'Active Cases',
      value: overview?.activeCases || 127,
      change: 12.3,
      icon: TrendingUp,
      iconColor: '#10b981',
      format: 'number' as const,
    },
    {
      title: 'Avg Duration (days)',
      value: overview?.averageDuration || 156,
      change: -5.2,
      isPositive: true,
      icon: TrendingUp,
      iconColor: '#8b5cf6',
      format: 'number' as const,
    },
    {
      title: 'Win Rate',
      value: 68.5,
      change: 3.2,
      icon: TrendingUp,
      iconColor: '#f59e0b',
      format: 'percentage' as const,
    },
  ];

  const caseStatusData = [
    { name: 'Active', value: 127, color: '#3b82f6' },
    { name: 'Pending', value: 45, color: '#f59e0b' },
    { name: 'Closed', value: 89, color: '#10b981' },
    { name: 'On Hold', value: 12, color: '#6b7280' },
  ];

  const practiceAreaData = [
    { name: 'Corporate Law', value: 85 },
    { name: 'Litigation', value: 72 },
    { name: 'Real Estate', value: 48 },
    { name: 'Intellectual Property', value: 38 },
    { name: 'Employment', value: 30 },
  ];

  const attorneyData = [
    {
      id: '1',
      name: 'Sarah Johnson',
      caseCount: 28,
      activeCases: 15,
      winRate: 72.5,
      avgDuration: 142,
    },
    {
      id: '2',
      name: 'Michael Chen',
      caseCount: 25,
      activeCases: 12,
      winRate: 68.0,
      avgDuration: 158,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      caseCount: 22,
      activeCases: 14,
      winRate: 75.2,
      avgDuration: 135,
    },
    {
      id: '4',
      name: 'David Kim',
      caseCount: 20,
      activeCases: 11,
      winRate: 65.5,
      avgDuration: 167,
    },
    {
      id: '5',
      name: 'Jennifer Lee',
      caseCount: 19,
      activeCases: 10,
      winRate: 70.1,
      avgDuration: 149,
    },
  ];

  const courtData = [
    { name: 'Superior Court', value: 95 },
    { name: 'District Court', value: 78 },
    { name: 'Circuit Court', value: 52 },
    { name: 'Federal Court', value: 35 },
    { name: 'Appeals Court', value: 13 },
  ];

  const ageDistributionData = [
    { name: '0-30 days', value: 45, color: '#10b981' },
    { name: '31-60 days', value: 38, color: '#3b82f6' },
    { name: '61-90 days', value: 28, color: '#f59e0b' },
    { name: '91-180 days', value: 22, color: '#ef4444' },
    { name: '180+ days', value: 12, color: '#991b1b' },
  ];

  const winLossData = [
    { name: 'Won', value: 89, color: '#10b981' },
    { name: 'Lost', value: 35, color: '#ef4444' },
    { name: 'Settled', value: 52, color: '#3b82f6' },
    { name: 'Pending', value: 45, color: '#6b7280' },
  ];

  const handleChartClick = (dimension: string, value: string) => {
    trackDrilldown(dimension, value);
    setDrilldown({
      active: true,
      levels: [
        { label: 'All Cases', value: 'all' },
        { label: value, value },
      ],
      data: null, // Fetch drill-down data here
    });
  };

  const handleDrilldownClose = () => {
    setDrilldown(null);
  };

  const handleLevelClick = (index: number) => {
    if (!drilldown) return;
    if (index === 0) {
      setDrilldown(null);
    } else {
      setDrilldown({
        ...drilldown,
        levels: drilldown.levels.slice(0, index + 1),
      });
    }
  };

  const handleExport = (format: string) => {
    console.log('Exporting case analytics to', format);
  };

  const attorneyColumns = [
    {
      key: 'name',
      label: 'Attorney',
      sortable: true,
      align: 'left' as const,
    },
    {
      key: 'caseCount',
      label: 'Total Cases',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'activeCases',
      label: 'Active',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'winRate',
      label: 'Win Rate',
      sortable: true,
      align: 'center' as const,
      format: (val: number) => `${val.toFixed(1)}%`,
    },
    {
      key: 'avgDuration',
      label: 'Avg Duration',
      sortable: true,
      align: 'center' as const,
      format: (val: number) => `${val} days`,
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Case Analytics</h1>
          <p className="text-slate-600 mt-1">
            Comprehensive case metrics and insights
          </p>
        </div>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
            icon={metric.icon}
            iconColor={metric.iconColor}
            format={metric.format}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Drilldown Panel */}
      {drilldown && (
        <DrilldownPanel
          levels={drilldown.levels}
          onLevelClick={handleLevelClick}
          onClose={handleDrilldownClose}
        >
          <div className="text-slate-600">
            Drill-down data for {drilldown.levels[drilldown.levels.length - 1].label}
          </div>
        </DrilldownPanel>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Status */}
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

        {/* Practice Areas */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Cases by Practice Area
          </h3>
          <BarChart
            data={practiceAreaData}
            dataKeys={[{ key: 'value', color: '#8b5cf6', name: 'Cases' }]}
            xAxisKey="name"
            height={300}
            horizontal={true}
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courts */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Cases by Court
          </h3>
          <BarChart
            data={courtData}
            dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Cases' }]}
            xAxisKey="name"
            height={300}
          />
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Case Age Distribution
          </h3>
          <DonutChart
            data={ageDistributionData}
            height={300}
            showLegend={true}
            showLabels={true}
          />
        </div>
      </div>

      {/* Win/Loss Ratio */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Case Outcomes
        </h3>
        <DonutChart
          data={winLossData}
          height={300}
          showLegend={true}
          showLabels={true}
        />
      </div>

      {/* Attorney Performance Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Case Load by Attorney
        </h3>
        <DataTable
          columns={attorneyColumns}
          data={attorneyData}
          pageSize={10}
          showPagination={false}
        />
      </div>
    </div>
  );
};
