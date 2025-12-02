/**
 * Legal Research Types
 * Comprehensive type definitions for LexiFlow AI's legal research system
 */

// ==================== Core Search Types ====================

export type DocumentType = 'case' | 'statute' | 'regulation' | 'article' | 'brief' | 'opinion';
export type CourtLevel = 'Supreme Court' | 'Appellate' | 'District' | 'State Supreme' | 'State Appellate' | 'Trial';
export type TreatmentStatus = 'valid' | 'followed' | 'distinguished' | 'questioned' | 'limited' | 'overruled' | 'superseded';
export type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'citations-desc';

export interface SearchFilters {
  jurisdiction?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  courtLevel?: CourtLevel[];
  practiceArea?: string[];
  documentType?: DocumentType[];
  sort?: SortOption;
  citedBy?: number; // minimum citation count
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  naturalLanguage?: boolean;
}

// ==================== Search Results ====================

export interface Citation {
  id: string;
  text: string;
  citation: string;
  url?: string;
  caseId?: string;
  title?: string;
  court?: string;
  year?: number;
  treatment?: TreatmentStatus;
}

export interface KeyHolding {
  id: string;
  text: string;
  importance: 'primary' | 'secondary';
  tags?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  citation: string;
  type: DocumentType;
  snippet: string;
  highlightedSnippet?: string;
  court?: string;
  courtLevel?: CourtLevel;
  jurisdiction: string;
  date: string;
  relevanceScore: number;
  citationCount?: number;
  url?: string;
  treatment?: TreatmentStatus;
  keyCitations?: Citation[];
  keyHoldings?: KeyHolding[];
  practiceAreas?: string[];
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
  facets: {
    jurisdictions: { value: string; count: number }[];
    courtLevels: { value: string; count: number }[];
    practiceAreas: { value: string; count: number }[];
    documentTypes: { value: string; count: number }[];
    years: { value: string; count: number }[];
  };
  suggestions?: string[];
  page: number;
  limit: number;
  timestamp: string;
}

// ==================== Case Analysis ====================

export interface CaseSummary {
  facts: string;
  issue: string;
  holding: string;
  reasoning: string;
  outcome: string;
  significance?: string;
}

export interface ProceduralHistory {
  id: string;
  date: string;
  court: string;
  action: string;
  outcome?: string;
}

export interface LegalIssue {
  id: string;
  issue: string;
  ruling: string;
  reasoning: string;
  relevant: boolean;
}

export interface RelatedCase {
  id: string;
  title: string;
  citation: string;
  relationship: 'citing' | 'cited' | 'parallel' | 'distinguished' | 'overruled';
  relevanceScore: number;
  snippet?: string;
  treatment?: TreatmentStatus;
}

export interface CaseAnalysis {
  caseId: string;
  title: string;
  citation: string;
  court: string;
  date: string;
  judges?: string[];
  attorneys?: {
    petitioner?: string[];
    respondent?: string[];
  };
  summary: CaseSummary;
  proceduralHistory: ProceduralHistory[];
  legalIssues: LegalIssue[];
  keyHoldings: KeyHolding[];
  citedCases: RelatedCase[];
  citingCases: RelatedCase[];
  relatedCases: RelatedCase[];
  statutes: Citation[];
  practiceAreas: string[];
  keywords: string[];
  fullTextUrl?: string;
  aiGenerated: boolean;
  confidence?: number;
}

// ==================== AI Analysis ====================

export interface AIInsight {
  id: string;
  type: 'summary' | 'key_point' | 'opposing_view' | 'similar_case' | 'warning' | 'strategy';
  title: string;
  content: string;
  confidence: number;
  sources?: Citation[];
  tags?: string[];
}

export interface AIAnalysisResponse {
  caseId: string;
  insights: AIInsight[];
  opposingArguments?: {
    argument: string;
    supportingCases: Citation[];
  }[];
  strengthsWeaknesses?: {
    strengths: string[];
    weaknesses: string[];
  };
  strategicRecommendations?: string[];
  generatedAt: string;
}

// ==================== Citation Checking ====================

export interface CitationValidation {
  citation: string;
  status: TreatmentStatus;
  title?: string;
  url?: string;
  warnings?: string[];
  treatmentHistory?: {
    date: string;
    action: string;
    by: string;
    description: string;
  }[];
  lastChecked: string;
}

export interface CitationCheckResult {
  documentId: string;
  citations: CitationValidation[];
  summary: {
    total: number;
    valid: number;
    warnings: number;
    invalid: number;
  };
  generatedAt: string;
}

// ==================== Citation Network ====================

export interface CitationNode {
  id: string;
  title: string;
  citation: string;
  year: number;
  court: string;
  citationCount: number;
  treatment?: TreatmentStatus;
  isTarget?: boolean;
}

export interface CitationEdge {
  source: string;
  target: string;
  type: 'cites' | 'cited-by' | 'follows' | 'distinguishes' | 'overrules';
  strength?: number;
}

export interface CitationGraph {
  nodes: CitationNode[];
  edges: CitationEdge[];
  centerNodeId: string;
}

// ==================== Research History & Folders ====================

export interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  createdAt: string;
  lastUsed?: string;
  alertsEnabled?: boolean;
  resultCount?: number;
}

export interface ResearchFolder {
  id: string;
  name: string;
  description?: string;
  cases: string[]; // case IDs
  savedSearches: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  shared?: boolean;
  collaborators?: string[];
}

export interface ResearchHistoryItem {
  id: string;
  query: string;
  filters?: SearchFilters;
  timestamp: string;
  resultCount: number;
  userId?: string;
}

// ==================== Search Suggestions ====================

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'case' | 'statute' | 'topic';
  relevance: number;
  metadata?: {
    citation?: string;
    jurisdiction?: string;
    year?: number;
  };
}

export interface SearchTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: 'motion' | 'discovery' | 'appeal' | 'trial' | 'research';
  variables?: string[];
}

// ==================== Statute Types ====================

export interface StatuteSection {
  id: string;
  number: string;
  title: string;
  text: string;
  effectiveDate?: string;
  annotations?: string[];
}

export interface Statute {
  id: string;
  title: string;
  citation: string;
  jurisdiction: string;
  chapter?: string;
  sections: StatuteSection[];
  lastAmended?: string;
  currentVersion: boolean;
  relatedCases?: Citation[];
}

// ==================== Secondary Sources ====================

export interface SecondarySource {
  id: string;
  title: string;
  type: 'article' | 'treatise' | 'practice_guide' | 'law_review' | 'legal_encyclopedia';
  authors?: string[];
  publication?: string;
  date: string;
  snippet: string;
  url?: string;
  relevanceScore: number;
  citations?: Citation[];
}

// ==================== Citation Alert ====================

export interface CitationAlert {
  id: string;
  caseId: string;
  caseName: string;
  citation: string;
  alertType: 'treatment_change' | 'new_citing_case' | 'negative_treatment';
  enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  lastChecked?: string;
  createdAt: string;
}
