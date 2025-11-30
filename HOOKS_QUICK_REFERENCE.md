# React Hooks Quick Reference Guide

## Quick Start

All hooks now fetch real data from the NestJS backend running at `http://localhost:3001/api/v1`.

## Common Usage Patterns

### 1. Basic Hook Usage with Loading & Error States

```tsx
import { useCaseList } from './hooks/useCaseList';

function CaseListComponent() {
  const {
    cases,
    loading,
    error,
    filteredCases,
    addCase,
    refresh
  } = useCaseList();

  if (loading) return <div>Loading cases...</div>;
  if (error) return <div>Error: {error} <button onClick={refresh}>Retry</button></div>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {filteredCases.map(c => (
        <div key={c.id}>{c.title}</div>
      ))}
    </div>
  );
}
```

### 2. Create Operations with Error Handling

```tsx
async function handleCreateCase() {
  try {
    const newCase = await addCase({
      title: 'New Case',
      status: 'Open',
      client: 'Client Name'
    });
    console.log('Case created:', newCase);
  } catch (err) {
    // Error is already set in the hook
    console.error('Failed to create case:', err);
  }
}
```

### 3. Update Operations

```tsx
async function handleUpdateCase(caseId: string) {
  try {
    await updateCase(caseId, { status: 'Closed' });
  } catch (err) {
    console.error('Failed to update case:', err);
  }
}
```

### 4. Delete Operations

```tsx
async function handleDeleteCase(caseId: string) {
  if (confirm('Are you sure?')) {
    try {
      await deleteCase(caseId);
    } catch (err) {
      console.error('Failed to delete case:', err);
    }
  }
}
```

## Hook Cheat Sheet

### useCaseList

```tsx
const {
  cases,              // All cases from backend
  loading,            // Initial loading state
  error,              // Error message (if any)
  refreshing,         // Background refresh state
  filteredCases,      // Filtered by status/type
  addCase,            // Create new case
  updateCase,         // Update existing case
  deleteCase,         // Delete case
  refresh,            // Reload data
} = useCaseList();
```

### useCaseDetail

```tsx
const {
  documents,          // Case documents
  stages,             // Workflow stages
  billingEntries,     // Time entries
  motions,            // Case motions
  loading,            // Loading state
  error,              // Error message
  timelineEvents,     // Aggregated timeline
  createDocument,     // Add document
  addTimeEntry,       // Add billing entry
  toggleTask,         // Update task status
  refresh,            // Reload all data
} = useCaseDetail(caseData);
```

### useDocumentManager

```tsx
const {
  documents,          // All documents
  filtered,           // Filtered documents
  loading,            // Loading state
  error,              // Error message
  addTag,             // Add tag to document
  removeTag,          // Remove tag
  stats,              // Document statistics
  refresh,            // Reload documents
} = useDocumentManager();
```

### useEvidenceVault

```tsx
const {
  evidenceItems,      // All evidence
  filteredItems,      // Filtered evidence
  selectedItem,       // Currently selected
  loading,            // Loading state
  error,              // Error message
  handleIntakeComplete,    // Log new evidence
  handleCustodyUpdate,     // Update chain of custody
  refresh,            // Reload evidence
} = useEvidenceVault();
```

### useSecureMessenger

```tsx
const {
  conversations,      // All conversations
  activeConversation, // Current conversation
  loading,            // Loading state
  error,              // Error message
  handleSendMessage,  // Send message
  contacts,           // Contact list
  refresh,            // Reload conversations
} = useSecureMessenger(currentUserId);
```

### useCalendarView

```tsx
const {
  events,             // Calendar events
  loading,            // Loading state
  error,              // Error message
  getEventsForDay,    // Get events for date
  changeMonth,        // Navigate months
  refresh,            // Reload calendar
} = useCalendarView();
```

## API Service Quick Reference

### Authentication

```typescript
// Login
const { access_token, user } = await ApiService.auth.login(email, password);
ApiService.setAuthToken(access_token);

// Get current user
const user = await ApiService.auth.getCurrentUser();

// Logout
ApiService.clearAuthToken();
```

### Cases

```typescript
// Get all cases
const cases = await ApiService.cases.getAll();

// Get case by ID
const case = await ApiService.cases.getById(id);

// Create case
const newCase = await ApiService.cases.create(data);

// Update case
const updated = await ApiService.cases.update(id, data);

// Delete case
await ApiService.cases.delete(id);
```

### Documents

```typescript
// Get all documents (optionally filter by case)
const docs = await ApiService.documents.getAll(caseId);

// Create document
const doc = await ApiService.documents.create(data);

// Update document
await ApiService.documents.update(id, data);
```

### Evidence

```typescript
// Get all evidence
const items = await ApiService.evidence.getAll();

// Create evidence
const item = await ApiService.evidence.create(data);

// Update evidence
await ApiService.evidence.update(id, data);
```

### Tasks

```typescript
// Get all tasks
const tasks = await ApiService.tasks.getAll();

// Update task
await ApiService.tasks.update(id, { status: 'Done' });
```

### Billing

```typescript
// Get time entries
const entries = await ApiService.billing.timeEntries.getAll(caseId);

// Create time entry
const entry = await ApiService.billing.timeEntries.create(data);
```

