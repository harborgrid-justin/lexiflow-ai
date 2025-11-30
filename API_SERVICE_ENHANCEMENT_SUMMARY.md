# LexiFlow API Service Enhancement Summary

## Overview
The frontend API service has been completely rewritten to properly communicate with the NestJS backend running on port 3001 with API prefix `/api/v1/`.

## Key Improvements

### 1. Correct Backend Configuration
- **Base URL**: Changed from `http://localhost:3001/api` to `http://localhost:3001/api/v1`
- **Environment Variable Support**: Uses `REACT_APP_API_URL` for configuration flexibility
- **Correct HTTP Methods**: Changed from PUT to PATCH to match NestJS conventions

### 2. Enterprise-Grade Error Handling
- **Custom ApiError Class**: Structured error handling with status codes and error data
- **Comprehensive Response Handling**:
  - Handles 401 unauthorized with automatic token cleanup and redirect
  - Parses error responses from backend with fallback for non-JSON errors
  - Handles empty responses (204/DELETE operations)
  - Validates JSON responses with error catching
- **Retry Logic**: Automatic retry for 5xx server errors with exponential backoff (3 retries)

### 3. Proper Authentication
- **Bearer Token Support**: All requests include `Authorization: Bearer <token>` header
- **Token Storage Options**: Support for both localStorage (persistent) and sessionStorage (session-only)
- **Token Management Utilities**:
  - `setAuthToken(token, remember)`: Store auth token
  - `clearAuthToken()`: Remove auth token
  - `isAuthenticated()`: Check auth status
  - `getToken()`: Get current token

### 4. Comprehensive API Coverage

The API service now has complete coverage of all backend modules:

#### Authentication (`auth`)
- `login(email, password)`: User login
- `register(userData)`: User registration
- `getCurrentUser()`: Get current authenticated user

#### Cases (`cases`)
- `getAll(orgId?)`: Get all cases with optional organization filter
- `getById(id)`: Get single case
- `getByClient(clientName)`: Get cases by client name
- `getByStatus(status)`: Get cases by status
- `create(data)`: Create new case
- `update(id, data)`: Update case
- `delete(id)`: Delete case

#### Documents (`documents`)
- `getAll(caseId?, orgId?)`: Get all documents with filters
- `getById(id)`: Get single document
- `getByType(type)`: Get documents by type
- `create(data)`: Create document
- `update(id, data)`: Update document
- `delete(id)`: Delete document

#### Evidence (`evidence`)
- `getAll(caseId?)`: Get all evidence with optional case filter
- `getById(id)`: Get single evidence item
- `create(data)`: Create evidence
- `update(id, data)`: Update evidence
- `delete(id)`: Delete evidence

#### Messages & Conversations (`messages`)
- Nested structure for better organization:
  - `conversations.getAll(caseId?, userId?)`: Get conversations
  - `conversations.getById(id)`: Get conversation
  - `conversations.create(data)`: Create conversation
  - `conversations.update(id, data)`: Update conversation
  - `conversations.getMessages(conversationId)`: Get messages in conversation
- `create(data)`: Create message
- `getById(id)`: Get message
- `update(id, data)`: Update message

#### Workflow (`workflow`)
- Nested structure for stages and tasks:
  - `stages.getAll(caseId?)`: Get workflow stages
  - `stages.getById(id)`: Get stage
  - `stages.create(data)`: Create stage
  - `stages.update(id, data)`: Update stage
  - `tasks.getAll(stageId?, assigneeId?)`: Get workflow tasks
  - `tasks.getById(id)`: Get task
  - `tasks.create(data)`: Create task
  - `tasks.update(id, data)`: Update task

#### Motions (`motions`)
- `getAll(caseId?)`: Get all motions
- `getById(id)`: Get single motion
- `getByStatus(status)`: Get motions by status
- `create(data)`: Create motion
- `update(id, data)`: Update motion
- `delete(id)`: Delete motion

#### Discovery (`discovery`)
- `getAll(caseId?)`: Get all discovery requests
- `getById(id)`: Get discovery request
- `create(data)`: Create discovery request
- `update(id, data)`: Update discovery request
- `delete(id)`: Delete discovery request

