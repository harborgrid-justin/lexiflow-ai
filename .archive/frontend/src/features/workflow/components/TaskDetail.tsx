/**
 * TaskDetail Component
 * Comprehensive slide-out panel for task details and management
 */

import React, { useState } from 'react';
import { useTask, useUpdateTask, useCompleteTask, useTaskActivities } from '../api/tasks.api';
import { TaskComments } from './TaskComments';
import { TaskChecklist } from './TaskChecklist';
import { PriorityBadge } from './PriorityBadge';
import { TaskPriority, TaskStatus } from '../types';
import { useTaskStore } from '../store/workflow.store';

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onClose }) => {
  const { data: task, isLoading } = useTask(taskId);
  const { data: activities } = useTaskActivities(taskId);
  const updateTask = useUpdateTask();
  const completeTask = useCompleteTask();
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details');

  if (isLoading || !task) {
    return (
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        data: { status },
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (priority: TaskPriority) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        data: { priority },
      });
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeTask.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-gray-50 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h2>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={task.priority} size="sm" />
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : task.status === 'Blocked'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.status}
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 border-b bg-white">
          <div className="flex px-6">
            {[
              { id: 'details', label: 'Details' },
              { id: 'comments', label: 'Comments' },
              { id: 'activity', label: 'Activity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {task.description || 'No description provided'}
                </p>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Critical">🔴 Critical</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Assignee & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  <div className="flex items-center gap-2">
                    {task.assigneeName ? (
                      <>
                        {task.assigneeAvatar ? (
                          <img
                            src={task.assigneeAvatar}
                            alt={task.assigneeName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                            {task.assigneeName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm text-gray-700">{task.assigneeName}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Unassigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <div className="text-sm">
                    {task.dueDate ? (
                      <div>
                        <p className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        {task.dueTime && (
                          <p className="text-gray-500 text-xs">{task.dueTime}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No due date</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Case */}
              {task.caseName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Case
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <span>📁</span>
                    <span className="text-sm text-gray-700">{task.caseName}</span>
                    {task.caseNumber && (
                      <span className="text-xs text-gray-500">({task.caseNumber})</span>
                    )}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {task.checklist && task.checklist.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Checklist
                  </label>
                  <TaskChecklist task={task} />
                </div>
              )}

              {/* Time Tracking */}
              {(task.estimatedHours || task.actualHours) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Tracking
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {task.estimatedHours && (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Estimated</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {task.estimatedHours}h
                        </p>
                      </div>
                    )}
                    {task.actualHours && (
                      <div className="px-3 py-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Actual</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {task.actualHours}h
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="space-y-2">
                    {task.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-2xl">📎</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(attachment.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <TaskComments taskId={taskId} />
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {activities && activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      {activity.userAvatar ? (
                        <img
                          src={activity.userAvatar}
                          alt={activity.userName}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                          {activity.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.userName}</span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No activity yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Close
            </button>
            <div className="flex gap-2">
              {task.status !== 'Completed' && (
                <button
                  onClick={handleComplete}
                  disabled={completeTask.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {completeTask.isPending ? 'Completing...' : 'Mark Complete'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
