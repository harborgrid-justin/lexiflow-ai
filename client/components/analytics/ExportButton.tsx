/**
 * ExportButton Component
 * Export data to various formats
 */

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { ExportFormat } from '../../types/analytics';

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void;
  formats?: ExportFormat[];
  loading?: boolean;
  className?: string;
}

const FORMAT_ICONS = {
  pdf: FileText,
  excel: FileSpreadsheet,
  csv: FileSpreadsheet,
  json: FileJson,
};

const FORMAT_LABELS = {
  pdf: 'PDF',
  excel: 'Excel',
  csv: 'CSV',
  json: 'JSON',
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  formats = ['pdf', 'excel', 'csv'],
  loading = false,
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format: ExportFormat) => {
    onExport(format);
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        <span className="text-sm font-medium">
          {loading ? 'Exporting...' : 'Export'}
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {formats.map((format) => {
              const Icon = FORMAT_ICONS[format];
              return (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Icon size={16} className="text-slate-400" />
                  <span>Export as {FORMAT_LABELS[format]}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
