/**
 * AdminPanelPage - Feature Module Page
 *
 * Admin console with system settings, security audits, and data management.
 *
 * ENZYME FEATURES:
 * - usePageView for admin console page tracking
 * - useLatestCallback for stable tab change handler
 * - useTrackEvent for admin navigation analytics
 * - HydrationBoundary for progressive loading of admin sections
 */

import React, { useState, Suspense, lazy } from 'react';
import { PageHeader, Card, Button, SidebarNavigation } from '@/components/common';
import { useAdminPanel, type AdminTab } from '../hooks';
import {
  usePageView,
  useLatestCallback,
  useTrackEvent,
  HydrationBoundary
} from '@/enzyme';
import {
  Users,
  FileText,
  Database,
  Link2,
  Shield,
} from 'lucide-react';

// Lazy load admin sub-components
const AdminHierarchy = lazy(() =>
  import('@/components/admin/AdminHierarchy').then(m => ({ default: m.AdminHierarchy }))
);
const AdminAuditLog = lazy(() =>
  import('@/components/admin/AdminAuditLog').then(m => ({ default: m.AdminAuditLog }))
);
const AdminPlatformManager = lazy(() =>
  import('@/components/admin/AdminPlatformManager').then(m => ({ default: m.AdminPlatformManager }))
);

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-pulse text-slate-400">Loading...</div>
  </div>
);

// Navigation items for admin console
const navigationItems = [
  { id: 'hierarchy', label: 'User Management', icon: Users },
  { id: 'logs', label: 'Audit Logs', icon: FileText },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'security', label: 'Security', icon: Shield },
];

export const AdminPanelPage: React.FC = () => {
  // Enzyme: Page view tracking
  usePageView('admin_panel');

  // Enzyme: Event tracking
  const trackEvent = useTrackEvent();

  const [activeTab, setActiveTabState] = useState<AdminTab>('hierarchy');
  const { logs } = useAdminPanel(activeTab);

  // Enzyme: Stable callback with tracking for tab changes
  const setActiveTab = useLatestCallback((tab: string) => {
    const previousTab = activeTab;
    trackEvent('admin_tab_changed', {
      from: previousTab,
      to: tab
    });
    setActiveTabState(tab as AdminTab);
  });

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <PageHeader 
        title="Admin Console" 
        subtitle="System settings, security audits, and data management."
      />
      
      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Navigation */}
        <HydrationBoundary id="admin-navigation" priority="high" trigger="immediate">
          <SidebarNavigation
            items={navigationItems}
            activeItem={activeTab}
            onItemChange={setActiveTab}
          />
        </HydrationBoundary>

        <Card className="flex-1 overflow-hidden flex flex-col p-0">
          <Suspense fallback={<LoadingFallback />}>
            {/* Hierarchy tab */}
            {activeTab === 'hierarchy' && (
              <HydrationBoundary id="admin-hierarchy-tab" priority="high" trigger="immediate">
                <AdminHierarchy />
              </HydrationBoundary>
            )}

            {/* Audit logs tab */}
            {activeTab === 'logs' && (
              <HydrationBoundary id="admin-logs-tab" priority="normal" trigger="visible">
                <AdminAuditLog logs={logs} />
              </HydrationBoundary>
            )}

            {/* Platform manager tab */}
            {activeTab === 'data' && (
              <HydrationBoundary id="admin-platform-tab" priority="normal" trigger="visible">
                <AdminPlatformManager />
              </HydrationBoundary>
            )}

            {/* Integrations tab */}
            {activeTab === 'integrations' && (
              <HydrationBoundary id="admin-integrations-tab" priority="low" trigger="idle">
                <div className="p-8 space-y-6 overflow-auto">
                  <h3 className="font-bold text-lg mb-4">Connected Platforms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">O</div>
                        <div><h4 className="font-bold">Outlook / Exchange</h4><p className="text-xs text-green-600">Connected (Sync Active)</p></div>
                      </div>
                      <Button variant="ghost" size="sm">Config</Button>
                    </div>
                    <div className="border p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold">iM</div>
                        <div><h4 className="font-bold">iManage</h4><p className="text-xs text-green-600">Connected (DMS)</p></div>
                      </div>
                      <Button variant="ghost" size="sm">Config</Button>
                    </div>
                    <div className="border p-4 rounded-lg flex items-center justify-between opacity-60">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-400 rounded flex items-center justify-center text-white font-bold">Doc</div>
                        <div><h4 className="font-bold">DocuSign</h4><p className="text-xs text-slate-500">Not Connected</p></div>
                      </div>
                      <Button variant="primary" size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
              </HydrationBoundary>
            )}

            {/* Security tab */}
            {activeTab === 'security' && (
              <HydrationBoundary id="admin-security-tab" priority="low" trigger="idle">
                <div className="p-8 overflow-auto">
                  <h3 className="font-bold text-lg mb-6">Policy Enforcement</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded bg-slate-50">
                      <div>
                        <h4 className="font-bold text-sm">Two-Factor Authentication (2FA)</h4>
                        <p className="text-xs text-slate-500">Enforce for all roles except 'Guest'</p>
                      </div>
                      <div className="h-6 w-11 bg-green-500 rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded bg-slate-50">
                      <div>
                        <h4 className="font-bold text-sm">Data Loss Prevention (DLP)</h4>
                        <p className="text-xs text-slate-500">Block downloads of documents tagged 'Strict Confidential' on mobile</p>
                      </div>
                      <div className="h-6 w-11 bg-green-500 rounded-full relative">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </HydrationBoundary>
            )}
          </Suspense>
        </Card>
      </div>
    </div>
  );
};