## Error Handling Best Practices

### 1. Display Error to User

```tsx
{error && (
  <div className="error-banner">
    <p>{error}</p>
    <button onClick={refresh}>Try Again</button>
  </div>
)}
```

### 2. Handle Specific Error Types

```tsx
import { ApiError } from './services/apiService';

try {
  await someOperation();
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 404) {
      console.log('Resource not found');
    } else if (err.status === 403) {
      console.log('Permission denied');
    }
  }
}
```

### 3. Toast Notifications

```tsx
try {
  await addCase(newCase);
  toast.success('Case created successfully!');
} catch (err) {
  toast.error(error || 'Failed to create case');
}
```

## Loading States Best Practices

### 1. Skeleton Screens

```tsx
if (loading) {
  return <SkeletonLoader />;
}
```

### 2. Inline Loaders

```tsx
<button onClick={handleSubmit} disabled={loading}>
  {loading ? <Spinner /> : 'Submit'}
</button>
```

### 3. Refresh Indicator

```tsx
<button onClick={refresh} disabled={refreshing}>
  {refreshing ? 'Refreshing...' : 'Refresh'}
</button>
```

## Common Pitfalls & Solutions

### 1. Stale Data After Mutation

```tsx
// ✅ Good - Refresh after mutation
async function handleUpdate() {
  await updateCase(id, data);
  await refresh(); // Ensures fresh data
}

// ❌ Bad - State might be stale
async function handleUpdate() {
  await updateCase(id, data);
  // UI shows old data
}
```

### 2. Missing Error Handling

```tsx
// ✅ Good - Always handle errors
try {
  await someOperation();
} catch (err) {
  // Error is set in hook state
}

// ❌ Bad - Unhandled promise rejection
someOperation(); // No error handling
```

### 3. Calling Hooks Conditionally

```tsx
// ❌ Bad - Conditional hook call
if (condition) {
  const { data } = useMyHook();
}

// ✅ Good - Always call hooks
const { data } = useMyHook();
if (condition && data) {
  // Use data
}
```

## Performance Tips

### 1. Avoid Unnecessary Re-fetches

```tsx
// ✅ Good - Only fetch when needed
useEffect(() => {
  if (caseId) {
    fetchCaseDetails();
  }
}, [caseId]); // Only re-fetch when caseId changes

// ❌ Bad - Fetches on every render
useEffect(() => {
  fetchCaseDetails();
}); // Missing dependency array
```

### 2. Debounce Search

```tsx
const [searchTerm, setSearchTerm] = useState('');

const debouncedSearch = useMemo(
  () => debounce((term) => performSearch(term), 300),
  []
);

useEffect(() => {
  debouncedSearch(searchTerm);
}, [searchTerm]);
```

### 3. Pagination

```tsx
// For large datasets, implement pagination
const {
  items,
  page,
  setPage,
  hasMore
} = usePaginatedList();

<button onClick={() => setPage(page + 1)} disabled={!hasMore}>
  Load More
</button>
```

## TypeScript Tips

### 1. Type Your Data

```tsx
interface FormData {
  title: string;
  status: 'Open' | 'Closed';
  client: string;
}

const [formData, setFormData] = useState<FormData>({
  title: '',
  status: 'Open',
  client: ''
});
```

### 2. Use Type Guards

```tsx
if (error && error instanceof ApiError) {
  // TypeScript knows this is ApiError
  console.log(error.status);
}
```

### 3. Type Async Handlers

```tsx
const handleSubmit = async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();
  await addCase(formData);
};
```

## Testing Your Integration

### 1. Check Backend is Running

```bash
curl http://localhost:3001/api/v1/cases
```

### 2. Verify Authentication

```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### 3. Test Hook in Isolation

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useCaseList } from './useCaseList';

test('loads cases', async () => {
  const { result } = renderHook(() => useCaseList());

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.cases.length).toBeGreaterThan(0);
  });
});
```

## Environment Configuration

### Development (.env.development)

```env
REACT_APP_API_URL=http://localhost:3001/api/v1
```

### Production (.env.production)

```env
REACT_APP_API_URL=https://api.lexiflow.com/api/v1
```

## Debugging Tips

### 1. Enable API Logging

```typescript
// In apiService.ts, add logging
async function fetchJson<T>(endpoint: string): Promise<T> {
  console.log('API Request:', endpoint);
  const result = await fetchWithRetry<T>(...);
  console.log('API Response:', result);
  return result;
}
```

### 2. Use React DevTools

- Install React Developer Tools extension
- Inspect hook state in Components tab
- Track re-renders with Profiler

### 3. Network Tab

- Open Browser DevTools → Network tab
- Filter by XHR/Fetch
- Inspect request/response payloads

## Support & Resources

- Backend API Docs: `http://localhost:3001/api/docs`
- Full Documentation: `HOOKS_BACKEND_INTEGRATION.md`
- NestJS Documentation: `nestjs/README.md`

## Quick Commands

```bash
# Start backend
cd nestjs && npm run start:dev

# Start frontend
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

**Last Updated**: 2025-11-29
**Backend Version**: NestJS v10
**Frontend Version**: React 18 + TypeScript
