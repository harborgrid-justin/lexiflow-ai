import React from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';

interface TaskSummary {
  id: string;
  title: string;
  assignedTo?: string;
}

interface UserSummary {
  id: string;
  name: string;
  role: string;
}

interface BulkReassignModalProps {
  isOpen: boolean;
  tasks: TaskSummary[];
  users: UserSummary[];
  selectedTasks: string[];
  assigneeId: string;
  loading: boolean;
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
  onAssigneeChange: (userId: string) => void;
  onSubmit: () => void;
  getUserName: (userId?: string) => string;
}

export const BulkReassignModal: React.FC<BulkReassignModalProps> = ({
  isOpen,
  tasks,
  users,
  selectedTasks,
  assigneeId,
  loading,
  onClose,
  onToggleTask,
  onAssigneeChange,
  onSubmit,
  getUserName,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Bulk Reassign Tasks">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Tasks</label>
        <div className="space-y-1 max-h-64 overflow-y-auto border rounded-lg p-2">
          {tasks.map((task) => (
            <button
              type="button"
              key={task.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer w-full text-left"
              onClick={() => onToggleTask(task.id)}
            >
              <input
                type="checkbox"
                readOnly
                checked={selectedTasks.includes(task.id)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{task.title}</p>
                {task.assignedTo && (
                  <p className="text-xs text-slate-500">Assigned to: {getUserName(task.assignedTo)}</p>
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">{selectedTasks.length} task(s) selected</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Assign To</label>
        <select
          value={assigneeId}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="">Choose a user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} - {user.role}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={loading || selectedTasks.length === 0 || !assigneeId}
        >
          Reassign {selectedTasks.length} Task(s)
        </Button>
      </div>
    </div>
  </Modal>
);
