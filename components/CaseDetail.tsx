
import React from 'react';
import { Case } from '../types';
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
import { useCaseDetail } from '../hooks/useCaseDetail';

interface CaseDetailProps {
  caseData: Case;
  onBack: () => void;
}

const TABS = ['Overview', 'Parties', 'Documents', 'Evidence', 'Discovery', 'Messages', 'Workflow', 'Drafting', 'Contract Review', 'Billing'];

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseData, onBack }) => {
  const {
    activeTab,
    setActiveTab,
    documents,
    setDocuments,
    stages,
    parties,
    setParties,
    billingEntries,
    setBillingEntries,
    generatingWorkflow,
    analyzingId,
    draftPrompt,
    setDraftPrompt,
    draftResult,
    isDrafting,
    timelineEvents,
    handleAnalyze,
    handleDraft,
    handleGenerateWorkflow
  } = useCaseDetail(caseData);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 md:mb-6 space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3">
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
                    {caseData.value.toLocaleString()}
                </span>
            </div>
            </div>
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
                <CaseTimeline events={timelineEvents} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 h-full overflow-y-auto pr-0 md:pr-2 pb-10">
                {activeTab === 'Overview' && <CaseOverview caseData={{...caseData, parties}} onTimeEntryAdded={(e) => setBillingEntries([e, ...billingEntries])} />}
                {activeTab === 'Parties' && <CaseParties parties={parties} onUpdate={setParties} />}
                {activeTab === 'Documents' && <CaseDocuments documents={documents} analyzingId={analyzingId} onAnalyze={handleAnalyze} onDocumentCreated={(d) => { setDocuments([...documents, d]); setActiveTab('Documents'); }} />}
                {activeTab === 'Evidence' && <CaseEvidence caseId={caseData.id} />}
                {activeTab === 'Discovery' && <CaseDiscovery caseId={caseData.id} />}
                {activeTab === 'Messages' && <CaseMessages caseData={caseData} />}
                {activeTab === 'Drafting' && <CaseDrafting caseTitle={caseData.title} draftPrompt={draftPrompt} setDraftPrompt={setDraftPrompt} draftResult={draftResult} isDrafting={isDrafting} onDraft={handleDraft} />}
                {activeTab === 'Workflow' && <CaseWorkflow stages={stages} generatingWorkflow={generatingWorkflow} onGenerateWorkflow={handleGenerateWorkflow} />}
                {activeTab === 'Contract Review' && <CaseContractReview />}
                {activeTab === 'Billing' && <CaseBilling billingModel={caseData.billingModel || 'Hourly'} value={caseData.value} entries={billingEntries} />}
            </div>
        </div>
      </div>
    </div>
  );
};
