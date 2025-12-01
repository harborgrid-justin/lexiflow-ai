
import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ActionButtonGroup, ActionButton } from '../common/ActionButtonGroup';
import { UserPlus, FileCheck, RefreshCw, Play, Database, ShieldAlert, Scale, Archive, Lock } from 'lucide-react';

interface Process {
  id: string;
  name: string;
  status: string;
  triggers: string;
  tasks: number;
  completed: number;
  owner: string;
}

interface FirmProcessListProps {
  processes: Process[];
}

export const FirmProcessList: React.FC<FirmProcessListProps> = ({ processes }) => {
  const getProcessIcon = (name: string) => {
    if (name.includes('Client') || name.includes('Onboarding')) return <UserPlus className="h-5 w-5 text-blue-600"/>;
    if (name.includes('Billing') || name.includes('Bill')) return <FileCheck className="h-5 w-5 text-green-600"/>;
    if (name.includes('Discovery') || name.includes('Data') || name.includes('Log')) return <Database className="h-5 w-5 text-purple-600"/>;
    if (name.includes('Audit') || name.includes('Compliance') || name.includes('Risk') || name.includes('Conflict')) return <ShieldAlert className="h-5 w-5 text-red-600"/>;
    if (name.includes('Admission') || name.includes('Pro Hac')) return <Scale className="h-5 w-5 text-indigo-600"/>;
    if (name.includes('Closing') || name.includes('Archive')) return <Archive className="h-5 w-5 text-slate-600"/>;
    if (name.includes('Hold') || name.includes('Enforcement')) return <Lock className="h-5 w-5 text-amber-600"/>;
    return <RefreshCw className="h-5 w-5 text-slate-600"/>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processes.map(bp => (
            <Card key={bp.id} noPadding className="flex flex-col h-full hover:border-blue-300 transition-colors">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded border border-slate-200 shadow-sm">
                    {getProcessIcon(bp.name)}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">{bp.name}</h4>
                    <p className="text-xs text-slate-500">{bp.owner}</p>
                </div>
                </div>
                <Badge variant={bp.status === 'Active' ? 'success' : bp.status === 'Idle' ? 'neutral' : 'warning'}>{bp.status}</Badge>
            </div>
            
            <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>Trigger: <strong className="text-slate-700">{bp.triggers}</strong></span>
                <span>Total Tasks: <strong>{bp.tasks}</strong></span>
                </div>
                
                {bp.status === 'Active' && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                    <span className="text-blue-600">Processing...</span>
                    <span>{Math.round((bp.completed / bp.tasks) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: `${(bp.completed / bp.tasks) * 100}%` }}></div>
                    </div>
                </div>
                )}

                {bp.status === 'Idle' && (
                <div className="flex items-center justify-center h-12 bg-slate-50 rounded border border-dashed border-slate-200 text-xs text-slate-400">
                    Waiting for trigger...
                </div>
                )}
            </div>

            <div className="p-3 border-t border-slate-100">
              <ActionButtonGroup
                actions={[
                  { label: 'Log', onClick: () => {}, variant: 'ghost', size: 'sm' },
                  { label: 'Configure', onClick: () => {}, variant: 'outline', size: 'sm' },
                  ...(bp.status !== 'Active' ? [
                    { label: 'Start', onClick: () => {}, variant: 'primary', size: 'sm', icon: Play }
                  ] : [])
                ]}
                justify="start"
              />
            </div>
            </Card>
        ))}
        
        {/* New Process Card */}
        <div className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-slate-50 transition-all cursor-pointer min-h-[200px]">
            <div className="bg-white p-4 rounded-full shadow-sm mb-3">
            <Play className="h-6 w-6"/>
            </div>
            <span className="font-bold text-sm">Design New Process</span>
            <span className="text-xs mt-1">Drag & Drop Workflow Builder</span>
        </div>
    </div>
  );
};
