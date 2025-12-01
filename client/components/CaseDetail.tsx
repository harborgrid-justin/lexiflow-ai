
import React from 'react';
import { Case, TimelineEvent, User } from '../types';
import { ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import { CaseOverview } from './case-detail/CaseOverview';
import { CaseDocuments } from './case-detail/CaseDocuments';
import { CaseWorkflow } from './case-detail/CaseWorkflow';
import { CaseDrafting } from './case-detail/CaseDrafting';
import { CaseBilling } from './case-detail/CaseBilling';
import { CaseContractReview } from './case-detail/CaseContractReview';
import { CaseTimeline } from './case-detail/CaseTimeline';
import { CaseEvidence } from './case-detail/CaseEvidence';
import { CaseDiscovery } from './case-detail/CaseDiscovery';
import { CaseMessages } from './case-detail/CaseMessages';
import { CaseParties } from './case-detail/CaseParties';
import { CaseMotions } from './case-detail/CaseMotions';
import { CaseTeam } from './case-detail/CaseTeam';
import { useCaseDetail } from '../hooks/useCaseDetail';
import { WorkflowQuickActions } from './workflow/WorkflowQuickActions';

interface CaseDetailProps {
  caseData: Case;
  onBack: () => void;
  currentUser?: User;
}

const TABS = ['Overview', 'Team', 'Motions', 'Parties', 'Documents', 'Evidence', 'Discovery', 'Messages', 'Workflow', 'Drafting', 'Contract Review', 'Billing'];

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseData, onBack, currentUser }) => {
  const {
    activeTab,
    setActiveTab,
    documents,
    stages,
    parties,
    setParties,
    billingEntries,
    generatingWorkflow,
    analyzingId,
    draftPrompt,
    setDraftPrompt,
    draftResult,
    isDrafting,
    timelineEvents,
    handleAnalyze,
    handleDraft,
    handleGenerateWorkflow,
    addTimeEntry,
    toggleTask,
    createDocument
  } = useCaseDetail(caseData);

  const [teamMembers, setTeamMembers] = React.useState<Array<{ id: string; name: string; role: string }>>([
    { id: '1', name: 'John Smith', role: 'Senior Partner' },
    { id: '2', name: 'Jane Doe', role: 'Associate' },
    { id: '3', name: 'Bob Johnson', role: 'Paralegal' }
  ]);

  const handleTimelineClick = (event: TimelineEvent) => {
      switch(event.type) {
          case 'motion':
          case 'hearing':
              setActiveTab('Motions');
              break;
          case 'document':
              setActiveTab('Documents');
              break;
          case 'task':
              setActiveTab('Workflow');
              break;
          case 'billing':
              setActiveTab('Billing');
              break;
          case 'milestone':
              setActiveTab('Overview');
              break;
      }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 md:mb-6 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3 flex-1">
            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><ArrowLeft className="h-5 w-5" /></button>
            <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 line-clamp-1">{caseData.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{caseData.id}</span>
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="line-clamp-1">{caseData.client}</span>
                {caseData.jurisdiction && (
                    <>
                        <span className="hidden md:inline text-slate-300">•</span>
                        <span className="flex items-center text-slate-600"><MapPin className="h-3 w-3 mr-1"/> {caseData.jurisdiction}</span>
                    </>
                )}
                <span className="hidden md:inline text-slate-300">•</span>
                <span className="flex items-center font-semibold text-slate-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    <DollarSign className="h-3 w-3 mr-0.5 text-green-600"/>
                    {(caseData.value ?? 0).toLocaleString()}
                </span>
            </div>
            </div>
        </div>
        <div className="flex-shrink-0">
          <WorkflowQuickActions 
            userId={currentUser?.id || '1'}
            caseId={caseData.id}
            compact
          />
        </div>
      </div>

      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto no-scrollbar pb-1">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{tab}</button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Timeline Widget */}
            <div className="hidden lg:block lg:col-span-3 h-full">
                <CaseTimeline events={timelineEvents} onEventClick={handleTimelineClick} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 h-full flex flex-col overflow-hidden pr-0 md:pr-2">
                {activeTab === 'Overview' && <CaseOverview caseData={{...caseData, parties}} onTimeEntryAdded={addTimeEntry} currentUser={currentUser} />}
                {activeTab === 'Team' && <CaseTeam caseId={caseData.id} />}
                {activeTab === 'Motions' && <CaseMotions caseId={caseData.id} caseTitle={caseData.title} currentUser={currentUser} />}
                {activeTab === 'Parties' && <CaseParties parties={parties} onUpdate={setParties} />}
                {activeTab === 'Documents' && <CaseDocuments documents={documents} analyzingId={analyzingId} onAnalyze={handleAnalyze} onDocumentCreated={(d) => { createDocument(d); setActiveTab('Documents'); }} currentUser={currentUser} />}
                {activeTab === 'Evidence' && <CaseEvidence caseId={caseData.id} currentUser={currentUser} />}
                {activeTab === 'Discovery' && <CaseDiscovery caseId={caseData.id} />}
                {activeTab === 'Messages' && <CaseMessages caseData={caseData} />}
                {activeTab === 'Drafting' && <CaseDrafting caseId={caseData.id} caseTitle={caseData.title} draftPrompt={draftPrompt} setDraftPrompt={setDraftPrompt} draftResult={draftResult} isDrafting={isDrafting} onDraft={handleDraft} />}
                {activeTab === 'Workflow' && <CaseWorkflow stages={stages} caseId={caseData.id} currentUserId={currentUser?.id || '1'} users={teamMembers} generatingWorkflow={generatingWorkflow} onGenerateWorkflow={handleGenerateWorkflow} onNavigateToModule={(module) => setActiveTab(module)} onToggleTask={toggleTask} />}
                {activeTab === 'Contract Review' && <CaseContractReview />}
                {activeTab === 'Billing' && <CaseBilling billingModel={caseData.billingModel || 'Hourly'} value={caseData.value} entries={billingEntries} />}
            </div>
        </div>
      </div>
    </div>
  );
};
