/**
 * TaskCard Component
 * Card-based task display for board/kanban views
 */

import React from 'react';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  draggable?: boolean;
  selected?: boolean;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  draggable = false,
  selected = false,
  className = '',
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  const dueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  const completedChecklist = task.checklist?.filter((item) => item.completed).length || 0;
  const totalChecklist = task.checklist?.length || 0;

  return (
    <div
      className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${className}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
          {task.title}
        </h3>
        <PriorityBadge priority={task.priority} size="sm" showLabel={false} />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Metadata */}
      <div className="space-y-2">
        {/* Case */}
        {task.caseName && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>📁</span>
            <span className="truncate">{task.caseName}</span>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-xs">
            <span>📅</span>
            <span
              className={`${
                isOverdue
                  ? 'text-red-600 font-semibold'
                  : dueToday
                  ? 'text-orange-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
              {isOverdue && ' (Overdue)'}
              {dueToday && !isOverdue && ' (Today)'}
            </span>
          </div>
        )}

        {/* Assignee */}
        {task.assigneeName && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            {task.assigneeAvatar ? (
              <img
                src={task.assigneeAvatar}
                alt={task.assigneeName}
                className="w-4 h-4 rounded-full"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">
                {task.assigneeName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate">{task.assigneeName}</span>
          </div>
        )}

        {/* Checklist Progress */}
        {totalChecklist > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{
                  width: `${(completedChecklist / totalChecklist) * 100}%`,
                }}
              />
            </div>
            <span className="text-gray-500 text-[10px] font-medium">
              {completedChecklist}/{totalChecklist}
            </span>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer Icons */}
        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
          {task.attachments && task.attachments.length > 0 && (
            <span className="flex items-center gap-1">
              📎 {task.attachments.length}
            </span>
          )}
          {task.timeEntries && task.timeEntries.length > 0 && (
            <span className="flex items-center gap-1">
              ⏱️ {task.actualHours?.toFixed(1) || 0}h
            </span>
          )}
          {task.dependencies && task.dependencies.length > 0 && (
            <span className="flex items-center gap-1">🔗 {task.dependencies.length}</span>
          )}
        </div>
      </div>
    </div>
  );
};
