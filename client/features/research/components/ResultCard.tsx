/**
 * Search Result Card
 * Display search result with snippet, citations, and quick actions
 */

import React from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, FolderPlus, Star, AlertCircle } from 'lucide-react';
import type { SearchResult } from '../api/research.types';
import { KeyciteIndicator } from './KeyciteIndicator';
import { TermsHighlighter } from './TermsHighlighter';

interface ResultCardProps {
  result: SearchResult;
  searchQuery?: string;
  onSave?: (resultId: string) => void;
  onAddToFolder?: (resultId: string) => void;
  onViewCase?: (resultId: string) => void;
  isSaved?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  searchQuery,
  onSave,
  onAddToFolder,
  onViewCase,
  isSaved = false,
}) => {
  const getDocumentTypeStyle = (type: SearchResult['type']) => {
    const styles = {
      case: 'bg-blue-100 text-blue-700',
      statute: 'bg-green-100 text-green-700',
      regulation: 'bg-purple-100 text-purple-700',
      article: 'bg-orange-100 text-orange-700',
      brief: 'bg-yellow-100 text-yellow-700',
      opinion: 'bg-indigo-100 text-indigo-700',
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDocumentTypeStyle(result.type)}`}>
              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
            </span>
            {result.treatment && (
              <KeyciteIndicator status={result.treatment} size="sm" />
            )}
            {result.citationCount && result.citationCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="w-3 h-3" />
                <span>{result.citationCount} citations</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
            <button onClick={() => onViewCase?.(result.id)} className="text-left">
              {result.title}
            </button>
          </h3>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={() => onSave(result.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isSaved ? 'Remove from saved' : 'Save result'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
          {onAddToFolder && (
            <button
              onClick={() => onAddToFolder(result.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Add to folder"
            >
              <FolderPlus className="w-5 h-5 text-gray-400" />
            </button>
          )}
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>
          )}
        </div>
      </div>

      {/* Citation */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-sm text-blue-600 font-medium">
          {result.citation}
        </span>
        {result.court && (
          <>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{result.court}</span>
          </>
        )}
        {result.date && (
          <>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{formatDate(result.date)}</span>
          </>
        )}
      </div>

      {/* Snippet */}
      <div className="mb-4">
        {result.highlightedSnippet ? (
          <div
            className="text-sm text-gray-700 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: result.highlightedSnippet }}
          />
        ) : (
          <TermsHighlighter
            text={result.snippet}
            searchTerms={searchQuery || ''}
            className="text-sm text-gray-700 line-clamp-3"
          />
        )}
      </div>

      {/* Key Holdings */}
      {result.keyHoldings && result.keyHoldings.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-xs font-semibold text-blue-900 mb-2">Key Holdings</h4>
          <ul className="space-y-1">
            {result.keyHoldings.slice(0, 2).map(holding => (
              <li key={holding.id} className="text-xs text-blue-800 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span className="flex-1 line-clamp-2">{holding.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Citations */}
      {result.keyCitations && result.keyCitations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Citations</h4>
          <div className="flex flex-wrap gap-2">
            {result.keyCitations.slice(0, 3).map(citation => (
              <span
                key={citation.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-mono"
                title={citation.title}
              >
                {citation.citation}
              </span>
            ))}
            {result.keyCitations.length > 3 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{result.keyCitations.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{result.jurisdiction}</span>
          {result.practiceAreas && result.practiceAreas.length > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <span>{result.practiceAreas.join(', ')}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {result.relevanceScore > 0.8 && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Highly Relevant</span>
              </div>
            )}
            {result.treatment === 'overruled' || result.treatment === 'superseded' && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="w-3 h-3" />
                <span>Review Treatment</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
