/**
 * TaskKanbanBoard Component
 * Kanban board view for task management
 */

import React, { useState } from 'react';
import { Task, TaskStatus, TaskBoardColumn } from '../types';
import { TaskCard } from './TaskCard';
import { useBoardStore } from '../store/workflow.store';

interface TaskKanbanBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}

const statusColumns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'Not Started', title: 'Not Started', color: 'bg-gray-100' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'Blocked', title: 'Blocked', color: 'bg-red-100' },
  { id: 'On Hold', title: 'On Hold', color: 'bg-yellow-100' },
  { id: 'Completed', title: 'Completed', color: 'bg-green-100' },
];

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onTaskMove,
}) => {
  const { draggingTaskId, setDraggingTask, columnOrder, hiddenColumns } = useBoardStore();
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Group tasks by status
  const columns: TaskBoardColumn[] = statusColumns
    .filter((col) => !hiddenColumns.includes(col.id))
    .map((col) => ({
      id: col.id,
      title: col.title,
      status: col.id,
      tasks: tasks.filter((task) => task.status === col.id),
      taskCount: tasks.filter((task) => task.status === col.id).length,
      color: col.color,
    }));

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    setDraggingTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggingTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    if (taskId) {
      onTaskMove(taskId, newStatus);
    }

    setDraggingTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 ${
            dragOverColumn === column.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.status)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color.replace('100', '500')}`} />
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                {column.taskCount}
              </span>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-3 min-h-[200px]">
            {column.tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                No tasks
              </div>
            ) : (
              column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task.id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={draggingTaskId === task.id ? 'opacity-50' : ''}
                />
              ))
            )}
          </div>

          {/* Column Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium py-2 hover:bg-white rounded-lg transition-colors"
              onClick={() => {
                // Quick add task to this column
              }}
            >
              + Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
