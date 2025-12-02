# LexiFlow AI - Legal Research Feature

A revolutionary legal research interface that uses AI to exceed capabilities of Westlaw, LexisNexis, and Bloomberg Law.

## Features

### Core Capabilities
- **AI-Powered Search**: Natural language queries with intelligent suggestions
- **Comprehensive Database**: Access to 50M+ cases, 10M+ statutes, 5M+ articles
- **Advanced Filtering**: Jurisdiction, court level, date range, practice area, document type
- **Citation Network**: Visualize case relationships and citation graphs
- **Case Analysis**: AI-generated summaries, key holdings, procedural history
- **Citation Checking**: Validate citations and check treatment status
- **Research Organization**: Folders, saved searches, and research history

### AI Features
- Case summaries and key holdings extraction
- Similar case suggestions
- Opposing arguments finder
- Strategic recommendations
- Strengths & weaknesses analysis
- AI confidence scoring

## Directory Structure

```
/client/features/research/
├── api/
│   ├── research.types.ts      # TypeScript types
│   ├── research.service.ts    # API service methods
│   ├── research.api.ts        # TanStack Query hooks
│   └── index.ts
├── components/
│   ├── SearchBar.tsx          # Advanced search input
│   ├── SearchFilters.tsx      # Faceted filter panel
│   ├── ResultCard.tsx         # Search result display
│   ├── AIInsightCard.tsx      # AI-generated insights
│   ├── CitationChecker.tsx    # Citation validation
│   ├── CitationGraph.tsx      # Citation network visualization
│   ├── KeyciteIndicator.tsx   # Treatment status indicator
│   ├── TermsHighlighter.tsx   # Search term highlighting
│   ├── ResearchFolder.tsx     # Research organization
│   └── index.ts
├── pages/
│   ├── ResearchPage.tsx       # Main dashboard
│   ├── SearchResultsPage.tsx  # Search results with filters
│   ├── CaseAnalysisPage.tsx   # Detailed case analysis
│   └── index.ts
├── store/
│   └── research.store.ts      # State management
├── index.ts
└── README.md
```

## API Hooks

### Search Hooks
- `useSearch(query, filters)` - Main search
- `useNaturalLanguageSearch()` - Natural language queries
- `useCaselaw(query, filters)` - Case law search
- `useStatutes(query, jurisdiction)` - Statutes search
- `useSecondaryResearch(query, types)` - Secondary sources
- `useSearchSuggestions(partialQuery)` - Autocomplete suggestions
- `useSearchTemplates(category)` - Search templates

### Case Analysis Hooks
- `useCaseAnalysis(caseId)` - Detailed case analysis
- `useAIAnalysis(caseId)` - AI-powered insights
- `useSimilarCases(caseId, limit)` - Similar cases
- `useOpposingArguments()` - Counter-arguments

### Citation Hooks
- `useCitationCheck(documentId)` - Validate citations
- `useValidateCitation()` - Single citation validation
- `useCitationGraph(caseId, depth)` - Citation network
- `useCitingCases(caseId, limit)` - Cases citing this case
- `useCitedCases(caseId, limit)` - Cases cited by this case

### Research Management Hooks
- `useResearchHistory(limit)` - Search history
- `useSavedSearches()` - Saved searches
- `useResearchFolders()` - Research folders
- `useCitationAlerts()` - Citation alerts

## Components

### SearchBar
Advanced search input with AI suggestions and natural language support.

```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  onSearch={handleSearch}
  enableAI={true}
  showSuggestions={true}
/>
```

### SearchFilters
Faceted filter panel for refining search results.

```tsx
<SearchFilters
  filters={filters}
  onChange={setFilters}
  facets={searchResults?.facets}
  onReset={resetFilters}
/>
```

### ResultCard
Display search results with key information and quick actions.

```tsx
<ResultCard
  result={result}
  searchQuery={query}
  onSave={handleSave}
  onAddToFolder={handleAddToFolder}
  onViewCase={handleViewCase}
  isSaved={isSaved}
/>
```

### AIInsightCard
Display AI-generated insights and analysis.

```tsx
<AIInsightCard
  insight={insight}
  onViewSource={handleViewSource}
  collapsible={true}
/>
```

### CitationGraph
Visualize citation relationships between cases.

```tsx
<CitationGraph
  graph={citationGraph}
  onNodeClick={handleNodeClick}
  height={600}
/>
```

### CitationChecker
Upload and validate citations in documents.

