/**
 * Case Row Component
 * Table row component for displaying case information in table view
 */

import React from 'react';
import { Case } from '../../../types';
import { CaseStatusBadge } from './CaseStatusBadge';
import { MoreVertical, ExternalLink } from 'lucide-react';

interface CaseRowProps {
  case: Case;
  onSelect?: (caseId: string) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CaseRow: React.FC<CaseRowProps> = ({ case: caseData, onSelect, isSelected, onClick }) => {
  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysOpen = () => {
    if (!caseData.filingDate) return '-';
    const filed = new Date(caseData.filingDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - filed.getTime()) / (1000 * 60 * 60 * 24));
    return `${days}d`;
  };

  return (
    <tr
      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      {/* Checkbox */}
      {onSelect && (
        <td className="px-4 py-3 w-12">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(caseData.id);
            }}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
        </td>
      )}

      {/* Case Title & Number */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 truncate max-w-xs" title={caseData.title}>
            {caseData.title}
          </span>
          {caseData.docketNumber && (
            <span className="text-xs text-slate-500 font-mono mt-0.5">{caseData.docketNumber}</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <CaseStatusBadge status={caseData.status} size="sm" />
      </td>

      {/* Client */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-900 truncate max-w-xs block" title={caseData.client}>
          {caseData.client || '-'}
        </span>
      </td>

      {/* Matter Type */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-700">{caseData.matterType || '-'}</span>
      </td>

      {/* Court */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-700 truncate max-w-xs block" title={caseData.court}>
          {caseData.court || '-'}
        </span>
      </td>

      {/* Filed Date */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-700">{formatDate(caseData.filingDate)}</span>
      </td>

      {/* Days Open */}
      <td className="px-4 py-3">
        <span className="text-sm text-slate-700">{getDaysOpen()}</span>
      </td>

      {/* Value */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-slate-900">{formatCurrency(caseData.value)}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 w-12">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="p-1 text-slate-400 hover:text-blue-600"
            title="View details"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Show context menu
            }}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
