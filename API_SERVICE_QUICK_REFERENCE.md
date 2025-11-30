# LexiFlow API Service - Quick Reference Guide

## Import
```typescript
import { ApiService, ApiError } from './services/apiService';
```

## Quick API Reference

### Authentication
```typescript
// Login and store token
const { access_token, user } = await ApiService.auth.login(email, password);
ApiService.setAuthToken(access_token);

// Register
await ApiService.auth.register({ email, password, name, role });

// Get current user
const user = await ApiService.auth.getCurrentUser();

// Check if authenticated
if (ApiService.isAuthenticated()) { /* ... */ }

// Logout
ApiService.clearAuthToken();
```

### Cases
```typescript
ApiService.cases.getAll(orgId?)
ApiService.cases.getById(id)
ApiService.cases.getByClient(clientName)
ApiService.cases.getByStatus(status)
ApiService.cases.create(data)
ApiService.cases.update(id, data)
ApiService.cases.delete(id)
```

### Documents
```typescript
ApiService.documents.getAll(caseId?, orgId?)
ApiService.documents.getById(id)
ApiService.documents.getByType(type)
ApiService.documents.create(data)
ApiService.documents.update(id, data)
ApiService.documents.delete(id)
```

### Evidence
```typescript
ApiService.evidence.getAll(caseId?)
ApiService.evidence.getById(id)
ApiService.evidence.create(data)
ApiService.evidence.update(id, data)
ApiService.evidence.delete(id)
```

### Messages
```typescript
// Conversations
ApiService.messages.conversations.getAll(caseId?, userId?)
ApiService.messages.conversations.getById(id)
ApiService.messages.conversations.create(data)
ApiService.messages.conversations.update(id, data)
ApiService.messages.conversations.getMessages(conversationId)

// Messages
ApiService.messages.create(data)
ApiService.messages.getById(id)
ApiService.messages.update(id, data)
```

### Workflow
```typescript
// Stages
ApiService.workflow.stages.getAll(caseId?)
ApiService.workflow.stages.getById(id)
ApiService.workflow.stages.create(data)
ApiService.workflow.stages.update(id, data)

// Tasks
ApiService.workflow.tasks.getAll(stageId?, assigneeId?)
ApiService.workflow.tasks.getById(id)
ApiService.workflow.tasks.create(data)
ApiService.workflow.tasks.update(id, data)
```

### Motions
```typescript
ApiService.motions.getAll(caseId?)
ApiService.motions.getById(id)
ApiService.motions.getByStatus(status)
ApiService.motions.create(data)
ApiService.motions.update(id, data)
ApiService.motions.delete(id)
```

### Discovery
```typescript
ApiService.discovery.getAll(caseId?)
ApiService.discovery.getById(id)
ApiService.discovery.create(data)
ApiService.discovery.update(id, data)
ApiService.discovery.delete(id)
```

### Billing
```typescript
// Time Entries
ApiService.billing.timeEntries.getAll(caseId?, userId?)
ApiService.billing.timeEntries.getById(id)
ApiService.billing.timeEntries.create(data)
ApiService.billing.timeEntries.update(id, data)
ApiService.billing.timeEntries.delete(id)

// Stats
ApiService.billing.getStats(caseId?, startDate?, endDate?)
```

### Calendar
```typescript
ApiService.calendar.getAll(caseId?, startDate?, endDate?)
ApiService.calendar.getById(id)
ApiService.calendar.getUpcoming(days?)
ApiService.calendar.getByType(type)
ApiService.calendar.create(data)
ApiService.calendar.update(id, data)
```

### Tasks
```typescript
ApiService.tasks.getAll(caseId?, assigneeId?)
ApiService.tasks.getById(id)
ApiService.tasks.getByStatus(status)
ApiService.tasks.create(data)
ApiService.tasks.update(id, data)
ApiService.tasks.delete(id)
```

### Users
```typescript
ApiService.users.getAll(orgId?)
ApiService.users.getById(id)
ApiService.users.getByEmail(email)
ApiService.users.update(id, data)
ApiService.users.delete(id)
```

