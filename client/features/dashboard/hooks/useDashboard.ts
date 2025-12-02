/**
 * useDashboard Hook
 *
 * Manages dashboard state and data fetching.
 */

import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, FileText, Clock, AlertTriangle } from 'lucide-react';
import {
  useLatestCallback,
  useTrackEvent,
  useDebouncedValue,
  useIsMounted
} from '@/enzyme';
import { DashboardApi } from '../api/dashboard.api';
import type { DashboardStat, ChartDataPoint, DashboardAlert, SLABreaches } from '../api/dashboard.types';

const ICON_MAP: Record<string, typeof Briefcase> = {
  Briefcase,
  FileText,
  Clock,
  AlertTriangle
};

export const useDashboard = () => {
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // Fetch dashboard data
  const { 
    data: dashboardData, 
    isLoading, 
    refetch: refetchDashboard 
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: DashboardApi.getDashboardData,
    staleTime: 5 * 60 * 1000
  });

  // Fetch SLA data
  const { 
    data: slaData, 
    refetch: refetchSLA 
  } = useQuery({
    queryKey: ['dashboard', 'sla'],
    queryFn: DashboardApi.getSLAStatus,
    staleTime: 2 * 60 * 1000
  });

  // Map icon strings to components
  const stats = useMemo((): DashboardStat[] => {
    if (!dashboardData?.stats) return [];
    return dashboardData.stats.map((s: any) => ({
      ...s,
      icon: ICON_MAP[s.icon] || AlertTriangle
    }));
  }, [dashboardData]);

  const chartData = useMemo((): ChartDataPoint[] => 
    dashboardData?.chartData || [], 
    [dashboardData?.chartData]
  );
  
  const alerts = useMemo((): DashboardAlert[] => 
    dashboardData?.alerts || [], 
    [dashboardData?.alerts]
  );

  // Compute SLA breaches with debouncing
  const rawSlaBreaches = useMemo((): SLABreaches => ({
    warnings: slaData?.warnings?.length || 0,
    breaches: slaData?.breaches?.length || 0
  }), [slaData?.warnings?.length, slaData?.breaches?.length]);

  const slaBreaches = useDebouncedValue(rawSlaBreaches, 500);

  // Track dashboard loads
  useEffect(() => {
    if (dashboardData && isMounted()) {
      trackEvent('dashboard_loaded', {
        statsCount: stats.length,
        alertsCount: alerts.length,
        hasChartData: chartData.length > 0
      });
    }
  }, [dashboardData, stats.length, alerts.length, chartData.length, trackEvent, isMounted]);

  // Refresh function
  const refresh = useLatestCallback(() => {
    if (!isMounted()) return;

    trackEvent('dashboard_refreshed', {
      timestamp: new Date().toISOString()
    });

    refetchDashboard();
    refetchSLA();
  });

  return {
    stats,
    chartData,
    alerts,
    slaBreaches,
    loading: isLoading,
    refresh
  };
};

export default useDashboard;
