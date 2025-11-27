
import React, { useState } from 'react';
import { WorkflowStage, WorkflowTask } from '../../types';
import { Cpu, Sparkles, Plus, CheckCircle, Clock, BookOpen, Zap, AlertCircle } from 'lucide-react';

interface CaseWorkflowProps {
  stages: WorkflowStage[];
  generatingWorkflow: boolean;
  onGenerateWorkflow: () => void;
}

export const CaseWorkflow: React.FC<CaseWorkflowProps> = ({ stages: initialStages, generatingWorkflow, onGenerateWorkflow }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'automation'>('tasks');
  const [stages, setStages] = useState(initialStages);

  const handleToggleTask = (stageId: string, taskId: string) => {
    setStages(prevStages => prevStages.map(stage => {
        if (stage.id !== stageId) return stage;
        
        const newTasks = stage.tasks.map(task => 
            task.id === taskId ? { ...task, status: task.status === 'Done' ? 'Pending' : 'Done' } : task
        );
        
        // Auto-complete stage if all tasks done
        const allDone = newTasks.every(t => t.status === 'Done');
        const anyInProgress = newTasks.some(t => t.status === 'In Progress');
        
        let newStageStatus: 'Pending' | 'Active' | 'Completed' = stage.status;
        if (allDone) newStageStatus = 'Completed';
        else if (anyInProgress || newTasks.some(t => t.status === 'Done')) newStageStatus = 'Active';

        return { ...stage, tasks: newTasks as WorkflowTask[], status: newStageStatus };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
              <h3 className="text-lg font-semibold text-slate-900">Workflow Engine</h3>
              <p className="text-sm text-slate-500">Automate and track case progress.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
             <button onClick={() => alert("Playbook loaded: Standard Litigation steps applied.")} 
                className="flex items-center justify-center px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50">
                <BookOpen className="h-4 w-4 mr-2 text-indigo-500" /> Load Playbook
            </button>
            <button onClick={() => setActiveTab(activeTab === 'tasks' ? 'automation' : 'tasks')} 
                className="flex items-center justify-center px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50">
                <Zap className="h-4 w-4 mr-2 text-amber-500" /> {activeTab === 'tasks' ? 'Automations' : 'View Tasks'}
            </button>
            <button onClick={onGenerateWorkflow} disabled={generatingWorkflow} 
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-70">
                {generatingWorkflow ? <Cpu className="h-4 w-4 animate-spin mr-2"/> : <Sparkles className="h-4 w-4 mr-2" />}
                AI Generate
            </button>
          </div>
      </div>

      {activeTab === 'tasks' ? (
        <div className="space-y-8">
            {stages.map((stage) => (
                <div key={stage.id} className="relative pl-6 md:pl-8 border-l-2 border-slate-200 last:border-0 pb-8 last:pb-0">
                    <div className={`absolute left-[-9px] top-0 h-4 w-4 rounded-full border-2 bg-white ${stage.status === 'Completed' ? 'border-green-500 bg-green-500' : stage.status === 'Active' ? 'border-blue-500' : 'border-slate-300'}`}></div>
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className={`px-4 md:px-6 py-3 border-b border-slate-200 flex justify-between items-center ${stage.status === 'Active' ? 'bg-blue-50/50' : 'bg-slate-50'}`}>
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-slate-800">{stage.title}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stage.status === 'Completed' ? 'bg-green-100 text-green-700' : stage.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{stage.status}</span>
                            </div>
                            <button className="text-slate-400 hover:text-blue-600"><Plus className="h-4 w-4"/></button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {stage.tasks.map((task) => (
                                <div key={task.id} 
                                     onClick={() => handleToggleTask(stage.id, task.id)}
                                     className="p-4 flex flex-col sm:flex-row sm:items-center hover:bg-slate-50 transition-colors group gap-3 cursor-pointer">
                                    <div className="flex items-center flex-1">
                                        <button className={`h-5 w-5 rounded border mr-4 flex items-center justify-center transition-colors shrink-0 ${task.status === 'Done' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-blue-500'}`}>
                                            {task.status === 'Done' && <CheckCircle className="h-3.5 w-3.5" />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm font-medium truncate ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                                                {task.priority === 'High' && task.status !== 'Done' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded font-bold">SLA</span>}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                                <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Due: {task.dueDate}</span>
                                                <span className="flex items-center">Assigned: {task.assignee}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {task.priority === 'High' && task.status !== 'Done' && (
                                        <div className="flex items-center text-xs text-red-500 font-medium">
                                            <AlertCircle className="h-3 w-3 mr-1"/> 2 days left
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-full"><Zap className="h-5 w-5 text-amber-600"/></div>
                    <div>
                        <h4 className="font-bold text-sm">Document Upload Trigger</h4>
                        <p className="text-xs text-slate-500">When "Motion to Dismiss" is uploaded -> Create Task "Review Motion"</p>
                    </div>
                </div>
                <div className="h-6 w-11 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div></div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full"><Clock className="h-5 w-5 text-blue-600"/></div>
                    <div>
                        <h4 className="font-bold text-sm">SLA Warning</h4>
                        <p className="text-xs text-slate-500">Alert Senior Partner if "High Priority" task overdue by 24h</p>
                    </div>
                </div>
                <div className="h-6 w-11 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div></div>
            </div>
        </div>
      )}
    </div>
  );
};
