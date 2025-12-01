import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Card } from '../common/Card';
import { ReassignmentModeButtons } from './reassignment/ReassignmentModeButtons';
import { SingleTaskReassignModal } from './reassignment/SingleTaskReassignModal';
import { BulkReassignModal } from './reassignment/BulkReassignModal';
import { UserReassignModal } from './reassignment/UserReassignModal';

interface TaskReassignmentPanelProps {
  caseId?: string;
  currentUserId: string;
  users: Array<{ id: string; name: string; role: string }>;
  tasks: Array<{ id: string; title: string; assignedTo?: string; status: string }>;
  onUpdate?: () => void;
}

type ReassignmentMode = 'single' | 'bulk' | 'user';

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

  const [mode, setMode] = useState<ReassignmentMode | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [fromUserId, setFromUserId] = useState<string>('');
  const [toUserId, setToUserId] = useState<string>('');

  const closeModal = () => {
    setMode(null);
    setSelectedTaskId('');
    setSelectedTasks([]);
    setFromUserId('');
    setToUserId('');
  };

  const handleSingleReassign = async () => {
    if (selectedTaskId && toUserId) {
      await reassignTask(selectedTaskId, toUserId, currentUserId);
      closeModal();
      onUpdate?.();
    }
  };

  const handleBulkReassign = async () => {
    if (selectedTasks.length > 0 && toUserId) {
      await bulkReassignTasks(selectedTasks, toUserId, currentUserId);
      closeModal();
      onUpdate?.();
    }
  };

  const handleUserReassign = async () => {
    if (fromUserId && toUserId) {
      await reassignAllFromUser(fromUserId, toUserId, caseId, currentUserId);
      closeModal();
      onUpdate?.();
    }
  };

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const getUserById = (userId?: string) => users.find(u => u.id === userId);

  return (
    <>
      <Card>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Task Reassignment</h3>
          </div>
        </div>
        <ReassignmentModeButtons onSelectMode={setMode} />
      </Card>

      <SingleTaskReassignModal
        isOpen={mode === 'single'}
        tasks={tasks}
        users={users}
        selectedTaskId={selectedTaskId}
        assigneeId={toUserId}
        loading={loading}
        onClose={closeModal}
        onTaskChange={setSelectedTaskId}
        onAssigneeChange={setToUserId}
        onSubmit={handleSingleReassign}
        getUserName={(id) => getUserById(id)?.name || 'Unknown'}
      />

      <BulkReassignModal
        isOpen={mode === 'bulk'}
        tasks={tasks}
        users={users}
        selectedTasks={selectedTasks}
        assigneeId={toUserId}
        loading={loading}
        onClose={closeModal}
        onToggleTask={toggleTask}
        onAssigneeChange={setToUserId}
        onSubmit={handleBulkReassign}
        getUserName={(id) => getUserById(id)?.name || 'Unknown'}
      />

      <UserReassignModal
        isOpen={mode === 'user'}
        users={users}
        tasks={tasks}
        fromUserId={fromUserId}
        toUserId={toUserId}
        loading={loading}
        onClose={closeModal}
        onChangeFromUser={setFromUserId}
        onChangeToUser={setToUserId}
        onSubmit={handleUserReassign}
        caseId={caseId}
      />
    </>
  );
};
