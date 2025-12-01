import React from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';

interface UserSummary {
  id: string;
  name: string;
  role: string;
}

interface TaskSummary {
  id: string;
  title: string;
  assignedTo?: string;
}

interface SingleTaskReassignModalProps {
  isOpen: boolean;
  tasks: TaskSummary[];
  users: UserSummary[];
  selectedTaskId: string;
  assigneeId: string;
  loading: boolean;
  onClose: () => void;
  onTaskChange: (taskId: string) => void;
  onAssigneeChange: (userId: string) => void;
  onSubmit: () => void;
  getUserName: (userId?: string) => string;
}

export const SingleTaskReassignModal: React.FC<SingleTaskReassignModalProps> = ({
  isOpen,
  tasks,
  users,
  selectedTaskId,
  assigneeId,
  loading,
  onClose,
  onTaskChange,
  onAssigneeChange,
  onSubmit,
  getUserName,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Reassign Task">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Task</label>
        <select
          value={selectedTaskId}
          onChange={(e) => onTaskChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="">Choose a task...</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} {task.assignedTo ? `(${getUserName(task.assignedTo)})` : '(Unassigned)'}
            </option>
          ))}
        </select>
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
        <Button variant="primary" onClick={onSubmit} disabled={loading || !selectedTaskId || !assigneeId}>
          Reassign
        </Button>
      </div>
    </div>
  </Modal>
);
