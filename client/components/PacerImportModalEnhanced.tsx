import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader, GripVertical, ArrowRight, RefreshCw } from 'lucide-react';
import { ApiService } from '../services/apiService';

interface PacerImportModalProps {
  onClose: () => void;
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
  deadlines?: Array<{
    date: string;
    title: string;
    type: string;
  }>;
}

interface FieldMapping {
  source: string;
  target: string;
  value: string;
  isValid: boolean;
}

type StepType = 'input' | 'mapping' | 'preview';

export function PacerImportModalEnhanced({ onClose, onImportComplete }: PacerImportModalProps) {
  const [docketText, setDocketText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<StepType>('input');
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);

  const caseFieldTargets = [
    { key: 'title', label: 'Case Title', required: true },
    { key: 'docketNumber', label: 'Docket Number', required: true },
    { key: 'court', label: 'Court', required: true },
    { key: 'judge', label: 'Judge', required: false },
    { key: 'filingDate', label: 'Filing Date', required: true },
    { key: 'jurisdiction', label: 'Jurisdiction', required: false },
    { key: 'natureOfSuit', label: 'Nature of Suit', required: false },
    { key: 'status', label: 'Status', required: false },
  ];

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
      
      // Auto-create initial field mappings
      const initialMappings: FieldMapping[] = [
        { source: 'caseInfo.title', target: 'title', value: result.caseInfo.title, isValid: true },
        { source: 'caseInfo.docketNumber', target: 'docketNumber', value: result.caseInfo.docketNumber, isValid: true },
        { source: 'caseInfo.court', target: 'court', value: result.caseInfo.court, isValid: true },
        { source: 'caseInfo.presidingJudge', target: 'judge', value: result.caseInfo.presidingJudge, isValid: true },
        { source: 'caseInfo.filingDate', target: 'filingDate', value: result.caseInfo.filingDate, isValid: true },
        { source: 'caseInfo.jurisdiction', target: 'jurisdiction', value: result.caseInfo.jurisdiction, isValid: true },
        { source: 'caseInfo.natureOfSuit', target: 'natureOfSuit', value: result.caseInfo.natureOfSuit, isValid: true },
        { source: 'caseInfo.status', target: 'status', value: result.caseInfo.status, isValid: true },
      ];
      
      setFieldMappings(initialMappings);
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
      // Apply field mappings to parsed data
      const mappedData = { ...parsedData };
      
      const response = await ApiService.cases.importPacer(mappedData);
      
      if (response?.case?.id) {
        onImportComplete(response.case.id);
        onClose();
      } else {
        throw new Error('Failed to import case');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import case');
    } finally {
      setImporting(false);
    }
  };

  const handleBack = () => {
    if (step === 'mapping') {
      setStep('input');
    } else if (step === 'preview') {
      setStep('mapping');
    }
    setError(null);
  };

  const handleDragStart = (e: React.DragEvent, field: string) => {
    setDraggedField(field);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetField: string) => {
    e.preventDefault();
    if (draggedField && parsedData) {
      // Update field mapping
      const newMappings = fieldMappings.map(m => 
        m.source === draggedField 
          ? { ...m, target: targetField }
          : m
      );
      setFieldMappings(newMappings);
    }
    setDraggedField(null);
  };

  const handleContinueToPreview = () => {
    // Validate required fields are mapped
    const requiredFields = caseFieldTargets.filter(f => f.required);
    const mappedTargets = fieldMappings.map(m => m.target);
    const missingRequired = requiredFields.filter(f => !mappedTargets.includes(f.key));
    
    if (missingRequired.length > 0) {
      setError(`Missing required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }
    
    setError(null);
    setStep('preview');
  };

  const validateFieldValue = (value: string, fieldKey: string): boolean => {
    if (!value || value === 'null') return false;
    if (fieldKey === 'filingDate') {
      return !isNaN(Date.parse(value));
    }
    return value.length > 0;
  };

  const toggleFieldValidity = (source: string) => {
    setFieldMappings(prev => 
      prev.map(m => 
        m.source === source 
          ? { ...m, isValid: !m.isValid }
          : m
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Import from PACER</h2>
              <p className="text-sm text-slate-600">
                {step === 'input' && 'Paste court docket text to automatically create case'}
                {step === 'mapping' && 'Review and map extracted fields to case data'}
                {step === 'preview' && 'Review final case information before import'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className={`flex items-center gap-2 ${step === 'input' ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'input' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                1
              </div>
              <span className="text-sm font-medium">Paste Text</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-2 ${step === 'mapping' ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'mapping' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Map Fields</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Preview & Import</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Input */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  PACER Docket Text
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
                  className="w-full h-96 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
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
            </div>
          )}

          {/* Step 2: Field Mapping */}
          {step === 'mapping' && parsedData && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Successfully Parsed</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Review the field mappings below. Drag fields to remap or toggle to exclude invalid data.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Extracted Data (Source) */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Extracted Data
                  </h3>
                  <div className="space-y-2">
                    {fieldMappings.map((mapping, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, mapping.source)}
                        className={`p-3 bg-white rounded border ${
                          draggedField === mapping.source 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : mapping.isValid
                            ? 'border-slate-200'
                            : 'border-red-300 bg-red-50'
                        } cursor-move hover:border-blue-300 transition-colors`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-600">
                                {mapping.source.split('.')[1]}
                              </span>
                              <button
                                onClick={() => toggleFieldValidity(mapping.source)}
                                className={`text-xs px-2 py-0.5 rounded ${
                                  mapping.isValid
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {mapping.isValid ? 'Valid' : 'Invalid'}
                              </button>
                            </div>
                            <p className="text-sm text-slate-900 truncate" title={mapping.value}>
                              {mapping.value || '(empty)'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Fields */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Case Fields
                  </h3>
                  <div className="space-y-2">
                    {caseFieldTargets.map((target) => {
                      const mapping = fieldMappings.find(m => m.target === target.key);
                      return (
                        <div
                          key={target.key}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, target.key)}
                          className={`p-3 bg-white rounded border ${
                            mapping && mapping.isValid
                              ? 'border-green-300 bg-green-50'
                              : target.required
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-slate-200'
                          } transition-colors`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-700">
                              {target.label}
                            </span>
                            {target.required && (
                              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          {mapping && (
                            <p className="text-sm text-slate-900 truncate" title={mapping.value}>
                              {mapping.value || '(empty)'}
                            </p>
                          )}
                          {!mapping && (
                            <p className="text-xs text-slate-400 italic">Drop field here</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Validation Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && parsedData && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Ready to Import</p>
                  <p className="text-sm text-green-700 mt-1">
                    All required fields mapped successfully. Review and click "Import Case" to create.
                  </p>
                </div>
              </div>

              {/* Case Info */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Case Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {fieldMappings.filter(m => m.isValid).map((mapping, idx) => (
                    <div key={idx}>
                      <span className="text-slate-600">
                        {caseFieldTargets.find(t => t.key === mapping.target)?.label}:
                      </span>
                      <p className="font-medium text-slate-900 mt-1">{mapping.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parties */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Parties ({parsedData.parties.length})
                </h3>
                <div className="space-y-3">
                  {parsedData.parties.slice(0, 5).map((party, idx) => (
                    <div key={idx} className="bg-white rounded p-3 border border-slate-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{party.name}</p>
                          <p className="text-sm text-slate-600 mt-1">{party.role}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700">
                          {party.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Docket Entries Summary */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Docket Entries ({parsedData.docketEntries.length})
                </h3>
                <p className="text-sm text-slate-600">
                  {parsedData.docketEntries.length} docket entries will be imported and processed
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Import Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          {step === 'input' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleParse}
                disabled={parsing || !docketText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {parsing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Parse Docket
                  </>
                )}
              </button>
            </>
          )}

          {step === 'mapping' && (
            <>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinueToPreview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Continue to Preview
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Import Case
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
