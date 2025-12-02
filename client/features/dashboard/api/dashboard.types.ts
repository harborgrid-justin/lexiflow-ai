/**
 * Dashboard Feature - Type Definitions
 */

import type { LucideIcon } from 'lucide-react';

export interface DashboardStat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export interface DashboardAlert {
  id: string;
  message: string;
  detail: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  caseId?: string;
}

export interface ChartDataPoint {
  name: string;
  count: number;
}

export interface SLABreaches {
  warnings: number;
  breaches: number;
}

export interface DashboardData {
  stats: DashboardStat[];
  chartData: ChartDataPoint[];
  alerts: DashboardAlert[];
  slaBreaches: SLABreaches;
}
