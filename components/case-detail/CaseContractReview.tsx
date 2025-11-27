
import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Upload, FileText, Cpu, AlertTriangle } from 'lucide-react';
import { GeminiService } from '../../services/geminiService';

export const CaseContractReview: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const analysis = await GeminiService.reviewContract(text);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" /> Contract Text
          </h3>
          <button className="text-xs flex items-center text-slate-500 hover:text-blue-600">
            <Upload className="h-3 w-3 mr-1" /> Import Doc
          </button>
        </div>
        <textarea 
          className="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed"
          placeholder="Paste contract text here for analysis..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button 
            onClick={handleReview}
            disabled={loading || !text}
            className="w-full py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Cpu className="h-4 w-4 animate-spin mr-2" /> : <ShieldAlert className="h-4 w-4 mr-2" />}
            Analyze Risks & Suggest Edits
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" /> AI Risk Analysis
          </h3>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {result ? (
            <div className="prose prose-sm prose-indigo max-w-none">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Gemini has identified potential risks in this contract. Please review the redlines below.
                    </p>
                  </div>
                </div>
              </div>
              <div className="whitespace-pre-wrap font-sans text-slate-700">{result}</div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShieldAlert className="h-12 w-12 mb-3 opacity-20" />
              <p>Enter contract text to generate a risk profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
