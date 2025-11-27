
import React, { useState } from 'react';
import { Case } from '../types';
import { 
  Plus, Briefcase, UserPlus, ShieldAlert, Users, Calendar, CheckSquare,
  DollarSign, Gavel, Mic2, FileCheck, Archive, FileInput
} from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { useCaseList } from '../hooks/useCaseList';
import { CaseListActive } from './case-list/CaseListActive';
import { CaseListIntake } from './case-list/CaseListIntake';
import { CaseListDocket } from './case-list/CaseListDocket';
import { CaseListResources } from './case-list/CaseListResources';
import { CaseListTrust } from './case-list/CaseListTrust';
import { CaseListExperts } from './case-list/CaseListExperts';
import { 
  CaseListConflicts, CaseListTasks, CaseListReporters, 
  CaseListClosing, CaseListArchived 
} from './case-list/CaseListMisc';
import { DocketImportModal } from './DocketImportModal';

interface CaseListProps {
  onSelectCase: (c: Case) => void;
}

type CaseView = 
  'active' | 'docket' | 'tasks' | 'intake' | 'conflicts' | 
  'resources' | 'trust' | 'experts' | 'reporters' | 'closing' | 'archived';

export const CaseList: React.FC<CaseListProps> = ({ onSelectCase }) => {
  const {
    isModalOpen,
    setIsModalOpen,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredCases,
    resetFilters
  } = useCaseList();

  const [view, setView] = useState<CaseView>('active');
  const [isDocketModalOpen, setIsDocketModalOpen] = useState(false);

  const handleDocketImport = (data: any) => {
    console.log("Imported Docket Data:", data);
    alert(`Successfully imported case: ${data.caseInfo?.title}. Created ${data.parties?.length} parties and ${data.docketEntries?.length} docket entries.`);
    // In a real app, this would dispatch to a store/context
  };

  const menuItems = [
    { id: 'active', label: 'Matters', icon: Briefcase },
    { id: 'docket', label: 'Docket', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'intake', label: 'Intake', icon: UserPlus },
    { id: 'conflicts', label: 'Conflicts', icon: ShieldAlert },
    { id: 'resources', label: 'Staffing', icon: Users },
    { id: 'trust', label: 'Trust', icon: DollarSign },
    { id: 'experts', label: 'Experts', icon: Gavel },
    { id: 'reporters', label: 'Reporters', icon: Mic2 },
    { id: 'closing', label: 'Closing', icon: FileCheck },
    { id: 'archived', label: 'Archive', icon: Archive },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Case Management" 
        subtitle="Manage matters, intake, and firm operations."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={FileInput} onClick={() => setIsDocketModalOpen(true)}>Import Docket</Button>
            <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>New Matter</Button>
          </div>
        }
      />

      <div className="bg-slate-100 p-1 rounded-xl overflow-x-auto">
        <nav className="flex space-x-1 min-w-max">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as CaseView)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-all duration-200
                ${view === item.id 
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
              `}
            >
              <item.icon className={`h-4 w-4 ${view === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[400px]">
        {view === 'active' && (
          <CaseListActive 
            filteredCases={filteredCases}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            resetFilters={resetFilters}
            onSelectCase={onSelectCase}
          />
        )}
        {view === 'intake' && <CaseListIntake />}
        {view === 'docket' && <CaseListDocket />}
        {view === 'resources' && <CaseListResources />}
        {view === 'trust' && <CaseListTrust />}
        {view === 'experts' && <CaseListExperts />}
        {view === 'conflicts' && <CaseListConflicts />}
        {view === 'tasks' && <CaseListTasks />}
        {view === 'reporters' && <CaseListReporters />}
        {view === 'closing' && <CaseListClosing />}
        {view === 'archived' && <CaseListArchived />}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Matter Wizard" size="sm">
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">Select a practice area to apply the correct workflow template.</p>
          <div className="space-y-2">
            {['Litigation', 'M&A', 'IP', 'Real Estate'].map((type) => (
              <button key={type} onClick={() => setIsModalOpen(false)} 
                className="w-full text-left p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center group">
                <Briefcase className="h-4 w-4 mr-3 text-slate-400 group-hover:text-blue-500" />
                <span className="font-medium text-slate-700 group-hover:text-blue-700">{type} Template</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <DocketImportModal 
        isOpen={isDocketModalOpen} 
        onClose={() => setIsDocketModalOpen(false)} 
        onImport={handleDocketImport}
      />
    </div>
  );
};
