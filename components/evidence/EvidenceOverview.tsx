
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { EvidenceTypeIcon } from '../common/EvidenceTypeIcon';
import { EvidenceItem } from '../../types';
import { GeminiService } from '../../services/geminiService';
import { User, Activity, MapPin, Link, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface EvidenceOverviewProps {
  selectedItem: EvidenceItem;
}

export const EvidenceOverview: React.FC<EvidenceOverviewProps> = ({ selectedItem }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await GeminiService.analyzeDocument(selectedItem.description);
    setAiSummary(result.summary);
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2" title="Evidence Particulars">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase">Description</label>
              <button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="text-xs flex items-center text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
              >
                {isAnalyzing ? <span className="animate-spin mr-1">⏳</span> : <Sparkles className="h-3 w-3 mr-1"/>}
                AI Analyze
              </button>
            </div>
            <p className="text-slate-900 bg-slate-50 p-4 rounded-md border border-slate-200 leading-relaxed text-sm">
              {selectedItem.description}
            </p>
            {aiSummary && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-md animate-fade-in">
                <h5 className="text-xs font-bold text-purple-700 mb-1 flex items-center"><Sparkles className="h-3 w-3 mr-1"/> AI Summary</h5>
                <p className="text-sm text-slate-700">{aiSummary}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Item Type</label>
              <div className="flex items-center text-sm font-medium text-slate-900">
                <EvidenceTypeIcon type={selectedItem.type} className="h-5 w-5 mr-2"/> {selectedItem.type}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Current Status</label>
              <Badge variant="info">Secure Storage</Badge>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Original Custodian</label>
              <div className="flex items-center text-sm text-slate-900">
                <User className="h-4 w-4 mr-2 text-slate-400"/> {selectedItem.custodian}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Collection Date</label>
              <div className="text-sm text-slate-900">{selectedItem.collectionDate}</div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Blockchain Verification</label>
              <div className="flex items-center p-3 bg-slate-800 rounded-md text-white font-mono text-xs">
                <Link className="h-4 w-4 text-green-400 mr-3 shrink-0"/>
                <span className="truncate">{selectedItem.blockchainHash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Immutable record anchored on-chain. Last verified: 2 mins ago.</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Tags & Metadata</label>
            <div className="flex flex-wrap gap-2">
              {selectedItem.tags.map(t => (
                <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200 flex items-center">
                  <Activity className="h-3 w-3 mr-1 opacity-50"/> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card title="Current Location">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-blue-600"/>
            </div>
            <h3 className="font-bold text-slate-900">{selectedItem.location}</h3>
            <p className="text-xs text-slate-500 mt-1">Last Verified: Today, 09:00 AM</p>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-4">
            <Button variant="outline" size="sm" className="w-full">Request Transfer</Button>
          </div>
        </Card>

        <Card title="FRCP 26(a) Status">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2"/>
            <span className="text-sm font-medium">Disclosed to Opposing Counsel</span>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
            Included in Initial Disclosures Packet v2 sent on 2024-02-01. Bates Range: 00145-00152.
          </div>
        </Card>
      </div>
    </div>
  );
};
import { CheckCircle } from 'lucide-react';
