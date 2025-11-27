
import React, { useState } from 'react';
import { Briefcase, Play, Layers, RefreshCw } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';
import { Button } from './common/Button';
import { MOCK_CASES } from '../data/mockCases';
import { BUSINESS_PROCESSES } from '../data/mockFirmProcesses';
import { CaseWorkflowList } from './workflow/CaseWorkflowList';
import { FirmProcessList } from './workflow/FirmProcessList';

interface MasterWorkflowProps {
  onSelectCase: (caseId: string) => void;
}

export const MasterWorkflow: React.FC<MasterWorkflowProps> = ({ onSelectCase }) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'firm'>('cases');

  const getCaseProgress = (status: string) => {
    switch(status) {
      case 'Discovery': return 45;
      case 'Trial': return 80;
      case 'Settled': return 100;
      default: return 10;
    }
  };

  const getNextTask = (status: string) => {
    switch(status) {
      case 'Discovery': return 'Review Production Set 2';
      case 'Trial': return 'Prepare Witness List';
      case 'Settled': return 'Execute Final Release';
      default: return 'Draft Complaint';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      <PageHeader 
        title="Master Workflow Engine" 
        subtitle="Orchestrate case lifecycles and firm-wide business operations."
        actions={
          <div className="flex gap-2">
            <Tabs 
              tabs={['cases', 'firm']} 
              activeTab={activeTab} 
              onChange={(t) => setActiveTab(t as any)} 
            />
            <Button variant="primary" icon={Play} className="hidden md:flex">Run Automation</Button>
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 font-bold uppercase">Active Workflows</p>
          <p className="text-2xl font-bold text-blue-600">{MOCK_CASES.length + BUSINESS_PROCESSES.filter(p => p.status === 'Active').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 font-bold uppercase">Tasks Due Today</p>
          <p className="text-2xl font-bold text-amber-600">14</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 font-bold uppercase">Automations Ran</p>
          <p className="text-2xl font-bold text-purple-600">1,204</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 font-bold uppercase">Efficiency Gain</p>
          <p className="text-2xl font-bold text-green-600">+22%</p>
        </div>
      </div>

      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-slate-500"/> Matter Lifecycles
            </h3>
            <span className="text-xs text-slate-500">Showing {MOCK_CASES.length} active matters</span>
          </div>
          <CaseWorkflowList 
            cases={MOCK_CASES} 
            onSelectCase={onSelectCase} 
            getCaseProgress={getCaseProgress} 
            getNextTask={getNextTask} 
          />
        </div>
      )}

      {activeTab === 'firm' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Layers className="h-5 w-5 mr-2 text-slate-500"/> Operational Processes
            </h3>
            <Button variant="outline" size="sm" icon={RefreshCw}>Refresh Status</Button>
          </div>
          <FirmProcessList processes={BUSINESS_PROCESSES} />
        </div>
      )}
    </div>
  );
};
