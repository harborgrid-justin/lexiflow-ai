
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/apiService';
import { EvidenceItem } from '../../types';
import { EvidenceInventory } from '../evidence/EvidenceInventory';

interface CaseEvidenceProps {
  caseId: string;
}

export const CaseEvidence: React.FC<CaseEvidenceProps> = ({ caseId }) => {
  const [caseEvidence, setCaseEvidence] = useState<EvidenceItem[]>([]);

  useEffect(() => {
    const fetchEvidence = async () => {
        try {
            const data = await ApiService.getCaseEvidence(caseId);
            setCaseEvidence(data);
        } catch (e) {
            console.error("Failed to fetch evidence", e);
        }
    };
    if (caseId) fetchEvidence();
  }, [caseId]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 shrink-0">
        <h3 className="text-lg font-bold text-slate-900">Case Evidence</h3>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        {caseEvidence.length === 0 ? (
          <p className="text-slate-500 italic">No evidence logged for this case.</p>
        ) : (
          <EvidenceInventory 
            items={caseEvidence} 
            filteredItems={caseEvidence} 
            filters={{ search: '', type: '', admissibility: '', caseId: '', custodian: '', dateFrom: '', dateTo: '', location: '', tags: '', collectedBy: '', hasBlockchain: false }}
            setFilters={() => {}} 
            onItemClick={(item) => alert(`Viewing details for ${item.title} (Nav to Vault for full details)`)}
            onIntakeClick={() => alert("Please go to Evidence Vault to log new items.")}
          />
        )}
      </div>
    </div>
  );
};
