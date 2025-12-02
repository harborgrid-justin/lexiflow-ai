/**
 * QuickAddTask Component
 * Inline task creation form
 */

import React, { useState } from 'react';
import { TaskPriority, QuickAddTaskForm } from '../types';
import { useCreateTask } from '../api/tasks.api';
import { useTaskStore } from '../store/workflow.store';

interface QuickAddTaskProps {
  caseId?: string;
  onSuccess?: () => void;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({ caseId, onSuccess }) => {
  const { closeQuickAdd } = useTaskStore();
  const createTask = useCreateTask();

  const [form, setForm] = useState<QuickAddTaskForm>({
    title: '',
    priority: 'Medium',
    caseId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    try {
      await createTask.mutateAsync({
        title: form.title.trim(),
        priority: form.priority || 'Medium',
        assigneeId: form.assigneeId,
        dueDate: form.dueDate,
        caseId: form.caseId,
      });

      // Reset form
      setForm({ title: '', priority: 'Medium', caseId });
      onSuccess?.();
      closeQuickAdd();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCancel = () => {
    setForm({ title: '', priority: 'Medium', caseId });
    closeQuickAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="space-y-3">
        {/* Title */}
        <input
          type="text"
          placeholder="Task title..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />

        {/* Quick Options */}
        <div className="flex flex-wrap gap-2">
          {/* Priority */}
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Critical">🔴 Critical</option>
            <option value="High">🟠 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>

          {/* Due Date */}
          <input
            type="date"
            value={form.dueDate || ''}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value || undefined })}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.title.trim() || createTask.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTask.isPending ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>

      {/* Error */}
      {createTask.error && (
        <div className="mt-3 text-sm text-red-600">
          Failed to create task: {createTask.error.message}
        </div>
      )}
    </form>
  );
};
