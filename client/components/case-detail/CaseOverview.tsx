
import React, { useState } from 'react';
import { Case, User } from '../../types';
import { Clock, FileText, Globe, Gavel, Users, DollarSign, Scale, Briefcase, FileCheck, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { TimeEntryModal } from '../TimeEntryModal';
import { ConsolidatedCasesCard } from './ConsolidatedCasesCard';

interface CaseOverviewProps {
  caseData: Case;
  onTimeEntryAdded: (entry: any) => void;
  currentUser?: User;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({ caseData, onTimeEntryAdded, currentUser }) => {
  const [showTimeModal, setShowTimeModal] = useState(false);

  const handleSaveTime = (rawEntry: any) => {
      onTimeEntryAdded({ ...rawEntry, userId: currentUser?.id });
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimeEntryModal isOpen={showTimeModal} onClose={() => setShowTimeModal(false)} caseId={caseData.title} onSave={handleSaveTime} />
        
        <div className="col-span-2 space-y-6">
        
        {/* PACER Case Information */}
        {(caseData.docketNumber || caseData.originatingCaseNumber || caseData.natureOfSuit || caseData.caseType) && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">PACER Case Information</h3>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              {caseData.docketNumber && (
                <div>
                  <dt className="text-sm font-medium text-slate-600">Docket Number</dt>
                  <dd className="mt-1 text-base font-mono font-bold text-blue-900">{caseData.docketNumber}</dd>
                </div>
              )}
              {caseData.originatingCaseNumber && (
                <div>
                  <dt className="text-sm font-medium text-slate-600">Originating Case</dt>
                  <dd className="mt-1 text-sm font-mono text-slate-700">{caseData.originatingCaseNumber}</dd>
                </div>
              )}
              {caseData.natureOfSuit && (
                <div>
                  <dt className="text-sm font-medium text-slate-600">Nature of Suit</dt>
                  <dd className="mt-1 text-sm text-slate-900">{caseData.natureOfSuit}</dd>
                </div>
              )}
              {caseData.caseType && (
                <div>
                  <dt className="text-sm font-medium text-slate-600">Case Type</dt>
                  <dd className="mt-1 text-sm text-slate-900">{caseData.caseType}</dd>
                </div>
              )}
              {caseData.feeStatus && (
                <div>
                  <dt className="text-sm font-medium text-slate-600">Fee Status</dt>
                  <dd className="mt-1 text-sm text-slate-900">{caseData.feeStatus}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Judges & Court Officials */}
        {(caseData.presidingJudge || caseData.orderingJudge || caseData.judge) && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-5 w-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">Judges & Court Officials</h3>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              {caseData.presidingJudge && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Presiding Judge</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">{caseData.presidingJudge}</dd>
                </div>
              )}
              {caseData.orderingJudge && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Ordering Judge</dt>
                  <dd className="mt-1 text-sm text-slate-900">{caseData.orderingJudge}</dd>
                </div>
              )}
              {caseData.judge && !caseData.presidingJudge && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Assigned Judge</dt>
                  <dd className="mt-1 text-sm text-slate-900">{caseData.judge}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Important Dates */}
        {(caseData.dateOrderJudgment || caseData.dateNoaFiled || caseData.dateRecvCoa || caseData.filingDate) && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900">Important Dates</h3>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              {caseData.filingDate && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Filing Date</dt>
                  <dd className="mt-1 text-sm text-slate-900">{new Date(caseData.filingDate).toLocaleDateString()}</dd>
                </div>
              )}
              {caseData.dateOrderJudgment && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Order/Judgment Date</dt>
                  <dd className="mt-1 text-sm text-slate-900">{new Date(caseData.dateOrderJudgment).toLocaleDateString()}</dd>
                </div>
              )}
              {caseData.dateNoaFiled && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">NOA Filed</dt>
                  <dd className="mt-1 text-sm text-slate-900">{new Date(caseData.dateNoaFiled).toLocaleDateString()}</dd>
                </div>
              )}
              {caseData.dateRecvCoa && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Received from COA</dt>
                  <dd className="mt-1 text-sm text-slate-900">{new Date(caseData.dateRecvCoa).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
        
        {/* Consolidated Cases */}
        {caseData.id && (
          <ConsolidatedCasesCard 
            caseId={caseData.id} 
            currentCaseDocketNumber={caseData.docketNumber}
          />
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Matter Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div><dt className="text-sm font-medium text-slate-500">Matter Type</dt><dd className="mt-1 text-sm font-semibold text-blue-600">{caseData.matterType || 'General'}</dd></div>
            <div>
                <dt className="text-sm font-medium text-slate-500">Est. Value</dt>
                <dd className="mt-1 text-sm text-slate-900 font-mono font-semibold flex items-center">
                    <DollarSign className="h-3 w-3 mr-1 text-green-600"/>
                    {caseData.value.toLocaleString()}
                </dd>
            </div>
            
            <div><dt className="text-sm font-medium text-slate-500">Jurisdiction</dt><dd className="mt-1 text-sm text-slate-900 flex items-center"><Globe className="h-3 w-3 mr-1 text-slate-400"/>{caseData.jurisdiction || 'N/A'}</dd></div>
            <div><dt className="text-sm font-medium text-slate-500">Court / Tribunal</dt><dd className="mt-1 text-sm text-slate-900 flex items-center"><Gavel className="h-3 w-3 mr-1 text-slate-400"/>{caseData.court || 'N/A'}</dd></div>
            
            <div><dt className="text-sm font-medium text-slate-500">Assigned Judge</dt><dd className="mt-1 text-sm text-slate-900 flex items-center"><Scale className="h-3 w-3 mr-1 text-slate-400"/>{caseData.judge || 'Unassigned'}</dd></div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Opposing Counsel / Firm</dt>
              <dd className="mt-1 text-sm text-slate-900 flex items-center">
                <Briefcase className="h-3 w-3 mr-1 text-slate-400"/>
                {caseData.opposingCounsel || 'N/A'}
              </dd>
            </div>

            <div className="col-span-1 sm:col-span-2"><dt className="text-sm font-medium text-slate-500">Description</dt><dd className="mt-1 text-sm text-slate-900 leading-relaxed">{caseData.description}</dd></div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center"><Users className="h-5 w-5 mr-2 text-slate-500"/>Parties</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {caseData.parties?.length ? caseData.parties.map(p => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.role}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{p.contact}</td>
                  </tr>
                )) : <tr><td colSpan={3} className="px-4 py-3 text-sm text-slate-400 italic">No parties listed.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => setShowTimeModal(true)} className="w-full flex items-center px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 border border-slate-200"><Clock className="h-4 w-4 mr-2 text-blue-500" /> Log Billable Time</button>
            <button className="w-full flex items-center px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-md text-sm font-medium text-slate-700 border border-slate-200"><FileText className="h-4 w-4 mr-2 text-emerald-500" /> Upload Doc</button>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};
