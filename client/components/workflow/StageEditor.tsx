import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../common/Button';

export interface WorkflowStage {
  id: string;
  title: string;
  description: string;
  order: number;
  tasks: WorkflowTask[];
}

export interface WorkflowTask {
  id: string;
  title: string;
  description?: string;
  assigneeRole?: string;
  estimatedDays?: number;
}

interface StageEditorProps {
  stage: WorkflowStage;
  onUpdate: (stage: WorkflowStage) => void;
  onDelete: () => void;
  onAddTask: () => void;
  onUpdateTask: (taskId: string, updates: Partial<WorkflowTask>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const StageEditor: React.FC<StageEditorProps> = ({
  stage,
  onUpdate,
  onDelete,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-start gap-3 mb-4">
        <GripVertical className="h-5 w-5 text-slate-400 mt-2 cursor-move" />
        <div className="flex-1 space-y-3">
          <input
            type="text"
            value={stage.title}
            onChange={(e) => onUpdate({ ...stage, title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
            placeholder="Stage name (e.g., Discovery)"
          />
          <textarea
            value={stage.description}
            onChange={(e) => onUpdate({ ...stage, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            rows={2}
            placeholder="Stage description..."
          />
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          icon={Trash2}
          className="flex-shrink-0"
        >
          Delete Stage
        </Button>
      </div>

      {/* Tasks */}
      <div className="space-y-2 ml-8">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-700">Tasks</h4>
          <Button
            variant="secondary"
            size="sm"
            onClick={onAddTask}
            icon={Plus}
          >
            Add Task
          </Button>
        </div>

        {stage.tasks.map((task) => (
          <div key={task.id} className="bg-slate-50 rounded p-3 border border-slate-200">
            <div className="flex items-start gap-2 mb-2">
              <input
                type="text"
                value={task.title}
                onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                placeholder="Task name"
              />
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={task.assigneeRole || ''}
                onChange={(e) => onUpdateTask(task.id, { assigneeRole: e.target.value })}
                className="px-2 py-1 border border-slate-300 rounded text-xs"
                placeholder="Assignee role (e.g., Paralegal)"
              />
              <input
                type="number"
                value={task.estimatedDays || ''}
                onChange={(e) => onUpdateTask(task.id, { estimatedDays: parseInt(e.target.value) || undefined })}
                className="px-2 py-1 border border-slate-300 rounded text-xs"
                placeholder="Est. days"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
