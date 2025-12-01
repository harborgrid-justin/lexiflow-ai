import React from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';

type SearchType = 'comprehensive' | 'case_law' | 'statutes' | 'news';

interface ResearchSearchFormProps {
  query: string;
  jurisdiction: string;
  searchType: SearchType;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onJurisdictionChange: (value: string) => void;
  onSearchTypeChange: (type: SearchType) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SEARCH_TYPE_LABELS: Array<{ id: SearchType; label: string }> = [
  { id: 'comprehensive', label: 'Comprehensive' },
  { id: 'case_law', label: 'Case Law Only' },
  { id: 'statutes', label: 'Statutes' },
  { id: 'news', label: 'Legal News' },
];

export const ResearchSearchForm: React.FC<ResearchSearchFormProps> = ({
  query,
  jurisdiction,
  searchType,
  isLoading,
  onQueryChange,
  onJurisdictionChange,
  onSearchTypeChange,
  onSubmit,
}) => {
  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {SEARCH_TYPE_LABELS.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onSearchTypeChange(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={jurisdiction}
            onChange={(e) => onJurisdictionChange(e.target.value)}
            placeholder="Jurisdiction (optional, e.g., Delaware, Federal)"
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
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
    </Card>
  );
};
