import React from 'react';
import { Search, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '../common/Card';
import { ResearchSession } from '../../types';

interface ResearchHistoryListProps {
  history: ResearchSession[];
  onFeedback: (id: string, type: 'positive' | 'negative') => void;
  showEmptyState?: boolean;
}

export const ResearchHistoryList: React.FC<ResearchHistoryListProps> = ({ history, onFeedback, showEmptyState = true }) => {
  if (!history.length) {
    return showEmptyState ? (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Search className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-lg text-center px-4">No research history yet. Start by entering a query above.</p>
      </div>
    ) : null;
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pb-20">
      {history.map((session) => (
        <Card key={session.id} className="overflow-hidden animate-fade-in-up p-0">
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
                      key={`${session.id}-source-${idx}`}
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
                onClick={() => onFeedback(session.id, 'positive')}
                className={`p-1.5 rounded hover:bg-green-50 transition-colors ${session.feedback === 'positive' ? 'text-green-600' : 'text-slate-400'}`}
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => onFeedback(session.id, 'negative')}
                className={`p-1.5 rounded hover:bg-red-50 transition-colors ${session.feedback === 'negative' ? 'text-red-600' : 'text-slate-400'}`}
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
