/**
 * Case Sidebar Component
 * Quick information sidebar showing case summary and key details
 */

import React from 'react';
import { Case } from '../../../types';
import { CaseStatusBadge } from './CaseStatusBadge';
import {
  Calendar,
  DollarSign,
  Building2,
  User,
  FileText,
  Clock,
  Scale,
  MapPin,
  Tag,
} from 'lucide-react';

interface CaseSidebarProps {
  case: Case;
  metrics?: {
    totalDocuments?: number;
    totalParties?: number;
    totalHours?: number;
    daysOpen?: number;
  };
}

export const CaseSidebar: React.FC<CaseSidebarProps> = ({ case: caseData, metrics }) => {
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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysOpen = () => {
    if (!caseData.filingDate) return metrics?.daysOpen || 0;
    const filed = new Date(caseData.filingDate);
    const now = new Date();
    return Math.floor((now.getTime() - filed.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Case Information</h2>
        <CaseStatusBadge status={caseData.status} />
      </div>

      {/* Key Details */}
      <div className="p-4 space-y-4">
        {/* Case Number */}
        {caseData.docketNumber && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Tag className="w-3 h-3" />
              <span>Case Number</span>
            </div>
            <p className="text-sm font-mono font-medium text-slate-900">{caseData.docketNumber}</p>
          </div>
        )}

        {/* Client */}
        {caseData.client && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Building2 className="w-3 h-3" />
              <span>Client</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{caseData.client}</p>
          </div>
        )}

        {/* Matter Type */}
        {caseData.matterType && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <FileText className="w-3 h-3" />
              <span>Matter Type</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{caseData.matterType}</p>
          </div>
        )}

        {/* Court */}
        {caseData.court && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Scale className="w-3 h-3" />
              <span>Court</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{caseData.court}</p>
          </div>
        )}

        {/* Jurisdiction */}
        {caseData.jurisdiction && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <MapPin className="w-3 h-3" />
              <span>Jurisdiction</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{caseData.jurisdiction}</p>
          </div>
        )}

        {/* Judge */}
        {caseData.judge && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <User className="w-3 h-3" />
              <span>Judge</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{caseData.judge}</p>
          </div>
        )}

        {/* Filing Date */}
        {caseData.filingDate && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Calendar className="w-3 h-3" />
              <span>Filed</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{formatDate(caseData.filingDate)}</p>
          </div>
        )}

        {/* Case Value */}
        {caseData.value && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Case Value</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{formatCurrency(caseData.value)}</p>
          </div>
        )}

        {/* Billing Model */}
        {caseData.billingModel && (
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Billing</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{caseData.billingModel}</p>
          </div>
        )}
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalDocuments || 0}</div>
              <div className="text-xs text-slate-600">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalParties || 0}</div>
              <div className="text-xs text-slate-600">Parties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getDaysOpen()}</div>
              <div className="text-xs text-slate-600">Days Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.totalHours || 0}</div>
              <div className="text-xs text-slate-600">Hours</div>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {caseData.description && (
        <div className="p-4 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
            Description
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{caseData.description}</p>
        </div>
      )}
    </div>
  );
};
