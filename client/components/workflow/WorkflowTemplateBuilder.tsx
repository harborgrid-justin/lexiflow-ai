import React, { useState, useCallback, DragEvent } from 'react';
import { Plus, Copy, Download, Upload, Save, LayoutTemplate, Workflow } from 'lucide-react';
import { Button } from '../common/Button';
import { TaskLibrarySidebar } from './components/TaskLibrarySidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { TASK_LIBRARY } from './data/task-library';
import { STAGE_TEMPLATES } from './data/stage-templates';
import type { WorkflowTemplate, WorkflowTaskTemplate, WorkflowStageTemplate } from './types/workflow-template.types';

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

  return (
    <div className="h-[calc(100vh-200px)] flex gap-6">
      {/* Task Library Sidebar */}
      {showTaskLibrary && (
        <TaskLibrarySidebar
          tasks={TASK_LIBRARY}
          stageTemplates={STAGE_TEMPLATES}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onTaskDragStart={handleTaskDragStart}
          onTaskDragEnd={handleTaskDragEnd}
          onAddStageFromTemplate={addStageFromTemplate}
          onClose={() => setShowTaskLibrary(false)}
          hasActiveTemplate={!!activeTemplate}
        />
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
            <WorkflowCanvas
              activeTemplate={activeTemplate}
              draggedStageIndex={draggedStageIndex}
              draggedTask={draggedTask}
              onStageDragStart={handleStageDragStart}
              onStageDragEnd={handleStageDragEnd}
              onStageDrop={handleStageDrop}
              onTaskDrop={handleTaskDrop}
              onDragOver={handleDragOver}
              onRemoveTask={removeTask}
              onRemoveStage={removeStage}
              onAddStage={() => addStageFromTemplate({ title: 'Custom Stage' })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
