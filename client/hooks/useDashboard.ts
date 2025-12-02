/**
 * ENZYME MIGRATION - Enhanced Dashboard Hook
 *
 * This hook manages the dashboard state and analytics with comprehensive Enzyme features.
 *
 * Enzyme Features Used:
 * - useApiRequest: Automatic caching and refetching for dashboard and SLA data
 * - useLatestCallback: Stable refresh function that always uses latest state
 * - useTrackEvent: Analytics tracking for dashboard loads, SLA status, and refreshes
 * - useIsMounted: Safe component lifecycle checks
 * - useDebouncedValue: Debounced SLA breach counts for performance
 *
 * Migration completed as part of Wave 6, Agent 46
 */

import { useMemo, useEffect } from 'react';
import { Briefcase, FileText, Clock, AlertTriangle } from 'lucide-react';
import {
  useApiRequest,
  useLatestCallback,
  useTrackEvent,
  useIsMounted,
  useDebouncedValue
} from '../enzyme';
import { useWorkflowEngine } from './useWorkflowEngine';

export const useDashboard = () => {
  const { checkSLABreaches } = useWorkflowEngine();
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // Fetch dashboard data with Enzyme - automatic caching and refetching
  const { data: dashboardData, isLoading, refetch: refetchDashboard } = useApiRequest<any>({
    endpoint: '/api/v1/analytics/dashboard',
    options: { staleTime: 5 * 60 * 1000 } // Cache for 5 minutes
  });

  // Fetch SLA breaches separately with shorter cache time
  const { data: slaData, refetch: refetchSLA } = useApiRequest<any>({
    endpoint: '/api/v1/workflow/engine/sla/check',
    options: { staleTime: 2 * 60 * 1000 } // Cache for 2 minutes
  });

  // Map icon strings to components using useMemo for performance
  const stats = useMemo(() => {
    if (!dashboardData?.stats) return [];
    return dashboardData.stats.map((s: any) => ({
      ...s,
      icon: s.icon === 'Briefcase' ? Briefcase : s.icon === 'FileText' ? FileText : s.icon === 'Clock' ? Clock : AlertTriangle
    }));
  }, [dashboardData]);

  // Compute alerts and chart data with memoization
  const chartData = useMemo(() => dashboardData?.chartData || [], [dashboardData?.chartData]);
  const alerts = useMemo(() => dashboardData?.alerts || [], [dashboardData?.alerts]);

  // Compute SLA breaches with debouncing to avoid rapid updates
  const rawSlaBreaches = useMemo(() => ({
    warnings: slaData?.warnings?.length || 0,
    breaches: slaData?.breaches?.length || 0
  }), [slaData?.warnings?.length, slaData?.breaches?.length]);

  // Debounce SLA breach counts to reduce re-renders during rapid updates
  const slaBreaches = useDebouncedValue(rawSlaBreaches, 500);

  // Track dashboard loads with analytics
  useEffect(() => {
    if (dashboardData && isMounted()) {
      trackEvent('dashboard_loaded', {
        statsCount: stats.length,
        alertsCount: alerts.length,
        hasChartData: chartData.length > 0
      });
    }
  }, [dashboardData, stats.length, alerts.length, chartData.length, trackEvent, isMounted]);

  // Track SLA status changes
  useEffect(() => {
    if (slaData && isMounted()) {
      trackEvent('dashboard_sla_status', {
        warnings: slaBreaches.warnings,
        breaches: slaBreaches.breaches,
        total: slaBreaches.warnings + slaBreaches.breaches
      });
    }
  }, [slaData, slaBreaches, trackEvent, isMounted]);

  // Expose refresh function with analytics tracking
  const refresh = useLatestCallback(() => {
    if (!isMounted()) return;

    trackEvent('dashboard_refreshed', {
      timestamp: new Date().toISOString()
    });

    // Trigger refetch of both queries
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