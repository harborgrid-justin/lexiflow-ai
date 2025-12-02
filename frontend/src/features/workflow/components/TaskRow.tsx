/**
 * TaskRow Component
 * Table row display for list view
 */

import React from 'react';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface TaskRowProps {
  task: Task;
  onClick?: () => void;
  selected?: boolean;
  onToggleSelect?: (taskId: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onClick,
  selected = false,
  onToggleSelect,
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  const dueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.(task.id);
  };

  return (
    <tr
      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
        selected ? 'bg-blue-50' : ''
      } ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}
      onClick={onClick}
    >
      {/* Checkbox */}
      <td className="px-4 py-3 w-12">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => {}}
          onClick={handleCheckboxClick}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>

      {/* Title */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{task.title}</span>
          {task.dependencies && task.dependencies.length > 0 && (
            <span className="text-xs text-gray-400" title="Has dependencies">
              🔗
            </span>
          )}
        </div>
        {task.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
        )}
      </td>

      {/* Priority */}
      <td className="px-4 py-3 w-32">
        <PriorityBadge priority={task.priority} size="sm" />
      </td>

      {/* Status */}
      <td className="px-4 py-3 w-40">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            task.status === 'Completed'
              ? 'bg-green-100 text-green-800'
              : task.status === 'In Progress'
              ? 'bg-blue-100 text-blue-800'
              : task.status === 'Blocked'
              ? 'bg-red-100 text-red-800'
              : task.status === 'On Hold'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {task.status}
        </span>
      </td>

      {/* Assignee */}
      <td className="px-4 py-3 w-48">
        {task.assigneeName ? (
          <div className="flex items-center gap-2">
            {task.assigneeAvatar ? (
              <img
                src={task.assigneeAvatar}
                alt={task.assigneeName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                {task.assigneeName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-gray-700">{task.assigneeName}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Unassigned</span>
        )}
      </td>

      {/* Due Date */}
      <td className="px-4 py-3 w-40">
        {task.dueDate ? (
          <div className="flex flex-col">
            <span
              className={`text-sm ${
                isOverdue
                  ? 'text-red-600 font-semibold'
                  : dueToday
                  ? 'text-orange-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {task.dueTime && (
              <span className="text-xs text-gray-500">{task.dueTime}</span>
            )}
            {isOverdue && (
              <span className="text-xs text-red-600 font-medium">Overdue</span>
            )}
            {dueToday && !isOverdue && (
              <span className="text-xs text-orange-600 font-medium">Due today</span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No due date</span>
        )}
      </td>

      {/* Case */}
      <td className="px-4 py-3 w-48">
        {task.caseName ? (
          <span className="text-sm text-gray-700 truncate block" title={task.caseName}>
            {task.caseName}
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 w-24 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          {task.attachments && task.attachments.length > 0 && (
            <span className="text-xs" title={`${task.attachments.length} attachments`}>
              📎 {task.attachments.length}
            </span>
          )}
          {(task.checklist?.length || 0) > 0 && (
            <span className="text-xs" title="Has checklist">
              ✓
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};
