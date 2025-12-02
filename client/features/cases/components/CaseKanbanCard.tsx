/**
 * Case Kanban Card Component
 * Compact card for kanban board view organized by status
 */

import React from 'react';
import { Case } from '../../../types';
import { Building2, Calendar, DollarSign, User, AlertCircle } from 'lucide-react';

interface CaseKanbanCardProps {
  case: Case;
  onClick?: () => void;
}

export const CaseKanbanCard: React.FC<CaseKanbanCardProps> = ({ case: caseData, onClick }) => {
  const formatCurrency = (value?: number) => {
    if (!value) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysOpen = () => {
    if (!caseData.filingDate) return null;
    const filed = new Date(caseData.filingDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - filed.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysOpen = getDaysOpen();
  const isOverdue = daysOpen && daysOpen > 365; // Mark cases over 1 year as potentially overdue

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
      onClick={onClick}
    >
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1" title={caseData.title}>
          {caseData.title}
        </h3>
        {caseData.docketNumber && (
          <p className="text-xs text-slate-500 font-mono">{caseData.docketNumber}</p>
        )}
      </div>

      {/* Matter Type */}
      {caseData.matterType && (
        <div className="mb-2">
          <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
            {caseData.matterType}
          </span>
        </div>
      )}

      {/* Key Information */}
      <div className="space-y-1.5 mb-3">
        {/* Client */}
        {caseData.client && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate" title={caseData.client}>
              {caseData.client}
            </span>
          </div>
        )}

        {/* Filing Date */}
        {caseData.filingDate && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span>Filed {formatDate(caseData.filingDate)}</span>
          </div>
        )}

        {/* Value */}
        {caseData.value && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <DollarSign className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="font-medium">{formatCurrency(caseData.value)}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          {caseData.caseMembers && caseData.caseMembers.length > 0 && (
            <>
              <User className="w-3 h-3" />
              <span>{caseData.caseMembers.length}</span>
            </>
          )}
        </div>
        {daysOpen && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
            {isOverdue && <AlertCircle className="w-3 h-3" />}
            <span>{daysOpen}d</span>
          </div>
        )}
      </div>
    </div>
  );
};
