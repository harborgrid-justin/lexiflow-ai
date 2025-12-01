import { useMemo } from 'react';
import { Briefcase, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useApiRequest, useLatestCallback } from '../enzyme';
import { useWorkflowEngine } from './useWorkflowEngine';

export const useDashboard = () => {
  const { checkSLABreaches } = useWorkflowEngine();

  // Fetch dashboard data with Enzyme - automatic caching and refetching
  const { data: dashboardData, isLoading } = useApiRequest<any>({
    endpoint: '/api/v1/analytics/dashboard',
    options: { staleTime: 5 * 60 * 1000 } // Cache for 5 minutes
  });

  // Fetch SLA breaches separately with shorter cache time
  const { data: slaData } = useApiRequest<any>({
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

  const chartData = dashboardData?.chartData || [];
  const alerts = dashboardData?.alerts || [];
  const slaBreaches = {
    warnings: slaData?.warnings?.length || 0,
    breaches: slaData?.breaches?.length || 0
  };

  return {
    stats,
    chartData,
    alerts,
    slaBreaches,
    isLoading
  };
};