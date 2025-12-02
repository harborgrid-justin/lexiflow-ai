/**
 * Dashboard Store
 * Zustand store for dashboard state management
 */

import { create } from 'zustand';

export type DashboardTimeRange = '7d' | '30d' | '90d' | '365d' | 'all';
export type DashboardMetricType = 'cases' | 'billing' | 'productivity' | 'sla';

interface DashboardFilters {
  timeRange: DashboardTimeRange;
  practiceArea?: string;
  attorney?: string;
  client?: string;
}

interface DashboardState {
  // Filters
  filters: DashboardFilters;
  
  // UI State
  selectedMetrics: DashboardMetricType[];
  isCompactView: boolean;
  showAlerts: boolean;
  
  // Actions
  setTimeRange: (range: DashboardTimeRange) => void;
  setFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
  toggleMetric: (metric: DashboardMetricType) => void;
  setCompactView: (compact: boolean) => void;
  toggleAlerts: () => void;
}

const defaultFilters: DashboardFilters = {
  timeRange: '30d',
  practiceArea: undefined,
  attorney: undefined,
  client: undefined,
};

export const useDashboardStore = create<DashboardState>((set) => ({
  filters: defaultFilters,
  selectedMetrics: ['cases', 'billing', 'productivity', 'sla'],
  isCompactView: false,
  showAlerts: true,

  setTimeRange: (range) => 
    set((state) => ({ 
      filters: { ...state.filters, timeRange: range } 
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters }
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  toggleMetric: (metric) =>
    set((state) => ({
      selectedMetrics: state.selectedMetrics.includes(metric)
        ? state.selectedMetrics.filter(m => m !== metric)
        : [...state.selectedMetrics, metric]
    })),

  setCompactView: (compact) => set({ isCompactView: compact }),

  toggleAlerts: () => set((state) => ({ showAlerts: !state.showAlerts })),
}));

// Selectors
export const selectDashboardFilters = (state: DashboardState) => state.filters;
export const selectTimeRange = (state: DashboardState) => state.filters.timeRange;
export const selectSelectedMetrics = (state: DashboardState) => state.selectedMetrics;
export const selectIsCompactView = (state: DashboardState) => state.isCompactView;
export const selectShowAlerts = (state: DashboardState) => state.showAlerts;
