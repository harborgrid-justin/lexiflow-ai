
import React from 'react';
import { GitGraph, Users, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Case } from '../../types';

interface CaseWorkflowListProps {
  cases: Case[];
  onSelectCase: (id: string) => void;
  getCaseProgress: (status: string) => number;
  getNextTask: (status: string) => string;
}

export const CaseWorkflowList: React.FC<CaseWorkflowListProps> = ({ cases, onSelectCase, getCaseProgress, getNextTask }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
        {cases.map(c => {
            const progress = getCaseProgress(c.status);
            return (
            <div 
                key={c.id} 
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onSelectCase(c.id)}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${progress === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    <GitGraph className="h-6 w-6"/>
                    </div>
                    <div>
                    <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600">{c.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-mono bg-slate-100 px-1 rounded">{c.id}</span>
                        <span>{c.matterType}</span>
                        <span className="flex items-center"><Users className="h-3 w-3 mr-1"/> {c.client}</span>
                    </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={progress === 100 ? 'success' : 'info'}>{c.status}</Badge>
                    <ChevronRight className="h-5 w-5 text-slate-300"/>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-1">
                    <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Stage Progress</span>
                    <span className="font-bold text-slate-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    {progress === 100 ? <CheckCircle className="h-5 w-5 text-green-500"/> : <Clock className="h-5 w-5 text-amber-500"/>}
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Current Step</p>
                        <p className="text-sm font-semibold text-slate-900">{getNextTask(c.status)}</p>
                    </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-blue-600">View</Button>
                </div>
                </div>
            </div>
            );
        })}
    </div>
  );
};
