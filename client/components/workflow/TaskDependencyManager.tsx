import React, { useState, useEffect } from 'react';
import { GitBranch, Check, AlertTriangle, X } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { TaskDependency, DependencyCheckResult } from '../../types/workflow-engine';

interface TaskDependencyManagerProps {
  taskId: string;
  taskTitle: string;
  availableTasks: Array<{ id: string; title: string; status: string }>;
  onUpdate?: () => void;
}

export const TaskDependencyManager: React.FC<TaskDependencyManagerProps> = ({
  taskId,
  _taskTitle,
  availableTasks,
  onUpdate
}) => {
  const {
    getTaskDependencies,
    setTaskDependencies,
    canStartTask,
    loading
  } = useWorkflowEngine();

  const [dependencies, setDependencies] = useState<TaskDependency | null>(null);
  const [canStart, setCanStart] = useState<DependencyCheckResult | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [dependencyType, setDependencyType] = useState<'blocking' | 'informational'>('blocking');
  const [isEditing, setIsEditing] = useState(false);

  const loadDependencies = async () => {
    const deps = await getTaskDependencies(taskId);
    if (deps) {
      setDependencies(deps);
      setSelectedTasks(deps.dependsOn);
      setDependencyType(deps.type);
    }

    const checkResult = await canStartTask(taskId);
    if (checkResult) {
      setCanStart(checkResult);
    }
  };

  useEffect(() => {
    loadDependencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleSave = async () => {
    if (selectedTasks.length > 0) {
      await setTaskDependencies(taskId, selectedTasks, dependencyType);
      await loadDependencies();
      setIsEditing(false);
      onUpdate?.();
    }
  };

  const toggleTask = (id: string) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Task Dependencies</h3>
          </div>
          {!isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              {dependencies ? 'Edit' : 'Add Dependencies'}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Status */}
        {canStart && !isEditing && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            canStart.canStart
              ? 'bg-green-50 text-green-800'
              : 'bg-amber-50 text-amber-800'
          }`}>
            {canStart.canStart ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Task can be started</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Blocked by {canStart.blockedBy.length} task(s)
                </span>
              </>
            )}
          </div>
        )}

        {/* Existing Dependencies */}
        {dependencies && !isEditing && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Depends on ({dependencies.type}):
            </p>
            <div className="space-y-1">
              {dependencies.dependsOn.map(depId => {
                const task = availableTasks.find(t => t.id === depId);
                const isComplete = task?.status === 'done';
                return (
                  <div
                    key={depId}
                    className={`p-2 rounded border flex items-center gap-2 ${
                      isComplete
                        ? 'bg-green-50 border-green-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                    )}
                    <span className="text-sm">{task?.title || depId}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dependency Type
              </label>
              <div className="flex gap-2">
                <Button
                  variant={dependencyType === 'blocking' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setDependencyType('blocking')}
                >
                  Blocking
                </Button>
                <Button
                  variant={dependencyType === 'informational' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setDependencyType('informational')}
                >
                  Informational
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {dependencyType === 'blocking'
                  ? 'Task cannot start until dependencies are complete'
                  : 'Dependencies are for reference only'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Dependencies
              </label>
              <div className="space-y-1 max-h-64 overflow-y-auto border rounded-lg p-2">
                {availableTasks.filter(t => t.id !== taskId).map(task => (
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
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      task.status === 'done'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  if (dependencies) {
                    setSelectedTasks(dependencies.dependsOn);
                    setDependencyType(dependencies.type);
                  }
                }}
                icon={X}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={loading || selectedTasks.length === 0}
              >
                Save Dependencies
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
