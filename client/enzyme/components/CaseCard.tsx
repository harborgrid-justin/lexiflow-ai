import React from 'react';
import { Calendar, User, DollarSign, TrendingUp } from 'lucide-react';
import { Case } from '../../types';

interface CaseCardProps {
  case: Case;
  onClick?: () => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ case: caseData, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-slate-100 text-slate-800';
      case 'on hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">
            {caseData.title || caseData.caseNumber || 'Untitled Case'}
          </h3>
          <p className="text-sm text-slate-500">{caseData.caseNumber}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(caseData.status)}`}>
          {caseData.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        {caseData.client && (
          <div className="flex items-center gap-2 text-slate-600">
            <User className="w-4 h-4" />
            <span>{caseData.client}</span>
          </div>
        )}

        {caseData.filingDate && (
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(caseData.filingDate).toLocaleDateString()}</span>
          </div>
        )}

        {caseData.value !== undefined && (
          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-4 h-4" />
            <span>${caseData.value.toLocaleString()}</span>
          </div>
        )}

        {caseData.probability !== undefined && (
          <div className="flex items-center gap-2 text-slate-600">
            <TrendingUp className="w-4 h-4" />
            <span>{caseData.probability}% probability</span>
          </div>
        )}
      </div>

      {caseData.description && (
        <p className="mt-3 text-sm text-slate-600 line-clamp-2">
          {caseData.description}
        </p>
      )}
    </div>
  );
};
