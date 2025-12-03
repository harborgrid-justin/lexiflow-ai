/**
 * useDashboard Hook - Dashboard Management
 *
 * Manages dashboard state and analytics with SLA monitoring.
 *
 * Enzyme Features:
 * - useApiRequest: Automatic caching and refetching
 * - useLatestCallback: Stable refresh function
 * - useTrackEvent: Analytics tracking
 * - useDebouncedValue: Debounced SLA breach counts
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useMemo } from 'react';
import { Briefcase, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useApiRequest } from '../services/hooks';
import {
  useLatestCallback,
  useTrackEvent,
  useDebouncedValue
} from '@missionfabric-js/enzyme/hooks';

export const useDashboard = () => {
  const trackEvent = useTrackEvent();

  // Fetch dashboard data with automatic caching
  const { data: dashboardData, isLoading, refetch: refetchDashboard } = useApiRequest<any>({
    endpoint: '/api/v1/analytics/dashboard',
    options: { staleTime: 5 * 60 * 1000 }
  });

  // Fetch SLA breaches with shorter cache time
  const { data: slaData, refetch: refetchSLA } = useApiRequest<any>({
    endpoint: '/api/v1/workflow/engine/sla/check',
    options: { staleTime: 2 * 60 * 1000 }
  });

  // Map icon strings to components
  const stats = useMemo(() => {
    if (!dashboardData?.stats) return [];
    return dashboardData.stats.map((s: any) => ({
      ...s,
      icon: s.icon === 'Briefcase' ? Briefcase : 
            s.icon === 'FileText' ? FileText : 
            s.icon === 'Clock' ? Clock : AlertTriangle
    }));
  }, [dashboardData]);

  const chartData = useMemo(() => dashboardData?.chartData || [], [dashboardData?.chartData]);
  const alerts = useMemo(() => dashboardData?.alerts || [], [dashboardData?.alerts]);

  // Compute SLA breaches with debouncing
  const rawSlaBreaches = useMemo(() => ({
    warnings: slaData?.warnings?.length || 0,
    breaches: slaData?.breaches?.length || 0
  }), [slaData?.warnings?.length, slaData?.breaches?.length]);

  const slaBreaches = useDebouncedValue(rawSlaBreaches, 500);

  // Refresh with analytics tracking
  const refresh = useLatestCallback(() => {
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
    isLoading,
    refresh
  };
};
