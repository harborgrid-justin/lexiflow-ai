/**
 * Case Management Store
 * State management for case list view preferences and filters
 */

import { useState, useCallback, useEffect } from 'react';
import { CaseFilters, CaseViewMode, FilterPreset } from '../api/cases.types';

const STORAGE_KEYS = {
  VIEW_MODE: 'cases_view_mode',
  FILTERS: 'cases_filters',
  SELECTED_CASES: 'cases_selected',
  FILTER_PRESETS: 'cases_filter_presets',
};

/**
 * Custom hook for managing case list state
 */
export const useCaseStore = () => {
  // View mode (table, grid, kanban)
  const [viewMode, setViewModeState] = useState<CaseViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (saved as CaseViewMode) || 'table';
  });

  // Active filters
  const [filters, setFiltersState] = useState<CaseFilters>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FILTERS);
    return saved ? JSON.parse(saved) : {};
  });

  // Selected case IDs (for bulk operations)
  const [selectedCases, setSelectedCasesState] = useState<string[]>([]);

  // Filter presets
  const [filterPresets, setFilterPresetsState] = useState<FilterPreset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FILTER_PRESETS);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist view mode to localStorage
  const setViewMode = useCallback((mode: CaseViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  }, []);

  // Persist filters to localStorage
  const setFilters = useCallback((newFilters: CaseFilters) => {
    setFiltersState(newFilters);
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(newFilters));
  }, []);

  // Update a specific filter
  const updateFilter = useCallback(
    (key: keyof CaseFilters, value: any) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
    },
    [filters, setFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).some((key) => {
      const value = filters[key as keyof CaseFilters];
      return value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true);
    });
  }, [filters]);

  // Selected cases management
  const selectCase = useCallback((caseId: string) => {
    setSelectedCasesState((prev) => {
      if (prev.includes(caseId)) {
        return prev; // Already selected
      }
      return [...prev, caseId];
    });
  }, []);

  const deselectCase = useCallback((caseId: string) => {
    setSelectedCasesState((prev) => prev.filter((id) => id !== caseId));
  }, []);

  const toggleCaseSelection = useCallback((caseId: string) => {
    setSelectedCasesState((prev) => {
      if (prev.includes(caseId)) {
        return prev.filter((id) => id !== caseId);
      }
      return [...prev, caseId];
    });
  }, []);

  const selectAllCases = useCallback((caseIds: string[]) => {
    setSelectedCasesState(caseIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCasesState([]);
  }, []);

  const isSelected = useCallback(
    (caseId: string) => {
      return selectedCases.includes(caseId);
    },
    [selectedCases]
  );

  // Filter presets management
  const saveFilterPreset = useCallback(
    (name: string, isDefault: boolean = false) => {
      const newPreset: FilterPreset = {
        id: Date.now().toString(),
        name,
        filters: { ...filters },
        isDefault,
        userId: 'current-user', // TODO: Get from auth context
        createdAt: new Date().toISOString(),
      };

      const updatedPresets = isDefault
        ? filterPresets.map((p) => ({ ...p, isDefault: false })).concat(newPreset)
        : [...filterPresets, newPreset];

      setFilterPresetsState(updatedPresets);
      localStorage.setItem(STORAGE_KEYS.FILTER_PRESETS, JSON.stringify(updatedPresets));
    },
    [filters, filterPresets]
  );

  const deleteFilterPreset = useCallback(
    (presetId: string) => {
      const updatedPresets = filterPresets.filter((p) => p.id !== presetId);
      setFilterPresetsState(updatedPresets);
      localStorage.setItem(STORAGE_KEYS.FILTER_PRESETS, JSON.stringify(updatedPresets));
    },
    [filterPresets]
  );

  const loadFilterPreset = useCallback((preset: FilterPreset) => {
    setFilters(preset.filters);
  }, [setFilters]);

  const setDefaultPreset = useCallback(
    (presetId: string) => {
      const updatedPresets = filterPresets.map((p) => ({
        ...p,
        isDefault: p.id === presetId,
      }));
      setFilterPresetsState(updatedPresets);
      localStorage.setItem(STORAGE_KEYS.FILTER_PRESETS, JSON.stringify(updatedPresets));
    },
    [filterPresets]
  );

  // Load default preset on mount
  useEffect(() => {
    const defaultPreset = filterPresets.find((p) => p.isDefault);
    if (defaultPreset && !hasActiveFilters()) {
      setFilters(defaultPreset.filters);
    }
  }, []); // Only run on mount

  return {
    // View mode
    viewMode,
    setViewMode,

    // Filters
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),

    // Selection
    selectedCases,
    selectCase,
    deselectCase,
    toggleCaseSelection,
    selectAllCases,
    clearSelection,
    isSelected,
    selectedCount: selectedCases.length,

    // Filter presets
    filterPresets,
    saveFilterPreset,
    deleteFilterPreset,
    loadFilterPreset,
    setDefaultPreset,
  };
};
