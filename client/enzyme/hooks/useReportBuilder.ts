import { useState } from 'react';
import { useApiRequest } from '../services/hooks';
import { enzymeClient } from '../services/client';
import { useLatestCallback, useTrackEvent } from '@missionfabric-js/enzyme/hooks';
import { Report, ReportConfig, ReportSchedule } from '../../types/analytics';

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
    endpoint: '/analytics/reports',
    options: {
      staleTime: 5 * 60 * 1000,
    }
  });

  // Create new report
  const createReport = useLatestCallback(async (reportData: Partial<Report>) => {
    setIsCreating(true);
    try {
      trackEvent('report_created', {
        type: reportData.type,
        timestamp: new Date().toISOString(),
      });

      const { data: newReport } = await enzymeClient.post<Report>('/analytics/reports', reportData);
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

        const { data: updated } = await enzymeClient.put<Report>(`/analytics/reports/${id}`, reportData);
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

      await enzymeClient.delete(`/analytics/reports/${id}`);
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

      const { data: result } = await enzymeClient.post(`/analytics/reports/${id}/execute`);
      return result;
    } catch (error) {
      console.error('Failed to execute report:', error);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  });

  return {
    reports,
    loadingReports,
    isCreating,
    isExecuting,
    createReport,
    updateReport,
    deleteReport,
    executeReport,
    refetchReports
  };
};
