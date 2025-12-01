
import React from 'react';
import { EvidenceInventory } from './evidence/EvidenceInventory';
import { EvidenceDetail } from './evidence/EvidenceDetail';
import { EvidenceIntake } from './evidence/EvidenceIntake';
import { EvidenceDashboard } from './evidence/EvidenceDashboard';
import { EvidenceCustodyLog } from './evidence/EvidenceCustodyLog';
import { PageHeader, Button } from './common';
import { LayoutDashboard, Box, Link, Plus, ScanLine, Activity, Zap } from 'lucide-react';
import { useEvidenceVault, ViewMode } from '../hooks/useEvidenceVault';
import { User } from '../types';
import { useTrackEvent, useLatestCallback } from '@missionfabric-js/enzyme/hooks';

interface EvidenceVaultProps {
  onNavigateToCase?: (caseId: string) => void;
  currentUser?: User;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({ onNavigateToCase, currentUser }) => {
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
    handleItemClick,
    handleBack,
    handleIntakeComplete,
    handleCustodyUpdate
  } = useEvidenceVault();

  const trackEvent = useTrackEvent();

  // Track page view
  React.useEffect(() => {
    trackEvent('evidence_vault_viewed', {
      view,
      itemCount: evidenceItems.length,
      filteredCount: filteredItems.length
    });
  }, [view]);

  // Stable callback for view changes with analytics
  const handleViewChange = useLatestCallback((newView: ViewMode) => {
    trackEvent('evidence_view_changed', { from: view, to: newView });
    setView(newView);
  });

  // Stable callback for intake with analytics
  const handleIntakeClick = useLatestCallback(() => {
    trackEvent('evidence_intake_started');
    setView('intake');
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {view !== 'detail' && (
        <>
        <PageHeader 
            title="Evidence Vault" 
            subtitle="Secure Chain of Custody & Forensic Asset Management."
            actions={
            <Button variant="primary" icon={Plus} onClick={handleIntakeClick}>Log New Item</Button>
            }
        />

        <div className="border-b border-slate-200 mb-6">
            <nav className="flex space-x-6 overflow-x-auto">
            {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'inventory', label: 'Master Inventory', icon: Box },
                { id: 'custody', label: 'Chain of Custody', icon: Link },
                { id: 'intake', label: 'Intake Wizard', icon: ScanLine },
            ].map(item => (
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
            <EvidenceDashboard onNavigate={(v) => handleViewChange(v as ViewMode)} />
        )}

        {view === 'inventory' && (
          <EvidenceInventory 
            items={evidenceItems} 
            filteredItems={filteredItems}
            filters={filters}
            setFilters={setFilters}
            onItemClick={handleItemClick}
            onIntakeClick={handleIntakeClick}
          />
        )}

        {view === 'custody' && (
            <EvidenceCustodyLog />
        )}
        
        {view === 'detail' && selectedItem && (
          <EvidenceDetail 
            selectedItem={selectedItem}
            handleBack={handleBack}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNavigateToCase={onNavigateToCase}
            onCustodyUpdate={handleCustodyUpdate}
          />
        )}

        {view === 'intake' && (
          <EvidenceIntake 
            handleBack={handleBack}
            onComplete={handleIntakeComplete}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Enzyme Framework Features Indicator */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-xs text-slate-600">
        <Activity className="h-4 w-4 text-blue-600" />
        <span className="font-semibold">Powered by Enzyme:</span>
        <Zap className="h-3 w-3 text-amber-500" />
        <span>TanStack Query caching • useLatestCallback • useTrackEvent analytics • Chain of Custody tracking</span>
      </div>
    </div>
  );
};
