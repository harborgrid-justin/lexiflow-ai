/**
 * VersionHistory Component
 * Display document version history with compare functionality
 */

import React from 'react';
import { Clock, Download, Eye, GitCompare } from 'lucide-react';
import type { DocumentVersion } from '../../../types';
import { Button } from '../../../components/common';

interface VersionHistoryProps {
  versions: DocumentVersion[];
  currentVersionId?: string;
  onRestore?: (version: DocumentVersion) => void;
  onDownload?: (version: DocumentVersion) => void;
  onPreview?: (version: DocumentVersion) => void;
  onCompare?: (version1: DocumentVersion, version2: DocumentVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  currentVersionId,
  onRestore,
  onDownload,
  onPreview,
  onCompare,
}) => {
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (size?: number): string => {
    if (!size) return 'Unknown';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = size;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2 && onCompare) {
      const v1 = versions.find(v => v.id === selectedVersions[0]);
      const v2 = versions.find(v => v.id === selectedVersions[1]);
      if (v1 && v2) {
        onCompare(v1, v2);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">Version History</h3>
          <span className="text-xs text-slate-500">({versions.length} versions)</span>
        </div>
        {selectedVersions.length === 2 && onCompare && (
          <Button onClick={handleCompare} icon={GitCompare} size="sm" variant="secondary">
            Compare
          </Button>
        )}
      </div>

      {/* Version List */}
      <div className="divide-y divide-slate-100">
        {versions.map((version, _index) => {
          const isSelected = selectedVersions.includes(version.id);
          const isCurrent = version.id === currentVersionId;

          return (
            <div
              key={version.id}
              className={`px-4 py-3 hover:bg-slate-50 transition-colors ${
                isSelected ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox for comparison */}
                {onCompare && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleVersionSelect(version.id)}
                    disabled={!isSelected && selectedVersions.length >= 2}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                )}

                {/* Version Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">
                      Version {version.versionNumber}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-1">
                    {formatDate(version.uploadDate)} by {version.uploadedBy}
                  </p>

                  {version.summary && (
                    <p className="text-sm text-slate-600 mb-2">{version.summary}</p>
                  )}

                  {version.fileSize && (
                    <p className="text-xs text-slate-400">{formatFileSize(version.fileSize)}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {onPreview && (
                    <button
                      onClick={() => onPreview(version)}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4 text-slate-600" />
                    </button>
                  )}
                  {onDownload && (
                    <button
                      onClick={() => onDownload(version)}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-slate-600" />
                    </button>
                  )}
                  {onRestore && !isCurrent && (
                    <Button
                      onClick={() => onRestore(version)}
                      size="sm"
                      variant="secondary"
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {versions.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            No version history available
          </div>
        )}
      </div>
    </div>
  );
};
