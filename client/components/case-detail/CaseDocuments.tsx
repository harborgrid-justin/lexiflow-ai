
import React, { useState } from 'react';
import { LegalDocument, User } from '../../types';
import { FileText, Cpu, Sparkles, Bot, Plus, Wand2, Eye } from 'lucide-react';
import { DocumentAssembly } from '../DocumentAssembly';

interface CaseDocumentsProps {
  documents: LegalDocument[];
  analyzingId: string | null;
  onAnalyze: (doc: LegalDocument) => void;
  onDocumentCreated?: (doc: LegalDocument) => void;
  currentUser?: User;
}

export const CaseDocuments: React.FC<CaseDocumentsProps> = ({ documents, analyzingId, onAnalyze, onDocumentCreated, currentUser }) => {
  const [showWizard, setShowWizard] = useState(false);

  const handleUpload = () => {
    // Mock upload functionality for demo purposes
    if (onDocumentCreated) {
        const newDoc: LegalDocument = {
            id: `doc-${Date.now()}`,
            caseId: 'current',
            title: `Uploaded Document ${documents.length + 1}`,
            type: 'Upload',
            content: 'This is a mock content for the uploaded document. It contains standard legal definitions and clauses pertinent to the case at hand. The document outlines the obligations of both parties and sets forth the terms of agreement.',
            uploadDate: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            tags: ['Uploaded', 'Review Required'],
            versions: [],
            uploadedBy: currentUser?.id
        };
        onDocumentCreated(newDoc);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative animate-fade-in pb-2">
      {showWizard && (
        <DocumentAssembly 
          caseTitle="Current Case" 
          onClose={() => setShowWizard(false)} 
          onSave={(doc) => {
             if (onDocumentCreated) onDocumentCreated({ ...doc, uploadedBy: currentUser?.id });
          }}
        />
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div className="flex gap-2 w-full md:w-auto">
          <input placeholder="Search documents..." className="px-4 py-2 border rounded-md text-sm w-full md:w-64" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => setShowWizard(true)} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            <Wand2 className="h-4 w-4 mr-2" /> Assemble Doc
          </button>
          <button onClick={handleUpload} className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" /> Upload
          </button>
        </div>
      </div>

      <div className="grid gap-4 flex-1 overflow-y-auto content-start pr-2">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 animate-fade-in-up">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4">
                <div className="bg-red-50 p-3 rounded-lg"><FileText className="h-6 w-6 text-red-600" /></div>
                <div>
                  <h4 className="font-semibold text-slate-900">{doc.title}</h4>
                  <div className="text-xs text-slate-500 mt-1">{doc.type} • {doc.uploadDate} • v{doc.versions.length}</div>
                </div>
              </div>
              <button onClick={() => onAnalyze(doc)} disabled={analyzingId === doc.id} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium border border-indigo-100 flex items-center">
                {analyzingId === doc.id ? <Cpu className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4"/>} <span className="ml-2">Analyze</span>
              </button>
            </div>
            
            {doc.content && (
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-3 w-3 text-slate-400"/>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Content Preview</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-600 font-serif italic line-clamp-3">
                        "{doc.content.length > 250 ? doc.content.substring(0, 250) + '...' : doc.content}"
                    </div>
                </div>
            )}

            {doc.summary && (
              <div className="bg-indigo-50/50 rounded p-4 border border-indigo-100 mt-4 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l"></div>
                <div className="flex justify-between mb-2"><h5 className="text-sm font-bold text-indigo-900 flex items-center"><Bot className="h-4 w-4 mr-2"/> Summary</h5></div>
                <p className="text-sm text-slate-700">{doc.summary}</p>
              </div>
            )}
            <div className="flex gap-2 mt-3">
                {doc.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
