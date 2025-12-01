/**
 * DiscoveryPlatform - Discovery Center Component
 *
 * Manages discovery requests, legal holds, and FRCP compliance.
 *
 * ENZYME MIGRATION:
 * - Uses useDiscoveryPlatform hook with useApiRequest/useApiMutation
 * - Added useLatestCallback for stable event handlers
 * - Added useTrackEvent for analytics
 * - Added usePageView for page tracking
 * - Added HydrationBoundary for progressive hydration of heavy sub-components
 */

import React, { useState, Suspense, lazy } from 'react';
import { PageHeader, Button, TabNavigation } from './common';
import {
  MessageCircle, Plus, Scale, Shield, Users, Lock, Clock
} from 'lucide-react';
import { useDiscoveryPlatform } from '../hooks/useDiscoveryPlatform';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  HydrationBoundary,
  LazyHydration
} from '../enzyme';

// Lazy load heavy components for better performance
const DiscoveryDashboard = lazy(() => import('./discovery/DiscoveryDashboard').then(m => ({ default: m.DiscoveryDashboard })));
const DiscoveryRequests = lazy(() => import('./discovery/DiscoveryRequests').then(m => ({ default: m.DiscoveryRequests })));
const PrivilegeLog = lazy(() => import('./discovery/PrivilegeLog').then(m => ({ default: m.PrivilegeLog })));
const LegalHolds = lazy(() => import('./discovery/LegalHolds').then(m => ({ default: m.LegalHolds })));
const DiscoveryDocumentViewer = lazy(() => import('./discovery/DiscoveryDocumentViewer').then(m => ({ default: m.DiscoveryDocumentViewer })));
const DiscoveryResponse = lazy(() => import('./discovery/DiscoveryResponse').then(m => ({ default: m.DiscoveryResponse })));
const DiscoveryProduction = lazy(() => import('./discovery/DiscoveryProduction').then(m => ({ default: m.DiscoveryProduction })));

type DiscoveryView = 'dashboard' | 'requests' | 'privilege' | 'holds' | 'plan' | 'doc_viewer' | 'response' | 'production';

// Loading fallback for lazy components
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200">
    <div className="animate-pulse text-slate-400">Loading...</div>
  </div>
);

export const DiscoveryPlatform: React.FC = () => {
  const [view, setView] = useState<DiscoveryView>('dashboard');
  const [contextId, setContextId] = useState<string | null>(null);
  const { requests, updateRequest, isLoading } = useDiscoveryPlatform();
  const isMounted = useIsMounted();

  // ENZYME: Analytics tracking
  const trackEvent = useTrackEvent();
  usePageView('discovery_platform');
  const primaryTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Scale },
    { id: 'requests', label: 'Requests & Responses', icon: MessageCircle },
    { id: 'privilege', label: 'Privilege Log', icon: Shield },
    { id: 'holds', label: 'Legal Holds', icon: Lock },
    { id: 'plan', label: 'Discovery Plan (26(f))', icon: Users },
  ];

  // ENZYME: Stable callbacks with useLatestCallback
  const handleNavigate = useLatestCallback((targetView: DiscoveryView, id?: string) => {
    if (id) setContextId(id);
    setView(targetView);

    // Track navigation event
    trackEvent('discovery_navigate', { targetView, hasContextId: !!id });
  });

  const handleBack = useLatestCallback(() => {
    setView('dashboard');
    setContextId(null);

    trackEvent('discovery_back_to_dashboard');
  });

  const handleSaveResponse = useLatestCallback(async (reqId: string, text: string) => {
    try {
      await updateRequest(reqId, { status: 'Responded', responsePreview: text });

      if (isMounted()) {
        trackEvent('discovery_response_saved', { requestId: reqId });
        alert(`Response saved for ${reqId}. Status updated to Responded.`);
        setView('requests');
      }
    } catch (error) {
      console.error("Failed to save response", error);
      if (isMounted()) {
        alert("Failed to save response.");
      }
    }
  });

  const renderContent = () => {
    // ENZYME: Wrap lazy-loaded components in Suspense with HydrationBoundary
    switch (view) {
        case 'dashboard':
            return (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="discovery-dashboard" priority="high" trigger="visible">
                  <DiscoveryDashboard onNavigate={handleNavigate} />
                </HydrationBoundary>
              </Suspense>
            );
        case 'requests':
            return (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="discovery-requests" priority="high" trigger="visible">
                  <DiscoveryRequests items={requests} onNavigate={handleNavigate} />
                </HydrationBoundary>
              </Suspense>
            );
        case 'privilege':
            return (
              <Suspense fallback={<LoadingFallback />}>
                <LazyHydration priority="normal" trigger="visible">
                  <PrivilegeLog />
                </LazyHydration>
              </Suspense>
            );
        case 'holds':
            return (
              <Suspense fallback={<LoadingFallback />}>
                <LazyHydration priority="normal" trigger="visible">
                  <LegalHolds />
                </LazyHydration>
              </Suspense>
            );
        case 'doc_viewer':
            return (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="discovery-doc-viewer" priority="high" trigger="immediate">
                  <DiscoveryDocumentViewer docId={contextId || ''} onBack={() => setView('dashboard')} />
                </HydrationBoundary>
              </Suspense>
            );
        case 'response': {
            const reqToDraft = requests.find(r => r.id === contextId);
            return (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="discovery-response" priority="high" trigger="immediate">
                  <DiscoveryResponse request={reqToDraft || null} onBack={() => setView('requests')} onSave={handleSaveResponse} />
                </HydrationBoundary>
              </Suspense>
            );
        }
        case 'production': {
            const reqToProduce = requests.find(r => r.id === contextId);
            return (
              <Suspense fallback={<LoadingFallback />}>
                <LazyHydration priority="normal" trigger="visible">
                  <DiscoveryProduction request={reqToProduce || null} onBack={() => setView('requests')} />
                </LazyHydration>
              </Suspense>
            );
        }
        case 'plan':
            return (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-lg border border-slate-200 border-dashed">
                    <Users className="h-16 w-16 mb-4 opacity-20"/>
                    <p className="font-medium text-lg">Rule 26(f) Discovery Plan Builder</p>
                    <p className="text-sm mb-6">Collaborative editor for joint discovery plans.</p>
                    <Button variant="outline" onClick={handleBack}>Return to Dashboard</Button>
                </div>
            );
        default:
            return (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="discovery-dashboard-default" priority="high" trigger="visible">
                  <DiscoveryDashboard onNavigate={handleNavigate} />
                </HydrationBoundary>
              </Suspense>
            );
    }
  };

  // Main Render
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header varies based on view depth */}
      {['dashboard', 'requests', 'privilege', 'holds', 'plan'].includes(view) ? (
          <>
            <PageHeader 
                title="Discovery Center" 
                subtitle="Manage Requests, Legal Holds, and FRCP Compliance."
                actions={
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Clock} onClick={() => alert("Syncing Court Deadlines...")}>Sync Deadlines</Button>
                    <Button variant="primary" icon={Plus} onClick={() => alert("New Request Wizard")}>Create Request</Button>
                </div>
                }
            />
            <TabNavigation 
              tabs={primaryTabs}
              activeTab={view}
              onTabChange={(id) => setView(id as DiscoveryView)}
              className="bg-white rounded-t-lg"
            />
          </>
      ) : null}

      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};
