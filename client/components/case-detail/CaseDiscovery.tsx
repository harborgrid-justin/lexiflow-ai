
import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/apiService';
import { DiscoveryRequest } from '../../types';
import { DiscoveryRequests } from '../discovery/DiscoveryRequests';
import { EmptyState } from '../common/EmptyState';
import { Search } from 'lucide-react';

interface CaseDiscoveryProps {
  caseId: string;
}

export const CaseDiscovery: React.FC<CaseDiscoveryProps> = ({ caseId }) => {
  const [caseRequests, setCaseRequests] = useState<DiscoveryRequest[]>([]);

  useEffect(() => {
    const fetchDiscovery = async () => {
        try {
            const data = await ApiService.getCaseDiscovery(caseId);
            setCaseRequests(data);
        } catch (e) {
            console.error("Failed to fetch discovery", e);
        }
    };
    if (caseId) fetchDiscovery();
  }, [caseId]);

  const handleNavigate = (view: string, id?: string) => {
      const req = caseRequests.find(r => r.id === id);
      alert(`Action: ${view} for request: ${req?.title || id}`);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 shrink-0">
        <h3 className="text-lg font-bold text-slate-900">Discovery Requests</h3>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        {caseRequests.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No discovery requests found"
            description="Discovery requests and responses will appear here once they are filed in this case."
            variant="card"
          />
        ) : (
          <DiscoveryRequests 
              items={caseRequests}
              onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  );
};
