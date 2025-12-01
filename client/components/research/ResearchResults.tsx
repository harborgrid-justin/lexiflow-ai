import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Card, Badge } from '../common';

export interface ResearchResultItem {
  title: string;
  snippet: string;
  url: string;
  source?: string;
}

export interface ResearchResultsData {
  totalResults: number;
  results: {
    caseLaw?: ResearchResultItem[];
    statutes?: ResearchResultItem[];
    articles?: ResearchResultItem[];
    news?: ResearchResultItem[];
  };
}

interface ResearchResultsProps {
  data: ResearchResultsData | null;
}

export const ResearchResults: React.FC<ResearchResultsProps> = ({ data }) => {
  if (!data) return null;

  const sections = [
    {
      title: 'Case Law',
      key: 'caseLaw' as const,
      icon: <BookOpen className="h-5 w-5 mr-2 text-blue-600" />,
      subtitle: (count: number) => `Case Law (${count})`,
      badgeVariant: 'active' as const,
    },
    {
      title: 'Statutes & Regulations',
      key: 'statutes' as const,
      subtitle: (count: number) => `Statutes & Regulations (${count})`,
      badgeVariant: 'success' as const,
    },
    {
      title: 'Legal Articles',
      key: 'articles' as const,
      subtitle: (count: number) => `Legal Articles (${count})`,
      badgeVariant: 'info' as const,
    },
    {
      title: 'Recent Legal News',
      key: 'news' as const,
      subtitle: (count: number) => `Recent Legal News (${count})`,
      badgeVariant: 'warning' as const,
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        Search Results ({data.totalResults} found)
      </h3>

      {sections.map((section) => {
        const items = data.results[section.key];
        if (!items || items.length === 0) return null;

        return (
          <div key={section.key} className="mb-6">
            <h4 className="font-bold text-slate-700 mb-3 flex items-center">
              {section.icon}
              {section.subtitle(items.length)}
            </h4>
            <div className="space-y-3">
              {items.map((result, idx) => (
                <div
                  key={`${section.key}-${idx}`}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    {result.title}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  <p className="text-sm text-slate-600 mt-2">{result.snippet}</p>
                  {result.source && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <Badge variant={section.badgeVariant} size="sm">{result.source}</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Card>
  );
};
