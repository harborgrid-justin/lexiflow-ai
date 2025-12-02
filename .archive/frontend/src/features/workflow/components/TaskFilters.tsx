/**
 * TaskFilters Component
 * Advanced filtering panel for tasks
 */

import React from 'react';
import { TaskFilters as TaskFiltersType, TaskPriority, TaskStatus } from '../types';
import { useTaskStore, selectHasActiveFilters } from '../store/workflow.store';

export const TaskFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useTaskStore();
  const hasActiveFilters = useTaskStore(selectHasActiveFilters);

  const priorities: TaskPriority[] = ['Critical', 'High', 'Medium', 'Low'];
  const statuses: TaskStatus[] = ['Not Started', 'In Progress', 'Blocked', 'On Hold', 'Completed'];

  const handleStatusToggle = (status: TaskStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const handlePriorityToggle = (priority: TaskPriority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];

    setFilters({ priority: newPriorities.length > 0 ? newPriorities : undefined });
  };

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => setFilters({ search: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.status?.includes(status) || false}
                onChange={() => handleStatusToggle(status)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <div className="space-y-2">
          {priorities.map((priority) => (
            <label key={priority} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.priority?.includes(priority) || false}
                onChange={() => handlePriorityToggle(priority)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{priority}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Due Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <div className="space-y-2">
          <input
            type="date"
            placeholder="From"
            value={filters.dueDateFrom || ''}
            onChange={(e) => setFilters({ dueDateFrom: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <input
            type="date"
            placeholder="To"
            value={filters.dueDateTo || ''}
            onChange={(e) => setFilters({ dueDateTo: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Filters
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isOverdue || false}
              onChange={(e) => setFilters({ isOverdue: e.target.checked || undefined })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Overdue only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasAttachments || false}
              onChange={(e) => setFilters({ hasAttachments: e.target.checked || undefined })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Has attachments</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasComments || false}
              onChange={(e) => setFilters({ hasComments: e.target.checked || undefined })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Has comments</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          placeholder="Enter tags (comma-separated)"
          value={filters.tags?.join(', ') || ''}
          onChange={(e) => {
            const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
            setFilters({ tags: tags.length > 0 ? tags : undefined });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
    </div>
  );
};
