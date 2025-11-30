
import React from 'react';
import { Briefcase, Users, Calendar, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface ParsedDocketPreviewProps {
  parsedData: any;
  setStep: (step: number) => void;
  handleFinish: () => void;
}

export const ParsedDocketPreview: React.FC<ParsedDocketPreviewProps> = ({ parsedData, setStep, handleFinish }) => {
  return (
    <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-full"><Briefcase className="h-6 w-6 text-blue-600"/></div>
            <div>
            <h4 className="font-bold text-lg text-blue-900">{parsedData.caseInfo?.title || 'Unknown Case'}</h4>
            <div className="flex flex-wrap gap-4 text-xs text-blue-700 mt-1">
                <span className="font-mono bg-blue-100 px-1 rounded">{parsedData.caseInfo?.caseNumber}</span>
                <span>{parsedData.caseInfo?.court}</span>
                <span>Judge: {parsedData.caseInfo?.judge}</span>
            </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center">
                <Users className="h-4 w-4 mr-2 text-slate-500"/>
                <span className="font-bold text-xs uppercase text-slate-600">Parties Found ({parsedData.parties?.length || 0})</span>
            </div>
            <div className="max-h-40 overflow-y-auto p-2 space-y-2">
                {parsedData.parties?.map((p: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-slate-100">
                    <span className="font-medium text-slate-900">{p.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{p.role}</span>
                </div>
                ))}
            </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-500"/>
                <span className="font-bold text-xs uppercase text-slate-600">Deadlines ({parsedData.deadlines?.length || 0})</span>
            </div>
            <div className="max-h-40 overflow-y-auto p-2 space-y-2">
                {parsedData.deadlines?.map((d: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-slate-100">
                    <span className="text-red-600 font-medium">{d.date}</span>
                    <span className="text-xs text-slate-600">{d.title}</span>
                </div>
                ))}
            </div>
            </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-500"/>
                <span className="font-bold text-xs uppercase text-slate-600">Recent Docket Entries ({parsedData.docketEntries?.length || 0})</span>
            </div>
            <div className="max-h-40 overflow-y-auto p-2 space-y-2">
                {parsedData.docketEntries?.slice(0, 5).map((e: any, i: number) => (
                <div key={i} className="text-sm p-2 bg-white rounded border border-slate-100">
                    <div className="flex gap-2 mb-1">
                    <span className="font-mono text-xs bg-slate-100 px-1 rounded text-slate-500">#{e.entryNumber}</span>
                    <span className="text-xs font-medium text-slate-900">{e.date}</span>
                    </div>
                    <p className="text-slate-600 text-xs line-clamp-2">{e.description}</p>
                </div>
                ))}
                {(parsedData.docketEntries?.length || 0) > 5 && (
                <p className="text-xs text-center text-slate-400 italic">...and {parsedData.docketEntries.length - 5} more</p>
                )}
            </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button variant="primary" icon={CheckCircle} onClick={handleFinish}>Create Case & Import All</Button>
        </div>
    </div>
  );
};
