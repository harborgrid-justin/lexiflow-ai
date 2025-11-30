
import React, { useState } from 'react';
import { WorkflowStage } from '../../types';
import { 
  Cpu, Sparkles, Plus, CheckCircle, Clock, BookOpen, Zap, 
  ArrowRight, FileText, DollarSign, Scale, Gavel, Layout, ChevronDown, ChevronUp, Box
} from 'lucide-react';
import { Button } from '../common/Button';
import { UserAvatar } from '../common/UserAvatar';

interface CaseWorkflowProps {
  stages: WorkflowStage[];
  generatingWorkflow: boolean;
  onGenerateWorkflow: () => void;
  onNavigateToModule?: (module: string) => void;
  onToggleTask?: (taskId: string, status: 'Pending' | 'In Progress' | 'Done') => void;
}

export const CaseWorkflow: React.FC<CaseWorkflowProps> = ({ stages, generatingWorkflow, onGenerateWorkflow, onNavigateToModule, onToggleTask }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'automation'>('timeline');
  const [expandedStage, setExpandedStage] = useState<string | null>(stages.find(s => s.status === 'Active')?.id || null);

  const handleToggleTask = (stageId: string, taskId: string) => {
    const stage = stages.find(s => s.id === stageId);
    const task = stage?.tasks.find(t => t.id === taskId);
    if (task && onToggleTask) {
        const newStatus = task.status === 'Done' ? 'Pending' : 'Done';
        onToggleTask(taskId, newStatus);
    }
  };

  const getModuleIcon = (module?: string) => {
      switch(module) {
          case 'Documents': return <FileText className="h-4 w-4"/>;
          case 'Billing': return <DollarSign className="h-4 w-4"/>;
          case 'Discovery': return <Scale className="h-4 w-4"/>;
          case 'Motions': return <Gavel className="h-4 w-4"/>;
          case 'Evidence': return <Box className="h-4 w-4"/>;
          default: return <Layout className="h-4 w-4"/>;
      }
  };

  const totalTasks = (stages || []).reduce((acc, s) => acc + (s.tasks || []).length, 0);
  const completedTasks = (stages || []).reduce((acc, s) => acc + (s.tasks || []).filter(t => t.status === 'Done').length, 0);
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      {/* Workflow Header / Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
          <div className="w-full md:w-1/3">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Workflow Status</h3>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                  <span>{completedTasks} of {totalTasks} Tasks Complete</span>
                  <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
             <button 
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'timeline' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
             >
                 Timeline
             </button>
             <button 
                onClick={() => setActiveTab('automation')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'automation' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
             >
                 Automations
             </button>
          </div>

          <div className="flex gap-2">
             <Button variant="outline" icon={BookOpen} onClick={() => alert("Loading Playbook...")}>Templates</Button>
             <Button 
                variant="primary" 
                icon={generatingWorkflow ? Cpu : Sparkles} 
                onClick={onGenerateWorkflow} 
                disabled={generatingWorkflow}
                className="bg-purple-600 hover:bg-purple-700 border-transparent text-white"
             >
                {generatingWorkflow ? 'Thinking...' : 'AI Assist'}
             </Button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
      {activeTab === 'timeline' ? (
        <div className="space-y-6">
            {stages.map((stage, index) => {
                const isExpanded = expandedStage === stage.id;
                const isActive = stage.status === 'Active';
                return (
                    <div key={stage.id} className={`bg-white rounded-xl border transition-all duration-300 ${isActive ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-sm'}`}>
                        {/* Stage Header */}
                        <div 
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-t-xl"
                            onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold ${
                                    stage.status === 'Completed' ? 'bg-green-100 border-green-500 text-green-700' :
                                    stage.status === 'Active' ? 'bg-blue-100 border-blue-500 text-blue-700' :
                                    'bg-slate-50 border-slate-300 text-slate-400'
                                }`}>
                                    {stage.status === 'Completed' ? <CheckCircle className="h-5 w-5"/> : index + 1}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-lg ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>{stage.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className={`px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'}`}>{stage.status}</span>
                                        <span>• {(stage.tasks || []).length} tasks</span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-slate-400">
                                {isExpanded ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5"/>}
                            </button>
                        </div>

                        {/* Stage Tasks */}
                        {isExpanded && (
                            <div className="p-4 pt-0 space-y-3 bg-slate-50/30 rounded-b-xl border-t border-slate-100">
                                <div className="h-2"></div> {/* Spacer */}
                                {(stage.tasks || []).map((task) => (
                                    <div key={task.id} className="group relative bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 items-start md:items-center">
                                        {/* Status Checkbox */}
                                        <button 
                                            onClick={() => handleToggleTask(stage.id, task.id)}
                                            className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                task.status === 'Done' 
                                                ? 'bg-green-500 border-green-500 text-white' 
                                                : 'border-slate-300 hover:border-blue-500 text-transparent'
                                            }`}
                                        >
                                            <CheckCircle className="h-4 w-4 fill-current"/>
                                        </button>

                                        {/* Task Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className={`font-semibold text-sm ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                    {task.title}
                                                </h5>
                                                {task.priority === 'High' && task.status !== 'Done' && (
                                                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200">HIGH</span>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p className="text-xs text-slate-500 mb-2 line-clamp-1">{task.description}</p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                                <span className="flex items-center gap-1"><UserAvatar name={task.assignee} size="sm" className="w-4 h-4 text-[9px]"/> {task.assignee}</span>
                                                <span className={`flex items-center gap-1 ${task.status !== 'Done' && new Date(task.dueDate) < new Date() ? 'text-red-500 font-bold' : ''}`}>
                                                    <Clock className="h-3 w-3"/> Due: {task.dueDate}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Module Action Button (Desktop: Right Side, Mobile: Full Width Bottom) */}
                                        {task.relatedModule && onNavigateToModule && (
                                            <button 
                                                onClick={() => onNavigateToModule(task.relatedModule!)}
                                                className="w-full md:w-auto mt-2 md:mt-0 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                                            >
                                                {getModuleIcon(task.relatedModule)}
                                                {task.actionLabel || 'View Module'}
                                                <ArrowRight className="h-3 w-3"/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded border border-dashed border-slate-300 transition-colors flex items-center justify-center gap-1">
                                    <Plus className="h-3 w-3"/> Add Sub-Task
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
            {/* Automation Visualization Cards */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="bg-amber-100 p-3 rounded-full text-amber-600"><Zap className="h-6 w-6"/></div>
                        <div>
                            <h4 className="font-bold text-slate-900">Document Upload Trigger</h4>
                            <p className="text-sm text-slate-500 mt-1">IF new document contains "Motion" THEN create task "Review Motion".</p>
                            <div className="mt-3 flex gap-2">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">Module: Documents</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">Module: Workflow</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-6 w-11 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Clock className="h-6 w-6"/></div>
                        <div>
                            <h4 className="font-bold text-slate-900">SLA Breach Warning</h4>
                            <p className="text-sm text-slate-500 mt-1">IF "High Priority" task is overdue &gt; 24h THEN notify Senior Partner.</p>
                            <div className="mt-3 flex gap-2">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">Role: Senior Partner</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-6 w-11 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div></div>
                </div>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-white transition-all cursor-pointer">
                <Plus className="h-8 w-8 mb-2"/>
                <span className="font-bold">Create New Automation</span>
            </div>
        </div>
      )}
      </div>
    </div>
  );
};
