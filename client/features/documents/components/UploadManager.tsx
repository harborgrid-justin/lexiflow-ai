/**
 * UploadManager Component
 * Global upload progress indicator and queue management
 */

import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Minimize2, Maximize2, XCircle } from 'lucide-react';
import type { UploadQueueItem } from '../api/documents.types';
import { ProgressBar } from '../../../components/common';

interface UploadManagerProps {
  uploads: UploadQueueItem[];
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
  onClear?: () => void;
}

export const UploadManager: React.FC<UploadManagerProps> = ({
  uploads,
  onCancel,
  onRetry,
  onClear,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || uploads.length === 0) {
    return null;
  }

  const inProgress = uploads.filter(u => u.status === 'uploading' || u.status === 'pending');
  const completed = uploads.filter(u => u.status === 'completed');
  const failed = uploads.filter(u => u.status === 'error');

  const totalProgress =
    uploads.length > 0
      ? uploads.reduce((sum, upload) => sum + upload.progress, 0) / uploads.length
      : 0;

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let value = bytes;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-900">
            Uploads {inProgress.length > 0 && `(${inProgress.length})`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4 text-slate-600" />
            ) : (
              <Minimize2 className="h-4 w-4 text-slate-600" />
            )}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-slate-200 rounded transition-colors"
            title="Close"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      {!isMinimized && inProgress.length > 0 && (
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <ProgressBar progress={totalProgress} className="h-2" />
        </div>
      )}

      {/* Upload List */}
      {!isMinimized && (
        <div className="max-h-96 overflow-y-auto">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {upload.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {upload.status === 'pending' && (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
                  )}
                  {upload.status === 'uploading' && (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {upload.file.name}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {upload.status === 'error' && onRetry && (
                        <button
                          onClick={() => onRetry(upload.id)}
                          className="p-1 hover:bg-slate-200 rounded transition-colors text-xs text-blue-600 hover:text-blue-700"
                          title="Retry"
                        >
                          Retry
                        </button>
                      )}
                      {(upload.status === 'uploading' || upload.status === 'pending') &&
                        onCancel && (
                          <button
                            onClick={() => onCancel(upload.id)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4 text-slate-400" />
                          </button>
                        )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">{formatFileSize(upload.file.size)}</p>

                  {/* Progress Bar */}
                  {(upload.status === 'uploading' || upload.status === 'pending') && (
                    <div className="space-y-1">
                      <ProgressBar progress={upload.progress} className="h-1" />
                      <p className="text-xs text-slate-500">{Math.round(upload.progress)}%</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {upload.status === 'error' && (
                    <p className="text-xs text-red-600">{upload.error || 'Upload failed'}</p>
                  )}

                  {/* Success Message */}
                  {upload.status === 'completed' && (
                    <p className="text-xs text-green-600">Upload complete</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Summary */}
      {!isMinimized && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {completed.length > 0 && (
              <span className="text-green-600">{completed.length} completed</span>
            )}
            {failed.length > 0 && <span className="text-red-600">{failed.length} failed</span>}
          </div>
          {(completed.length > 0 || failed.length > 0) && onClear && (
            <button
              onClick={onClear}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Minimized View */}
      {isMinimized && inProgress.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
            <span className="text-sm text-slate-600">
              Uploading {inProgress.length} file{inProgress.length !== 1 ? 's' : ''}...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
