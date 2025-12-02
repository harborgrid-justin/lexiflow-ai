/**
 * Advanced Legal Research Search Bar
 * Supports natural language, Boolean operators, and field searches
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, BookOpen, FileText, Scale, Sparkles } from 'lucide-react';
import { useSearchSuggestions } from '../api';
import { useDebouncedValue } from '../../../enzyme';
import type { SearchSuggestion } from '../api/research.types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  enableAI?: boolean;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search case law, statutes, and legal resources...',
  enableAI = true,
  showSuggestions = true,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedValue = useDebouncedValue(value, 300);
  const { data: suggestions = [], isLoading: loadingSuggestions } = useSearchSuggestions(
    debouncedValue,
    { enabled: showSuggestions && isFocused && debouncedValue.length >= 3 }
  );

  const showSuggestionsDropdown = isFocused && suggestions.length > 0;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSearch(suggestion.text);
    setIsFocused(false);
    setSelectedIndex(-1);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'case':
        return <Scale className="w-4 h-4 text-blue-500" />;
      case 'statute':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'topic':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 transition-all duration-200
          ${isFocused ? 'border-blue-500 shadow-lg ring-4 ring-blue-50' : 'border-gray-200 hover:border-gray-300'}
        `}>
          <Search className="w-6 h-6 text-gray-400 flex-shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow clicking on suggestions
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 text-lg outline-none placeholder-gray-400"
          />

          {enableAI && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-purple-700">AI-Powered</span>
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}

          <button
            type="submit"
            disabled={!value.trim()}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${value.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestionsDropdown && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {loadingSuggestions ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <div className="animate-pulse">Loading suggestions...</div>
            </div>
          ) : (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`
                    w-full px-6 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left
                    ${index === selectedIndex ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className="mt-0.5">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {suggestion.text}
                    </div>
                    {suggestion.metadata && (
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        {suggestion.metadata.citation && (
                          <span>{suggestion.metadata.citation}</span>
                        )}
                        {suggestion.metadata.jurisdiction && (
                          <span>{suggestion.metadata.jurisdiction}</span>
                        )}
                        {suggestion.metadata.year && (
                          <span>{suggestion.metadata.year}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {suggestion.type}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {isFocused && !showSuggestionsDropdown && value.length < 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-50 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Search Tips</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div><span className="font-medium">Natural language:</span> "cases about workplace discrimination"</div>
            <div><span className="font-medium">Boolean:</span> "negligence AND (medical OR malpractice)"</div>
            <div><span className="font-medium">Field search:</span> court:supreme jurisdiction:california</div>
            <div><span className="font-medium">Exact phrase:</span> "summary judgment"</div>
          </div>
        </div>
      )}
    </div>
  );
};
