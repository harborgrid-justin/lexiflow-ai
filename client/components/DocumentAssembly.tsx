
import React from 'react';
import { X, FileText, ChevronRight, Check, Save } from 'lucide-react';
import { LegalDocument } from '../types';
import { useDocumentAssembly } from '../hooks/useDocumentAssembly';

interface DocumentAssemblyProps {
  onClose: () => void;
  caseTitle: string;
  onSave?: (doc: LegalDocument) => void;
}

export const DocumentAssembly: React.FC<DocumentAssemblyProps> = ({ onClose, caseTitle, onSave }) => {
  const {
    step,
    setStep,
    template,
    setTemplate,
    formData,
    setFormData,
    result,
    loading,
    generate,
    handleSave
  } = useDocumentAssembly(caseTitle, onSave, onClose);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" /> Document Assembly Wizard
          </h3>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold">Select a Template</h4>
              {['NDA', 'Engagement Letter', 'Motion to Dismiss', 'Settlement Agreement'].map(t => (
                <button key={t} onClick={() => { setTemplate(t); setStep(2); }} 
                  className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center group">
                  <span className="font-medium text-slate-700 group-hover:text-blue-700">{t}</span>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold">Configure {template}</h4>
              <input placeholder="Recipient Name" className="w-full p-3 border rounded-md" 
                value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})} />
              <input placeholder="Key Terms / Main Point" className="w-full p-3 border rounded-md" 
                value={formData.mainPoint} onChange={e => setFormData({...formData, mainPoint: e.target.value})} />
              <button onClick={generate} disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex justify-center">
                {loading ? 'Generating...' : 'Generate Document'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 h-full flex flex-col">
              <h4 className="text-base font-semibold flex items-center text-green-600"><Check className="h-4 w-4 mr-2"/> Draft Generated</h4>
              <textarea className="flex-1 w-full p-4 bg-slate-50 border rounded-md font-mono text-sm min-h-[300px]" value={result} readOnly />
              <button onClick={handleSave} className="w-full py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 flex justify-center items-center">
                 <Save className="h-4 w-4 mr-2"/> Save to Case Documents
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
