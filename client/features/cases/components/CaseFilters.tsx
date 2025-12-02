/**
 * Case Filters Component
 * Sophisticated filter panel with multiple filter types
 */

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Save, Star } from 'lucide-react';
import { CaseFilters as CaseFiltersType, CaseStatusType, PracticeArea, CasePriority } from '../api/cases.types';

interface CaseFiltersProps {
  filters: CaseFiltersType;
  onFilterChange: (filters: CaseFiltersType) => void;
  onClear: () => void;
  onSavePreset?: (name: string) => void;
  availableAttorneys?: Array<{ id: string; name: string }>;
  availableCourts?: string[];
  availableJurisdictions?: string[];
}

const STATUSES: CaseStatusType[] = [
  'Active',
  'Pending',
  'Discovery',
  'Trial',
  'Settled',
  'Closed',
  'Archived',
  'Appeal',
  'On Hold',
];

const PRACTICE_AREAS: PracticeArea[] = [
  'Litigation',
  'Commercial Litigation',
  'M&A',
  'IP',
  'Real Estate',
  'Criminal Defense',
  'Family Law',
  'Immigration',
  'Employment Law',
  'Tax Law',
  'Bankruptcy',
  'Personal Injury',
];

const PRIORITIES: CasePriority[] = ['Low', 'Medium', 'High', 'Urgent'];

export const CaseFilters: React.FC<CaseFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
  onSavePreset,
  availableAttorneys = [],
  availableCourts = [],
  availableJurisdictions = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof CaseFiltersType];
    return value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true);
  });

  const updateFilter = (key: keyof CaseFiltersType, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof CaseFiltersType, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    updateFilter(key, newValues.length > 0 ? newValues : undefined);
  };

  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim());
      setPresetName('');
      setShowSaveDialog(false);
    }
  };

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        return count + (value.length > 0 ? 1 : 0);
      }
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="font-semibold text-slate-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <>
              {onSavePreset && (
                <button
                  onClick={() => setShowSaveDialog(!showSaveDialog)}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              )}
              <button
                onClick={onClear}
                className="text-xs text-slate-600 hover:text-red-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            </>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600 hover:text-slate-900"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Save Preset Dialog */}
      {showSaveDialog && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
            />
            <button
              onClick={handleSavePreset}
              disabled={!presetName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value || undefined)}
              placeholder="Search cases..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => {
                const isSelected = filters.status?.includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleArrayFilter('status', status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practice Area Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Practice Area</label>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_AREAS.map((area) => {
                const isSelected = filters.practiceArea?.includes(area);
                return (
                  <button
                    key={area}
                    onClick={() => toggleArrayFilter('practiceArea', area)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((priority) => {
                const isSelected = filters.priority?.includes(priority);
                return (
                  <button
                    key={priority}
                    onClick={() => toggleArrayFilter('priority', priority)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {priority}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attorney Filter */}
          {availableAttorneys.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Attorney</label>
              <select
                multiple
                value={filters.attorney || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  updateFilter('attorney', selected.length > 0 ? selected : undefined);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                size={Math.min(availableAttorneys.length, 5)}
              >
                {availableAttorneys.map((attorney) => (
                  <option key={attorney.id} value={attorney.id}>
                    {attorney.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Court Filter */}
          {availableCourts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court</label>
              <input
                type="text"
                list="courts"
                value={filters.court?.[0] || ''}
                onChange={(e) => updateFilter('court', e.target.value ? [e.target.value] : undefined)}
                placeholder="Select or type court name..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
              />
              <datalist id="courts">
                {availableCourts.map((court) => (
                  <option key={court} value={court} />
                ))}
              </datalist>
            </div>
          )}

          {/* Jurisdiction Filter */}
          {availableJurisdictions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Jurisdiction</label>
              <input
                type="text"
                list="jurisdictions"
                value={filters.jurisdiction?.[0] || ''}
                onChange={(e) =>
                  updateFilter('jurisdiction', e.target.value ? [e.target.value] : undefined)
                }
                placeholder="Select or type jurisdiction..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
              />
              <datalist id="jurisdictions">
                {availableJurisdictions.map((jurisdiction) => (
                  <option key={jurisdiction} value={jurisdiction} />
                ))}
              </datalist>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
