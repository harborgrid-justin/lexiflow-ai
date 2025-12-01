
import React, { useState, useEffect } from 'react';
import { ConsolidatedCase } from '../../types';
import { ApiService } from '../../services/apiService';
import { Link as LinkIcon, ExternalLink, GitMerge, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ConsolidatedCasesCardProps {
  caseId: string;
  currentCaseDocketNumber?: string;
  onNavigateToCase?: (caseId: string) => void;
}

export const ConsolidatedCasesCard: React.FC<ConsolidatedCasesCardProps> = ({ 
  caseId, 
  currentCaseDocketNumber,
  onNavigateToCase 
}) => {
  const [consolidated, setConsolidated] = useState<ConsolidatedCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsolidatedCases = async () => {
      try {
        setLoading(true);
        // This will be implemented in the backend
        const data = await ApiService.getConsolidatedCases(caseId);
        setConsolidated(data || []);
      } catch (error) {
        console.error('Failed to fetch consolidated cases:', error);
        setConsolidated([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsolidatedCases();
  }, [caseId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getAssociationColor = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes('consolidated')) return 'info';
    if (lower.includes('related')) return 'warning';
    if (lower.includes('transferred')) return 'neutral';
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (consolidated.length === 0) {
    return null; // Don't show the card if there are no consolidated cases
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <GitMerge className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Consolidated & Related Cases</h3>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {consolidated.length} {consolidated.length === 1 ? 'case' : 'cases'} associated with this matter
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {consolidated.map((item) => {
          const isLeadCase = item.memberCaseNumber === currentCaseDocketNumber;
          const relatedDocketNumber = isLeadCase ? item.leadCaseNumber : item.memberCaseNumber;
          const isActive = !item.dateEnd || new Date(item.dateEnd) > new Date();
          
          return (
            <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-mono font-bold text-slate-900 text-lg">
                      {relatedDocketNumber}
                    </h4>
                    <Badge variant={getAssociationColor(item.associationType)}>
                      {item.associationType}
                    </Badge>
                    {!isActive && (
                      <Badge variant="neutral" size="sm">Ended</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <LinkIcon className="h-3 w-3 text-slate-400" />
                    <span>
                      {isLeadCase ? (
                        <>This case is a <strong>member</strong> of lead case {item.leadCaseNumber}</>
                      ) : (
                        <>This case is the <strong>lead case</strong> for member {item.memberCaseNumber}</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Started: {formatDate(item.dateStart)}</span>
                    {item.dateEnd && (
                      <span>Ended: {formatDate(item.dateEnd)}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {item.leadCaseId && onNavigateToCase && (
                    <button
                      onClick={() => onNavigateToCase(item.leadCaseId!)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Lead Case
                    </button>
                  )}
                  {item.memberCaseId && onNavigateToCase && !isLeadCase && (
                    <button
                      onClick={() => onNavigateToCase(item.memberCaseId!)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Member Case
                    </button>
                  )}
                </div>
              </div>

              {!isActive && (
                <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    This case association ended on {item.dateEnd && formatDate(item.dateEnd)}. 
                    The cases may now be proceeding independently.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Consolidated case relationships are imported from PACER docket data</span>
        </div>
      </div>
    </div>
  );
};
