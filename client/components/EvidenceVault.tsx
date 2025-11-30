
import React from 'react';
import { EvidenceInventory } from './evidence/EvidenceInventory';
import { EvidenceDetail } from './evidence/EvidenceDetail';
import { EvidenceIntake } from './evidence/EvidenceIntake';
import { EvidenceDashboard } from './evidence/EvidenceDashboard';
import { EvidenceCustodyLog } from './evidence/EvidenceCustodyLog';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';
import { LayoutDashboard, Box, Link, Plus, ScanLine } from 'lucide-react';
import { useEvidenceVault, ViewMode } from '../hooks/useEvidenceVault';
import { User } from '../types';

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

  return (
    <div className="space-y-6 animate-fade-in">
      {view !== 'detail' && (
        <>
        <PageHeader 
            title="Evidence Vault" 
            subtitle="Secure Chain of Custody & Forensic Asset Management."
            actions={
            <Button variant="primary" icon={Plus} onClick={() => setView('intake')}>Log New Item</Button>
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
                onClick={() => setView(item.id as ViewMode)}
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
            <EvidenceDashboard onNavigate={(v) => setView(v as ViewMode)} />
        )}

        {view === 'inventory' && (
          <EvidenceInventory 
            items={evidenceItems} 
            filteredItems={filteredItems}
            filters={filters}
            setFilters={setFilters}
            onItemClick={handleItemClick}
            onIntakeClick={() => setView('intake')}
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
    </div>
  );
};
