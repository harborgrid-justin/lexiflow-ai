import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';

interface UserSummary {
  id: string;
  name: string;
  role: string;
}

interface TaskSummary {
  id: string;
  assignedTo?: string;
}

interface UserReassignModalProps {
  isOpen: boolean;
  users: UserSummary[];
  tasks: TaskSummary[];
  fromUserId: string;
  toUserId: string;
  loading: boolean;
  onClose: () => void;
  onChangeFromUser: (userId: string) => void;
  onChangeToUser: (userId: string) => void;
  onSubmit: () => void;
  caseId?: string;
}

export const UserReassignModal: React.FC<UserReassignModalProps> = ({
  isOpen,
  users,
  tasks,
  fromUserId,
  toUserId,
  loading,
  onClose,
  onChangeFromUser,
  onChangeToUser,
  onSubmit,
  caseId,
}) => {
  const getTaskCountForUser = (userId: string) => tasks.filter((t) => t.assignedTo === userId).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reassign All Tasks from User">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">From User</label>
          <select
            value={fromUserId}
            onChange={(e) => onChangeFromUser(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">Choose a user...</option>
            {users.map((user) => {
              const count = getTaskCountForUser(user.id);
              return (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role} ({count} tasks)
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="h-5 w-5 text-slate-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">To User</label>
          <select
            value={toUserId}
            onChange={(e) => onChangeToUser(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">Choose a user...</option>
            {users
              .filter((user) => user.id !== fromUserId)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.role}
                </option>
              ))}
          </select>
        </div>

        {fromUserId && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              This will reassign {getTaskCountForUser(fromUserId)} task(s)
              {caseId ? ' from this case' : ' across all cases'}
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={loading || !fromUserId || !toUserId}>
            Reassign All
          </Button>
        </div>
      </div>
    </Modal>
  );
};
