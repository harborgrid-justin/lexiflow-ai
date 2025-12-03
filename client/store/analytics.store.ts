/**
 * Analytics Store
 * State management for analytics dashboard and report preferences
 */

import { useState, useCallback } from 'react';
import { DateRange, DashboardLayout, WidgetPosition, AnalyticsFilters } from '../types/analytics';

// Store interface
interface AnalyticsStore {
  // Dashboard preferences
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  // Dashboard layout
  layout: DashboardLayout | null;
  setLayout: (layout: DashboardLayout) => void;
  resetLayout: () => void;

  // Filters
  filters: AnalyticsFilters;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  clearFilters: () => void;

  // Saved reports
  savedReports: string[];
  addSavedReport: (reportId: string) => void;
  removeSavedReport: (reportId: string) => void;

  // UI preferences
  preferences: {
    showSparklines: boolean;
    chartAnimations: boolean;
    refreshInterval: number;
  };
  setPreferences: (prefs: Partial<{
    showSparklines: boolean;
    chartAnimations: boolean;
    refreshInterval: number;
  }>) => void;
}

// Default state
const DEFAULT_DATE_RANGE: DateRange = {
  start: new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split('T')[0],
  end: new Date().toISOString().split('T')[0],
  preset: 'last-30-days',
};

const DEFAULT_FILTERS: AnalyticsFilters = {
  dateRange: DEFAULT_DATE_RANGE,
  practiceAreas: undefined,
  attorneys: undefined,
  clients: undefined,
  status: undefined,
  courts: undefined,
};

const DEFAULT_PREFERENCES = {
  showSparklines: true,
  chartAnimations: true,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
};

const DEFAULT_LAYOUT: DashboardLayout = {
  id: 'default',
  name: 'Default Layout',
  isDefault: true,
  widgets: [
    { id: 'kpi-grid', type: 'kpi-cards', x: 0, y: 0, width: 12, height: 2 },
    { id: 'revenue-chart', type: 'area-chart', x: 0, y: 2, width: 6, height: 4 },
    { id: 'case-status', type: 'donut-chart', x: 6, y: 2, width: 6, height: 4 },
  ],
};

/**
 * useAnalyticsStore Hook
 * Custom hook for analytics state management
 */
export const useAnalyticsStore = (): AnalyticsStore => {
  // Load from localStorage on mount
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`analytics_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const saveToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(`analytics_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // State
  const [dateRange, setDateRangeState] = useState<DateRange>(() =>
    loadFromStorage('dateRange', DEFAULT_DATE_RANGE)
  );

  const [layout, setLayoutState] = useState<DashboardLayout | null>(() =>
    loadFromStorage('layout', DEFAULT_LAYOUT)
  );

  const [filters, setFiltersState] = useState<AnalyticsFilters>(() =>
    loadFromStorage('filters', DEFAULT_FILTERS)
  );

  const [savedReports, setSavedReports] = useState<string[]>(() =>
    loadFromStorage('savedReports', [])
  );

  const [preferences, setPreferencesState] = useState(() =>
    loadFromStorage('preferences', DEFAULT_PREFERENCES)
  );

  // Actions
  const setDateRange = useCallback((range: DateRange) => {
    setDateRangeState(range);
    saveToStorage('dateRange', range);
  }, []);

  const setLayout = useCallback((newLayout: DashboardLayout) => {
    setLayoutState(newLayout);
    saveToStorage('layout', newLayout);
  }, []);

  const resetLayout = useCallback(() => {
    setLayoutState(DEFAULT_LAYOUT);
    saveToStorage('layout', DEFAULT_LAYOUT);
  }, []);

  const setFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters };
      saveToStorage('filters', updated);
      return updated;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    saveToStorage('filters', DEFAULT_FILTERS);
  }, []);

  const addSavedReport = useCallback((reportId: string) => {
    setSavedReports((prev) => {
      if (prev.includes(reportId)) return prev;
      const updated = [...prev, reportId];
      saveToStorage('savedReports', updated);
      return updated;
    });
  }, []);

  const removeSavedReport = useCallback((reportId: string) => {
    setSavedReports((prev) => {
      const updated = prev.filter((id) => id !== reportId);
      saveToStorage('savedReports', updated);
      return updated;
    });
  }, []);

  const setPreferences = useCallback(
    (newPrefs: Partial<typeof DEFAULT_PREFERENCES>) => {
      setPreferencesState((prev) => {
        const updated = { ...prev, ...newPrefs };
        saveToStorage('preferences', updated);
        return updated;
      });
    },
    []
  );

  return {
    dateRange,
    setDateRange,
    layout,
    setLayout,
    resetLayout,
    filters,
    setFilters,
    clearFilters,
    savedReports,
    addSavedReport,
    removeSavedReport,
    preferences,
    setPreferences,
  };
};
