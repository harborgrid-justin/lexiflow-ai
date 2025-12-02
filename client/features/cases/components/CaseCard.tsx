/**
 * Case Card Component
 * Visual card view for displaying case information in grid layout
 */

import React from 'react';
import { Case, User } from '../../../types';
import { CaseStatusBadge } from './CaseStatusBadge';
import {
  Calendar,
  User as UserIcon,
  Building2,
  DollarSign,
  FileText,
  Clock,
  MoreVertical,
} from 'lucide-react';

interface CaseCardProps {
  case: Case;
  onSelect?: (caseId: string) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ case: caseData, onSelect, isSelected, onClick }) => {
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysOpen = () => {
    if (!caseData.filingDate) return null;
    const filed = new Date(caseData.filingDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - filed.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 truncate" title={caseData.title}>
              {caseData.title}
            </h3>
            {caseData.docketNumber && (
              <p className="text-xs text-slate-500 font-mono mt-1">{caseData.docketNumber}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(caseData.id);
                }}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Show context menu
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CaseStatusBadge status={caseData.status} size="sm" />
          {caseData.matterType && (
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
              {caseData.matterType}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Client */}
        {caseData.client && (
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">Client</p>
              <p className="text-sm font-medium text-slate-900 truncate">{caseData.client}</p>
            </div>
          </div>
        )}

        {/* Court & Jurisdiction */}
        {(caseData.court || caseData.jurisdiction) && (
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">Court / Jurisdiction</p>
              <p className="text-sm text-slate-900 truncate">
                {caseData.court || caseData.jurisdiction || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Filing Date */}
        {caseData.filingDate && (
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">Filed</p>
              <p className="text-sm text-slate-900">{formatDate(caseData.filingDate)}</p>
            </div>
          </div>
        )}

        {/* Case Value */}
        {caseData.value && (
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">Value</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrency(caseData.value)}</p>
            </div>
          </div>
        )}

        {/* Description */}
        {caseData.description && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600 line-clamp-2">{caseData.description}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getDaysOpen() !== null ? `${getDaysOpen()} days open` : 'N/A'}
          </div>
          {caseData.caseMembers && caseData.caseMembers.length > 0 && (
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              <span>{caseData.caseMembers.length} member{caseData.caseMembers.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
