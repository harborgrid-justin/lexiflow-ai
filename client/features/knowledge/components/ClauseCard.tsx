/**
 * ClauseCard - Individual Clause Display Component
 *
 * Displays a single clause with metadata and actions.
 */

import React from 'react';
import { FileText, BarChart2, ShieldAlert, History } from 'lucide-react';
import { Card } from '@/components/common';
import type { Clause } from '../api/knowledge.types';

interface ClauseCardProps {
  clause: Clause;
  onViewHistory: (clause: Clause) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, onViewHistory }) => {
  return (
    <Card noPadding className="flex flex-col hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-lg">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {clause.category}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2">{clause.name}</h3>
        </div>
        {clause.riskRating === 'High' && (
          <div title="High Risk">
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        <p className="text-sm text-slate-600 line-clamp-3 font-serif bg-slate-50 p-3 rounded italic border border-slate-100 mb-4">
          "{clause.content}"
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
          <div className="flex items-center">
            <FileText className="h-3 w-3 mr-1" /> Ver: {clause.version}
          </div>
          <div className="flex items-center">
            <BarChart2 className="h-3 w-3 mr-1" /> Used: {clause.usageCount}x
          </div>
          <div className="col-span-2">Updated: {clause.lastUpdated}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-end">
        <button
          onClick={() => onViewHistory(clause)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
        >
          <History className="h-3 w-3 mr-1" /> View History
        </button>
      </div>
    </Card>
  );
};

export default ClauseCard;
