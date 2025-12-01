import React, { useState, useEffect } from 'react';
import { Users, CheckCircle } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { ParallelTaskGroup, ParallelGroupStatus } from '../../types/workflow-engine';

interface ParallelTasksManagerProps {
  stageId: string;
  tasks: Array<{ id: string; title: string; status: string }>;
  onUpdate?: () => void;
}

export const ParallelTasksManager: React.FC<ParallelTasksManagerProps> = ({
  stageId,
  tasks,
  onUpdate
}) => {
  const {
    createParallelGroup,
    checkParallelGroupCompletion,
    getParallelGroups,
    loading
  } = useWorkflowEngine();

  const [groups, setGroups] = useState<ParallelTaskGroup[]>([]);
  const [groupStatuses, setGroupStatuses] = useState<Record<string, ParallelGroupStatus>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [completionRule, setCompletionRule] = useState<'all' | 'any' | 'percentage'>('all');
  const [threshold, setThreshold] = useState(100);

  useEffect(() => {
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  const loadGroups = async () => {
    const groupList = await getParallelGroups(stageId);
    if (groupList) {
      setGroups(groupList);
      
      // Load status for each group
      for (const group of groupList) {
        const status = await checkParallelGroupCompletion(group.id);
        if (status) {
          setGroupStatuses(prev => ({ ...prev, [group.id]: status }));
        }
      }
    }
  };

  const handleCreateGroup = async () => {
    if (selectedTasks.length >= 2) {
      await createParallelGroup(
        stageId,
        selectedTasks,
        completionRule,
        completionRule === 'percentage' ? threshold : undefined
      );
      await loadGroups();
      setIsCreating(false);
      setSelectedTasks([]);
      onUpdate?.();
    }
  };

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <Card>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Parallel Task Groups</h3>
          </div>
          {!isCreating && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreating(true)}
            >
              Create Group
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Existing Groups */}
        {groups.length > 0 && !isCreating && (
          <div className="space-y-3">
            {groups.map(group => {
              const status = groupStatuses[group.id];
              const progress = status
                ? Math.round((status.completedCount / status.totalCount) * 100)
                : 0;

              return (
                <div key={group.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">
                      Parallel Group ({group.completionRule})
                    </span>
                    {status?.isComplete && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>

                  {status && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{status.completedCount} / {status.totalCount}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    {group.tasks.map(taskId => {
                      const task = tasks.find(t => t.id === taskId);
                      const isComplete = task?.status === 'done';
                      return (
                        <div
                          key={taskId}
                          className={`text-sm p-2 rounded flex items-center gap-2 ${
                            isComplete ? 'bg-green-50 text-green-800' : 'bg-white text-slate-700'
                          }`}
                        >
                          {isComplete && <CheckCircle className="h-3 w-3" />}
                          <span className="flex-1">{task?.title || taskId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Group Form */}
        {isCreating && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Completion Rule
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={completionRule === 'all' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCompletionRule('all')}
                >
                  All
                </Button>
                <Button
                  variant={completionRule === 'any' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCompletionRule('any')}
                >
                  Any
                </Button>
                <Button
                  variant={completionRule === 'percentage' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCompletionRule('percentage')}
                >
                  %
                </Button>
              </div>
              {completionRule === 'percentage' && (
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Threshold %"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Tasks (minimum 2)
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
                    <span className="text-sm flex-1">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setSelectedTasks([]);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateGroup}
                disabled={loading || selectedTasks.length < 2}
              >
                Create Group
              </Button>
            </div>
          </div>
        )}

        {groups.length === 0 && !isCreating && (
          <div className="text-center py-8 text-slate-500">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No parallel task groups configured</p>
          </div>
        )}
      </div>
    </Card>
  );
};
