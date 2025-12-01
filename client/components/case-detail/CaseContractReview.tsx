
import React, { useState } from 'react';
import { ShieldAlert, Upload, FileText, Cpu, AlertTriangle } from 'lucide-react';
import { OpenAIService } from '../../services/openAIService';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TextArea } from '../common/Inputs';
import { EmptyState } from '../common/EmptyState';

export const CaseContractReview: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const analysis = await OpenAIService.reviewContract(text);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <div className="flex-1 overflow-hidden pr-2">
        <div className="h-full flex flex-col md:flex-row gap-6">
          <Card className="flex-1 flex flex-col overflow-hidden" noPadding>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" /> Contract Text
              </h3>
              <Button variant="ghost" size="sm" icon={Upload}>
                Import Doc
              </Button>
            </div>
            <textarea 
              className="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed"
              placeholder="Paste contract text here for analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <Button 
                onClick={handleReview}
                disabled={loading || !text}
                variant="primary"
                icon={loading ? Cpu : ShieldAlert}
                isLoading={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Analyze Risks & Suggest Edits
              </Button>
            </div>
          </Card>

          <Card className="flex-1 flex flex-col overflow-hidden" noPadding>
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
                <EmptyState 
                  icon={ShieldAlert}
                  message="Enter contract text to generate a risk profile."
                />
              )}
            </div>
          </Card>
    </div>
      </div>
    </div>
  );
};
