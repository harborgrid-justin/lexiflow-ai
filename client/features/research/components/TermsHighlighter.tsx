/**
 * Terms Highlighter
 * Highlights search terms in text results
 */

import React from 'react';

interface TermsHighlighterProps {
  text: string;
  searchTerms: string;
  className?: string;
  highlightClassName?: string;
}

export const TermsHighlighter: React.FC<TermsHighlighterProps> = ({
  text,
  searchTerms,
  className = '',
  highlightClassName = 'bg-yellow-200 font-medium',
}) => {
  if (!searchTerms || !text) {
    return <span className={className}>{text}</span>;
  }

  // Extract search terms, removing boolean operators and special characters
  const terms = searchTerms
    .replace(/AND|OR|NOT|\(|\)|"/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 2) // Only highlight terms longer than 2 chars
    .map(term => term.toLowerCase());

  if (terms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Create a regex pattern that matches any of the search terms
  const pattern = new RegExp(
    `(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );

  // Split text by matches and wrap matches in highlight spans
  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = terms.some(term =>
          part.toLowerCase() === term || part.toLowerCase().includes(term)
        );

        if (isMatch) {
          return (
            <mark key={index} className={highlightClassName}>
              {part}
            </mark>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
