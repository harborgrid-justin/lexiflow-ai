# Case Management Module

The core case management feature for LexiFlow AI - designed to exceed Westlaw and LexisNexis case management capabilities.

## Structure

```
features/cases/
├── api/
│   ├── cases.api.ts       # TanStack Query hooks
│   └── cases.types.ts     # TypeScript interfaces
├── components/
│   ├── CaseStatusBadge.tsx
│   ├── CaseFilters.tsx
│   ├── CaseCard.tsx
│   ├── CaseRow.tsx
│   ├── CaseKanbanCard.tsx
│   ├── CaseTimeline.tsx
│   ├── CaseParties.tsx
│   ├── CaseSidebar.tsx
│   └── CreateCaseDialog.tsx
├── pages/
│   ├── CaseListPage.tsx   # Main list view with filters
│   └── CaseDetailPage.tsx # Detailed case view with tabs
├── store/
│   └── cases.store.ts     # State management
└── index.ts               # Public API
```

## Features

### Case List Page
- **Multiple View Modes**: Table, Grid, and Kanban views
- **Advanced Filtering**: Status, practice area, attorney, client, court, jurisdiction, date range, priority
- **Saved Filter Presets**: Save and reuse common filter combinations
- **Bulk Operations**: Archive, delete, or update multiple cases
- **Export**: CSV, XLSX, PDF export options
- **Real-time Search**: Search across case titles, numbers, and descriptions
- **Responsive Design**: Works on desktop, tablet, and mobile

### Case Detail Page
- **Tabbed Interface**:
  - **Overview**: Quick stats, recent activity, and description
  - **Documents**: Linked documents with preview
  - **Parties**: All involved parties with attorney information
  - **Timeline**: Chronological activity feed
  - **Tasks**: Case-specific tasks (coming soon)
  - **Billing**: Time entries and invoices (coming soon)
  - **Notes**: Case notes and memos (coming soon)
  - **Discovery**: Discovery documents and requests (coming soon)
- **Information Sidebar**: Key case details and metrics
- **Quick Actions**: Edit, delete, and more

### Case Creation
- **Multi-step Wizard**:
  1. Basic Info: Title, number, type, practice area
  2. Client & Parties: Client and involved parties
  3. Court & Jurisdiction: Court and legal jurisdiction
  4. Key Dates: Important dates and deadlines
  5. Team: Assign attorneys and staff
  6. Review: Review and create case
- **Form Validation**: Zod schemas for data validation
- **Progressive Disclosure**: Only show relevant fields

## API Hooks

### Query Hooks
```typescript
import { useCases, useCase, useCaseTimeline, useCaseParties } from '@/features/cases';

// List cases with filters
const { cases, isLoading, total } = useCases({
  filters: {
    status: ['Active', 'Pending'],
    practiceArea: ['Litigation'],
  },
  page: 1,
  limit: 20,
});

// Get single case
const { case: caseData, isLoading } = useCase(caseId);

// Get case timeline
const { timeline, isLoading } = useCaseTimeline(caseId);

// Get case parties
const { parties, isLoading } = useCaseParties(caseId);
```

### Mutation Hooks
```typescript
import { useCreateCase, useUpdateCase, useDeleteCase } from '@/features/cases';

// Create case
const { createCase } = useCreateCase();
await createCase({
  title: 'Smith v. Jones',
  client: 'John Smith',
  matterType: 'Litigation',
  status: 'Active',
});

// Update case
const { updateCase } = useUpdateCase();
await updateCase(caseId, { status: 'Closed' });

// Delete case
const { deleteCase } = useDeleteCase();
await deleteCase(caseId);
```

## State Management

```typescript
import { useCaseStore } from '@/features/cases';

const {
  // View mode
  viewMode,
  setViewMode,

  // Filters
  filters,
  setFilters,
  updateFilter,
  clearFilters,
  hasActiveFilters,

  // Selection
  selectedCases,
  toggleCaseSelection,
  clearSelection,

  // Presets
  saveFilterPreset,
  filterPresets,
} = useCaseStore();
```

## Components

### CaseListPage
Main list view with multiple display modes and advanced filtering.

```typescript
import { CaseListPage } from '@/features/cases';

function App() {
  return <CaseListPage />;
}
```

### CaseDetailPage
Comprehensive case detail view with tabbed interface.

```typescript
import { CaseDetailPage } from '@/features/cases';

function App() {
  return <CaseDetailPage />;
}
```

### CreateCaseDialog
Multi-step wizard for creating new cases.

```typescript
import { CreateCaseDialog } from '@/features/cases';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { createCase } = useCreateCase();

  return (
    <CreateCaseDialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={createCase}
      availableAttorneys={attorneys}
    />
  );
}
```

## Backend API Endpoints

The case management module expects these backend endpoints:

- `GET /api/v1/cases` - List cases with pagination and filters
- `GET /api/v1/cases/:id` - Get single case
- `POST /api/v1/cases` - Create new case
- `PATCH /api/v1/cases/:id` - Update case
- `DELETE /api/v1/cases/:id` - Delete case
- `GET /api/v1/cases/:id/timeline` - Get case timeline
- `GET /api/v1/cases/:id/parties` - Get case parties
- `GET /api/v1/cases/:id/members` - Get case team members
- `GET /api/v1/cases/:id/metrics` - Get case metrics

## Design Principles

1. **Information Dense**: Show maximum information without overwhelming
2. **Fast & Responsive**: Optimized for speed with TanStack Query caching
3. **Flexible Views**: Multiple view modes for different workflows
4. **Power User Features**: Keyboard shortcuts, bulk operations, saved filters
5. **Mobile-Friendly**: Responsive design that works on all devices
6. **Accessible**: WCAG 2.1 AA compliant

## Performance Considerations

- TanStack Query for automatic caching and background refetching
- Virtual scrolling for large case lists (coming soon)
- Lazy loading of tabs and components
- Optimistic updates for instant feedback
- Debounced search to reduce API calls

## Future Enhancements

- [ ] Advanced search with boolean operators
- [ ] Case templates for common case types
- [ ] Batch import from PACER
- [ ] Case analytics and reporting
- [ ] Calendar integration
- [ ] Email integration
- [ ] Document automation
- [ ] AI-powered case insights
- [ ] Conflict checking
- [ ] Statute of limitations tracking

## Contributing

When adding new features to the case management module:

1. Add types to `api/cases.types.ts`
2. Add API hooks to `api/cases.api.ts`
3. Create components in `components/`
4. Update pages as needed
5. Export from `index.ts`
6. Update this README

## License

Proprietary - LexiFlow AI
