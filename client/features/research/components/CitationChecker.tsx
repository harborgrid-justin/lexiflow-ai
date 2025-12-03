/**
 * Citation Checker Component
 * Upload and validate citations in legal documents
 */

import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useCitationCheck } from '../api';
import type { TreatmentStatus } from '../api/research.types';
import { KeyciteIndicator } from './KeyciteIndicator';

interface CitationCheckerProps {
  documentId?: string;
  onUpload?: (file: File) => Promise<string>; // Returns document ID
}

export const CitationChecker: React.FC<CitationCheckerProps> = ({
  documentId: initialDocumentId,
  onUpload,
}) => {
  const [documentId, setDocumentId] = useState<string | undefined>(initialDocumentId);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());

  const { data: checkResult, isLoading, refetch } = useCitationCheck(documentId || '', {
    enabled: !!documentId,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    setIsUploading(true);
    try {
      const docId = await onUpload(file);
      setDocumentId(docId);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleCitation = (citation: string) => {
    setExpandedCitations(prev => {
      const next = new Set(prev);
      if (next.has(citation)) {
        next.delete(citation);
      } else {
        next.add(citation);
      }
      return next;
    });
  };

  const getStatusIcon = (status: TreatmentStatus) => {
    switch (status) {
      case 'valid':
      case 'followed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'questioned':
      case 'limited':
      case 'distinguished':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'overruled':
      case 'superseded':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TreatmentStatus) => {
    switch (status) {
      case 'valid':
      case 'followed':
        return 'border-green-200 bg-green-50';
      case 'questioned':
      case 'limited':
      case 'distinguished':
        return 'border-yellow-200 bg-yellow-50';
      case 'overruled':
      case 'superseded':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Citation Checker</h2>
        <p className="text-sm text-gray-600">
          Upload a document to validate all citations and check treatment status
        </p>
      </div>

      {/* Upload Section */}
      {!documentId && (
        <div className="p-6">
          <label className="block">
            <div className="flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-900 mb-1">
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </span>
              <span className="text-sm text-gray-600 mb-4">
                PDF, DOCX, or TXT files supported
              </span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              {!isUploading && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Select File
                </button>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Results Section */}
      {documentId && (
        <>
          {/* Summary */}
          {checkResult && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Citation Summary</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{checkResult.summary.total}</div>
                  <div className="text-sm text-gray-600">Total Citations</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="text-2xl font-bold text-green-600">{checkResult.summary.valid}</div>
                  </div>
                  <div className="text-sm text-gray-600">Valid</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <div className="text-2xl font-bold text-yellow-600">{checkResult.summary.warnings}</div>
                  </div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div className="text-2xl font-bold text-red-600">{checkResult.summary.invalid}</div>
                  </div>
                  <div className="text-sm text-gray-600">Invalid</div>
                </div>
              </div>
            </div>
          )}

          {/* Citations List */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Checking citations...</p>
              </div>
            ) : checkResult && checkResult.citations.length > 0 ? (
              <div className="space-y-3">
                {checkResult.citations.map((validation) => {
                  const isExpanded = expandedCitations.has(validation.citation);

                  return (
                    <div
                      key={validation.citation}
                      className={`border-2 rounded-lg overflow-hidden transition-all ${getStatusColor(validation.status)}`}
                    >
                      <button
                        onClick={() => toggleCitation(validation.citation)}
                        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/50 transition-colors"
                      >
                        {getStatusIcon(validation.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="font-mono text-sm font-medium text-gray-900">
                              {validation.citation}
                            </code>
                            <KeyciteIndicator status={validation.status} size="sm" />
                          </div>
                          {validation.title && (
                            <div className="text-sm text-gray-700 line-clamp-1">
                              {validation.title}
                            </div>
                          )}
                          {validation.warnings && validation.warnings.length > 0 && (
                            <div className="mt-1 text-xs text-yellow-700">
                              {validation.warnings.length} warning{validation.warnings.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {validation.url && (
                            <a
                              href={validation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 hover:bg-white rounded transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </a>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-200 bg-white space-y-3">
                          {/* Warnings */}
                          {validation.warnings && validation.warnings.length > 0 && (
                            <div className="pt-3">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Warnings</h4>
                              <ul className="space-y-1">
                                {validation.warnings.map((warning, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-yellow-700">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{warning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Treatment History */}
                          {validation.treatmentHistory && validation.treatmentHistory.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Treatment History</h4>
                              <div className="space-y-2">
                                {validation.treatmentHistory.map((history, index) => (
                                  <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                      {new Date(history.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-gray-900">{history.action}</div>
                                      <div className="text-xs text-gray-600">{history.by}</div>
                                      {history.description && (
                                        <div className="text-xs text-gray-700 mt-1">{history.description}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Last Checked */}
                          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                            Last checked: {new Date(validation.lastChecked).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No citations found in this document</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
