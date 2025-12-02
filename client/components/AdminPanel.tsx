/**
 * AdminPanel Component
 *
 * ENZYME MIGRATION:
 * - usePageView for admin console page tracking
 * - useLatestCallback for stable tab change handler
 * - useTrackEvent for admin navigation analytics
 * - HydrationBoundary for progressive loading of admin sections
 *
 * Analytics Events:
 * - admin_tab_changed: When user switches between admin tabs
 *
 * Hydration Strategy:
 * - Navigation: priority="high", trigger="immediate" (critical UI)
 * - Hierarchy: priority="high", trigger="immediate" (most used tab)
 * - Audit logs: priority="normal", trigger="visible" (data-heavy)
 * - Platform manager: priority="normal", trigger="visible" (complex UI)
 * - Integrations/Security: priority="low", trigger="idle" (rarely accessed)
 *
 * Performance:
 * - Progressive hydration reduces initial load time
 * - Tab switching tracked for usage analytics
 * - Conditional rendering keeps DOM lightweight
 */

import React, { useState } from 'react';
import { PageHeader, Card, Button, SidebarNavigation } from './common';
import { useAdminPanel } from '../hooks/useAdminPanel';
import {
  usePageView,
  useLatestCallback,
  useTrackEvent,
  HydrationBoundary
} from '../enzyme';

export const AdminPanel: React.FC = () => {
  // Enzyme: Page view tracking
  usePageView('admin_panel');

  // Enzyme: Event tracking
  const trackEvent = useTrackEvent();

  const [activeTab, setActiveTabState] = useState('hierarchy');
  const { logs } = useAdminPanel(activeTab);

  // Enzyme: Stable callback with tracking for tab changes
  const setActiveTab = useLatestCallback((tab: string) => {
    const previousTab = activeTab;
    trackEvent('admin_tab_changed', {
      from: previousTab,
      to: tab
    });
    setActiveTabState(tab);
  });

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <PageHeader 
        title="Admin Console" 
        subtitle="System settings, security audits, and data management."
      />
      
      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Enzyme: Navigation hydrated immediately (critical UI) */}
        <HydrationBoundary id="admin-navigation" priority="high" trigger="immediate">
          <SidebarNavigation
            items={navigationItems}
            activeItem={activeTab}
            onItemChange={setActiveTab}
          />
        </HydrationBoundary>

        <Card className="flex-1 overflow-hidden flex flex-col p-0">
            {/* Enzyme: Hierarchy tab hydrated immediately (most used) */}
            {activeTab === 'hierarchy' && (
              <HydrationBoundary id="admin-hierarchy-tab" priority="high" trigger="immediate">
                <AdminHierarchy />
              </HydrationBoundary>
            )}

            {/* Enzyme: Audit logs hydrated when visible (data-heavy) */}
            {activeTab === 'logs' && (
              <HydrationBoundary id="admin-logs-tab" priority="normal" trigger="visible">
                <AdminAuditLog logs={logs} />
              </HydrationBoundary>
            )}

            {/* Enzyme: Platform manager hydrated when visible (complex UI) */}
            {activeTab === 'data' && (
              <HydrationBoundary id="admin-platform-tab" priority="normal" trigger="visible">
                <AdminPlatformManager />
              </HydrationBoundary>
            )}

            {/* Enzyme: Integrations hydrated when idle (rarely accessed) */}
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

            {/* Enzyme: Security hydrated when idle (rarely accessed) */}
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
                            <div className="h-6 w-11 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div></div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded bg-slate-50">
                            <div>
                                <h4 className="font-bold text-sm">Data Loss Prevention (DLP)</h4>
                                <p className="text-xs text-slate-500">Block downloads of documents tagged 'Strict Confidential' on mobile</p>
                            </div>
                            <div className="h-6 w-11 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div></div>
                        </div>
                    </div>
                </div>
              </HydrationBoundary>
            )}
        </Card>
      </div>
    </div>
  );
};
