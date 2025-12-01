import React from 'react';
import { X, CheckCircle, ListChecks, Layers, ArrowRight, Clock } from 'lucide-react';
import { Badge } from './common';

interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  status: string;
  order: number;
  progress: number;
}

interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimated_hours?: number;
  related_module?: string;
}

interface WorkflowSuccessModalProps {
  onClose: () => void;
  onNavigateToCase: () => void;
  caseTitle: string;
  workflow: {
    stages: WorkflowStage[];
    tasks: WorkflowTask[];
  };
}

export function WorkflowSuccessModal({ 
  onClose, 
  onNavigateToCase, 
  caseTitle, 
  workflow 
}: WorkflowSuccessModalProps) {
  const totalEstimatedHours = workflow.tasks.reduce(
    (sum, task) => sum + (task.estimated_hours || 0),
    0
  );

  const priorityCounts = {
    high: workflow.tasks.filter(t => t.priority === 'high').length,
    medium: workflow.tasks.filter(t => t.priority === 'medium').length,
    low: workflow.tasks.filter(t => t.priority === 'low').length,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Case Successfully Imported!</h2>
              <p className="text-sm text-slate-600 mt-1">{caseTitle}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Layers className="w-4 h-4" />
                  <span className="font-medium">{workflow.stages.length} Stages</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-600">
                  <ListChecks className="w-4 h-4" />
                  <span className="font-medium">{workflow.tasks.length} Tasks</span>
                </div>
                <div className="flex items-center gap-1.5 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{totalEstimatedHours.toFixed(1)}h Estimated</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-green-900 mb-2">
              PACER Import Workflow Created
            </h3>
            <p className="text-sm text-green-700">
              A structured business process has been created to guide you through case setup, 
              client onboarding, document collection, case assessment, and team assignment.
            </p>
          </div>

          {/* Workflow Overview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Workflow Stages</h3>
            <div className="space-y-3">
              {workflow.stages.map((stage, idx) => {
                return (
                  <div key={stage.id} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                          ${stage.status === 'in-progress' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-200 text-slate-600'}
                        `}>
                          {stage.order}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{stage.name}</h4>
                          <p className="text-sm text-slate-600 mt-0.5">{stage.description}</p>
                        </div>
                      </div>
                      <Badge variant={stage.status === 'in-progress' ? 'active' : 'inactive'} size="sm">
                        {stage.status === 'in-progress' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                    
                    {/* Stage Tasks Preview */}
                    <div className="mt-3 ml-11 space-y-1.5">
                      {workflow.tasks
                        .filter((_, taskIdx) => {
                          const tasksPerStage = Math.ceil(workflow.tasks.length / workflow.stages.length);
                          return taskIdx >= idx * tasksPerStage && taskIdx < (idx + 1) * tasksPerStage;
                        })
                        .map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            <div className={`
                              w-1.5 h-1.5 rounded-full
                              ${task.priority === 'high' 
                                ? 'bg-red-500' 
                                : task.priority === 'medium' 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'}
                            `} />
                            <span className="text-slate-700">{task.title}</span>
                            {task.estimated_hours && (
                              <span className="text-slate-500 text-xs ml-auto">
                                {task.estimated_hours}h
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Priority Breakdown */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Task Priorities</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-red-600">{priorityCounts.high}</span>
                </div>
                <p className="text-xs font-medium text-slate-600">High Priority</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-yellow-600">{priorityCounts.medium}</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Medium Priority</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold text-green-600">{priorityCounts.low}</span>
                </div>
                <p className="text-xs font-medium text-slate-600">Low Priority</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps</h3>
            <ul className="space-y-1.5 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Review the case details and verify all imported data</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Start with Stage 1 tasks: Verify case information and parties</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Assign team members to workflow tasks as needed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onNavigateToCase}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>View Case & Workflow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
