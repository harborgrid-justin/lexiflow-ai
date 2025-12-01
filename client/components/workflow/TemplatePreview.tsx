import React from 'react';
import { FileText, Calendar, Users, Clock } from 'lucide-react';
import type { WorkflowStage } from './StageEditor';

interface TemplatePreviewProps {
  stages: WorkflowStage[];
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ stages }) => {
  const totalTasks = stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
  const totalDays = stages.reduce((sum, stage) => 
    sum + stage.tasks.reduce((taskSum, task) => taskSum + (task.estimatedDays || 0), 0), 0
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Template Preview
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">Stages</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stages.length}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Tasks</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{totalTasks}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-xs text-purple-700 font-medium">Est. Days</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{totalDays}</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">Roles</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">
            {new Set(stages.flatMap(s => s.tasks.map(t => t.assigneeRole).filter(Boolean))).size}
          </p>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700">Workflow Timeline</h4>
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center text-blue-600 font-semibold text-sm">
                {index + 1}
              </div>
              {index < stages.length - 1 && (
                <div className="w-0.5 h-12 bg-blue-200" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <h5 className="font-medium text-slate-900">{stage.title}</h5>
              {stage.description && (
                <p className="text-xs text-slate-600 mt-1">{stage.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span>{stage.tasks.length} tasks</span>
                <span>•</span>
                <span>
                  {stage.tasks.reduce((sum, task) => sum + (task.estimatedDays || 0), 0)} days
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stages.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No stages added yet</p>
          <p className="text-xs mt-1">Click "Add Stage" to get started</p>
        </div>
      )}
    </div>
  );
};
