import React, { DragEvent } from 'react';
import { Plus, GripVertical, Trash2, CheckSquare, Zap, Users, Clock } from 'lucide-react';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import type { WorkflowTemplate, WorkflowTaskTemplate } from '../types/workflow-template.types';

interface WorkflowCanvasProps {
  activeTemplate: WorkflowTemplate | null;
  draggedStageIndex: number | null;
  draggedTask: WorkflowTaskTemplate | null;
  onStageDragStart: (index: number) => void;
  onStageDragEnd: () => void;
  onStageDrop: (e: DragEvent, targetIndex: number) => void;
  onTaskDrop: (e: DragEvent, stageId: string) => void;
  onDragOver: (e: DragEvent) => void;
  onRemoveTask: (stageId: string, taskId: string) => void;
  onRemoveStage: (stageId: string) => void;
  onAddStage: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  activeTemplate,
  draggedStageIndex,
  draggedTask,
  onStageDragStart,
  onStageDragEnd,
  onStageDrop,
  onTaskDrop,
  onDragOver,
  onRemoveTask,
  onRemoveStage,
  onAddStage,
}) => {
  if (!activeTemplate) {
    return null;
  }

  if (activeTemplate.stages.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-10 w-10 text-blue-400"/>
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">No Stages Yet</h3>
        <p className="text-slate-500 mb-6">Add stages from the templates or create custom ones</p>
        <Button variant="primary" icon={Plus} onClick={onAddStage}>
          Add First Stage
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTemplate.stages.map((stage, stageIndex) => (
        <div
          key={stage.id}
          draggable
          onDragStart={() => onStageDragStart(stageIndex)}
          onDragEnd={onStageDragEnd}
          onDragOver={onDragOver}
          onDrop={(e) => onStageDrop(e, stageIndex)}
          className={`bg-white rounded-xl border-2 ${
            draggedStageIndex === stageIndex ? 'border-blue-400 opacity-50' : 'border-slate-200'
          } shadow-sm hover:shadow-md transition-all`}
        >
          {/* Stage Header */}
          <div className={`p-4 bg-gradient-to-r from-${stage.color}-50 to-${stage.color}-100/50 rounded-t-xl border-b-2 border-${stage.color}-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="cursor-move">
                  <GripVertical className="h-5 w-5 text-slate-400 hover:text-blue-600"/>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      Stage {stageIndex + 1}: {stage.title}
                    </span>
                    <Badge variant="neutral" className="text-xs">
                      {stage.tasks.length} tasks
                    </Badge>
                  </div>
                  {stage.description && (
                    <p className="text-sm text-slate-600 mt-1">{stage.description}</p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50"
                onClick={() => onRemoveStage(stage.id)}
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
            </div>
          </div>

          {/* Drop Zone for Tasks */}
          <div
            onDragOver={onDragOver}
            onDrop={(e) => onTaskDrop(e, stage.id)}
            className={`p-4 min-h-[120px] ${
              draggedTask ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
            }`}
          >
            {stage.tasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                <p className="text-sm">Drag tasks here from the library</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stage.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-slate-400 mt-1">
                          <CheckSquare className="h-4 w-4"/>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">{task.title}</span>
                            {task.automated && (
                              <Badge variant="info" className="text-xs">
                                <Zap className="h-3 w-3 mr-1"/>Auto
                              </Badge>
                            )}
                            <Badge 
                              variant={
                                task.priority === 'High' ? 'error' : 
                                task.priority === 'Medium' ? 'warning' : 
                                'success'
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1"/>
                              {task.role}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1"/>
                              {task.estimatedDays} days
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
                        onClick={() => onRemoveTask(stage.id, task.id)}
                      >
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Stage Button */}
      <button
        onClick={onAddStage}
        className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-500 hover:text-blue-600 font-medium"
      >
        <Plus className="h-6 w-6 mx-auto mb-2"/>
        Add Another Stage
      </button>
    </div>
  );
};
