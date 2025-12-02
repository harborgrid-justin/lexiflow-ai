/**
 * TasksPage Component
 * Main task management page with multiple view modes
 */

import React, { useMemo, useState } from 'react';
import { useTasks, useUpdateTask, useBulkTaskAction } from '../api/tasks.api';
import { useTaskStore, selectHasActiveFilters } from '../store/workflow.store';
import { TaskKanbanBoard } from '../components/TaskKanbanBoard';
import { TaskRow } from '../components/TaskRow';
import { TaskFilters } from '../components/TaskFilters';
import { TaskDetail } from '../components/TaskDetail';
import { QuickAddTask } from '../components/QuickAddTask';
import { TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    filters,
    sort,
    setSort,
    selectedTaskIds,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    detailTaskId,
    openTaskDetail,
    closeTaskDetail,
    showQuickAdd,
    openQuickAdd,
    closeQuickAdd,
  } = useTaskStore();

  const hasActiveFilters = useTaskStore(selectHasActiveFilters);
  const [showFilters, setShowFilters] = useState(true);

  const { data: tasks = [], isLoading, error } = useTasks(filters, sort);
  const updateTask = useUpdateTask();
  const bulkAction = useBulkTaskAction();

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        data: { status: newStatus },
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      clearSelection();
    } else {
      selectAllTasks(tasks.map((t) => t.id));
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTaskIds.length === 0) return;

    try {
      await bulkAction.mutateAsync({
        taskIds: selectedTaskIds,
        action: 'complete',
      });
      clearSelection();
    } catch (error) {
      console.error('Failed to complete tasks:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTaskIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedTaskIds.length} tasks?`)) return;

    try {
      await bulkAction.mutateAsync({
        taskIds: selectedTaskIds,
        action: 'delete',
      });
      clearSelection();
    } catch (error) {
      console.error('Failed to delete tasks:', error);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed'
    ).length;

    return { total, completed, inProgress, overdue };
  }, [tasks]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track all your legal tasks
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { mode: 'list', icon: '☰', label: 'List' },
                  { mode: 'board', icon: '▦', label: 'Board' },
                  { mode: 'calendar', icon: '📅', label: 'Calendar' },
                  { mode: 'timeline', icon: '━', label: 'Timeline' },
                ].map((view) => (
                  <button
                    key={view.mode}
                    onClick={() => setViewMode(view.mode as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === view.mode
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={view.label}
                  >
                    {view.icon}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  hasActiveFilters
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                🔍 Filters {hasActiveFilters && `(${Object.keys(filters).filter((k) => filters[k as keyof typeof filters]).length})`}
              </button>

              <button
                onClick={() => openQuickAdd()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                + New Task
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total:</span>
              <span className="font-semibold text-gray-900">{stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">In Progress:</span>
              <span className="font-semibold text-blue-600">{stats.inProgress}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Completed:</span>
              <span className="font-semibold text-green-600">{stats.completed}</span>
            </div>
            {stats.overdue > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Overdue:</span>
                <span className="font-semibold text-red-600">{stats.overdue}</span>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedTaskIds.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedTaskIds.length} task{selectedTaskIds.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkComplete}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
                >
                  Complete
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1.5 text-gray-700 hover:text-gray-900 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0 border-r bg-white overflow-y-auto">
            <div className="p-4">
              <TaskFilters />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading tasks...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 font-semibold mb-2">Failed to load tasks</p>
                <p className="text-gray-500 text-sm">{error.message}</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Quick Add */}
              {showQuickAdd && (
                <div className="mb-6">
                  <QuickAddTask onSuccess={closeQuickAdd} />
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left w-12">
                          <input
                            type="checkbox"
                            checked={selectedTaskIds.length === tasks.length && tasks.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Assignee
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Case
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tasks.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center">
                            <p className="text-gray-400">No tasks found</p>
                            <button
                              onClick={() => openQuickAdd()}
                              className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              Create your first task
                            </button>
                          </td>
                        </tr>
                      ) : (
                        tasks.map((task) => (
                          <TaskRow
                            key={task.id}
                            task={task}
                            onClick={() => openTaskDetail(task.id)}
                            selected={selectedTaskIds.includes(task.id)}
                            onToggleSelect={toggleTaskSelection}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Board View */}
              {viewMode === 'board' && (
                <TaskKanbanBoard
                  tasks={tasks}
                  onTaskClick={openTaskDetail}
                  onTaskMove={handleTaskMove}
                />
              )}

              {/* Calendar View */}
              {viewMode === 'calendar' && (
                <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
                  <p className="text-gray-400">Calendar view coming soon...</p>
                </div>
              )}

              {/* Timeline View */}
              {viewMode === 'timeline' && (
                <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
                  <p className="text-gray-400">Timeline view coming soon...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Panel */}
      {detailTaskId && (
        <TaskDetail
          taskId={detailTaskId}
          onClose={closeTaskDetail}
        />
      )}
    </div>
  );
};
