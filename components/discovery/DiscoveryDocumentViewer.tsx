
import React from 'react';
import { ArrowLeft, Printer, Download, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { MOCK_DISCOVERY_DOCS } from '../../data/mockDiscovery';

interface DiscoveryDocumentViewerProps {
  docId: string;
  onBack: () => void;
}

export const DiscoveryDocumentViewer: React.FC<DiscoveryDocumentViewerProps> = ({ docId, onBack }) => {
  // @ts-ignore
  const doc = MOCK_DISCOVERY_DOCS[docId];

  if (!doc) return <div className="p-8 text-center text-slate-500">Document not found.</div>;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 animate-fade-in">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div className="flex items-center">
                <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="h-5 w-5"/>
                </button>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600"/>
                        {doc.title}
                    </h2>
                    <p className="text-xs text-slate-500">Filed: {doc.date} • {doc.type}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="ghost" icon={Printer}>Print</Button>
                <Button size="sm" variant="outline" icon={Download}>Download</Button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
            <div className="max-w-3xl mx-auto bg-white shadow-lg min-h-[800px] p-12 border border-slate-200">
                <pre className="whitespace-pre-wrap font-serif text-slate-900 text-sm leading-relaxed">
                    {doc.content}
                </pre>
            </div>
        </div>
    </div>
  );
};
