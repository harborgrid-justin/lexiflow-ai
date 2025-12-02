/**
 * WorkflowPage - Feature Module Page
 *
 * Master workflow engine for orchestrating case lifecycles and firm-wide
 * business operations with enterprise features.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Play, Layers, RefreshCw, BarChart3, Bell } from 'lucide-react';
import { PageHeader, Tabs, Button, StatCard } from '@/shared/ui';
import { usePageView, useTrackEvent, useLatestCallback } from '@/enzyme';
import { ApiService } from '@/services/apiService';
import type { Case } from '@/types';
import { useWorkflowEngine, useWorkflowAnalytics } from '../hooks';
import {
  CaseWorkflowList,
  FirmProcessList,
  WorkflowConfig,
  WorkflowTemplateBuilder,
  NotificationCenter,
  SLAMonitor,
  WorkflowMetricGrid,
  EnterpriseCapabilitiesSection,
  StageProgressSection,
  BottleneckInsights,
  TaskDistributionSection,
  SLABreachAlert,
} from '../components';

type WorkflowTab = 'cases' | 'firm' | 'templates' | 'config' | 'analytics' | 'notifications';

interface WorkflowPageProps {
  onSelectCase?: (caseId: string) => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ onSelectCase }) => {
  const [activeTab, setActiveTab] = useState<WorkflowTab>('cases');
  const [cases, setCases] = useState<Case[]>([]);
  const [processes, setProcesses] = useState<{ id: string; status: string; name: string }[]>([]);
  const [currentUser] = useState({ id: '1', name: 'Current User' });
  const [unreadCount, setUnreadCount] = useState(0);
  const [analyticsSection, setAnalyticsSection] = useState<string | null>('capabilities');
  
  const { getNotifications } = useWorkflowEngine();
  const {
    metrics,
    velocity,
    bottlenecks,
    refreshAnalytics,
    isRefreshing,
    checkSLABreaches,
  } = useWorkflowAnalytics();

  // Enzyme analytics
  usePageView('workflow');
  const trackEvent = useTrackEvent();

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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeNotifications = async () => {
      if (!isMounted) return;
      await loadNotificationCount();
    };

    initializeNotifications();
    const interval = setInterval(() => {
      void loadNotificationCount();
    }, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [loadNotificationCount]);

  const handleSelectCase = useLatestCallback((caseId: string) => {
    trackEvent('workflow_case_selected', { caseId, tab: activeTab });
    onSelectCase?.(caseId);
  });

  const handleTabChange = useLatestCallback((tab: string) => {
    trackEvent('workflow_tab_changed', { from: activeTab, to: tab });
    setActiveTab(tab as WorkflowTab);
  });

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

  const activeCount = cases.length + processes.filter(p => p.status === 'Active').length;

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
                onChange={handleTabChange} 
              />
            </div>
            <div className="relative">
              <Button 
                variant="secondary" 
                icon={Bell} 
                onClick={() => handleTabChange('notifications')}
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
        <StatCard label="Active Workflows" value={activeCount} color="text-blue-600" bg="bg-white" />
        <StatCard label="Tasks Due Today" value={14} color="text-amber-600" bg="bg-white" />
        <StatCard label="Automations Ran" value="1,204" color="text-purple-600" bg="bg-white" />
        <StatCard label="Efficiency Gain" value="+22%" color="text-green-600" bg="bg-white" />
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
            onSelectCase={handleSelectCase} 
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

      {activeTab === 'templates' && <WorkflowTemplateBuilder />}
      
      {activeTab === 'config' && <WorkflowConfig />}

      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-slate-500"/> Workflow Analytics
            </h3>
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={refreshAnalytics} disabled={isRefreshing}>
              Refresh
            </Button>
          </div>
          
          <WorkflowMetricGrid metrics={metrics} velocity={velocity} />
          <SLAMonitor showBreachReport />
          <EnterpriseCapabilitiesSection
            metrics={metrics}
            isExpanded={analyticsSection === 'capabilities'}
            onToggle={() => setAnalyticsSection(prev => prev === 'capabilities' ? null : 'capabilities')}
          />
          <StageProgressSection
            metrics={metrics}
            isExpanded={analyticsSection === 'stages'}
            onToggle={() => setAnalyticsSection(prev => prev === 'stages' ? null : 'stages')}
          />
          <BottleneckInsights
            bottlenecks={bottlenecks}
            isExpanded={analyticsSection === 'bottlenecks'}
            onToggle={() => setAnalyticsSection(prev => prev === 'bottlenecks' ? null : 'bottlenecks')}
          />
          <TaskDistributionSection metrics={metrics} />
          <SLABreachAlert metrics={metrics} onViewDetails={() => checkSLABreaches()} />
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
