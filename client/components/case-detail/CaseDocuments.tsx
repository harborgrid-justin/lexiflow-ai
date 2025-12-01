
import React, { useState } from 'react';
import { LegalDocument, User } from '../../types';
import { FileText, Cpu, Sparkles, Bot, Plus, Wand2, Eye, ExternalLink, Scale } from 'lucide-react';
import { DocumentAssembly } from '../DocumentAssembly';
import { ensureTagsArray } from '../../utils/type-transformers';
import { Button } from '../common/Button';
import { Input } from '../common/Inputs';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

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
      
      <Card className="flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div className="flex gap-2 w-full md:w-auto">
          <Input placeholder="Search documents..." className="w-full md:w-64" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={() => setShowWizard(true)} variant="primary" icon={Wand2} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700">
            Assemble Doc
          </Button>
          <Button onClick={handleUpload} variant="primary" icon={Plus} className="flex-1 md:flex-none">
            Upload
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 flex-1 overflow-y-auto content-start pr-2">
        {documents.map((doc) => (
          <Card key={doc.id} className="animate-fade-in-up">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4">
                <div className="bg-red-50 p-3 rounded-lg"><FileText className="h-6 w-6 text-red-600" /></div>
                <div>
                  <h4 className="font-semibold text-slate-900">{doc.title}</h4>
                  <div className="text-xs text-slate-500 mt-1">{doc.type} • {doc.uploadDate} • v{(doc.versions || []).length}</div>
                  {doc.docketEntryId && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-cyan-600">
                      <Scale className="h-3 w-3" />
                      <span>Linked to Docket Entry</span>
                      {doc.pacerDocLink && (
                        <a href={doc.pacerDocLink} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline ml-1">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Button 
                onClick={() => onAnalyze(doc)} 
                disabled={analyzingId === doc.id}
                variant="ghost"
                icon={analyzingId === doc.id ? Cpu : Sparkles}
                size="sm"
                className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
              >
                Analyze
              </Button>
            </div>
            
            {doc.content && (
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-3 w-3 text-slate-400"/>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Content Preview</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-600 font-serif italic line-clamp-3">
                        "{(doc.content || '').length > 250 ? (doc.content || '').substring(0, 250) + '...' : doc.content}"
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
                {ensureTagsArray(doc.tags).map(t => <Badge key={t} variant="secondary" size="sm">{t}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
