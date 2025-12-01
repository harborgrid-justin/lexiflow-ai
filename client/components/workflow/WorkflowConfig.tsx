import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, GripVertical, FileText, Zap, CheckSquare } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DEFAULT_TEMPLATES } from './data/default-templates';
import type { WorkflowTemplate } from './types/workflow-template.types';

export const WorkflowConfig: React.FC = () => {
  const [templates, _setTemplates] = useState<WorkflowTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(DEFAULT_TEMPLATES[0].id);
  const [isEditing, setIsEditing] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Template List */}
      <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Workflow Templates</h3>
          <Button size="sm" icon={Plus} variant="outline">New</Button>
        </div>
        
        <div className="space-y-3">
          {templates.map(template => (
            <div 
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTemplateId === template.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`font-bold ${selectedTemplateId === template.id ? 'text-blue-700' : 'text-slate-900'}`}>
                  {template.name}
                </h4>
                <Badge variant={template.type === 'Case' ? 'info' : 'neutral'}>{template.type}</Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{template.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center"><Settings className="h-3 w-3 mr-1"/> {(template.stages || []).length} Stages</span>
                <span className="flex items-center"><CheckSquare className="h-3 w-3 mr-1"/> {(template.stages || []).reduce((acc, s) => acc + (s.tasks || []).length, 0)} Tasks</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Editor */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {selectedTemplate ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{selectedTemplate.name}</h2>
                  <Badge variant="neutral">v1.2</Badge>
                </div>
                <p className="text-slate-500 text-sm">{selectedTemplate.description}</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <Button variant="primary" icon={Save} onClick={handleSave}>Save Changes</Button>
                ) : (
                  <Button variant="outline" icon={Settings} onClick={() => setIsEditing(true)}>Edit Configuration</Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {(selectedTemplate.stages || []).map((stage, index) => (
                <div key={stage.id} className="relative pl-8 border-l-2 border-slate-200 last:border-l-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                  
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Stage {index + 1}: {stage.title}</h3>
                    {isEditing && <Button size="sm" variant="ghost" className="text-red-500" icon={Trash2}>Remove</Button>}
                  </div>

                  <div className="space-y-3">
                    {(stage.tasks || []).map(task => (
                      <div key={task.id} className="bg-slate-50 p-4 rounded border border-slate-200 hover:border-blue-200 transition-colors group">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-slate-400 cursor-grab active:cursor-grabbing">
                              <GripVertical className="h-4 w-4"/>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900">{task.title}</span>
                                {task.automated && (
                                  <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded flex items-center font-medium">
                                    <Zap className="h-3 w-3 mr-1"/> Auto
                                  </span>
                                )}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                                  task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">{task.description}</p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center"><FileText className="h-3 w-3 mr-1"/> Role: {task.role}</span>
                              </div>
                            </div>
                          </div>
                          {isEditing && (
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="ghost" className="w-full border border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600" icon={Plus}>
                        Add Task
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <div className="pl-8">
                  <Button variant="outline" className="w-full border-dashed" icon={Plus}>Add New Stage</Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Settings className="h-12 w-12 mb-4 opacity-20"/>
            <p>Select a workflow template to configure</p>
          </div>
        )}
      </div>
    </div>
  );
};
