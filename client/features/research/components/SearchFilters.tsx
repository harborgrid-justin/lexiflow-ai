/**
 * Faceted Search Filters for Legal Research
 * Advanced filtering for jurisdiction, court level, date range, etc.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Scale, MapPin, FileText, Filter } from 'lucide-react';
import type { SearchFilters as SearchFiltersType, CourtLevel, DocumentType, SortOption } from '../api/research.types';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onChange: (filters: SearchFiltersType) => void;
  facets?: {
    jurisdictions?: { value: string; count: number }[];
    courtLevels?: { value: string; count: number }[];
    practiceAreas?: { value: string; count: number }[];
    documentTypes?: { value: string; count: number }[];
    years?: { value: string; count: number }[];
  };
  onReset?: () => void;
}

const FilterSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  sectionKey: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, icon, sectionKey: _sectionKey, children, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  facets,
  onReset,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['sort', 'jurisdiction', 'documentType'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const updateFilters = (key: keyof SearchFiltersType, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayValue = (key: keyof SearchFiltersType, value: string) => {
    const current = (filters[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilters(key, next.length > 0 ? next : undefined);
  };

  const hasActiveFilters = Object.values(filters).some(v =>
    Array.isArray(v) ? v.length > 0 : v !== undefined
  );

  const activeFilterCount = [
    filters.jurisdiction?.length || 0,
    filters.courtLevel?.length || 0,
    filters.practiceArea?.length || 0,
    filters.documentType?.length || 0,
    filters.dateRange ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const courtLevels: CourtLevel[] = [
    'Supreme Court',
    'Appellate',
    'District',
    'State Supreme',
    'State Appellate',
    'Trial',
  ];

  const documentTypes: DocumentType[] = [
    'case',
    'statute',
    'regulation',
    'article',
    'brief',
    'opinion',
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'citations-desc', label: 'Most Cited' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && onReset && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection 
        title="Sort By" 
        icon={<FileText className="w-4 h-4 text-gray-500" />} 
        sectionKey="sort"
        isExpanded={expandedSections.has('sort')}
        onToggle={() => toggleSection('sort')}
      >
        <div className="space-y-2">
          {sortOptions.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded"
            >
              <input
                type="radio"
                name="sort"
                checked={filters.sort === option.value || (!filters.sort && option.value === 'relevance')}
                onChange={() => updateFilters('sort', option.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Jurisdiction */}
      <FilterSection 
        title="Jurisdiction" 
        icon={<MapPin className="w-4 h-4 text-gray-500" />} 
        sectionKey="jurisdiction"
        isExpanded={expandedSections.has('jurisdiction')}
        onToggle={() => toggleSection('jurisdiction')}
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {facets?.jurisdictions && facets.jurisdictions.length > 0 ? (
            facets.jurisdictions.map(({ value, count }) => (
              <label
                key={value}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={filters.jurisdiction?.includes(value) || false}
                    onChange={() => toggleArrayValue('jurisdiction', value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 truncate">{value}</span>
                </div>
                <span className="text-xs text-gray-500">{count}</span>
              </label>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No jurisdictions available</div>
          )}
        </div>
      </FilterSection>

      {/* Court Level */}
      <FilterSection 
        title="Court Level" 
        icon={<Scale className="w-4 h-4 text-gray-500" />} 
        sectionKey="courtLevel"
        isExpanded={expandedSections.has('courtLevel')}
        onToggle={() => toggleSection('courtLevel')}
      >
        <div className="space-y-2">
          {courtLevels.map(level => {
            const facet = facets?.courtLevels?.find(f => f.value === level);
            return (
              <label
                key={level}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.courtLevel?.includes(level) || false}
                    onChange={() => toggleArrayValue('courtLevel', level)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </div>
                {facet && <span className="text-xs text-gray-500">{facet.count}</span>}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Document Type */}
      <FilterSection 
        title="Document Type" 
        icon={<FileText className="w-4 h-4 text-gray-500" />} 
        sectionKey="documentType"
        isExpanded={expandedSections.has('documentType')}
        onToggle={() => toggleSection('documentType')}
      >
        <div className="space-y-2">
          {documentTypes.map(type => {
            const facet = facets?.documentTypes?.find(f => f.value === type);
            return (
              <label
                key={type}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.documentType?.includes(type) || false}
                    onChange={() => toggleArrayValue('documentType', type)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </div>
                {facet && <span className="text-xs text-gray-500">{facet.count}</span>}
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Practice Area */}
      {facets?.practiceAreas && facets.practiceAreas.length > 0 && (
        <FilterSection 
          title="Practice Area" 
          icon={<Scale className="w-4 h-4 text-gray-500" />} 
          sectionKey="practiceArea"
          isExpanded={expandedSections.has('practiceArea')}
          onToggle={() => toggleSection('practiceArea')}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {facets.practiceAreas.map(({ value, count }) => (
              <label
                key={value}
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={filters.practiceArea?.includes(value) || false}
                    onChange={() => toggleArrayValue('practiceArea', value)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 truncate">{value}</span>
                </div>
                <span className="text-xs text-gray-500">{count}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Date Range */}
      <FilterSection 
        title="Date Range" 
        icon={<Calendar className="w-4 h-4 text-gray-500" />} 
        sectionKey="dateRange"
        isExpanded={expandedSections.has('dateRange')}
        onToggle={() => toggleSection('dateRange')}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => updateFilters('dateRange', {
                ...filters.dateRange,
                start: e.target.value || undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => updateFilters('dateRange', {
                ...filters.dateRange,
                end: e.target.value || undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {filters.dateRange && (
            <button
              onClick={() => updateFilters('dateRange', undefined)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear dates
            </button>
          )}
        </div>
      </FilterSection>

      {/* Minimum Citations */}
      <FilterSection 
        title="Minimum Citations" 
        icon={<Scale className="w-4 h-4 text-gray-500" />} 
        sectionKey="citations"
        isExpanded={expandedSections.has('citations')}
        onToggle={() => toggleSection('citations')}
      >
        <div className="space-y-2">
          <input
            type="number"
            min="0"
            value={filters.citedBy || ''}
            onChange={(e) => updateFilters('citedBy', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="e.g., 10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500">Show only cases cited at least this many times</p>
        </div>
      </FilterSection>
    </div>
  );
};
