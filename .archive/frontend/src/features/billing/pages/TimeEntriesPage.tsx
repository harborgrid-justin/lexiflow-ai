// Time Entries Page - Main page for managing time entries
import React, { useState, useMemo } from 'react';
import { Plus, Filter, Download, Edit, Trash2, Calendar } from 'lucide-react';
import { useTimeEntries, useTimeEntrySummary, useBulkDeleteTimeEntries } from '../api/timeEntries.api';
import { useBillingStore } from '../store/billing.store';
import { TimeEntryRow } from '../components/TimeEntryRow';
import { TimeEntryForm } from '../components/TimeEntryForm';
import { QuickTimeEntry } from '../components/QuickTimeEntry';
import { HoursSummary } from '../components/HoursSummary';
import { ActivityTypeSelect } from '../components/ActivityTypeSelect';
import { TimeEntry, TimeEntryFilters } from '../api/billing.types';
import { formatDate } from '../utils/formatters';

export const TimeEntriesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [groupBy, setGroupBy] = useState<'date' | 'case' | 'none'>('date');

  const filters = useBillingStore((state) => state.timeEntryFilters);
  const setFilters = useBillingStore((state) => state.setTimeEntryFilters);
  const resetFilters = useBillingStore((state) => state.resetTimeEntryFilters);

  const selectedEntries = useBillingStore((state) => state.selectedTimeEntries);
  const toggleSelection = useBillingStore((state) => state.toggleTimeEntrySelection);
  const selectAll = useBillingStore((state) => state.selectAllTimeEntries);
  const clearSelection = useBillingStore((state) => state.clearTimeEntrySelection);

  const { data: entries = [], isLoading, refetch } = useTimeEntries(filters);
  const { data: summary, isLoading: summaryLoading } = useTimeEntrySummary(filters);
  const bulkDeleteMutation = useBulkDeleteTimeEntries();

  // Group entries
  const groupedEntries = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Entries': entries };
    }

    const groups: Record<string, TimeEntry[]> = {};

    entries.forEach((entry) => {
      let key: string;
      if (groupBy === 'date') {
        key = formatDate(entry.date, 'long');
      } else if (groupBy === 'case') {
        key = entry.caseName || 'Unknown Case';
      } else {
        key = 'All Entries';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(entry);
    });

    return groups;
  }, [entries, groupBy]);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedEntries.length} selected time entries?`)) {
      return;
    }

    try {
      await bulkDeleteMutation.mutateAsync(selectedEntries);
      clearSelection();
    } catch (error) {
      console.error('Failed to delete time entries:', error);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting time entries...');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Time Entries</h1>
            <p className="text-slate-600 mt-1">Track and manage your billable time</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Activity Type
                </label>
                <ActivityTypeSelect
                  value={filters.activityType || 'research'}
                  onChange={(value) => setFilters({ activityType: value })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Billable
                </label>
                <select
                  value={filters.isBillable?.toString() || 'all'}
                  onChange={(e) =>
                    setFilters({
                      isBillable: e.target.value === 'all' ? undefined : e.target.value === 'true',
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="true">Billable Only</option>
                  <option value="false">Non-Billable Only</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="px-8 py-6">
        {summary && <HoursSummary summary={summary} isLoading={summaryLoading} />}
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="bg-white border border-slate-200 rounded-lg">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Group by:</label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as 'date' | 'case' | 'none')}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="date">Date</option>
                  <option value="case">Case</option>
                  <option value="none">None</option>
                </select>
              </div>
              {selectedEntries.length > 0 && (
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-slate-600">
                    {selectedEntries.length} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            <div className="text-sm text-slate-600">{entries.length} entries</div>
          </div>

          {/* Quick Entry */}
          <div className="px-6 py-4 border-b border-slate-200">
            <QuickTimeEntry onSuccess={refetch} />
          </div>

          {/* Entries List */}
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No time entries found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your first time entry
                </button>
              </div>
            ) : (
              Object.entries(groupedEntries).map(([group, groupEntries]) => (
                <div key={group}>
                  {groupBy !== 'none' && (
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">{group}</h3>
                  )}
                  <div className="space-y-2">
                    {groupEntries.map((entry) => (
                      <TimeEntryRow
                        key={entry.id}
                        entry={entry}
                        isSelected={selectedEntries.includes(entry.id)}
                        onToggleSelect={toggleSelection}
                        showCase={groupBy !== 'case'}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Time Entry Form Modal */}
      {showForm && (
        <TimeEntryForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            refetch();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};
