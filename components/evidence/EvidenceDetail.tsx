
import React from 'react';
import { Button } from '../common/Button';
import { EvidenceItem, ChainOfCustodyEvent } from '../../types';
import { ArrowLeft, FileSearch, Lock, ExternalLink } from 'lucide-react';
import { EvidenceOverview } from './EvidenceOverview';
import { EvidenceChainOfCustody } from './EvidenceChainOfCustody';
import { EvidenceAdmissibility } from './EvidenceAdmissibility';
import { EvidenceStructure } from './EvidenceStructure';
import { EvidenceForensics } from './EvidenceForensics';

interface EvidenceDetailProps {
  selectedItem: EvidenceItem;
  handleBack: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onNavigateToCase?: (caseId: string) => void;
  onCustodyUpdate?: (event: ChainOfCustodyEvent) => void;
}

export const EvidenceDetail: React.FC<EvidenceDetailProps> = ({ 
  selectedItem, handleBack, activeTab, setActiveTab, onNavigateToCase, onCustodyUpdate 
}) => {
  return (
    <div className="h-full flex flex-col space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{selectedItem.title}</h1>
              <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600">{selectedItem.id}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 text-sm">Associated Case: <span className="font-medium text-blue-600">{selectedItem.caseId}</span></p>
              {onNavigateToCase && (
                <button 
                  onClick={() => onNavigateToCase(selectedItem.caseId)}
                  className="text-xs flex items-center text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded"
                >
                  <ExternalLink className="h-3 w-3 mr-1"/> View Case
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={FileSearch}>Generate Report</Button>
          <Button variant="primary" icon={Lock} onClick={() => setActiveTab('custody')}>Log Transfer</Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {['overview', 'structure', 'custody', 'admissibility', 'forensics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap capitalize transition-colors ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab === 'custody' ? 'Chain of Custody' : tab === 'structure' ? 'Document Chunks' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-8">
        {activeTab === 'overview' && <EvidenceOverview selectedItem={selectedItem} />}
        {activeTab === 'structure' && <EvidenceStructure selectedItem={selectedItem} />}
        {activeTab === 'custody' && <EvidenceChainOfCustody selectedItem={selectedItem} onCustodyUpdate={onCustodyUpdate} />}
        {activeTab === 'admissibility' && <EvidenceAdmissibility selectedItem={selectedItem} />}
        {activeTab === 'forensics' && <EvidenceForensics selectedItem={selectedItem} />}
      </div>
    </div>
  );
};
