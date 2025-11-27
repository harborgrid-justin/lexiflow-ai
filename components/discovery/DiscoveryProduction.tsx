
import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Check, Settings, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { DiscoveryRequest } from '../../types';
import { DocumentService } from '../../services/documentService';

interface DiscoveryProductionProps {
  request: DiscoveryRequest | null;
  onBack: () => void;
}

export const DiscoveryProduction: React.FC<DiscoveryProductionProps> = ({ request, onBack }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [batesStart, setBatesStart] = useState('PROD-00100');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setUploading(true);
          const files = Array.from(e.target.files);
          for (const file of files) {
              await DocumentService.processFile(file); // Simulate processing
              setUploadedFiles(prev => [...prev, file.name]);
          }
          setUploading(false);
      }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 animate-fade-in">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center">
                <button onClick={onBack} className="mr-3 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="h-5 w-5"/>
                </button>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Production Staging Area</h2>
                    <p className="text-xs text-slate-500">{request ? `Responding to: ${request.title}` : 'General Production Volume'}</p>
                </div>
            </div>
            <Button size="sm" variant="primary" onClick={() => { alert('Production finalized.'); onBack(); }}>Finalize & Produce</Button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Configuration */}
            <div className="w-full md:w-80 border-r border-slate-200 p-6 bg-slate-50/50 space-y-6">
                <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center mb-3"><Settings className="h-4 w-4 mr-2"/> Production Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Bates Numbering Start</label>
                            <input className="w-full p-2 border rounded text-sm font-mono" value={batesStart} onChange={e => setBatesStart(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Format</label>
                            <select className="w-full p-2 border rounded text-sm">
                                <option>PDF + Text + Load File</option>
                                <option>Native Only</option>
                                <option>TIFF (Single Page)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Confidentiality Stamp</label>
                            <select className="w-full p-2 border rounded text-sm">
                                <option>None</option>
                                <option>CONFIDENTIAL</option>
                                <option>ATTORNEY EYES ONLY</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-xs flex items-start">
                    <ShieldCheck className="h-4 w-4 mr-2 shrink-0"/>
                    <p>Privilege filter active. Documents tagged 'Privileged' will be auto-flagged for withheld log.</p>
                </div>
            </div>

            {/* Upload Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center hover:bg-slate-50 cursor-pointer transition-colors relative">
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload}/>
                        {uploading ? (
                             <div className="text-blue-600 font-medium animate-pulse">Processing & Bates Stamping...</div>
                        ) : (
                            <div>
                                <Upload className="h-10 w-10 mx-auto text-slate-400 mb-3"/>
                                <span className="text-lg text-slate-700 font-medium block">Drag & Drop Documents</span>
                                <span className="text-sm text-slate-500">or click to browse responsive files</span>
                            </div>
                        )}
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b pb-2">Staged Documents ({uploadedFiles.length})</h4>
                            <div className="space-y-2">
                                {uploadedFiles.map((f, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm p-3 bg-white shadow-sm border border-slate-200 rounded hover:border-blue-300 transition-colors">
                                        <span className="flex items-center font-medium text-slate-700"><FileText className="h-4 w-4 mr-3 text-blue-500"/> {f}</span>
                                        <div className="flex items-center text-xs text-slate-400">
                                            <span className="mr-3 font-mono bg-slate-100 px-1 rounded">Bates: PROD-{100 + idx}</span>
                                            <Check className="h-4 w-4 text-green-500"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
