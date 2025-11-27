
import React, { useState } from 'react';
import { Case, TimeEntry } from '../../types';
import { Clock, FileText, Globe, Gavel, Users, DollarSign, Scale, Briefcase } from 'lucide-react';
import { TimeEntryModal } from '../TimeEntryModal';

interface CaseOverviewProps {
  caseData: Case;
  onTimeEntryAdded: (entry: TimeEntry) => void;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({ caseData, onTimeEntryAdded }) => {
  const [showTimeModal, setShowTimeModal] = useState(false);

  const handleSaveTime = (rawEntry: any) => {
      // In a real app, this would be an API call returning the new ID
      const newEntry: TimeEntry = {
          id: `t-${Date.now()}`,
          ...rawEntry
      };
      onTimeEntryAdded(newEntry);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TimeEntryModal isOpen={showTimeModal} onClose={() => setShowTimeModal(false)} caseId={caseData.title} onSave={handleSaveTime} />
      
      <div className="col-span-2 space-y-6">
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
  );
};
