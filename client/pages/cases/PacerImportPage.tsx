import React, { useState, useCallback, useRef } from 'react';
import { ArrowLeft, FileText, Layout, Eye, Flag } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { WorkflowSuccessModal } from '../../components/WorkflowSuccessModal';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { StepHeader } from '../../components/shared/StepHeader';
import { FileUploadZone } from '../../components/shared/FileUploadZone';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { SuccessMessage } from '../../components/shared/SuccessMessage';
import { DataMappingSection } from '../../components/shared/DataMappingSection';
import { CaseInfoPreview } from '../../components/shared/CaseInfoPreview';
import { PartiesPreview } from '../../components/shared/PartiesPreview';
import { DocketEntriesPreview } from '../../components/shared/DocketEntriesPreview';
import { ConsolidatedCasesPreview } from '../../components/shared/ConsolidatedCasesPreview';

interface PacerImportPageProps {
  onBack: () => void;
  onImportComplete: (caseId: string) => void;
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  confidence: number;
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
  const [_isDragOver, setIsDragOver] = useState(false);
  const [_fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [_fileInputRef] = useRef<HTMLInputElement>(null);

  // Drag and drop handlers for file upload
  const _handleFileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const _handleFileDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const _handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await _handleFileUpload(files[0] as File);
    }
  }, []);

  const _handleFileUpload = async (file: File) => {
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
    } catch (_err) {
      setError('Failed to read the uploaded file. Please try again.');
    }
  };

  const _handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await _handleFileUpload(file);
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

      // Initialize field mappings with auto-detected mappings
      const initialMappings: FieldMapping[] = [
        { sourceField: 'docketNumber', targetField: 'caseNumber', confidence: 0.95 },
        { sourceField: 'title', targetField: 'caseName', confidence: 0.90 },
        { sourceField: 'court', targetField: 'court', confidence: 0.95 },
        { sourceField: 'filingDate', targetField: 'filedDate', confidence: 0.90 },
        { sourceField: 'presidingJudge', targetField: 'judge', confidence: 0.85 },
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

  const _handleBack = () => {
    if (step === 'mapping') {
      setStep('input');
    } else if (step === 'preview') {
      setStep('mapping');
    } else {
      onBack();
    }
    setError(null);
  };

  const _handleDragStart = (field: string) => {
    setDraggedField(field);
  };

  const _handleDragEnd = () => {
    setDraggedField(null);
  };

  const _handleDrop = (targetField: string) => {
    if (draggedField && parsedData) {
      // Swap field values
      // This is a simplified version - you'd implement actual field swapping logic
      console.log(`Mapping ${draggedField} to ${targetField}`);
    }
    setDraggedField(null);
  };

  const handleMappingChange = (index: number, mapping: FieldMapping) => {
    const newMappings = [..._fieldMappings];
    newMappings[index] = mapping;
    setFieldMappings(newMappings);
  };

  const handleAddMapping = () => {
    setFieldMappings([..._fieldMappings, { sourceField: '', targetField: '', confidence: 0 }]);
  };

  const handleContinueToPreview = () => {
    setStep('preview');
  };

  const handleRemoveMapping = (index: number) => {
    setFieldMappings(_fieldMappings.filter((_, i) => i !== index));
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

  const stepsOrder = ['input', 'mapping', 'preview', 'success'];
  const currentStepIndex = stepsOrder.indexOf(step);

  const getStepStatus = (stepId: StepType) => {
    const stepIndex = stepsOrder.indexOf(stepId);
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  const _getStepInfo = (stepId: StepType) => {
    const stepInfos = {
      input: { title: 'Upload Docket', description: 'Paste text or upload file', icon: FileText },
      mapping: { title: 'Map Fields', description: 'Review extracted data', icon: Layout },
      preview: { title: 'Preview', description: 'Confirm details', icon: Eye },
      success: { title: 'Complete', description: 'Case created', icon: Flag }
    };
    return stepInfos[stepId];
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <PageHeader
        title="Import from PACER"
        subtitle="Create a new case from PACER docket text or file"
        actions={
          <Button variant="secondary" icon={ArrowLeft} onClick={onBack}>
            Cancel Import
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Step 1: Upload Docket */}
          <div className={`bg-white rounded-xl border transition-all duration-300 ${step === 'input' ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-sm'}`}>
            <StepHeader
              stepId="input"
              stepNumber={1}
              title="Upload Docket"
              description="Paste text or upload file"
              status={getStepStatus('input')}
              icon={FileText}
              onClick={() => getStepStatus('input') === 'completed' && setStep('input')}
            />

            {step === 'input' && (
              <div className="p-6 pt-0 border-t border-slate-100">
                <div className="h-4"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      PACER Docket Text
                    </label>

                    {/* Drag and Drop Zone */}
                    <FileUploadZone
                      acceptedTypes={['text/plain', 'text/html', 'application/pdf']}
                      placeholder="Drag and drop a PACER file here, or browse to upload"
                      supportedFormats="Supports .txt, .html files (PDF coming soon)"
                      onFileSelect={_handleFileUpload}
                      className="mb-4"
                    />

                    {/* Text Area */}
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Or paste docket text directly:
                      </label>
                      <textarea
                        value={docketText}
                        onChange={(e) => setDocketText(e.target.value)}
                        placeholder="Paste complete PACER docket text here... Example: Court of Appeals Docket #: 25-1229..."
                        className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Include the complete docket information including case details, parties, counsel, and docket entries
                    </p>
                  </div>

                    {error && (
                      <ErrorAlert
                        title="Error"
                        message={error}
                        className="mb-4"
                      />
                    )}                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleParse}
                      disabled={parsing || !docketText.trim()}
                      isLoading={parsing}
                      variant="primary"
                    >
                      {parsing ? 'Parsing...' : 'Parse Docket'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Map Fields */}
          <div className={`bg-white rounded-xl border transition-all duration-300 ${step === 'mapping' ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-sm'}`}>
            <StepHeader
              stepId="mapping"
              stepNumber={2}
              title="Map Fields"
              description="Review extracted data"
              status={getStepStatus('mapping')}
              icon={Layout}
              onClick={() => getStepStatus('mapping') === 'completed' && setStep('mapping')}
            />

            {step === 'mapping' && parsedData && (
              <div className="p-6 pt-0 border-t border-slate-100">
                <div className="h-4"></div>
                <div className="space-y-6">
                  {/* Data Mapping */}
                  <DataMappingSection
                    mappings={_fieldMappings}
                    onMappingChange={handleMappingChange}
                    onAddMapping={handleAddMapping}
                    onRemoveMapping={handleRemoveMapping}
                    availableSourceFields={['docketNumber', 'title', 'court', 'filingDate', 'presidingJudge', 'natureOfSuit', 'jurisdiction', 'caseType', 'status']}
                    availableTargetFields={['caseNumber', 'caseName', 'court', 'filedDate', 'judge', 'natureOfSuit', 'jurisdiction', 'caseType', 'status']}
                  />

                  {error && (
                    <ErrorAlert
                      title="Mapping Error"
                      message={error}
                      className="mb-4"
                    />
                  )}

                  <div className="flex justify-end pt-4 gap-3">
                    <Button variant="outline" onClick={() => setStep('input')}>
                      Back
                    </Button>
                    <Button onClick={handleContinueToPreview} variant="primary">
                      Continue to Preview
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Preview */}
          <div className={`bg-white rounded-xl border transition-all duration-300 ${step === 'preview' ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-sm'}`}>
            <StepHeader
              stepId="preview"
              stepNumber={3}
              title="Preview"
              description="Confirm details"
              status={getStepStatus('preview')}
              icon={Eye}
              onClick={() => getStepStatus('preview') === 'completed' && setStep('preview')}
            />

            {step === 'preview' && parsedData && (
              <div className="p-6 pt-0 border-t border-slate-100">
                <div className="h-4"></div>
                <div className="space-y-6">
                  {/* Success Message */}
                  <SuccessMessage
                    message="Review the extracted information below and click 'Import Case' to create"
                    className="mb-6"
                  />

                  {/* Case Info */}
                  <CaseInfoPreview
                    caseInfo={{
                      caseNumber: parsedData.caseInfo.docketNumber,
                      caseName: parsedData.caseInfo.title,
                      court: parsedData.caseInfo.court,
                      filedDate: parsedData.caseInfo.filingDate,
                      caseType: parsedData.caseInfo.caseType,
                      jurisdiction: parsedData.caseInfo.jurisdiction,
                      status: parsedData.caseInfo.status,
                      judge: parsedData.caseInfo.presidingJudge
                    }}
                    className="mb-6"
                  />

                  {/* Parties */}
                  <PartiesPreview
                    parties={parsedData.parties.map(party => ({
                      name: party.name,
                      type: party.type as 'individual' | 'organization',
                      role: party.role,
                      counsel: party.counsel?.map(c => ({
                        name: c.name,
                        firm: c.firm,
                        contact: c.email || c.phone
                      }))
                    }))}
                    className="mb-6"
                  />

                  {/* Docket Entries */}
                  <DocketEntriesPreview
                    entries={parsedData.docketEntries.map(entry => ({
                      date: entry.date,
                      description: entry.description,
                      documentNumber: entry.entryNumber.toString(),
                      type: undefined // Could be enhanced to detect entry types
                    }))}
                    className="mb-6"
                  />

                  {/* Consolidated Cases */}
                  {parsedData.consolidatedCases && parsedData.consolidatedCases.length > 0 && (
                    <ConsolidatedCasesPreview
                      cases={parsedData.consolidatedCases.map(cc => ({
                        caseNumber: cc.caseNumber,
                        caseName: cc.caseNumber, // Using case number as name since name isn't provided
                        court: parsedData.caseInfo.court,
                        status: 'Active', // Default status
                        relationship: cc.relationship
                      }))}
                      className="mb-6"
                    />
                  )}

                  {error && (
                    <ErrorAlert
                      title="Import Error"
                      message={error}
                      className="mb-4"
                    />
                  )}

                  <div className="flex justify-end pt-4 gap-3">
                    <Button variant="outline" onClick={() => setStep('mapping')}>
                      Back
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={importing}
                      isLoading={importing}
                      variant="primary"
                    >
                      {importing ? 'Importing...' : 'Import Case'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Complete */}
          <div className={`bg-white rounded-xl border transition-all duration-300 ${step === 'success' ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 shadow-sm'}`}>
            <StepHeader
              stepId="success"
              stepNumber={4}
              title="Complete"
              description="Case created"
              status={getStepStatus('success')}
              icon={Flag}
              onClick={() => getStepStatus('success') === 'completed' && setStep('success')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
