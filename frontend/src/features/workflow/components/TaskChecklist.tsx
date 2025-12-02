/**
 * TaskChecklist Component
 * Subtasks checklist management
 */

import React, { useState } from 'react';
import { Task, ChecklistItem } from '../types';
import { useUpdateChecklistItem } from '../api/tasks.api';

interface TaskChecklistProps {
  task: Task;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({ task }) => {
  const updateChecklistItem = useUpdateChecklistItem();
  const [newItemTitle, setNewItemTitle] = useState('');

  const handleToggleItem = async (item: ChecklistItem) => {
    try {
      await updateChecklistItem.mutateAsync({
        taskId: task.id,
        itemId: item.id,
        completed: !item.completed,
      });
    } catch (error) {
      console.error('Failed to update checklist item:', error);
    }
  };

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;

    // This would need to be implemented as a separate API call
    console.log('Add checklist item:', newItemTitle);
    setNewItemTitle('');
  };

  const checklist = task.checklist || [];
  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-500">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-2">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 group"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleItem(item)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <p
                className={`text-sm ${
                  item.completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-700'
                }`}
              >
                {item.title}
              </p>
              {item.assigneeId && (
                <p className="text-xs text-gray-500 mt-1">
                  Assigned to: {item.assigneeId}
                </p>
              )}
              {item.dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {item.completed && item.completedAt && (
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                ✓ {new Date(item.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add New Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="Add checklist item..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddItem();
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItemTitle.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
};
