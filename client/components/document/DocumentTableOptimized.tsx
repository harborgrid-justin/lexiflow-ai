import React, { memo } from 'react';
import { LegalDocument } from '../../types';
import { isSlowConnection } from '@missionfabric-js/enzyme/hooks';

interface DocumentTableOptimizedProps {
  documents: LegalDocument[];
  selectedDocs: string[];
  onToggleSelection: (id: string) => void;
  onViewHistory: (doc: LegalDocument) => void;
  onTagDoc: (doc: LegalDocument) => void;
}

// ✅ ENZYME: Network-aware document rendering
export const DocumentTableOptimized: React.FC<DocumentTableOptimizedProps> = memo(({
  documents,
  selectedDocs,
  onToggleSelection,
  onViewHistory,
  onTagDoc
}) => {
  const isSlow = isSlowConnection();
  
  // On slow connections, show simplified view
  const itemsToShow = isSlow ? 50 : documents.length;
  const visibleDocs = documents.slice(0, itemsToShow);

  return (
    <div className="space-y-2">
      {isSlow && documents.length > 50 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          📶 Slow connection detected - showing first 50 documents. 
          Remaining {documents.length - 50} documents available on faster connection.
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-slate-600 uppercase">Select</th>
              <th className="text-left p-3 text-xs font-semibold text-slate-600 uppercase">Title</th>
              <th className="text-left p-3 text-xs font-semibold text-slate-600 uppercase">Type</th>
              <th className="text-left p-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th className="text-left p-3 text-xs font-semibold text-slate-600 uppercase">Tags</th>
              <th className="text-left p-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleDocs.map(doc => (
              <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => onToggleSelection(doc.id)}
                    className="rounded border-slate-300"
                  />
                </td>
                <td className="p-3">
                  <div className="font-medium text-slate-900">{doc.title}</div>
                  <div className="text-xs text-slate-500">{doc.uploadDate}</div>
                </td>
                <td className="p-3 text-sm text-slate-600">{doc.type}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'Signed' ? 'bg-green-100 text-green-700' :
                    doc.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="p-3">
                  {!isSlow && (
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(doc.tags) ? doc.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                          {tag}
                        </span>
                      )) : null}
                      {Array.isArray(doc.tags) && doc.tags.length > 2 && (
                        <span className="text-xs text-slate-400">+{doc.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewHistory(doc)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      History
                    </button>
                    <button
                      onClick={() => onTagDoc(doc)}
                      className="text-xs text-slate-600 hover:text-slate-800"
                    >
                      Tags
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

DocumentTableOptimized.displayName = 'DocumentTableOptimized';
