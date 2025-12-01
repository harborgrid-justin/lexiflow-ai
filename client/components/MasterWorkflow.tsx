
import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Play, Layers, RefreshCw, BarChart3, Bell } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';
import { Button } from './common/Button';
import { ApiService } from '../services/apiService';
import { Case } from '../types';
import { CaseWorkflowList } from './workflow/CaseWorkflowList';
import { FirmProcessList } from './workflow/FirmProcessList';
import { WorkflowConfig } from './workflow/WorkflowConfig';
import { WorkflowTemplateBuilder } from './workflow/WorkflowTemplateBuilder';
import { WorkflowAnalyticsDashboard } from './workflow/WorkflowAnalyticsDashboard';
import { NotificationCenter } from './workflow/NotificationCenter';
import { SLAMonitor } from './workflow/SLAMonitor';
import { useWorkflowEngine } from '../hooks/useWorkflowEngine';

interface MasterWorkflowProps {
  onSelectCase: (caseId: string) => void;
}

export const MasterWorkflow: React.FC<MasterWorkflowProps> = ({ onSelectCase }) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'firm' | 'templates' | 'config' | 'analytics' | 'notifications'>('cases');
  const [cases, setCases] = useState<Case[]>([]);
  const [processes, setProcesses] = useState<any[]>([]);
  const [currentUser] = useState({ id: '1', name: 'Current User' }); // Replace with actual current user
  const { getNotifications } = useWorkflowEngine();
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotificationCount = useCallback(async () => {
    const notifications = await getNotifications(currentUser.id, true);
    if (notifications) {
      setUnreadCount(notifications.length);
    }
  }, [getNotifications, currentUser.id]);

  useEffect(() => {
     
    const fetchData = async () => {
        try {
            const [c, p] = await Promise.all([
                ApiService.getCases(),
                ApiService.getFirmProcesses()
            ]);
            setCases(c);
            setProcesses(p);
        } catch (e) {
            console.error("Failed to fetch workflow data", e);
        }
    };
    fetchData();
    
    // Load and refresh notifications
    loadNotificationCount();
    const interval = setInterval(() => loadNotificationCount(), 30000);
    return () => clearInterval(interval);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

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
        subtitle="Orchestrate case lifecycles and firm-wide business operations with all enterprise features."
        actions={
          <div className="flex gap-2 items-center">
            <div className="flex gap-2 overflow-x-auto">
              <Tabs 
                tabs={['cases', 'firm', 'analytics', 'notifications', 'templates', 'config']} 
                activeTab={activeTab} 
                onChange={(t) => setActiveTab(t as any)} 
              />
            </div>
            <div className="relative">
              <Button 
                variant="secondary" 
                icon={Bell} 
                onClick={() => setActiveTab('notifications')}
                className="relative"
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
            <Button variant="primary" icon={Play} className="hidden md:flex">Run Automation</Button>
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500 font-bold uppercase">Active Workflows</p>
          <p className="text-2xl font-bold text-blue-600">{cases.length + processes.filter(p => p.status === 'Active').length}</p>
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
            <span className="text-xs text-slate-500">Showing {cases.length} active matters</span>
          </div>
          <CaseWorkflowList 
            cases={cases} 
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
          <FirmProcessList processes={processes} />
        </div>
      )}

      {activeTab === 'templates' && (
        <WorkflowTemplateBuilder />
      )}

      {activeTab === 'config' && (
        <WorkflowConfig />
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-slate-500"/> Workflow Analytics
            </h3>
          </div>
          
          {/* Global SLA Monitor */}
          <SLAMonitor showBreachReport />
          
          {/* Analytics Dashboard */}
          <WorkflowAnalyticsDashboard />
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-slate-500"/> Notification Center
            </h3>
          </div>
          <NotificationCenter userId={currentUser.id} />
        </div>
      )}
    </div>
  );
};
