
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Search, AlertTriangle, Lock, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { ConflictCheck, EthicalWall } from '../types';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';

export const ComplianceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conflicts' | 'walls' | 'risk'>('conflicts');
  const [conflicts, setConflicts] = useState<ConflictCheck[]>([]);
  const [walls, setWalls] = useState<EthicalWall[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [c, w] = await Promise.all([
                ApiService.getConflicts(),
                ApiService.getWalls()
            ]);
            setConflicts(c);
            setWalls(w);
        } catch (e) {
            console.error("Failed to fetch compliance data", e);
        }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Risk & Compliance Center" 
        subtitle="Conflicts, Ethical Walls, and Regulatory Monitoring."
        actions={
          <Tabs 
            tabs={['conflicts', 'walls', 'risk']} 
            activeTab={activeTab} 
            onChange={(t) => setActiveTab(t as any)} 
          />
        }
      />

      {activeTab === 'conflicts' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
             <h3 className="font-bold text-slate-800 flex items-center"><Search className="mr-2 h-4 w-4"/> Recent Checks</h3>
             <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Run New Check</button>
          </div>
          <table className="min-w-full divide-y divide-slate-200">
             <thead className="bg-slate-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Entity</th>
                 <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                 <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                 <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Hits</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-200">
               {conflicts.map(c => (
                 <tr key={c.id}>
                   <td className="px-6 py-4 font-medium text-slate-900">{c.entityName}</td>
                   <td className="px-6 py-4 text-slate-500 text-sm">{c.date}</td>
                   <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Cleared' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                   <td className="px-6 py-4 text-sm text-slate-500">{c.foundIn.length > 0 ? c.foundIn.join(', ') : 'None'}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      )}

      {activeTab === 'walls' && (
        <div className="grid grid-cols-1 gap-4">
           {walls.map(w => (
             <div key={w.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-red-50 rounded-lg"><Lock className="h-6 w-6 text-red-600"/></div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{w.title}</h3>
                    <p className="text-sm text-slate-500 mb-2">Matter ID: {w.caseId}</p>
                    <div className="flex gap-2 text-xs">
                       <span className="bg-slate-100 px-2 py-1 rounded">Restricted: {w.restrictedGroups.join(', ')}</span>
                       <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded">Access: {w.authorizedUsers.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="flex items-center text-green-600 text-sm font-medium"><CheckCircle className="h-4 w-4 mr-1"/> Enforced</div>
                   <button className="text-slate-400 hover:text-blue-600 font-medium text-sm">Edit Policy</button>
                </div>
             </div>
           ))}
           <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 font-medium flex justify-center items-center">
              <Lock className="h-4 w-4 mr-2"/> Create New Ethical Wall
           </button>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <h3 className="font-bold text-slate-900 mb-2">High Risk Clients</h3>
              <p className="text-3xl font-bold text-slate-900">3</p>
              <p className="text-xs text-slate-500 mt-1">Due to sanctions list or PEP status.</p>
           </div>
           <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500">
              <h3 className="font-bold text-slate-900 mb-2">Missing Engagement Letters</h3>
              <p className="text-3xl font-bold text-slate-900">12</p>
              <p className="text-xs text-slate-500 mt-1">Active matters without signed docs.</p>
           </div>
           <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h3 className="font-bold text-slate-900 mb-2">Data Policy Violations</h3>
              <p className="text-3xl font-bold text-slate-900">0</p>
              <p className="text-xs text-slate-500 mt-1">DLP scans clean for last 30 days.</p>
           </div>
        </div>
      )}
    </div>
  );
};
