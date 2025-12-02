/**
 * useReportBuilder Hook
 * Custom report creation and management
 */

import { useState } from 'react';
import { useApiRequest, useTrackEvent, useLatestCallback } from '../enzyme';
import { Report, ReportConfig, ReportSchedule } from '../types/analytics';
import { ApiService } from '../services/apiService';

export const useReportBuilder = () => {
  const trackEvent = useTrackEvent();
  const [isCreating, setIsCreating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Fetch all reports
  const {
    data: reports,
    isLoading: loadingReports,
    refetch: refetchReports,
  } = useApiRequest<Report[]>({
    endpoint: '/api/v1/analytics/reports',
    options: { staleTime: 2 * 60 * 1000 },
  });

  // Create new report
  const createReport = useLatestCallback(async (reportData: Partial<Report>) => {
    setIsCreating(true);
    try {
      trackEvent('report_created', {
        type: reportData.type,
        timestamp: new Date().toISOString(),
      });

      const newReport = await ApiService.analytics.createReport(reportData);
      await refetchReports();
      return newReport;
    } catch (error) {
      console.error('Failed to create report:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  });

  // Update existing report
  const updateReport = useLatestCallback(
    async (id: string, reportData: Partial<Report>) => {
      try {
        trackEvent('report_updated', {
          reportId: id,
          timestamp: new Date().toISOString(),
        });

        const updated = await ApiService.analytics.updateReport(id, reportData);
        await refetchReports();
        return updated;
      } catch (error) {
        console.error('Failed to update report:', error);
        throw error;
      }
    }
  );

  // Delete report
  const deleteReport = useLatestCallback(async (id: string) => {
    try {
      trackEvent('report_deleted', {
        reportId: id,
        timestamp: new Date().toISOString(),
      });

      await ApiService.analytics.deleteReport(id);
      await refetchReports();
    } catch (error) {
      console.error('Failed to delete report:', error);
      throw error;
    }
  });

  // Execute report
  const executeReport = useLatestCallback(async (id: string) => {
    setIsExecuting(true);
    try {
      trackEvent('report_executed', {
        reportId: id,
        timestamp: new Date().toISOString(),
      });

      const result = await ApiService.analytics.executeReport(id);
      return result;
    } catch (error) {
      console.error('Failed to execute report:', error);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  });

  // Schedule report
  const scheduleReport = useLatestCallback(
    async (id: string, schedule: ReportSchedule) => {
      try {
        trackEvent('report_scheduled', {
          reportId: id,
          frequency: schedule.frequency,
          timestamp: new Date().toISOString(),
        });

        await ApiService.analytics.scheduleReport(id, schedule);
        await refetchReports();
      } catch (error) {
        console.error('Failed to schedule report:', error);
        throw error;
      }
    }
  );

  // Get report data
  const getReportData = useLatestCallback(
    async (reportType: string, params?: any) => {
      try {
        return await ApiService.analytics.getReportData(reportType, params);
      } catch (error) {
        console.error('Failed to get report data:', error);
        throw error;
      }
    }
  );

  return {
    reports,
    loadingReports,
    isCreating,
    isExecuting,
    createReport,
    updateReport,
    deleteReport,
    executeReport,
    scheduleReport,
    getReportData,
    refetchReports,
  };
};
