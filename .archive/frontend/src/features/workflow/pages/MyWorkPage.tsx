/**
 * MyWorkPage Component
 * Personal task dashboard for the current user
 */

import React, { useMemo } from 'react';
import { useMyTasks, useTaskStatistics } from '../api/tasks.api';
import { TaskCard } from '../components/TaskCard';
import { TaskDetail } from '../components/TaskDetail';
import { QuickAddTask } from '../components/QuickAddTask';
import { useTaskStore } from '../store/workflow.store';
import { Task } from '../types';

export const MyWorkPage: React.FC = () => {
  const { data: allTasks = [], isLoading } = useMyTasks();
  const { data: stats } = useTaskStatistics();
  const { detailTaskId, openTaskDetail, closeTaskDetail, showQuickAdd, openQuickAdd, closeQuickAdd } = useTaskStore();

  // Group tasks
  const groupedTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const todayTasks: Task[] = [];
    const overdueTasks: Task[] = [];
    const upcomingTasks: Task[] = [];
    const completedTasks: Task[] = [];
    const noDueDateTasks: Task[] = [];

    allTasks.forEach((task) => {
      if (task.status === 'Completed') {
        completedTasks.push(task);
      } else if (!task.dueDate) {
        noDueDateTasks.push(task);
      } else {
        const dueDate = new Date(task.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        if (dueDateOnly < today) {
          overdueTasks.push(task);
        } else if (dueDateOnly.getTime() === today.getTime()) {
          todayTasks.push(task);
        } else if (dueDateOnly <= weekEnd) {
          upcomingTasks.push(task);
        } else {
          upcomingTasks.push(task);
        }
      }
    });

    return {
      today: todayTasks,
      overdue: overdueTasks,
      upcoming: upcomingTasks,
      completed: completedTasks.slice(0, 10), // Last 10 completed
      noDeadline: noDueDateTasks,
    };
  }, [allTasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Work</h1>
          <p className="text-gray-600">Your personal task dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.total || allTasks.length}</p>
            <p className="text-sm text-gray-500 mt-1">All active tasks</p>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Due Today</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{groupedTasks.today.length}</p>
            <p className="text-sm text-gray-500 mt-1">Tasks due today</p>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{groupedTasks.overdue.length}</p>
            <p className="text-sm text-gray-500 mt-1">Need attention</p>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
            <p className="text-sm text-gray-500 mt-1">This week</p>
          </div>
        </div>

        {/* Quick Add */}
        <div className="mb-6">
          {showQuickAdd ? (
            <QuickAddTask onSuccess={closeQuickAdd} />
          ) : (
            <button
              onClick={() => openQuickAdd()}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
            >
              + Quick Add Task
            </button>
          )}
        </div>

        {/* Task Sections */}
        <div className="space-y-8">
          {/* Overdue Tasks */}
          {groupedTasks.overdue.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-red-600">⚠️</span>
                  Overdue Tasks
                  <span className="text-sm font-normal text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    {groupedTasks.overdue.length}
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.overdue.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => openTaskDetail(task.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Today's Tasks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>📅</span>
                Due Today
                <span className="text-sm font-normal text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {groupedTasks.today.length}
                </span>
              </h2>
            </div>
            {groupedTasks.today.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.today.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => openTaskDetail(task.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-400">No tasks due today</p>
              </div>
            )}
          </section>

          {/* Upcoming This Week */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span>📆</span>
                Upcoming
                <span className="text-sm font-normal text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {groupedTasks.upcoming.length}
                </span>
              </h2>
            </div>
            {groupedTasks.upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.upcoming.slice(0, 9).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => openTaskDetail(task.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-400">No upcoming tasks</p>
              </div>
            )}
          </section>

          {/* Recently Completed */}
          {groupedTasks.completed.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Recently Completed
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.completed.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => openTaskDetail(task.id)}
                    className="opacity-75"
                  />
                ))}
              </div>
            </section>
          )}

          {/* No Deadline */}
          {groupedTasks.noDeadline.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span>📝</span>
                  No Deadline
                  <span className="text-sm font-normal text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {groupedTasks.noDeadline.length}
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedTasks.noDeadline.slice(0, 6).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => openTaskDetail(task.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Empty State */}
        {allTasks.length === 0 && (
          <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600 mb-6">You don't have any tasks assigned to you.</p>
            <button
              onClick={() => openQuickAdd()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Create Your First Task
            </button>
          </div>
        )}
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
