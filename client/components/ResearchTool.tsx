
import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, BookOpen, Loader2, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { ApiService } from '../services/apiService';
import { ResearchSession, User } from '../types';
import { PageHeader } from './common/PageHeader';

interface ResearchToolProps {
  currentUser?: User;
}

export const ResearchTool: React.FC<ResearchToolProps> = ({ currentUser }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ResearchSession[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const sessions = await ApiService.getResearchHistory();
        setHistory(sessions);
      } catch (error) {
        console.error('Failed to fetch research history:', error);
      }
    };
    fetchHistory();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await GeminiService.conductResearch(query);
      
      const newSession: ResearchSession = {
        id: Date.now().toString(),
        query,
        response: result.text,
        sources: result.sources,
        timestamp: new Date().toISOString(),
        userId: currentUser?.id
      };

      const savedSession = await ApiService.saveResearchSession(newSession);
      setHistory([savedSession, ...history]);
    } catch (error) {
      console.error('Research failed:', error);
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handleFeedback = async (id: string, type: 'positive' | 'negative') => {
    try {
        await ApiService.submitResearchFeedback(id, type);
        setHistory(history.map(session => 
          session.id === id ? { ...session, feedback: type } : session
        ));
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <PageHeader 
        title="AI Legal Research" 
        subtitle="Ask complex legal questions using Gemini 2.5 with Google Search grounding."
      />

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Precedents for piercing corporate veil in Delaware..."
            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-sm md:text-lg"
          />
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 md:h-6 md:w-6" />
          <button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors text-sm md:text-base"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin md:mr-2" /> : <span className="hidden md:inline">Research</span>}
            {isLoading ? null : <ArrowRight className="md:hidden h-4 w-4" />}
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg text-center px-4">No research history yet. Start by entering a query above.</p>
          </div>
        )}

        {history.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
            <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div className="flex items-start md:items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full shrink-0">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-semibold text-slate-900 text-sm md:text-base leading-tight">{session.query}</span>
              </div>
              <span className="text-xs text-slate-500 ml-10 md:ml-0">{session.timestamp}</span>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                {session.response}
              </div>

              {session.sources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Cited Sources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {session.sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-600 group-hover:text-blue-800 line-clamp-1">{source.title}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{source.url}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-slate-500 ml-2 mt-0.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-end space-x-4 border-t border-slate-50 pt-4">
                <span className="text-xs text-slate-400">Helpful?</span>
                <button 
                  onClick={() => handleFeedback(session.id, 'positive')}
                  className={`p-1.5 rounded hover:bg-green-50 transition-colors ${session.feedback === 'positive' ? 'text-green-600' : 'text-slate-400'}`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleFeedback(session.id, 'negative')}
                  className={`p-1.5 rounded hover:bg-red-50 transition-colors ${session.feedback === 'negative' ? 'text-red-600' : 'text-slate-400'}`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
