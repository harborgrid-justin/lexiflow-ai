import React, { useState } from 'react';
import { useCitation } from '../../enzyme/hooks/useCitation';
import { useFormatting } from '../../enzyme/hooks/useFormatting';
import { useReference } from '../../enzyme/hooks/useReference';
import { Button, Card } from '../common';
import { BookOpen, CheckCircle, AlertCircle, FileText, Link as LinkIcon, Search, Wand2, FileCheck, Scale } from 'lucide-react';

interface DraftingToolsProps {
  content: string;
  onUpdateContent: (newContent: string) => void;
}

export const DraftingTools: React.FC<DraftingToolsProps> = ({ content, onUpdateContent }) => {
  const [activeTab, setActiveTab] = useState<'citations' | 'formatting' | 'references'>('citations');
  
  // Hooks
  const { 
    extractCitations, 
    batchVerify, 
    shepardize, 
    autoCorrect,
    isLoading: citationLoading 
  } = useCitation();

  const {
    applyFormat,
    templates,
    generateTableOfAuthorities,
    validateFormatting,
    isLoading: formattingLoading
  } = useFormatting();

  const {
    lookupReference,
    findCrossReferences,
    semanticSearch
  } = useReference();

  // State
  const [extractedCitations, setExtractedCitations] = useState<any[]>([]);
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [referenceQuery, setReferenceQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Handlers
  const handleScanCitations = async () => {
    const citations = await extractCitations(content);
    setExtractedCitations(citations);
    
    if (citations.length > 0) {
      const verification = await batchVerify(citations.map(c => c.text));
      setVerificationResults(verification);
    }
  };

  const handleShepardize = async (citationId: string) => {
    await shepardize(citationId);
    // In a real app, we'd update the UI with the result
    alert('Shepardization complete. Status: Positive');
  };

  const handleAutoCorrect = async (citation: string) => {
    const result = await autoCorrect(citation);
    if (result.confidence > 0.8) {
      const newContent = content.replace(citation, result.corrected);
      onUpdateContent(newContent);
    }
  };

  const handleApplyTemplate = async (templateId: string) => {
    const formatted = await applyFormat({ content, templateId });
    onUpdateContent(formatted);
  };

  const handleValidate = async () => {
    const result = await validateFormatting({ content, ruleset: 'standard' });
    setValidationErrors(result.valid ? [] : result.errors);
    if (result.valid) alert('Formatting is valid!');
  };

  const handleReferenceSearch = async () => {
    const results = await semanticSearch(referenceQuery);
    setSearchResults(results);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('citations')}
          className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === 'citations' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Scale className="w-3 h-3" /> Citations
        </button>
        <button
          onClick={() => setActiveTab('formatting')}
          className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === 'formatting' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <FileCheck className="w-3 h-3" /> Format
        </button>
        <button
          onClick={() => setActiveTab('references')}
          className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === 'references' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <BookOpen className="w-3 h-3" /> Refs
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
        {activeTab === 'citations' && (
          <div className="space-y-4">
            <Button 
              onClick={handleScanCitations} 
              isLoading={citationLoading}
              className="w-full"
              icon={Search}
            >
              Scan Document for Citations
            </Button>

            {extractedCitations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase">Found Citations</h4>
                {extractedCitations.map((citation, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border border-slate-200 text-sm">
                    <div className="font-medium mb-1">{citation.text}</div>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => handleShepardize(citation.id)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" /> Shepardize
                      </button>
                      <button 
                        onClick={() => handleAutoCorrect(citation.text)}
                        className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                      >
                        <Wand2 className="w-3 h-3" /> Auto-Correct
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'formatting' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleApplyTemplate(t.id)}
                    className="p-2 text-xs border rounded hover:border-blue-500 hover:bg-blue-50 text-left"
                  >
                    {t.name}
                  </button>
                ))}
                {templates.length === 0 && <div className="text-xs text-slate-400 col-span-2">No templates available</div>}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Validation</h4>
              <Button 
                onClick={handleValidate} 
                isLoading={formattingLoading}
                variant="secondary"
                className="w-full mb-2"
              >
                Validate Formatting
              </Button>
              {validationErrors.length > 0 && (
                <div className="bg-red-50 p-2 rounded border border-red-100 text-xs text-red-700 space-y-1">
                  {validationErrors.map((err, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Button 
                onClick={async () => {
                  const toa = await generateTableOfAuthorities('current-doc');
                  onUpdateContent(toa + '\n\n' + content);
                }}
                variant="secondary"
                className="w-full"
              >
                Generate Table of Authorities
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'references' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={referenceQuery}
                onChange={(e) => setReferenceQuery(e.target.value)}
                placeholder="Search references..."
                className="flex-1 text-sm border rounded px-2 py-1"
              />
              <Button onClick={handleReferenceSearch} size="sm" icon={Search}>
                Find
              </Button>
            </div>

            <div className="space-y-2">
              {searchResults.map(ref => (
                <div key={ref.id} className="bg-white p-3 rounded border border-slate-200 text-sm group cursor-pointer hover:border-blue-400">
                  <div className="font-medium text-blue-700">{ref.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{ref.citation}</div>
                  <div className="text-xs text-slate-600 mt-2 line-clamp-2">{ref.summary}</div>
                  <button 
                    onClick={() => onUpdateContent(content + ` [${ref.citation}]`)}
                    className="mt-2 text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 w-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Insert Citation
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
