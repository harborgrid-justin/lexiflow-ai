/**
 * CaseEvidence Component
 *
 * ENZYME MIGRATION - December 2, 2025 (Agent 17)
 *
 * Enzyme Features Implemented:
 * - ✅ useTrackEvent: Tracks case_evidence_viewed on mount, case_evidence_item_clicked on item click
 * - ✅ useLatestCallback: Wraps onItemClick callback with tracking
 * - ✅ useIsMounted: Guards setState after async fetch to prevent memory leaks
 *
 * Analytics Events:
 * - case_evidence_viewed: { caseId, evidenceCount } - Fired when component mounts
 * - case_evidence_item_clicked: { caseId, itemId, itemTitle } - Fired when evidence item is clicked
 *
 * Migration Notes:
 * - Added safe async fetch pattern with isMounted guard
 * - Converted onItemClick to useLatestCallback with integrated tracking
 * - No progressive hydration needed (single view component)
 */

import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/apiService';
import { EvidenceItem } from '../../types';
import { EvidenceInventory } from '../evidence/EvidenceInventory';
import { useTrackEvent, useLatestCallback, useIsMounted } from '../../enzyme';

interface CaseEvidenceProps {
  caseId: string;
}

export const CaseEvidence: React.FC<CaseEvidenceProps> = ({ caseId }) => {
  const [caseEvidence, setCaseEvidence] = useState<EvidenceItem[]>([]);
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchEvidence = async () => {
        try {
            const data = await ApiService.getCaseEvidence(caseId);
            // Safe state update - only if component is still mounted
            if (isMounted()) {
              setCaseEvidence(data);
              // Track evidence viewed event with count
              trackEvent('case_evidence_viewed', {
                caseId,
                evidenceCount: data.length
              });
            }
        } catch (e) {
            console.error("Failed to fetch evidence", e);
        }
    };
    if (caseId) fetchEvidence();
  }, [caseId, isMounted, trackEvent]);

  // Wrap onItemClick with useLatestCallback and add tracking
  const handleItemClick = useLatestCallback((item: EvidenceItem) => {
    trackEvent('case_evidence_item_clicked', {
      caseId,
      itemId: item.id,
      itemTitle: item.title
    });
    alert(`Viewing details for ${item.title} (Nav to Vault for full details)`);
  });

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
            onItemClick={handleItemClick}
            onIntakeClick={() => alert("Please go to Evidence Vault to log new items.")}
          />
        )}
      </div>
    </div>
  );
};