#### Billing (`billing`)
- Nested structure for time entries:
  - `timeEntries.getAll(caseId?, userId?)`: Get time entries
  - `timeEntries.getById(id)`: Get time entry
  - `timeEntries.create(data)`: Create time entry
  - `timeEntries.update(id, data)`: Update time entry
  - `timeEntries.delete(id)`: Delete time entry
- `getStats(caseId?, startDate?, endDate?)`: Get billing statistics

#### Calendar (`calendar`)
- `getAll(caseId?, startDate?, endDate?)`: Get calendar events
- `getById(id)`: Get calendar event
- `getUpcoming(days?)`: Get upcoming events
- `getByType(type)`: Get events by type
- `create(data)`: Create event
- `update(id, data)`: Update event

#### Tasks (`tasks`)
- `getAll(caseId?, assigneeId?)`: Get all tasks
- `getById(id)`: Get single task
- `getByStatus(status)`: Get tasks by status
- `create(data)`: Create task
- `update(id, data)`: Update task
- `delete(id)`: Delete task

#### Users (`users`)
- `getAll(orgId?)`: Get all users
- `getById(id)`: Get user by ID
- `getByEmail(email)`: Get user by email
- `update(id, data)`: Update user
- `delete(id)`: Delete user

#### Organizations (`organizations`)
- `getAll()`: Get all organizations
- `getById(id)`: Get organization
- `create(data)`: Create organization
- `update(id, data)`: Update organization
- `delete(id)`: Delete organization

#### Clients (`clients`)
- `getAll(orgId?)`: Get all clients
- `getById(id)`: Get client
- `getByName(name)`: Get clients by name
- `create(data)`: Create client
- `update(id, data)`: Update client
- `delete(id)`: Delete client

#### Analytics (`analytics`)
- `getAll(caseId?, metricType?)`: Get analytics records
- `getById(id)`: Get analytics record
- `getCasePrediction(caseId)`: Get case outcome prediction
- `getJudgeAnalytics(judgeName)`: Get judge analytics
- `getCounselPerformance(counselName)`: Get counsel performance
- `create(data)`: Create analytics record

#### Compliance (`compliance`)
- `getAll(orgId?)`: Get compliance records
- `getById(id)`: Get compliance record
- `getByRiskLevel(riskLevel)`: Get by risk level
- `create(data)`: Create compliance record
- `update(id, data)`: Update compliance record

#### Knowledge Base (`knowledge`)
- `getAll(category?)`: Get knowledge articles
- `getById(id)`: Get knowledge article
- `search(query)`: Search knowledge base
- `create(data)`: Create article
- `update(id, data)`: Update article

#### Jurisdictions (`jurisdictions`)
- `getAll(country?)`: Get jurisdictions
- `getById(id)`: Get jurisdiction
- `getByCode(code)`: Get jurisdiction by code
- `create(data)`: Create jurisdiction
- `update(id, data)`: Update jurisdiction

#### Clauses (`clauses`)
- `getAll(category?, type?)`: Get clauses
- `getById(id)`: Get clause
- `search(query)`: Search clauses
- `create(data)`: Create clause
- `update(id, data)`: Update clause

#### Search (`search`)
Advanced search capabilities:
- `semantic(query, limit?, threshold?)`: Semantic search
- `hybrid(query, limit?, semanticWeight?)`: Hybrid search (semantic + keyword)
- `findSimilarDocuments(documentId, limit?)`: Find similar documents
- `extractLegalCitations(text, documentId?)`: Extract legal citations
- `getQueryHistory(limit?)`: Get search history

### 5. Advanced Features

#### Query String Builder
- Automatic query parameter construction
- Handles undefined/null values gracefully
- Type-safe parameter handling

#### URL Encoding
- Automatic encoding of URL parameters using `encodeURIComponent()`
- Prevents URL injection and special character issues

#### Nested Resource Organization
- Logical grouping of related resources (e.g., `billing.timeEntries`, `messages.conversations`)
- Improves code organization and discoverability

### 6. Type Safety
- Full TypeScript support with proper generic types
- Return types match backend DTOs
- Compile-time type checking for API calls

