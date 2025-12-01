import React, { useState, useEffect } from 'react';
import { UserPlus, Users, ArrowRight } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

interface TaskReassignmentPanelProps {
  caseId?: string;
  currentUserId: string;
  users: Array<{ id: string; name: string; role: string }>;
  tasks: Array<{ id: string; title: string; assignedTo?: string; status: string }>;
  onUpdate?: () => void;
}

export const TaskReassignmentPanel: React.FC<TaskReassignmentPanelProps> = ({
  caseId,
  currentUserId,
  users,
  tasks,
  onUpdate
}) => {
  const {
    reassignTask,
    bulkReassignTasks,
    reassignAllFromUser,
    loading
  } = useWorkflowEngine();

  const [mode, setMode] = useState<'single' | 'bulk' | 'user' | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [fromUserId, setFromUserId] = useState<string>('');
  const [toUserId, setToUserId] = useState<string>('');

  const handleSingleReassign = async () => {
    if (selectedTaskId && toUserId) {
      await reassignTask(selectedTaskId, toUserId, currentUserId);
      setMode(null);
      setSelectedTaskId('');
      setToUserId('');
      onUpdate?.();
    }
  };

  const handleBulkReassign = async () => {
    if (selectedTasks.length > 0 && toUserId) {
      await bulkReassignTasks(selectedTasks, toUserId, currentUserId);
      setMode(null);
      setSelectedTasks([]);
      setToUserId('');
      onUpdate?.();
    }
  };

  const handleUserReassign = async () => {
    if (fromUserId && toUserId) {
      await reassignAllFromUser(fromUserId, toUserId, caseId, currentUserId);
      setMode(null);
      setFromUserId('');
      setToUserId('');
      onUpdate?.();
    }
  };

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const getUserById = (userId: string) => users.find(u => u.id === userId);

  return (
    <>
      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Task Reassignment</h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <Button
            variant="secondary"
            onClick={() => setMode('single')}
            className="w-full justify-start"
            icon={UserPlus}
          >
            Reassign Single Task
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMode('bulk')}
            className="w-full justify-start"
            icon={Users}
          >
            Bulk Reassign Tasks
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMode('user')}
            className="w-full justify-start"
            icon={ArrowRight}
          >
            Reassign All from User
          </Button>
        </div>
      </Card>

      {/* Single Task Reassignment Modal */}
      <Modal
        isOpen={mode === 'single'}
        onClose={() => {
          setMode(null);
          setSelectedTaskId('');
          setToUserId('');
        }}
        title="Reassign Task"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Task
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Choose a task...</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} {task.assignedTo ? `(${getUserById(task.assignedTo)?.name})` : '(Unassigned)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Assign To
            </label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Choose a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSingleReassign}
              disabled={loading || !selectedTaskId || !toUserId}
            >
              Reassign
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Reassignment Modal */}
      <Modal
        isOpen={mode === 'bulk'}
        onClose={() => {
          setMode(null);
          setSelectedTasks([]);
          setToUserId('');
        }}
        title="Bulk Reassign Tasks"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Tasks
            </label>
            <div className="space-y-1 max-h-64 overflow-y-auto border rounded-lg p-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.assignedTo && (
                      <p className="text-xs text-slate-500">
                        Assigned to: {getUserById(task.assignedTo)?.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {selectedTasks.length} task(s) selected
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Assign To
            </label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Choose a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBulkReassign}
              disabled={loading || selectedTasks.length === 0 || !toUserId}
            >
              Reassign {selectedTasks.length} Task(s)
            </Button>
          </div>
        </div>
      </Modal>

      {/* User-to-User Reassignment Modal */}
      <Modal
        isOpen={mode === 'user'}
        onClose={() => {
          setMode(null);
          setFromUserId('');
          setToUserId('');
        }}
        title="Reassign All Tasks from User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              From User
            </label>
            <select
              value={fromUserId}
              onChange={(e) => setFromUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Choose a user...</option>
              {users.map(user => {
                const taskCount = tasks.filter(t => t.assignedTo === user.id).length;
                return (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.role} ({taskCount} tasks)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To User
            </label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="">Choose a user...</option>
              {users.filter(u => u.id !== fromUserId).map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
            </select>
          </div>

          {fromUserId && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                This will reassign {tasks.filter(t => t.assignedTo === fromUserId).length} task(s)
                {caseId ? ' from this case' : ' across all cases'}
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUserReassign}
              disabled={loading || !fromUserId || !toUserId}
            >
              Reassign All
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
