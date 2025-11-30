
import React, { useState, useEffect, useMemo } from 'react';
import { PenTool, Cpu, Book, AlertTriangle, Check, Wand2, Search, History } from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { Clause } from '../../types';
import { AdvancedEditor } from '../AdvancedEditor';
import { ApiService } from '../../services/apiService';
import { ClauseHistoryModal } from '../ClauseHistoryModal';

interface CaseDraftingProps {
  caseId: string;
  caseTitle: string;
  draftPrompt: string;
  setDraftPrompt: (s: string) => void;
  draftResult: string;
  isDrafting: boolean;
  onDraft: () => void;
}

export const CaseDrafting: React.FC<CaseDraftingProps> = ({ 
  caseId,
  caseTitle,
  draftPrompt,
  setDraftPrompt,
  draftResult,
  isDrafting,
  onDraft
}) => {
  const [content, setContent] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [activeMode, setActiveMode] = useState<'edit' | 'review' | 'clauses'>('edit');
  const [loading, setLoading] = useState(false);
  const [clauses, setClauses] = useState<Clause[]>([]);
  
  // Clause Library State
  const [clauseSearch, setClauseSearch] = useState('');
  const [selectedClauseHistory, setSelectedClauseHistory] = useState<Clause | null>(null);

  useEffect(() => {
    const fetchClauses = async () => {
        try {
            const data = await ApiService.getClauses();
            setClauses(data);
        } catch (e) {
            console.error("Failed to fetch clauses", e);
        }
    };
    fetchClauses();
  }, []);

  useEffect(() => {
    if (draftResult) {
      setContent(prev => prev + `<p>${draftResult.replace(/\n/g, '<br/>')}</p>`);
    }
  }, [draftResult]);

  const filteredClauses = useMemo(() => {
    return clauses.filter(c => 
      c.name.toLowerCase().includes(clauseSearch.toLowerCase()) || 
      c.content.toLowerCase().includes(clauseSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(clauseSearch.toLowerCase())
    );
  }, [clauseSearch, clauses]);

  const handleReview = async () => {
    if(!content) return;
    setLoading(true);
    setActiveMode('review');
    const plainText = content.replace(/<[^>]*>?/gm, '');
    const res = await GeminiService.reviewContract(plainText);
    setReviewResult(res);
    setLoading(false);
  };

  const insertClause = (c: Clause) => {
    const clauseHtml = `<p><strong>[${c.name}]:</strong> ${c.content}</p>`;
    setContent(prev => prev + clauseHtml);
  };

  const handleSaveDocument = async (newHtml: string) => {
    setContent(newHtml);
    try {
      await ApiService.createDocument({
        caseId,
        title: `Draft - ${new Date().toLocaleString()}`,
        type: 'Draft',
        status: 'Draft',
        uploadDate: new Date().toISOString(),
        summary: 'Drafted in Case Drafting module',
        riskScore: 0,
        lastModified: new Date().toISOString(),
        sourceModule: 'Drafting',
        isEncrypted: false,
        sharedWithClient: false,
        fileSize: '0 KB' // Placeholder
      });
      alert('Document saved to case file.');
    } catch (error) {
      console.error("Failed to save document", error);
      alert("Failed to save document.");
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <div className="flex-1 overflow-hidden pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
          {selectedClauseHistory && (
            <ClauseHistoryModal clause={selectedClauseHistory} onClose={() => setSelectedClauseHistory(null)} />
          )}

          <div className="lg:col-span-2 flex flex-col h-full space-y-4">
        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex gap-2 items-center">
             <div className="bg-purple-100 p-2 rounded-md"><Wand2 className="h-5 w-5 text-purple-600"/></div>
             <input 
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onDraft()}
                placeholder="Describe a clause or section to draft (e.g. 'Force Majeure for a pandemic')..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
            />
            <button 
                onClick={onDraft} 
                disabled={isDrafting || !draftPrompt} 
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
                {isDrafting ? 'Generating...' : 'Generate Draft'}
            </button>
        </div>

        <div className="flex-1 min-h-0">
          <AdvancedEditor 
            key={content.length} 
            initialContent={content} 
            onSave={handleSaveDocument}
            placeholder="Begin drafting your legal document here..." 
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveMode('edit')} 
            className={`flex-1 py-3 text-sm font-medium ${activeMode !== 'review' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Clause Library
          </button>
          <button 
            onClick={() => setActiveMode('review')} 
            className={`flex-1 py-3 text-sm font-medium ${activeMode === 'review' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Risk Analysis
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/30 flex flex-col">
          {activeMode === 'review' ? (
             <div className="p-4 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800 flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 shrink-0 mt-0.5"/>
                    <p>AI Analysis detects potential risks. Review suggestions carefully.</p>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Cpu className="h-8 w-8 animate-spin mb-2"/>
                        <span className="text-xs">Analyzing contract structure...</span>
                    </div>
                ) : (
                    <div className="prose prose-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {reviewResult || (
                            <div className="text-center py-8 text-slate-400 italic">
                                Click "Review Risks" to analyze the current document content.
                                <button onClick={handleReview} className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded shadow-sm text-slate-700 block mx-auto hover:bg-slate-50">Run Analysis</button>
                            </div>
                        )}
                    </div>
                )}
             </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Search Bar */}
              <div className="p-3 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                    <input 
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Search clauses..."
                        value={clauseSearch}
                        onChange={(e) => setClauseSearch(e.target.value)}
                    />
                </div>
              </div>

              {/* Clause List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div className="flex justify-between items-center mb-2 px-1">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Available ({filteredClauses.length})</p>
                </div>
                
                {filteredClauses.map(c => (
                  <div 
                      key={c.id} 
                      className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-1">
                        <div className="cursor-pointer flex-1" onClick={() => insertClause(c)}>
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                <Book className="h-3 w-3 text-slate-400"/> {c.name}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 mt-1.5 inline-block">{c.category}</span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedClauseHistory(c); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="View Version History"
                        >
                            <History className="h-3.5 w-3.5"/>
                        </button>
                    </div>
                    <div className="cursor-pointer" onClick={() => insertClause(c)}>
                        <p className="text-xs text-slate-500 line-clamp-3 italic font-serif mt-1 leading-relaxed border-l-2 border-slate-100 pl-2">
                            "{c.content}"
                        </p>
                        <div className="mt-2 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end">
                            <Check className="h-3 w-3 mr-1"/> Insert Clause
                        </div>
                    </div>
                  </div>
                ))}
                
                {filteredClauses.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        <p className="text-xs">No clauses found matching "{clauseSearch}"</p>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};
