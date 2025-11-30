
import React from 'react';
import { FileText, Download, Eye, MoreVertical, Clock, CheckSquare, ShieldCheck, Tag } from 'lucide-react';
import { LegalDocument } from '../../types';
import { Badge } from '../common/Badge';
import { ensureTagsArray } from '../../utils/type-transformers';

interface DocumentTableProps {
  documents: LegalDocument[];
  selectedDocs: string[];
  toggleSelection: (id: string) => void;
  setSelectedDocs: (ids: string[]) => void;
  setSelectedDocForHistory: (doc: LegalDocument) => void;
  setTaggingDoc: (doc: LegalDocument) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ 
  documents, selectedDocs, toggleSelection, setSelectedDocs, setSelectedDocForHistory, setTaggingDoc 
}) => {
  return (
    <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
            <th className="w-10 px-6 py-3"><input type="checkbox" onChange={() => selectedDocs.length === documents.length ? setSelectedDocs([]) : setSelectedDocs(documents.map(d => d.id))} checked={selectedDocs.length === documents.length && documents.length > 0} /></th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Document Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Module Source</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Security</th>
            <th className="px-6 py-3 text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {documents.map((doc) => (
            <tr key={doc.id} className={`hover:bg-slate-50 cursor-pointer group ${selectedDocs.includes(doc.id) ? 'bg-blue-50/30' : ''}`} onClick={() => toggleSelection(doc.id)}>
                <td className="px-6 py-4"><input type="checkbox" checked={selectedDocs.includes(doc.id)} onChange={() => toggleSelection(doc.id)} onClick={(e) => e.stopPropagation()}/></td>
                <td className="px-6 py-4">
                <div className="flex items-center">
                    <FileText className={`h-8 w-8 p-1.5 rounded-lg mr-3 transition-colors ${doc.sourceModule === 'Evidence' ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-600'}`} />
                    <div>
                    <div className="text-sm font-medium text-slate-900 group-hover:text-blue-700">{doc.title}</div>
                    {/* Feature 4: Meta-tagging display & Edit */}
                    <div className="flex gap-1 mt-1 flex-wrap items-center">
                        {ensureTagsArray(doc.tags).map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">{t}</span>)}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setTaggingDoc(doc); }} 
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600" 
                            title="Manage Tags"
                        >
                            <Tag className="h-3 w-3"/>
                        </button>
                    </div>
                    </div>
                </div>
                </td>
                {/* Feature 5: Module Linking */}
                <td className="px-6 py-4">
                    <Badge variant={doc.sourceModule === 'Evidence' ? 'warning' : doc.sourceModule === 'Discovery' ? 'info' : 'neutral'}>
                        {doc.sourceModule}
                    </Badge>
                </td>
                {/* Feature 6: Status Indicators (OCR/Sign) */}
                <td className="px-6 py-4">
                        {doc.status === 'Signed' ? (
                            <span className="flex items-center text-xs text-green-700 font-medium"><CheckSquare className="h-3 w-3 mr-1"/> e-Signed</span>
                        ) : doc.status === 'Draft' ? (
                        <span className="flex items-center text-xs text-slate-500"><Clock className="h-3 w-3 mr-1"/> Draft</span>
                        ) : (
                        <span className="flex items-center text-xs text-blue-600">Final</span>
                        )}
                </td>
                {/* Feature 7: Security Status */}
                <td className="px-6 py-4">
                    {doc.isEncrypted && <div className="flex items-center text-xs text-slate-500" title="AES-256 Encrypted"><ShieldCheck className="h-3 w-3 mr-1 text-green-500"/> Secure</div>}
                </td>
                <td className="px-6 py-4 text-right">
                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600"><Download className="h-4 w-4"/></button>
                    <button onClick={() => setSelectedDocForHistory(doc)} className="p-1.5 text-slate-400 hover:text-blue-600" title="View History"><Eye className="h-4 w-4"/></button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600"><MoreVertical className="h-4 w-4"/></button>
                </div>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
};
