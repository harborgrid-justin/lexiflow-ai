
import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, BookOpen, Loader2, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
// GeminiService available for future AI-powered research features
// import { GeminiService } from '../services/geminiService';
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
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [jurisdiction, setJurisdiction] = useState('');
  const [searchType, setSearchType] = useState<'comprehensive' | 'case_law' | 'statutes' | 'news'>('comprehensive');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const sessions = await ApiService.getResearchHistory();
        setHistory(sessions || []);
      } catch (error) {
        console.error('Failed to fetch research history:', error);
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentResults(null);
    
    try {
      let result;
      
      if (searchType === 'comprehensive') {
        // Use Google Custom Search for comprehensive legal research
        result = await ApiService.search.legalResearch({
          query,
          jurisdiction: jurisdiction || undefined,
          includeCaseLaw: true,
          includeStatutes: true,
          includeArticles: true,
          includeNews: false,
        });
        
        setCurrentResults(result);
      } else if (searchType === 'case_law') {
        const caseLawResults = await ApiService.search.searchCaseLaw(query, jurisdiction || undefined);
        setCurrentResults({ results: { caseLaw: caseLawResults }, totalResults: caseLawResults.length });
      } else if (searchType === 'statutes') {
        const statuteResults = await ApiService.search.searchStatutes(query, jurisdiction || undefined);
        setCurrentResults({ results: { statutes: statuteResults }, totalResults: statuteResults.length });
      } else if (searchType === 'news') {
        const newsResults = await ApiService.search.searchLegalNews(query, 30);
        setCurrentResults({ results: { news: newsResults }, totalResults: newsResults.length });
      }
      
      // Save to history
      const newSession: ResearchSession = {
        id: Date.now().toString(),
        query,
        response: `Found ${result?.totalResults || 0} results`,
        sources: [],
        timestamp: new Date().toISOString(),
        userId: currentUser?.id
      };

      const savedSession = await ApiService.saveResearchSession(newSession);
      setHistory([savedSession, ...history]);
    } catch (error) {
      console.error('Research failed:', error);
      alert('Research failed. Please check your Google Custom Search API configuration.');
    } finally {
      setIsLoading(false);
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
        subtitle="Powered by Google Custom Search API - Search case law, statutes, and legal articles."
      />

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Type Selection */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSearchType('comprehensive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'comprehensive' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Comprehensive
            </button>
            <button
              type="button"
              onClick={() => setSearchType('case_law')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'case_law' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Case Law Only
            </button>
            <button
              type="button"
              onClick={() => setSearchType('statutes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'statutes' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Statutes
            </button>
            <button
              type="button"
              onClick={() => setSearchType('news')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'news' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Legal News
            </button>
          </div>

          {/* Jurisdiction Filter */}
          <div className="flex gap-4">
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="Jurisdiction (optional, e.g., Delaware, Federal)"
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
          </div>

          {/* Main Search Input */}
          <div className="relative">
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
          </div>
        </form>
      </div>

      {/* Current Results */}
      {currentResults && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Search Results ({currentResults.totalResults} found)
          </h3>
          
          {currentResults.results.caseLaw && currentResults.results.caseLaw.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-slate-700 mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600"/>
                Case Law ({currentResults.results.caseLaw.length})
              </h4>
              <div className="space-y-3">
                {currentResults.results.caseLaw.map((result: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                      {result.title}
                      <ExternalLink className="h-4 w-4 ml-2"/>
                    </a>
                    <p className="text-sm text-slate-600 mt-2">{result.snippet}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{result.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentResults.results.statutes && currentResults.results.statutes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-slate-700 mb-3">Statutes & Regulations ({currentResults.results.statutes.length})</h4>
              <div className="space-y-3">
                {currentResults.results.statutes.map((result: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                      {result.title}
                      <ExternalLink className="h-4 w-4 ml-2"/>
                    </a>
                    <p className="text-sm text-slate-600 mt-2">{result.snippet}</p>
                    <span className="text-xs text-slate-500 mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded">{result.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentResults.results.articles && currentResults.results.articles.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-slate-700 mb-3">Legal Articles ({currentResults.results.articles.length})</h4>
              <div className="space-y-3">
                {currentResults.results.articles.map((result: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                      {result.title}
                      <ExternalLink className="h-4 w-4 ml-2"/>
                    </a>
                    <p className="text-sm text-slate-600 mt-2">{result.snippet}</p>
                    <span className="text-xs text-slate-500 mt-2 inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded">{result.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentResults.results.news && currentResults.results.news.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-slate-700 mb-3">Recent Legal News ({currentResults.results.news.length})</h4>
              <div className="space-y-3">
                {currentResults.results.news.map((result: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                      {result.title}
                      <ExternalLink className="h-4 w-4 ml-2"/>
                    </a>
                    <p className="text-sm text-slate-600 mt-2">{result.snippet}</p>
                    <span className="text-xs text-slate-500 mt-2 inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded">{result.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 pb-20">
        {history.length === 0 && !currentResults && (
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

              {(session.sources || []).length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Cited Sources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(session.sources || []).map((source, idx) => (
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
