import React from 'react';
import { Search, LayoutTemplate, GripVertical, Zap, Users, Clock } from 'lucide-react';
import { Button } from '../../common/Button';
import type { WorkflowTaskTemplate, WorkflowStageTemplate } from '../types/workflow-template.types';

interface TaskLibrarySidebarProps {
  tasks: WorkflowTaskTemplate[];
  stageTemplates: Partial<WorkflowStageTemplate>[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTaskDragStart: (task: WorkflowTaskTemplate) => void;
  onTaskDragEnd: () => void;
  onAddStageFromTemplate: (stageTemplate: Partial<WorkflowStageTemplate>) => void;
  onClose: () => void;
  hasActiveTemplate: boolean;
}

export const TaskLibrarySidebar: React.FC<TaskLibrarySidebarProps> = ({
  tasks,
  stageTemplates,
  searchQuery,
  onSearchChange,
  onTaskDragStart,
  onTaskDragEnd,
  onAddStageFromTemplate,
  onClose,
  hasActiveTemplate,
}) => {
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 flex items-center">
            <LayoutTemplate className="h-5 w-5 mr-2 text-blue-600"/>
            Task Library
          </h3>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onClose}
            className="text-slate-500"
          >
            ←
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Task Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={() => onTaskDragStart(task)}
            onDragEnd={onTaskDragEnd}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-move transition-all group"
          >
            <div className="flex items-start gap-2">
              <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-blue-500 mt-0.5 flex-shrink-0"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-slate-900 truncate">{task.title}</span>
                  {task.automated && (
                    <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded flex items-center font-medium flex-shrink-0">
                      <Zap className="h-3 w-3"/>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center"><Users className="h-3 w-3 mr-1"/>{task.role}</span>
                  <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/>{task.estimatedDays}d</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stage Templates */}
      <div className="border-t border-slate-200 p-4 bg-slate-50">
        <h4 className="text-xs font-bold text-slate-600 uppercase mb-3">Stage Templates</h4>
        <div className="space-y-2">
          {stageTemplates.map(stageTemplate => (
            <button
              key={stageTemplate.id}
              onClick={() => onAddStageFromTemplate(stageTemplate)}
              disabled={!hasActiveTemplate}
              className="w-full p-2 text-left text-sm rounded border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${stageTemplate.color}-500`}></div>
                <span className="font-medium text-slate-700">{stageTemplate.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
