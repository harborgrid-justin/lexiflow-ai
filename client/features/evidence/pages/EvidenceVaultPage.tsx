/**
 * EvidenceVaultPage - Evidence Vault Page Component
 *
 * Main page for secure chain of custody and forensic asset management.
 *
 * Features:
 * - Multi-view navigation (dashboard, inventory, custody, intake, detail)
 * - Progressive hydration for performance
 * - Analytics tracking
 */

import React, { Suspense } from 'react';
import { LayoutDashboard, Box, Link, Plus, ScanLine, Activity, Zap } from 'lucide-react';
import { PageHeader, Button } from '@/components/common';
import {
  useTrackEvent,
  useLatestCallback,
  usePageView,
  EnzymeHydrationBoundary as HydrationBoundary,
  EnzymeLazyHydration as LazyHydration
} from '@/enzyme';
import { useEvidenceVault, ViewMode } from '../hooks/useEvidenceVault';

// Lazy load sub-components
const EvidenceInventory = React.lazy(() => 
  import('@/components/evidence/EvidenceInventory').then(m => ({ default: m.EvidenceInventory }))
);
const EvidenceDetail = React.lazy(() => 
  import('@/components/evidence/EvidenceDetail').then(m => ({ default: m.EvidenceDetail }))
);
const EvidenceIntake = React.lazy(() => 
  import('@/components/evidence/EvidenceIntake').then(m => ({ default: m.EvidenceIntake }))
);
const EvidenceDashboard = React.lazy(() => 
  import('@/components/evidence/EvidenceDashboard').then(m => ({ default: m.EvidenceDashboard }))
);
const EvidenceCustodyLog = React.lazy(() => 
  import('@/components/evidence/EvidenceCustodyLog').then(m => ({ default: m.EvidenceCustodyLog }))
);

interface EvidenceVaultPageProps {
  onNavigateToCase?: (caseId: string) => void;
  currentUser?: { id: string; name: string; role: string };
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200">
    <div className="animate-pulse text-slate-400">Loading evidence data...</div>
  </div>
);

export const EvidenceVaultPage: React.FC<EvidenceVaultPageProps> = ({ 
  onNavigateToCase, 
  currentUser 
}) => {
  const {
    view,
    setView,
    activeTab,
    setActiveTab,
    selectedItem,
    evidenceItems,
    filters,
    setFilters,
    filteredItems,
    loading,
    handleItemClick,
    handleBack,
    handleIntakeComplete,
    handleCustodyUpdate
  } = useEvidenceVault();

  const trackEvent = useTrackEvent();
  usePageView('evidence_vault');

  // Track view changes
  React.useEffect(() => {
    trackEvent('evidence_vault_view_changed', {
      view,
      itemCount: evidenceItems.length,
      filteredCount: filteredItems.length
    });
  }, [view, evidenceItems.length, filteredItems.length, trackEvent]);

  const handleViewChange = useLatestCallback((newView: ViewMode) => {
    trackEvent('evidence_view_changed', { from: view, to: newView });
    setView(newView);
  });

  const handleIntakeClick = useLatestCallback(() => {
    trackEvent('evidence_intake_started');
    setView('intake');
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Master Inventory', icon: Box },
    { id: 'custody', label: 'Chain of Custody', icon: Link },
    { id: 'intake', label: 'Intake Wizard', icon: ScanLine },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingFallback />
        </div>
      ) : (
        <>
          {view !== 'detail' && (
            <>
              <PageHeader
                title="Evidence Vault"
                subtitle="Secure Chain of Custody & Forensic Asset Management."
                actions={
                  <Button variant="primary" icon={Plus} onClick={handleIntakeClick}>
                    Log New Item
                  </Button>
                }
              />

              <div className="border-b border-slate-200 mb-6">
                <nav className="flex space-x-6 overflow-x-auto">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleViewChange(item.id as ViewMode)}
                      className={`pb-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
                        view === item.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </>
          )}

          <div className="min-h-[500px]">
            {view === 'dashboard' && (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="evidence-dashboard" priority="high" trigger="visible">
                  <EvidenceDashboard onNavigate={(v) => handleViewChange(v as ViewMode)} />
                </HydrationBoundary>
              </Suspense>
            )}

            {view === 'inventory' && (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="evidence-inventory" priority="high" trigger="visible">
                  <EvidenceInventory
                    items={evidenceItems}
                    filteredItems={filteredItems}
                    filters={filters}
                    setFilters={setFilters}
                    onItemClick={handleItemClick}
                    onIntakeClick={handleIntakeClick}
                  />
                </HydrationBoundary>
              </Suspense>
            )}

            {view === 'custody' && (
              <Suspense fallback={<LoadingFallback />}>
                <LazyHydration priority="high" trigger="visible">
                  <EvidenceCustodyLog />
                </LazyHydration>
              </Suspense>
            )}

            {view === 'detail' && selectedItem && (
              <Suspense fallback={<LoadingFallback />}>
                <HydrationBoundary id="evidence-detail" priority="high" trigger="immediate">
                  <EvidenceDetail
                    selectedItem={selectedItem}
                    handleBack={handleBack}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onNavigateToCase={onNavigateToCase}
                    onCustodyUpdate={handleCustodyUpdate}
                  />
                </HydrationBoundary>
              </Suspense>
            )}

            {view === 'intake' && (
              <Suspense fallback={<LoadingFallback />}>
                <LazyHydration priority="normal" trigger="idle">
                  <EvidenceIntake
                    handleBack={handleBack}
                    onComplete={handleIntakeComplete}
                    currentUser={currentUser}
                  />
                </LazyHydration>
              </Suspense>
            )}
          </div>

          {/* Enzyme Framework Features Indicator */}
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-xs text-slate-600">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="font-semibold">Powered by Enzyme:</span>
            <Zap className="h-3 w-3 text-amber-500" />
            <span>TanStack Query caching • useLatestCallback • useTrackEvent analytics • Chain of Custody tracking</span>
          </div>
        </>
      )}
    </div>
  );
};

export default EvidenceVaultPage;