```tsx
<CitationChecker
  documentId={docId}
  onUpload={handleUpload}
/>
```

### KeyciteIndicator
Display case treatment status (like Westlaw's KeyCite).

```tsx
<KeyciteIndicator
  status="valid"
  size="md"
  showLabel={true}
/>
```

## Pages

### ResearchPage
Main dashboard with search, templates, history, and folders.

**Route**: `/research`

### SearchResultsPage
Search results page with faceted filters and AI insights.

**Route**: `/research/search?q={query}`

### CaseAnalysisPage
Detailed case analysis with AI insights and citation network.

**Route**: `/research/cases/:caseId`

## State Management

The research store manages:
- Current search query and filters
- Saved results and folders
- View preferences
- UI state (filters visibility, etc.)

```tsx
import { useResearchStore } from './store/research.store';

function MyComponent() {
  const {
    currentQuery,
    setCurrentQuery,
    filters,
    setFilters,
    savedResultIds,
    addSavedResult,
  } = useResearchStore();

  // Use the store...
}
```

## Backend Integration

### Required Endpoints

The frontend expects these backend endpoints:

#### Search
- `POST /api/v1/search` - Main search
- `POST /api/v1/search/natural-language` - Natural language search
- `POST /api/v1/research/caselaw` - Case law search
- `POST /api/v1/research/statutes` - Statutes search
- `POST /api/v1/research/secondary` - Secondary sources
- `GET /api/v1/search/suggestions?q={query}` - Search suggestions
- `GET /api/v1/search/templates` - Search templates

#### Case Analysis
- `GET /api/v1/research/cases/:id/analysis` - Case analysis
- `POST /api/v1/ai/analyze-case` - AI case analysis
- `GET /api/v1/research/cases/:id/similar` - Similar cases
- `POST /api/v1/ai/opposing-arguments` - Opposing arguments

#### Citations
- `POST /api/v1/ai/citation-check` - Check citations
- `POST /api/v1/research/citations/validate` - Validate citation
- `GET /api/v1/research/cases/:id/citation-graph` - Citation graph
- `GET /api/v1/research/cases/:id/citing` - Citing cases
- `GET /api/v1/research/cases/:id/cited` - Cited cases

#### Research Management
- `GET /api/v1/research/history` - Research history
- `GET /api/v1/research/saved-searches` - Saved searches
- `GET /api/v1/research/folders` - Research folders
- `GET /api/v1/research/citation-alerts` - Citation alerts

## Installation

1. The feature is already set up in `/client/features/research/`

2. Import and use in your app:

```tsx
import { ResearchPage, SearchResultsPage, CaseAnalysisPage } from './features/research';

// In your router:
<Route path="/research" element={<ResearchPage />} />
<Route path="/research/search" element={<SearchResultsPage />} />
<Route path="/research/cases/:caseId" element={<CaseAnalysisPage />} />
```

3. Ensure TanStack Query is set up in your app root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

## Optional: Zustand Installation

For better performance and dev tools, install Zustand:

```bash
cd /home/user/lexiflow-ai/client
npm install zustand
```

Then update `/store/research.store.ts` to use the Zustand implementation (commented at the bottom of the file).

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Enzyme** - API hooks and utilities
- **React Router** - Navigation

## Key Design Decisions

1. **Feature-based architecture**: All research-related code is colocated
2. **Type-safe API layer**: Full TypeScript coverage for API calls
3. **Smart caching**: TanStack Query caches results intelligently
4. **AI-first**: AI features are integrated throughout, not bolted on
5. **Professional UI**: Clean, lawyer-friendly interface
6. **Extensible**: Easy to add new search types, filters, and AI features

## Future Enhancements

- [ ] Real-time collaboration on research folders
- [ ] Advanced citation network with D3.js force-directed graph
- [ ] Voice search with speech-to-text
- [ ] Research memo generation
- [ ] Integration with case management
- [ ] Offline mode with IndexedDB
- [ ] Chrome extension for in-browser citation checking
- [ ] Mobile app (React Native)

## Performance

- Search results cached for 5 minutes
- AI analysis cached for 15 minutes
- Lazy loading for large result sets
- Optimistic updates for saved searches
- Debounced search suggestions (300ms)
- Code splitting by route

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Screen reader friendly
- Color contrast compliant (WCAG AA)
- Focus indicators
- Semantic HTML

## License

Proprietary - LexiFlow AI

## Support

For questions or issues, contact the LexiFlow AI development team.
