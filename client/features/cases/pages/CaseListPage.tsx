/**
 * Case List Page
 * Sophisticated case management interface with multiple view modes
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Grid3x3,
  List,
  Columns,
  Download,
  Archive,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useCases, useCreateCase, useDeleteCase } from '../api/cases.api';
import { useCaseStore } from '../store/cases.store';
import { CaseFilters } from '../components/CaseFilters';
import { CaseCard } from '../components/CaseCard';
import { CaseRow } from '../components/CaseRow';
import { CaseKanbanCard } from '../components/CaseKanbanCard';
import { CreateCaseDialog } from '../components/CreateCaseDialog';
import { CaseStatusType } from '../api/cases.types';

export const CaseListPage: React.FC = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Store hooks
  const {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    selectedCases,
    toggleCaseSelection,
    selectAllCases,
    clearSelection,
    isSelected,
    selectedCount,
    hasActiveFilters,
    saveFilterPreset,
  } = useCaseStore();

  // API hooks
  const { cases, isLoading, error, refetch, total, page, totalPages } = useCases({
    filters: { ...filters, search: searchQuery },
    page: 1,
    limit: 50,
  });

  const { createCase } = useCreateCase();
  const { deleteCase } = useDeleteCase();

  const handleCreateCase = async (caseData: any) => {
    await createCase(caseData);
    refetch();
  };

  const handleCaseClick = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  const handleBulkArchive = async () => {
    // TODO: Implement bulk archive
    console.log('Archiving cases:', selectedCases);
    clearSelection();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting cases');
  };

  // Group cases by status for Kanban view
  const casesByStatus = cases.reduce((acc, caseItem) => {
    const status = caseItem.status as CaseStatusType;
    if (!acc[status]) acc[status] = [];
    acc[status].push(caseItem);
    return acc;
  }, {} as Record<CaseStatusType, typeof cases>);

  const kanbanColumns: CaseStatusType[] = [
    'Active',
    'Pending',
    'Discovery',
    'Trial',
    'Settled',
    'Closed',
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cases</h1>
            <p className="text-sm text-slate-500 mt-1">
              {total} total cases {hasActiveFilters && '(filtered)'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <>
                <span className="text-sm text-slate-600">{selectedCount} selected</span>
                <button
                  onClick={handleBulkArchive}
                  className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Clear
                </button>
              </>
            )}
            <button
              onClick={handleExport}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => refetch()}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Case
            </button>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
              showFilters
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <div className="flex items-center gap-1 border border-slate-300 rounded-md p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${
                viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded ${
                viewMode === 'kanban' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Kanban view"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto p-4">
            <CaseFilters
              filters={filters}
              onFilterChange={setFilters}
              onClear={clearFilters}
              onSavePreset={saveFilterPreset}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading cases...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-2">Failed to load cases</p>
                <button
                  onClick={() => refetch()}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : cases.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-slate-400 mb-4">
                  <Grid3x3 className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No cases found</h3>
                <p className="text-slate-500 mb-4">
                  {hasActiveFilters
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first case'}
                </p>
                {!hasActiveFilters && (
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Create Case
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === 'table' && (
                <div className="bg-white">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                selectAllCases(cases.map((c) => c.id));
                              } else {
                                clearSelection();
                              }
                            }}
                            checked={selectedCount === cases.length && cases.length > 0}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Case
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Client
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Court
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Filed
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Days Open
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.map((caseItem) => (
                        <CaseRow
                          key={caseItem.id}
                          case={caseItem}
                          onSelect={toggleCaseSelection}
                          isSelected={isSelected(caseItem.id)}
                          onClick={() => handleCaseClick(caseItem.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cases.map((caseItem) => (
                      <CaseCard
                        key={caseItem.id}
                        case={caseItem}
                        onSelect={toggleCaseSelection}
                        isSelected={isSelected(caseItem.id)}
                        onClick={() => handleCaseClick(caseItem.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Kanban View */}
              {viewMode === 'kanban' && (
                <div className="p-6 overflow-x-auto">
                  <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                    {kanbanColumns.map((status) => (
                      <div key={status} className="w-80 flex-shrink-0">
                        <div className="bg-slate-100 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900">{status}</h3>
                            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded">
                              {casesByStatus[status]?.length || 0}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {casesByStatus[status]?.map((caseItem) => (
                            <CaseKanbanCard
                              key={caseItem.id}
                              case={caseItem}
                              onClick={() => handleCaseClick(caseItem.id)}
                            />
                          ))}
                          {(!casesByStatus[status] || casesByStatus[status].length === 0) && (
                            <div className="text-center py-8 text-slate-400 text-sm">
                              No cases
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Case Dialog */}
      <CreateCaseDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
};
