/**
 * Legal Research Feature - Main Export
 * Complete legal research system with AI-powered analysis
 */

// API & Hooks
export { 
  researchKeys,
  // React Query hooks
  useSearch,
  useNaturalLanguageSearch,
  useCaselaw,
  useStatutes,
  useSecondaryResearch,
  useSearchSuggestions,
  useSearchTemplates,
  useCaseAnalysis,
  useAIAnalysis,
  useSimilarCases,
  useOpposingArguments,
  useCitationCheck,
  useValidateCitation,
  useCitationGraph,
  useCitingCases,
  useCitedCases,
  useResearchHistory,
  useClearHistory,
  useDeleteHistoryItem,
  useSavedSearches,
  useCreateSavedSearch,
  useUpdateSavedSearch,
  useDeleteSavedSearch,
  useExecuteSavedSearch,
  useResearchFolders,
  useResearchFolder,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useAddCaseToFolder,
  useRemoveCaseFromFolder,
  useCitationAlerts,
  useCreateCitationAlert,
  useUpdateCitationAlert,
  useDeleteCitationAlert,
  useToggleCitationAlert,
  useStatute,
  useStatuteRelatedCases,
  useResearchSummary,
  useExtractKeyHoldings,
  useGenerateResearchMemo,
  useCasesLikeThis,
  useExportResults,
  useExportFolder,
} from './api';

// Types - use explicit exports to avoid conflicts with component names
export type {
  // Search Types
  DocumentType,
  CourtLevel,
  TreatmentStatus,
  SortOption,
  SearchFilters,
  SearchQuery,
  Citation,
  KeyHolding,
  SearchResult,
  SearchResponse,
  // Case Analysis Types
  CaseSummary,
  ProceduralHistory,
  LegalIssue,
  RelatedCase,
  CaseAnalysis,
  // AI Types
  AIInsight,
  AIAnalysisResponse,
  // Citation Types
  CitationValidation,
  CitationCheckResult,
  CitationNode,
  CitationEdge,
  CitationGraph as CitationGraphType,
  // Research Organization Types
  SavedSearch,
  ResearchFolder as ResearchFolderType,
  ResearchHistoryItem,
  SearchSuggestion,
  SearchTemplate,
  // Statute Types
  StatuteSection,
  Statute,
  SecondarySource,
  CitationAlert,
} from './api/research.types';

// Components
export { SearchBar } from './components/SearchBar';
export { SearchFilters as SearchFiltersPanel } from './components/SearchFilters';
export { ResultCard } from './components/ResultCard';
export { AIInsightCard, AIInsightList } from './components/AIInsightCard';
export { CitationChecker } from './components/CitationChecker';
export { CitationGraph as CitationGraphView } from './components/CitationGraph';
export { KeyciteIndicator, KeyciteBadge } from './components/KeyciteIndicator';
export { TermsHighlighter } from './components/TermsHighlighter';
export { ResearchFolder as ResearchFolderPanel, ResearchFolderList } from './components/ResearchFolder';

// Pages
export * from './pages';

// Store
export * from './store/research.store';
