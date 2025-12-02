/**
 * Analytics Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalyticsDateRange, AnalyticsViewMode } from '../api/analytics.types';

interface AnalyticsState {
  // View state
  viewMode: AnalyticsViewMode;
  setViewMode: (mode: AnalyticsViewMode) => void;

  // Date range
  dateRange: AnalyticsDateRange;
  setDateRange: (range: AnalyticsDateRange) => void;
  setQuickRange: (preset: 'today' | 'week' | 'month' | 'quarter' | 'year') => void;

  // Comparison mode
  isComparisonEnabled: boolean;
  comparisonRange: AnalyticsDateRange | null;
  enableComparison: (range: AnalyticsDateRange) => void;
  disableComparison: () => void;

  // Chart preferences
  chartType: 'line' | 'bar' | 'area';
  setChartType: (type: 'line' | 'bar' | 'area') => void;
}

const getDefaultDateRange = (): AnalyticsDateRange => {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    from: firstOfMonth.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0],
  };
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      // View state
      viewMode: 'dashboard',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Date range
      dateRange: getDefaultDateRange(),
      setDateRange: (range) => set({ dateRange: range }),
      setQuickRange: (preset) => {
        const now = new Date();
        let from: Date;

        switch (preset) {
          case 'today':
            from = now;
            break;
          case 'week':
            from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            from = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'quarter':
            from = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
            break;
          case 'year':
            from = new Date(now.getFullYear(), 0, 1);
            break;
        }

        set({
          dateRange: {
            from: from.toISOString().split('T')[0],
            to: now.toISOString().split('T')[0],
          },
        });
      },

      // Comparison mode
      isComparisonEnabled: false,
      comparisonRange: null,
      enableComparison: (range) =>
        set({ isComparisonEnabled: true, comparisonRange: range }),
      disableComparison: () =>
        set({ isComparisonEnabled: false, comparisonRange: null }),

      // Chart preferences
      chartType: 'line',
      setChartType: (type) => set({ chartType: type }),
    }),
    {
      name: 'lexiflow-analytics-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        chartType: state.chartType,
      }),
    }
  )
);
