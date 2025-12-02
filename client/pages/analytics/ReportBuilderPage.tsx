/**
 * Report Builder Page
 * Custom report creation and management
 */

import React, { useState } from 'react';
import { Plus, Play, Calendar, Download, Edit, Trash2, Save } from 'lucide-react';
import { useReportBuilder } from '../../hooks/useReportBuilder';
import { usePageView, useLatestCallback } from '../../enzyme';
import { DataTable } from '../../components/analytics/DataTable';
import { Report, ReportType, ReportSchedule } from '../../types/analytics';

export const ReportBuilderPage: React.FC = () => {
  usePageView('report_builder');

  const {
    reports,
    loadingReports,
    isCreating,
    isExecuting,
    createReport,
    updateReport,
    deleteReport,
    executeReport,
    scheduleReport,
  } = useReportBuilder();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [reportForm, setReportForm] = useState({
    name: '',
    description: '',
    type: 'executive-summary' as ReportType,
    dataSource: 'cases',
    metrics: [] as string[],
    filters: {},
    chartType: 'bar',
  });

  // Mock reports data
  const mockReports = reports || [
    {
      id: '1',
      name: 'Monthly Executive Summary',
      description: 'Comprehensive monthly performance report',
      type: 'executive-summary' as const,
      createdBy: 'Sarah Johnson',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      isTemplate: false,
      config: {
        dataSources: [{ type: 'cases' as const, fields: ['status', 'value'] }],
        dimensions: ['month', 'practice_area'],
        metrics: ['revenue', 'cases', 'hours'],
        filters: [],
        visualization: { chartType: 'bar' as const },
        dateRange: { start: '2024-01-01', end: '2024-01-31', preset: 'this-month' },
      },
      schedule: {
        frequency: 'monthly' as const,
        dayOfMonth: 1,
        time: '09:00',
        recipients: ['admin@firm.com'],
        format: 'pdf' as const,
      },
    },
    {
      id: '2',
      name: 'Weekly Case Analytics',
      description: 'Case status and progress tracking',
      type: 'case-analysis' as const,
      createdBy: 'Michael Chen',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20',
      isTemplate: false,
      config: {
        dataSources: [{ type: 'cases' as const, fields: ['status', 'attorney'] }],
        dimensions: ['status', 'attorney'],
        metrics: ['count', 'age'],
        filters: [],
        visualization: { chartType: 'donut' as const },
        dateRange: { start: '', end: '', preset: 'last-7-days' },
      },
    },
    {
      id: '3',
      name: 'Financial Performance Report',
      description: 'Revenue and billing metrics',
      type: 'financial' as const,
      createdBy: 'Emily Rodriguez',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-25',
      isTemplate: true,
      config: {
        dataSources: [{ type: 'billing' as const, fields: ['revenue', 'billed'] }],
        dimensions: ['client', 'practice_area'],
        metrics: ['revenue', 'billed', 'collected'],
        filters: [],
        visualization: { chartType: 'area' as const },
        dateRange: { start: '', end: '', preset: 'this-quarter' },
      },
      schedule: {
        frequency: 'weekly' as const,
        dayOfWeek: 1,
        time: '08:00',
        recipients: ['partners@firm.com'],
        format: 'excel' as const,
      },
    },
  ];

  const handleCreateReport = useLatestCallback(async () => {
    try {
      await createReport({
        name: reportForm.name,
        description: reportForm.description,
        type: reportForm.type,
        config: {
          dataSources: [{ type: reportForm.dataSource as any, fields: [] }],
          dimensions: [],
          metrics: reportForm.metrics,
          filters: [],
          visualization: { chartType: reportForm.chartType as any },
          dateRange: { start: '', end: '', preset: 'this-month' },
        },
        isTemplate: false,
      } as any);

      setShowCreateModal(false);
      setReportForm({
        name: '',
        description: '',
        type: 'executive-summary',
        dataSource: 'cases',
        metrics: [],
        filters: {},
        chartType: 'bar',
      });
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  });

  const handleExecuteReport = useLatestCallback(async (reportId: string) => {
    try {
      const result = await executeReport(reportId);
      console.log('Report executed:', result);
      // Show result or download
    } catch (error) {
      console.error('Failed to execute report:', error);
    }
  });

  const handleDeleteReport = useLatestCallback(async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      await deleteReport(reportId);
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  });

  const reportColumns = [
    {
      key: 'name',
      label: 'Report Name',
      sortable: true,
      align: 'left' as const,
      format: (val: string, row: Report) => (
        <div>
          <div className="font-medium text-slate-900">{val}</div>
          {row.description && (
            <div className="text-xs text-slate-500 mt-1">{row.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      align: 'center' as const,
      format: (val: string) => (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
          {val.replace('-', ' ')}
        </span>
      ),
    },
    {
      key: 'schedule',
      label: 'Schedule',
      align: 'center' as const,
      format: (val: ReportSchedule) =>
        val ? (
          <span className="text-sm text-slate-600">
            {val.frequency.charAt(0).toUpperCase() + val.frequency.slice(1)}
          </span>
        ) : (
          <span className="text-sm text-slate-400">Manual</span>
        ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      align: 'center' as const,
      format: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      format: (_: any, row: Report) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleExecuteReport(row.id)}
            disabled={isExecuting}
            className="p-2 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
            title="Execute Report"
          >
            <Play size={16} className="text-blue-600" />
          </button>
          <button
            onClick={() => setEditingReport(row)}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            title="Edit Report"
          >
            <Edit size={16} className="text-slate-600" />
          </button>
          <button
            onClick={() => handleDeleteReport(row.id)}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
            title="Delete Report"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const REPORT_TYPES = [
    { value: 'executive-summary', label: 'Executive Summary' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'case-analysis', label: 'Case Analysis' },
    { value: 'productivity', label: 'Productivity Report' },
    { value: 'client-report', label: 'Client Report' },
    { value: 'custom', label: 'Custom Report' },
  ];

  const DATA_SOURCES = [
    { value: 'cases', label: 'Cases' },
    { value: 'billing', label: 'Billing' },
    { value: 'time-entries', label: 'Time Entries' },
    { value: 'documents', label: 'Documents' },
    { value: 'clients', label: 'Clients' },
  ];

  const CHART_TYPES = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'donut', label: 'Donut Chart' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Report Builder</h1>
          <p className="text-slate-600 mt-1">
            Create and manage custom reports
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span className="font-medium">New Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <DataTable
          columns={reportColumns}
          data={mockReports}
          pageSize={10}
          showPagination={true}
        />
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Create New Report
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Report Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportForm.name}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Monthly Performance Report"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the report"
                />
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportForm.type}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, type: e.target.value as ReportType })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {REPORT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Source */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data Source
                </label>
                <select
                  value={reportForm.dataSource}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, dataSource: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {DATA_SOURCES.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visualization Type
                </label>
                <select
                  value={reportForm.chartType}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, chartType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CHART_TYPES.map((chart) => (
                    <option key={chart.value} value={chart.value}>
                      {chart.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReport}
                  disabled={!reportForm.name || isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Create Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
