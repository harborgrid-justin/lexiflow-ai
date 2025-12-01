import React, { useState, useCallback, DragEvent } from 'react';
import {
  Plus, Trash2, Save, GripVertical, Zap,
  CheckSquare, Copy, Download, Upload, Search,
  LayoutTemplate, Workflow, Clock, Users
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface WorkflowTaskTemplate {
  id: string;
  title: string;
  description: string;
  role: string;
  priority: 'Low' | 'Medium' | 'High';
  automated: boolean;
  estimatedDays?: number;
  dependencies?: string[];
}

interface WorkflowStageTemplate {
  id: string;
  title: string;
  description?: string;
  tasks: WorkflowTaskTemplate[];
  color?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: 'Case' | 'Administrative' | 'Custom';
  category: string;
  stages: WorkflowStageTemplate[];
  isPublished: boolean;
  createdBy?: string;
  updatedAt?: string;
}

// Task Library - Draggable task templates
const TASK_LIBRARY: WorkflowTaskTemplate[] = [
  { id: 'task-1', title: 'Conflict Check', description: 'Run global conflict check', role: 'Admin', priority: 'High', automated: true, estimatedDays: 1 },
  { id: 'task-2', title: 'Send Engagement Letter', description: 'Draft and send engagement agreement', role: 'Partner', priority: 'High', automated: false, estimatedDays: 2 },
  { id: 'task-3', title: 'Client Intake Form', description: 'Collect client information', role: 'Admin', priority: 'Medium', automated: true, estimatedDays: 1 },
  { id: 'task-4', title: 'Draft Complaint', description: 'Prepare initial complaint', role: 'Associate', priority: 'High', automated: false, estimatedDays: 5 },
  { id: 'task-5', title: 'File Motion', description: 'File motion with court', role: 'Paralegal', priority: 'High', automated: false, estimatedDays: 1 },
  { id: 'task-6', title: 'Discovery Request', description: 'Prepare discovery requests', role: 'Associate', priority: 'Medium', automated: false, estimatedDays: 3 },
  { id: 'task-7', title: 'Document Review', description: 'Review produced documents', role: 'Associate', priority: 'Medium', automated: false, estimatedDays: 7 },
  { id: 'task-8', title: 'Deposition Prep', description: 'Prepare for deposition', role: 'Associate', priority: 'High', automated: false, estimatedDays: 5 },
  { id: 'task-9', title: 'Expert Consultation', description: 'Consult with expert witness', role: 'Partner', priority: 'Medium', automated: false, estimatedDays: 2 },
  { id: 'task-10', title: 'Settlement Negotiation', description: 'Negotiate settlement terms', role: 'Partner', priority: 'High', automated: false, estimatedDays: 3 },
  { id: 'task-11', title: 'Invoice Generation', description: 'Generate client invoice', role: 'Billing', priority: 'Medium', automated: true, estimatedDays: 1 },
  { id: 'task-12', title: 'Time Entry Approval', description: 'Review and approve time entries', role: 'Partner', priority: 'Low', automated: false, estimatedDays: 1 },
];

// Stage Templates
const STAGE_TEMPLATES: Partial<WorkflowStageTemplate>[] = [
  { id: 'stage-intake', title: 'Intake & Assessment', description: 'Initial client onboarding', color: 'blue', tasks: [] },
  { id: 'stage-discovery', title: 'Discovery Phase', description: 'Evidence gathering and exchange', color: 'purple', tasks: [] },
  { id: 'stage-motions', title: 'Motions Practice', description: 'Pre-trial motions', color: 'amber', tasks: [] },
  { id: 'stage-trial', title: 'Trial Preparation', description: 'Prepare for trial', color: 'red', tasks: [] },
  { id: 'stage-settlement', title: 'Settlement', description: 'Negotiate and finalize settlement', color: 'green', tasks: [] },
  { id: 'stage-closing', title: 'Case Closing', description: 'Finalize and archive', color: 'slate', tasks: [] },
];

export const WorkflowTemplateBuilder: React.FC = () => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<WorkflowTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTask, setDraggedTask] = useState<WorkflowTaskTemplate | null>(null);
  const [draggedStageIndex, setDraggedStageIndex] = useState<number | null>(null);
  const [showTaskLibrary, setShowTaskLibrary] = useState(true);
  const [_isEditing, setIsEditing] = useState(false);

  // Generate unique ID using useCallback to avoid impure function during render
  const generateId = useCallback((prefix: string) => `${prefix}-${Date.now()}`, []);

  // Create new blank template
  const createNewTemplate = () => {
    const newTemplate: WorkflowTemplate = {
      id: generateId('template'),
      name: 'New Workflow Template',
      description: 'Describe this workflow...',
      type: 'Custom',
      category: 'General',
      stages: [],
      isPublished: false,
      createdBy: 'Current User',
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    setActiveTemplate(newTemplate);
    setIsEditing(true);
  };

  // Drag handlers for tasks from library
  const handleTaskDragStart = (task: WorkflowTaskTemplate) => {
    setDraggedTask(task);
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
  };

  const handleStageDragStart = (stageIndex: number) => {
    setDraggedStageIndex(stageIndex);
  };

  const handleStageDragEnd = () => {
    setDraggedStageIndex(null);
  };

  // Drop task onto stage
  const handleTaskDrop = (e: DragEvent, stageId: string) => {
    e.preventDefault();
    if (!draggedTask || !activeTemplate) return;

    const newTask: WorkflowTaskTemplate = {
      ...draggedTask,
      id: generateId(draggedTask.id), // Unique ID for this instance
    };

    const updatedTemplate = {
      ...activeTemplate,
      stages: activeTemplate.stages.map(stage => 
        stage.id === stageId 
          ? { ...stage, tasks: [...stage.tasks, newTask] }
          : stage
      )
    };

    setActiveTemplate(updatedTemplate);
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  // Reorder stages
  const handleStageDrop = (e: DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedStageIndex === null || !activeTemplate || draggedStageIndex === targetIndex) return;

    const newStages = [...activeTemplate.stages];
    const [movedStage] = newStages.splice(draggedStageIndex, 1);
    newStages.splice(targetIndex, 0, movedStage);

    const updatedTemplate = { ...activeTemplate, stages: newStages };
    setActiveTemplate(updatedTemplate);
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  // Add new stage from template
  const addStageFromTemplate = (stageTemplate: Partial<WorkflowStageTemplate>) => {
    if (!activeTemplate) return;

    const newStage: WorkflowStageTemplate = {
      id: generateId('stage'),
      title: stageTemplate.title || 'New Stage',
      description: stageTemplate.description,
      color: stageTemplate.color || 'blue',
      tasks: [],
    };

    const updatedTemplate = {
      ...activeTemplate,
      stages: [...activeTemplate.stages, newStage]
    };

    setActiveTemplate(updatedTemplate);
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  // Remove task from stage
  const removeTask = (stageId: string, taskId: string) => {
    if (!activeTemplate) return;

    const updatedTemplate = {
      ...activeTemplate,
      stages: activeTemplate.stages.map(stage =>
        stage.id === stageId
          ? { ...stage, tasks: stage.tasks.filter(t => t.id !== taskId) }
          : stage
      )
    };

    setActiveTemplate(updatedTemplate);
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  // Remove stage
  const removeStage = (stageId: string) => {
    if (!activeTemplate) return;

    const updatedTemplate = {
      ...activeTemplate,
      stages: activeTemplate.stages.filter(s => s.id !== stageId)
    };

    setActiveTemplate(updatedTemplate);
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  };

  const filteredTasks = TASK_LIBRARY.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] flex gap-6">
      {/* Task Library Sidebar */}
      {showTaskLibrary && (
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
                onClick={() => setShowTaskLibrary(false)}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                onDragStart={() => handleTaskDragStart(task)}
                onDragEnd={handleTaskDragEnd}
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
              {STAGE_TEMPLATES.map(stageTemplate => (
                <button
                  key={stageTemplate.id}
                  onClick={() => addStageFromTemplate(stageTemplate)}
                  disabled={!activeTemplate}
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
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!showTaskLibrary && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowTaskLibrary(true)}
                icon={LayoutTemplate}
              >
                Task Library
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600"/>
              <span className="font-bold text-lg">
                {activeTemplate ? activeTemplate.name : 'Workflow Template Builder'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" icon={Upload}>Import</Button>
            <Button size="sm" variant="outline" icon={Download}>Export</Button>
            {activeTemplate && (
              <>
                <Button size="sm" variant="outline" icon={Copy}>Duplicate</Button>
                <Button size="sm" variant="primary" icon={Save}>Save Template</Button>
              </>
            )}
          </div>
        </div>

        {/* Template Selector */}
        {!activeTemplate && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Workflow className="h-12 w-12 text-blue-600"/>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Build Your Workflow Template
              </h2>
              <p className="text-slate-500 mb-8">
                Create custom workflows with drag-and-drop ease. Organize stages and tasks to streamline your legal processes.
              </p>
              <Button size="lg" variant="primary" icon={Plus} onClick={createNewTemplate}>
                Create New Template
              </Button>
            </div>
          </div>
        )}

        {/* Workflow Builder Canvas */}
        {activeTemplate && (
          <div className="flex-1 overflow-y-auto p-6">
            {activeTemplate.stages.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-10 w-10 text-blue-400"/>
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">No Stages Yet</h3>
                <p className="text-slate-500 mb-6">Add stages from the templates or create custom ones</p>
                <Button variant="primary" icon={Plus} onClick={() => addStageFromTemplate({ title: 'Custom Stage' })}>
                  Add First Stage
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTemplate.stages.map((stage, stageIndex) => (
                  <div
                    key={stage.id}
                    draggable
                    onDragStart={() => handleStageDragStart(stageIndex)}
                    onDragEnd={handleStageDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleStageDrop(e, stageIndex)}
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
                          onClick={() => removeStage(stage.id)}
                        >
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>

                    {/* Drop Zone for Tasks */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleTaskDrop(e, stage.id)}
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
                          {stage.tasks.map((task, _taskIndex) => (
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
                                  onClick={() => removeTask(stage.id, task.id)}
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
                  onClick={() => addStageFromTemplate({ title: 'Custom Stage' })}
                  className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-500 hover:text-blue-600 font-medium"
                >
                  <Plus className="h-6 w-6 mx-auto mb-2"/>
                  Add Another Stage
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