### Organizations
```typescript
ApiService.organizations.getAll()
ApiService.organizations.getById(id)
ApiService.organizations.create(data)
ApiService.organizations.update(id, data)
ApiService.organizations.delete(id)
```

### Clients
```typescript
ApiService.clients.getAll(orgId?)
ApiService.clients.getById(id)
ApiService.clients.getByName(name)
ApiService.clients.create(data)
ApiService.clients.update(id, data)
ApiService.clients.delete(id)
```

### Analytics
```typescript
ApiService.analytics.getAll(caseId?, metricType?)
ApiService.analytics.getById(id)
ApiService.analytics.getCasePrediction(caseId)
ApiService.analytics.getJudgeAnalytics(judgeName)
ApiService.analytics.getCounselPerformance(counselName)
ApiService.analytics.create(data)
```

### Compliance
```typescript
ApiService.compliance.getAll(orgId?)
ApiService.compliance.getById(id)
ApiService.compliance.getByRiskLevel(riskLevel)
ApiService.compliance.create(data)
ApiService.compliance.update(id, data)
```

### Knowledge Base
```typescript
ApiService.knowledge.getAll(category?)
ApiService.knowledge.getById(id)
ApiService.knowledge.search(query)
ApiService.knowledge.create(data)
ApiService.knowledge.update(id, data)
```

### Jurisdictions
```typescript
ApiService.jurisdictions.getAll(country?)
ApiService.jurisdictions.getById(id)
ApiService.jurisdictions.getByCode(code)
ApiService.jurisdictions.create(data)
ApiService.jurisdictions.update(id, data)
```

### Clauses
```typescript
ApiService.clauses.getAll(category?, type?)
ApiService.clauses.getById(id)
ApiService.clauses.search(query)
ApiService.clauses.create(data)
ApiService.clauses.update(id, data)
```

### Advanced Search
```typescript
// Semantic search
ApiService.search.semantic(query, limit?, threshold?)

// Hybrid search (semantic + keyword)
ApiService.search.hybrid(query, limit?, semanticWeight?)

// Find similar documents
ApiService.search.findSimilarDocuments(documentId, limit?)

// Extract legal citations
ApiService.search.extractLegalCitations(text, documentId?)

// Search history
ApiService.search.getQueryHistory(limit?)
```

## Error Handling Pattern

```typescript
import { ApiService, ApiError } from './services/apiService';

async function loadData() {
  try {
    const data = await ApiService.cases.getAll();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      // API error with details
      switch (error.status) {
        case 400:
          console.error('Bad request:', error.data);
          break;
        case 401:
          // User already redirected to login
          console.error('Unauthorized');
          break;
        case 403:
          console.error('Forbidden:', error.statusText);
          break;
        case 404:
          console.error('Not found');
          break;
        case 500:
        case 502:
        case 503:
          // Already retried 3 times
          console.error('Server error:', error.statusText);
          break;
        default:
          console.error('API error:', error.statusText);
      }
    } else {
      // Network or other error
      console.error('Network error:', error);
    }
    throw error;
  }
}
```

## React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { ApiService, ApiError } from '../services/apiService';
import { Case } from '../types';

function useCases(orgId?: string) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const data = await ApiService.cases.getAll(orgId);
        setCases(data);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.statusText);
        } else {
          setError('Network error');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, [orgId]);

  return { cases, loading, error };
}
```

## Configuration

### Environment Variables
Set in `.env` file:
```
REACT_APP_API_URL=http://localhost:3001/api/v1
```

For production:
```
REACT_APP_API_URL=https://api.lexiflow.com/api/v1
```

## Backend Information
- **Port**: 3001
- **Base URL**: http://localhost:3001
- **API Prefix**: /api/v1
- **Documentation**: http://localhost:3001/api/docs

## Features
- Automatic retry on 5xx errors (3 retries with exponential backoff)
- Automatic token management
- Automatic redirect on 401 Unauthorized
- Type-safe API calls
- URL parameter encoding
- Query string builder
- Comprehensive error handling
