/**
 * ComplianceDashboard - Risk & Compliance Center Component
 *
 * Manages conflict checks, ethical walls, and regulatory risk monitoring.
 *
 * ENZYME MIGRATION:
 * - Uses useComplianceDashboard hook with useApiRequest/useApiMutation
 * - Added useLatestCallback for stable tab change handler
 * - Added useTrackEvent for analytics on tab changes and key actions
 * - Added usePageView for page tracking
 * - Added HydrationBoundary for progressive hydration of tab content sections
 */

import React, { useState } from 'react';
import { Search, Lock, CheckCircle } from 'lucide-react';
import { PageHeader, Tabs, Card, Button, Badge } from './common';
import { useComplianceDashboard } from '../hooks/useComplianceDashboard';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  HydrationBoundary
} from '../enzyme';

type ComplianceTab = 'conflicts' | 'walls' | 'risk';

export const ComplianceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ComplianceTab>('conflicts');
  const { conflicts, walls } = useComplianceDashboard();

  // ENZYME: Analytics tracking
  const trackEvent = useTrackEvent();
  usePageView('compliance_dashboard');

  // ENZYME: Stable callback for tab changes with analytics
  const handleTabChange = useLatestCallback((tab: string) => {
    const newTab = tab as ComplianceTab;
    setActiveTab(newTab);

    trackEvent('compliance_tab_change', { tab: newTab, previousTab: activeTab });
  });

  // ENZYME: Track key actions
  const handleRunNewCheck = useLatestCallback(() => {
    trackEvent('compliance_run_conflict_check');
    // Original action placeholder
    alert('Running new conflict check...');
  });

  const handleEditPolicy = useLatestCallback((wallId: string, wallTitle: string) => {
    trackEvent('compliance_edit_wall_policy', { wallId, wallTitle });
    // Original action placeholder
    alert(`Editing policy for: ${wallTitle}`);
  });

  const handleCreateWall = useLatestCallback(() => {
    trackEvent('compliance_create_ethical_wall');
    // Original action placeholder
    alert('Creating new ethical wall...');
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Risk & Compliance Center"
        subtitle="Conflicts, Ethical Walls, and Regulatory Monitoring."
        actions={
          <Tabs
            tabs={['conflicts', 'walls', 'risk']}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        }
      />

      {/* ENZYME: Wrap each tab content in HydrationBoundary for progressive hydration */}
      {activeTab === 'conflicts' && (
        <HydrationBoundary id="compliance-conflicts" priority="high" trigger="visible">
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center"><Search className="mr-2 h-4 w-4"/> Recent Checks</h3>
               <Button size="sm" onClick={handleRunNewCheck}>Run New Check</Button>
            </div>
            <table className="min-w-full divide-y divide-slate-200">
               <thead className="bg-slate-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Entity</th>
                   <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                   <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                   <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Hits</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                 {conflicts.map(c => (
                   <tr key={c.id}>
                     <td className="px-6 py-4 font-medium text-slate-900">{c.entityName}</td>
                     <td className="px-6 py-4 text-slate-500 text-sm">{c.date}</td>
                     <td className="px-6 py-4">
                       <Badge variant={c.status === 'Cleared' ? 'success' : 'error'} size="sm">
                         {c.status}
                       </Badge>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-500">{c.foundIn.length > 0 ? c.foundIn.join(', ') : 'None'}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </Card>
        </HydrationBoundary>
      )}

      {activeTab === 'walls' && (
        <HydrationBoundary id="compliance-walls" priority="high" trigger="visible">
          <div className="grid grid-cols-1 gap-4">
             {walls.map(w => (
               <Card key={w.id} className="flex justify-between items-center">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-50 rounded-lg"><Lock className="h-6 w-6 text-red-600"/></div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{w.title}</h3>
                      <p className="text-sm text-slate-500 mb-2">Matter ID: {w.caseId}</p>
                      <div className="flex gap-2 text-xs">
                         <span className="bg-slate-100 px-2 py-1 rounded">Restricted: {w.restrictedGroups.join(', ')}</span>
                         <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded">Access: {w.authorizedUsers.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center text-green-600 text-sm font-medium"><CheckCircle className="h-4 w-4 mr-1"/> Enforced</div>
                     <Button variant="ghost" size="sm" onClick={() => handleEditPolicy(w.id, w.title)}>Edit Policy</Button>
                  </div>
               </Card>
             ))}
             <button
               className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 font-medium flex justify-center items-center"
               onClick={handleCreateWall}
             >
                <Lock className="h-4 w-4 mr-2"/> Create New Ethical Wall
             </button>
          </div>
        </HydrationBoundary>
      )}

      {activeTab === 'risk' && (
        <HydrationBoundary id="compliance-risk" priority="normal" trigger="visible">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card className="border-l-4 border-l-red-500">
                <h3 className="font-bold text-slate-900 mb-2">High Risk Clients</h3>
                <p className="text-3xl font-bold text-slate-900">3</p>
                <p className="text-xs text-slate-500 mt-1">Due to sanctions list or PEP status.</p>
             </Card>
             <Card className="border-l-4 border-l-amber-500">
                <h3 className="font-bold text-slate-900 mb-2">Missing Engagement Letters</h3>
                <p className="text-3xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500 mt-1">Active matters without signed docs.</p>
             </Card>
             <Card className="border-l-4 border-l-blue-500">
                <h3 className="font-bold text-slate-900 mb-2">Data Policy Violations</h3>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-500 mt-1">DLP scans clean for last 30 days.</p>
             </Card>
          </div>
        </HydrationBoundary>
      )}
    </div>
  );
};
