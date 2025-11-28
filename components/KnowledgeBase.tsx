
import React, { useState, useEffect } from 'react';
import { Search, Book, FileText, Lightbulb, MessageCircle } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';
import { ApiService } from '../services/apiService';
import { KnowledgeItem } from '../types';

export const KnowledgeBase: React.FC = () => {
  const [tab, setTab] = useState<'wiki'|'precedents'|'qa'>('wiki');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryMap: Record<string, string> = {
            'wiki': 'Playbook',
            'precedents': 'Precedent',
            'qa': 'Q&A'
        };
        const data = await ApiService.getKnowledgeBase(categoryMap[tab]);
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <input 
                    className="w-full pl-10 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                    placeholder={`Search ${tab === 'wiki' ? 'articles, playbooks...' : tab === 'precedents' ? 'past matters, winning strategies...' : 'internal questions...'}`} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
            <div className="p-8 text-center text-slate-500">Loading knowledge base...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tab === 'wiki' && filteredItems.map(item => (
                     <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 cursor-pointer group transition-all">
                        <div className="flex items-center justify-between mb-2">
                            {item.metadata.icon === 'Book' ? <Book className="h-5 w-5 text-purple-500"/> : <Lightbulb className="h-5 w-5 text-amber-500"/>}
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.metadata.color === 'purple' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{item.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600">{item.title}</h3>
                        <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
                     </div>
                ))}

                {tab === 'precedents' && filteredItems.map(item => (
                     <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 cursor-pointer transition-all">
                        <div className="flex items-center justify-between mb-2"><FileText className="h-5 w-5 text-blue-500"/><span className="text-xs text-slate-500">{item.metadata.similarity}% Similarity</span></div>
                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                        <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
                        <div className="mt-3 flex gap-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded">{tag}</span>
                            ))}
                        </div>
                     </div>
                ))}

                {tab === 'qa' && (
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200">
                                <div className="flex gap-3">
                                    <div className="mt-1"><MessageCircle className="h-5 w-5 text-slate-400"/></div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{item.summary}</p>
                                        <div className="mt-3 bg-green-50 p-3 rounded text-sm text-slate-700 border border-green-100">
                                            <span className="font-bold text-green-700 block mb-1">Top Answer (Partner Verified)</span>
                                            {item.metadata.topAnswer || item.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
