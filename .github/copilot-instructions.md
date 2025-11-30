# LexiFlow AI - Copilot Instructions

## Project Overview

LexiFlow is an enterprise legal case management platform with AI capabilities. It consists of:
- **React Frontend** (Vite + TypeScript) - SPA at project root
- **NestJS Backend** (`nestjs/`) - REST API with PostgreSQL + pgvector

## Architecture

### Frontend Data Flow
```
App.tsx (router) → Feature Components → Custom Hooks (useCaseDetail, etc.) → ApiService → Backend
                                     ↘ GeminiService (AI features)
```

### Key Patterns

**Component Organization**: Feature components in `components/` with sub-modules in nested folders:
- `components/case-detail/` - Case-specific tabs (CaseDocuments, CaseMotions, etc.)
- `components/common/` - Reusable UI primitives (Card, Button, Modal, Table, etc.)
- `components/admin/`, `components/calendar/` - Feature groupings

**Custom Hooks** (`hooks/`): Encapsulate state + API calls for complex views. Example: `useCaseDetail.ts` manages documents, workflow stages, billing, and timeline aggregation.

**Type Definitions**: All domain types live in `types.ts` - includes enums (`CaseStatus`, `MotionType`), role types (`UserRole`), and 30+ entity interfaces.

**API Layer**: `services/apiService.ts` provides typed CRUD methods with JWT auth handling. Mock data in `data/mock*.ts` mirrors API shape.

**AI Integration**: `services/geminiService.ts` wraps Gemini 2.5 Flash for document analysis, research, drafting, and docket parsing. Uses structured JSON responses.

### Backend (NestJS)
- Modules in `nestjs/src/modules/` follow Controller → Service → Model pattern
- 22 Sequelize models with PostgreSQL + pgvector for semantic search
- API prefix: `/api/v1/`, Swagger docs at `/api/docs`
- Vector search via `VectorSearchService` for document similarity

## Development Commands

```bash
# Frontend (root directory)
npm install
npm run dev          # Vite dev server on port 3000

# Backend (nestjs directory)
cd nestjs
npm install
npm run start:dev    # NestJS on port 3001
```

## Environment Setup

**Frontend** (`.env.local` in root):
```
GEMINI_API_KEY=your_gemini_api_key
```

**Backend** (`nestjs/.env`):
```
DATABASE_URL=postgresql://neondb_owner:npg_JxVMIUH4dvQ9@ep-aged-shape-adexd9x0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_jwt_secret
```

The backend uses **Neon** (serverless PostgreSQL) with pgvector extension for vector similarity search.

## Code Conventions

### Component Structure
```tsx
// Import pattern: React → External libs → Local components → Types → Services
import React, { useState, useEffect } from 'react';
import { SomeIcon } from 'lucide-react';
import { Card } from './common/Card';
import { Case } from '../types';
import { ApiService } from '../services/apiService';
```

### Styling
- Tailwind CSS utility classes directly in JSX
- Consistent color palette: `slate-*` for neutrals, `blue-*` for primary actions
- Common patterns: `rounded-lg shadow-sm border border-slate-200` for cards

### RBAC Pattern
Role-based UI filtering happens at component level. See `Sidebar.tsx`:
```tsx
if (currentUser.role === 'Administrator' || currentUser.role === 'Senior Partner') {
  baseMenuItems.push(/* admin items */);
}
```

### API Patterns
- Use `ApiService` methods, not raw `fetch`
- All endpoints return typed responses matching `types.ts`
- Error handling redirects to `/login` on 401

## Important Files

| File | Purpose |
|------|---------|
| `types.ts` | All TypeScript interfaces and enums |
| `App.tsx` | Root component with view routing |
| `services/apiService.ts` | API client with auth |
| `services/geminiService.ts` | AI feature implementations |
| `components/common/` | Shared UI components |
| `hooks/use*.ts` | State management for complex views |
| `nestjs/PROJECT_STRUCTURE.md` | Full backend architecture docs |

## AI Feature Integration

When adding AI features, use `GeminiService` methods with structured JSON schemas:
```typescript
// Example: Document analysis returns typed object
const result = await GeminiService.analyzeDocument(content);
// Returns: { summary: string; riskScore: number }
```

Available AI methods: `analyzeDocument`, `conductResearch`, `generateDraft`, `generateWorkflow`, `reviewContract`, `refineTimeEntry`, `parseDocket`

## Testing Note

No test framework is currently configured. Backend has Jest setup in `nestjs/package.json` but tests are pending.
