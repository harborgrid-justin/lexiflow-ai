import React, { useState, useCallback, useRef } from 'react';
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle, Loader, FileUp, Download, GripVertical } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { WorkflowSuccessModal } from '../../components/WorkflowSuccessModal';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';

interface PacerImportPageProps {
  onBack: () => void;
  onImportComplete: (caseId: string) => void;
}

interface ParsedData {
  caseInfo: {
    docketNumber: string;
    originatingCaseNumber: string;
    title: string;
    court: string;
    jurisdiction: string;
    natureOfSuit: string;
    caseType: string;
    filingDate: string;
    presidingJudge: string;
    orderingJudge?: string;
    status: string;
  };
  parties: Array<{
    name: string;
    role: string;
    type: string;
    contact: string;
    counsel?: Array<{
      name: string;
      firm: string;
      email: string;
      phone: string;
      status: string;
      address: string;
    }>;
  }>;
  docketEntries: Array<{
    entryNumber: number;
    date: string;
    description: string;
    pages?: number;
    fileSize?: string;
  }>;
  consolidatedCases?: Array<{
    caseNumber: string;
    relationship: string;
    startDate: string;
    endDate?: string;
  }>;
}

type StepType = 'input' | 'mapping' | 'preview' | 'success';

export const PacerImportPage: React.FC<PacerImportPageProps> = ({ onBack, onImportComplete }) => {
  const [docketText, setDocketText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<StepType>('input');
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers for file upload
  const handleFileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleFileDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['text/plain', 'text/html', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid PACER file (.txt, .html, or .pdf)');
      return;
    }

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        // For PDF files, we'll need to extract text
        // For now, show an error as PDF parsing requires additional libraries
        setError('PDF parsing is not yet implemented. Please paste the docket text directly or upload a .txt or .html file.');
        return;
      } else {
        text = await file.text();
      }

      setDocketText(text);
      setError(null);
    } catch (err) {
      setError('Failed to read the uploaded file. Please try again.');
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleParse = async () => {
    if (!docketText.trim()) {
      setError('Please paste PACER docket text');
      return;
    }

    setParsing(true);
    setError(null);

    try {
      // Use backend API with enterprise OpenAI key
      const result = await ApiService.cases.parsePacerDocket(docketText);

      if (!result || !result.caseInfo) {
        throw new Error('Failed to parse PACER data. Please check the format.');
      }

      setParsedData(result);
      setStep('mapping');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PACER docket');
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (!parsedData) return;

    setImporting(true);
    setError(null);

    try {
      // Send parsed data to backend to create case
      const response = await ApiService.cases.importPacer(parsedData);

      if (response?.case?.id) {
        setImportResult(response);
        setStep('success');
      } else {
        throw new Error('Failed to import case');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import case');
    } finally {
      setImporting(false);
    }
  };

  const handleNavigateToCase = () => {
    if (importResult?.case?.id) {
      onImportComplete(importResult.case.id);
    }
  };

  const handleBack = () => {
    if (step === 'mapping') {
      setStep('input');
    } else if (step === 'preview') {
      setStep('mapping');
    } else {
      onBack();
    }
    setError(null);
  };

  const handleDragStart = (field: string) => {
    setDraggedField(field);
  };

  const handleDragEnd = () => {
    setDraggedField(null);
  };

  const handleDrop = (targetField: string) => {
    if (draggedField && parsedData) {
      // Swap field values
      const temp = { ...parsedData };
      // This is a simplified version - you'd implement actual field swapping logic
      console.log(`Mapping ${draggedField} to ${targetField}`);
    }
    setDraggedField(null);
  };

  const handleContinueToPreview = () => {
    setStep('preview');
  };

  // Show workflow success modal if import completed
  if (step === 'success' && importResult) {
    return (
      <WorkflowSuccessModal
        onClose={onBack}
        onNavigateToCase={handleNavigateToCase}
        caseTitle={importResult.case.title}
        workflow={importResult.workflow}
      />
    );
  }

  const getStepTitle = () => {
    switch (step) {
      case 'input': return 'Import from PACER';
      case 'mapping': return 'Data Mapping';
      case 'preview': return 'Review & Import';
      default: return 'Import from PACER';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 'input': return 'Upload or paste court docket text to automatically create a case';
      case 'mapping': return 'Map extracted fields to ensure accuracy before importing';
      case 'preview': return 'Review the extracted information and confirm import';
      default: return 'Upload or paste court docket text to automatically create a case';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={getStepTitle()}
        subtitle={getStepSubtitle()}
        actions={
          <Button variant="secondary" icon={ArrowLeft} onClick={handleBack}>
            Back
          </Button>
        }
      />

      <div className="max-w-5xl mx-auto">
        {step === 'input' && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  PACER Docket Text
                </label>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleFileDragOver}
                  onDragLeave={handleFileDragLeave}
                  onDrop={handleFileDrop}
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isDragOver
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">
                      Drag and drop a PACER file here, or{' '}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        browse to upload
                      </button>
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports .txt, .html files (PDF coming soon)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.html,.pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Text Area */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Or paste docket text directly:
                  </label>
                  <textarea
                    value={docketText}
                    onChange={(e) => setDocketText(e.target.value)}
                    placeholder="Paste complete PACER docket text here...

Example:
Court of Appeals Docket #: 25-1229
Nature of Suit: 3422 Bankruptcy Appeals
Smith v. Jones Corporation
..."
                    className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Include the complete docket information including case details, parties, counsel, and docket entries
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleParse}
                  disabled={parsing || !docketText.trim()}
                  isLoading={parsing}
                >
                  {parsing ? 'Parsing...' : 'Parse Docket'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'mapping' && parsedData && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Data Mapping</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Drag and drop fields to correct any mapping issues. Ensure extracted data matches the correct fields before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Case Information Mapping */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(parsedData.caseInfo).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      draggable
                      onDragStart={() => handleDragStart(`caseInfo.${key}`)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded cursor-move hover:bg-slate-100 flex-1"
                    >
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-slate-900 truncate max-w-[200px]">{String(value)}</p>
                      </div>
                    </div>
                    <div
                      onDrop={() => handleDrop(`caseInfo.${key}`)}
                      onDragOver={(e) => e.preventDefault()}
                      className="w-8 h-8 border-2 border-dashed border-slate-300 rounded flex items-center justify-center hover:border-blue-400"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parties Mapping */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Parties ({parsedData.parties.length})
              </h3>
              <div className="space-y-3">
                {parsedData.parties.map((party, idx) => (
                  <div key={idx} className="bg-slate-50 rounded p-3 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        draggable
                        onDragStart={() => handleDragStart(`party.${idx}.name`)}
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded cursor-move hover:bg-slate-50 flex-1"
                      >
                        <GripVertical className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs font-medium text-slate-700">Party Name</p>
                          <p className="text-sm text-slate-900">{party.name}</p>
                        </div>
                      </div>
                      <div
                        onDrop={() => handleDrop(`party.${idx}.name`)}
                        onDragOver={(e) => e.preventDefault()}
                        className="w-8 h-8 border-2 border-dashed border-slate-300 rounded flex items-center justify-center hover:border-blue-400"
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        draggable
                        onDragStart={() => handleDragStart(`party.${idx}.role`)}
                        onDragEnd={handleDragEnd}
                        className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded cursor-move hover:bg-slate-50 flex-1"
                      >
                        <GripVertical className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs font-medium text-slate-700">Role</p>
                          <p className="text-sm text-slate-900">{party.role}</p>
                        </div>
                      </div>
                      <div
                        onDrop={() => handleDrop(`party.${idx}.role`)}
                        onDragOver={(e) => e.preventDefault()}
                        className="w-8 h-8 border-2 border-dashed border-slate-300 rounded flex items-center justify-center hover:border-blue-400"
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Mapping Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={handleContinueToPreview}>
                Continue to Preview
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && parsedData && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Successfully Parsed</p>
                <p className="text-sm text-green-700 mt-1">
                  Review the extracted information below and click "Import Case" to create
                </p>
              </div>
            </div>

            {/* Case Info */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Title:</span>
                  <p className="font-medium text-slate-900 mt-1">{parsedData.caseInfo.title}</p>
                </div>
                <div>
                  <span className="text-slate-600">Docket Number:</span>
                  <p className="font-medium text-slate-900 mt-1">{parsedData.caseInfo.docketNumber}</p>
                </div>
                <div>
                  <span className="text-slate-600">Court:</span>
                  <p className="font-medium text-slate-900 mt-1">{parsedData.caseInfo.court}</p>
                </div>
                <div>
                  <span className="text-slate-600">Judge:</span>
                  <p className="font-medium text-slate-900 mt-1">{parsedData.caseInfo.presidingJudge}</p>
                </div>
                <div>
                  <span className="text-slate-600">Nature of Suit:</span>
                  <p className="font-medium text-slate-900 mt-1">{parsedData.caseInfo.natureOfSuit}</p>
                </div>
                <div>
                  <span className="text-slate-600">Filing Date:</span>
                  <p className="font-medium text-slate-900 mt-1">{parsedData.caseInfo.filingDate}</p>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Parties ({parsedData.parties.length})
              </h3>
              <div className="space-y-3">
                {parsedData.parties.map((party, idx) => (
                  <div key={idx} className="bg-slate-50 rounded p-3 border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{party.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{party.role}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700">
                        {party.type}
                      </span>
                    </div>
                    {party.counsel && party.counsel.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-700 mb-1">Counsel:</p>
                        {party.counsel.map((counsel, cidx) => (
                          <div key={cidx} className="text-xs text-slate-600 mt-1">
                            <span className="font-medium">{counsel.name}</span>
                            {counsel.firm && <span> - {counsel.firm}</span>}
                            {counsel.email && <span> ({counsel.email})</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Docket Entries Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Docket Entries ({parsedData.docketEntries.length})
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {parsedData.docketEntries.slice(0, 10).map((entry, idx) => (
                  <div key={idx} className="text-sm bg-slate-50 rounded p-2 border border-slate-200">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-slate-900 min-w-[2rem]">
                        {entry.entryNumber}
                      </span>
                      <span className="text-slate-600 min-w-[5rem]">{entry.date}</span>
                      <span className="text-slate-700 flex-1">{entry.description}</span>
                    </div>
                  </div>
                ))}
                {parsedData.docketEntries.length > 10 && (
                  <p className="text-xs text-slate-500 text-center pt-2">
                    ... and {parsedData.docketEntries.length - 10} more entries
                  </p>
                )}
              </div>
            </div>

            {/* Consolidated Cases */}
            {parsedData.consolidatedCases && parsedData.consolidatedCases.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Consolidated Cases ({parsedData.consolidatedCases.length})
                </h3>
                <div className="space-y-2">
                  {parsedData.consolidatedCases.map((cc, idx) => (
                    <div key={idx} className="text-sm bg-slate-50 rounded p-2 border border-slate-200">
                      <span className="font-medium">{cc.caseNumber}</span>
                      <span className="text-slate-600 ml-2">({cc.relationship})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Import Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleImport}
                disabled={importing}
                isLoading={importing}
              >
                {importing ? 'Importing...' : 'Import Case'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};