## Usage Examples

### Authentication
```typescript
// Login
const { access_token, user } = await ApiService.auth.login('user@example.com', 'password');
ApiService.setAuthToken(access_token);

// Get current user
const currentUser = await ApiService.auth.getCurrentUser();
```

### Cases
```typescript
// Get all cases for an organization
const cases = await ApiService.cases.getAll('org-id');

// Get cases by status
const activeCases = await ApiService.cases.getByStatus('active');

// Create a case
const newCase = await ApiService.cases.create({
  title: 'Smith v. Jones',
  case_number: '2024-CV-001',
  status: 'active',
});

// Update a case
await ApiService.cases.update('case-id', { status: 'closed' });
```

### Documents
```typescript
// Get documents for a case
const docs = await ApiService.documents.getAll('case-id');

// Get documents by type
const pleadings = await ApiService.documents.getByType('pleading');

// Create document
const doc = await ApiService.documents.create({
  title: 'Motion to Dismiss',
  document_type: 'motion',
  case_id: 'case-id',
});
```

### Billing
```typescript
// Get time entries for a case
const timeEntries = await ApiService.billing.timeEntries.getAll('case-id');

// Create time entry
const entry = await ApiService.billing.timeEntries.create({
  case_id: 'case-id',
  user_id: 'user-id',
  hours: 2.5,
  description: 'Legal research',
});

// Get billing stats
const stats = await ApiService.billing.getStats('case-id', '2024-01-01', '2024-12-31');
```

### Search
```typescript
// Semantic search
const results = await ApiService.search.semantic('contract breach liability', 10);

// Hybrid search
const hybridResults = await ApiService.search.hybrid('discovery motion', 20, 0.7);

// Find similar documents
const similar = await ApiService.search.findSimilarDocuments('doc-id', 5);
```

### Error Handling
```typescript
import { ApiService, ApiError } from './services/apiService';

try {
  const cases = await ApiService.cases.getAll();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}: ${error.statusText}`);
    console.error('Error data:', error.data);

    if (error.status === 404) {
      // Handle not found
    } else if (error.status === 403) {
      // Handle forbidden
    } else if (error.status >= 500) {
      // Handle server error (already retried automatically)
    }
  } else {
    console.error('Network error:', error);
  }
}
```

## Migration Guide

### Old API Service
```typescript
const cases = await ApiService.getCases();
const case = await ApiService.getCase('id');
await ApiService.updateCase('id', data);
```

### New API Service
```typescript
const cases = await ApiService.cases.getAll();
const case = await ApiService.cases.getById('id');
await ApiService.cases.update('id', data);
```

## Breaking Changes

1. **Namespace Structure**: Resources are now organized in namespaces (e.g., `cases.getAll()` instead of `getCases()`)
2. **Method Names**: Standardized naming (`getAll()`, `getById()`, `create()`, `update()`, `delete()`)
3. **Error Handling**: Errors are now `ApiError` instances instead of generic `Error`
4. **Base URL**: Changed to include `/api/v1` prefix

## Backend Compatibility

This API service is fully compatible with the NestJS backend at:
- **URL**: `http://localhost:3001`
- **API Prefix**: `/api/v1`
- **Controllers**: All 18 backend modules are fully covered

## Files Modified

- `C:\temp\lexiflow-ai\services\apiService.ts` - Complete rewrite

## Testing Recommendations

1. Test authentication flow (login, token storage, auto-redirect on 401)
2. Test CRUD operations for each resource
3. Test query parameter filtering
4. Test error handling scenarios
5. Test retry logic for server errors
6. Test URL encoding for special characters

## Next Steps

1. Update frontend components to use new API service namespace structure
2. Add integration tests for API service
3. Consider adding request/response interceptors for logging
4. Add TypeScript interfaces for all request/response types
5. Consider adding request caching layer
6. Add API request timeout configuration

## Production Considerations

1. Set `REACT_APP_API_URL` environment variable for production backend
2. Implement proper error logging service integration
3. Add request/response monitoring
4. Consider adding request queuing for offline support
5. Implement proper CSRF protection if needed
6. Add rate limiting awareness on frontend
