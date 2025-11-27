
import React, { useState } from 'react';
import { Search, Book, FileText, Lightbulb, MessageCircle } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';

export const KnowledgeBase: React.FC = () => {
  const [tab, setTab] = useState<'wiki'|'precedents'|'qa'>('wiki');
  return (
    <div className="space-y-6 animate-fade-in">
        <PageHeader 
          title="Knowledge Base" 
          subtitle="Firm-wide intelligence, precedents, and internal wiki."
          actions={
            <Tabs 
              tabs={['wiki', 'precedents', 'qa']} 
              activeTab={tab} 
              onChange={(t) => setTab(t as any)} 
            />
          }
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"/>
                <input className="w-full pl-10 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder={`Search ${tab === 'wiki' ? 'articles, playbooks...' : tab === 'precedents' ? 'past matters, winning strategies...' : 'internal questions...'}`} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tab === 'wiki' && (
                <>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 cursor-pointer group transition-all">
                    <div className="flex items-center justify-between mb-2"><Book className="h-5 w-5 text-purple-500"/><span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Playbook</span></div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600">California Employment Litigation</h3>
                    <p className="text-sm text-slate-500 mt-2">Standard operating procedures for discrimination claims filed in CA Superior Court.</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 cursor-pointer group transition-all">
                    <div className="flex items-center justify-between mb-2"><Lightbulb className="h-5 w-5 text-amber-500"/><span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Q&A</span></div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Handling GDPR Subject Requests</h3>
                    <p className="text-sm text-slate-500 mt-2">Step-by-step guide for responding to data deletion requests from EU clients.</p>
                 </div>
                </>
            )}

            {tab === 'precedents' && (
                <>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 cursor-pointer transition-all">
                    <div className="flex items-center justify-between mb-2"><FileText className="h-5 w-5 text-blue-500"/><span className="text-xs text-slate-500">92% Similarity</span></div>
                    <h3 className="font-bold text-slate-900">Smith v. MegaCorp (2021)</h3>
                    <p className="text-sm text-slate-500 mt-2">Successfully argued Motion to Dismiss based on lack of standing in similar class action.</p>
                    <div className="mt-3 flex gap-2"><span className="text-xs bg-slate-100 px-2 py-1 rounded">Class Action</span><span className="text-xs bg-slate-100 px-2 py-1 rounded">Dismissal</span></div>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 cursor-pointer transition-all">
                    <div className="flex items-center justify-between mb-2"><FileText className="h-5 w-5 text-blue-500"/><span className="text-xs text-slate-500">88% Similarity</span></div>
                    <h3 className="font-bold text-slate-900">Doe v. TechGiant (2019)</h3>
                    <p className="text-sm text-slate-500 mt-2">Settlement reached during discovery. Key leverage was internal email retention policy violation.</p>
                    <div className="mt-3 flex gap-2"><span className="text-xs bg-slate-100 px-2 py-1 rounded">Discovery</span><span className="text-xs bg-slate-100 px-2 py-1 rounded">Settlement</span></div>
                 </div>
                </>
            )}

            {tab === 'qa' && (
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex gap-3">
                            <div className="mt-1"><MessageCircle className="h-5 w-5 text-slate-400"/></div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900">How do we handle "Service of Process" for international defendants in China?</h3>
                                <p className="text-xs text-slate-500 mt-1">Asked by James Doe • 2 days ago</p>
                                <div className="mt-3 bg-green-50 p-3 rounded text-sm text-slate-700 border border-green-100">
                                    <span className="font-bold text-green-700 block mb-1">Top Answer (Partner Verified)</span>
                                    Requires compliance with the Hague Convention. Do not attempt direct mail. Use the central authority pathway...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
