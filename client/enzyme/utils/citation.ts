import { Citation } from '../types';

/**
 * Basic client-side citation formatting fallback
 */
export const formatCitationFallback = (citation: Citation): string => {
  return citation.text;
};

/**
 * Simple heuristic to check if a text looks like a Bluebook citation
 */
export const isBluebookCitation = (text: string): boolean => {
  // Matches patterns like "123 U.S. 456" or "123 F.3d 456"
  return /^\d+\s+[A-Za-z\.\s]+\s+\d+/.test(text);
};

/**
 * Extract potential citations from text using regex (client-side)
 */
export const extractCitationsRegex = (text: string): string[] => {
  const citationRegex = /\d+\s+[A-Za-z\.\s]+\s+\d+(?:\s+\(\d{4}\))?/g;
  return text.match(citationRegex) || [];
};
