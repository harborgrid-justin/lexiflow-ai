# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LexiFlow AI is a full-stack legal case management suite with AI-powered document search. The frontend is a React SPA and the backend is a NestJS API with PostgreSQL + pgvector for semantic search.

## Commands

### Frontend (root directory)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend (nestjs/ directory)
```bash
cd nestjs
npm install          # Install dependencies
npm run start:dev    # Start with auto-reload (port 3001)
npm run build        # Compile TypeScript
npm run start:prod   # Run production build
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting
npm test             # Run unit tests
npm run test:watch   # Tests in watch mode
npm run test:cov     # Tests with coverage
npm run test:e2e     # End-to-end tests
```

### Database Setup (requires PostgreSQL 14+ with pgvector)
```bash
# Windows
./nestjs/src/database/scripts/setup_database.ps1

# Linux/macOS
./nestjs/src/database/scripts/setup_database.sh
```

## Architecture

```
lexiflow-ai/
├── Frontend (React 19 + Vite + TypeScript)
│   ├── App.tsx              # Root component with navigation/state
│   ├── index.tsx            # React DOM entry
│   ├── types.ts             # Shared TypeScript interfaces
│   ├── components/          # 118 React components in 16 subdirectories
│   ├── hooks/               # 6 custom hooks (useCaseDetail, useCaseList, etc.)
│   ├── services/            # API client, Gemini AI, document handling
│   └── data/                # Mock data for development
│
└── nestjs/                  # Backend (NestJS 10 + Sequelize + PostgreSQL)
    └── src/
        ├── main.ts          # Bootstrap, starts server on port 3001
        ├── app.module.ts    # Root module, initializes DB and all feature modules
        ├── models/          # 22 Sequelize models (Organization, User, Case, Document, etc.)
        ├── modules/         # 20 feature modules (auth, cases, documents, search, etc.)
        ├── services/        # Global services (VectorSearchService)
        └── database/        # Migrations, seeders, setup scripts
```

### Module Pattern (Backend)

Each NestJS module follows a consistent structure:
- `*.module.ts` - Dependency injection configuration
- `*.controller.ts` - HTTP endpoint handlers with route definitions
- `*.service.ts` - Business logic and database operations

### Key Services

- **apiService.ts** (frontend): HTTP client with JWT auth handling, auto-redirects on 401
- **geminiService.ts** (frontend): Google Gemini AI integration for document analysis
- **VectorSearchService** (backend): Semantic search using pgvector embeddings

### Database Models with AI Features

The backend includes 4 AI-specific models for vector search:
- `DocumentEmbedding` - Vector embeddings for semantic search
- `LegalCitation` - Extracted legal citations
- `DocumentAnalysis` - AI-generated document analysis
- `SearchQuery` - Search analytics and query tracking

## API Endpoints

All backend APIs are prefixed with `/api/v1/`. Key endpoints:

- **Auth**: `POST /auth/login`, `POST /auth/register`
- **Cases**: `GET/POST /cases`, `GET/PATCH /cases/:id`
- **Documents**: `GET/POST /documents`, `GET /documents/:id`
- **Search (AI)**: `POST /search/semantic`, `POST /search/hybrid`, `GET /search/similar-documents/:id`

## Environment Variables

Frontend uses `.env.local` with `GEMINI_API_KEY`.

Backend requires `.env` (copy from `.env.example`):
- `DB_*` - PostgreSQL connection
- `JWT_SECRET` - Auth token signing
- `OPENAI_API_KEY` - Vector embeddings (ada-002)
- `FRONTEND_URL` / `CORS_ORIGINS` - CORS configuration

## Key Patterns

1. **Multi-tenant isolation**: All queries filter by `organizationId`
2. **JWT auth**: Passport strategies with `@CurrentUser()` decorator
3. **Vector search**: pgvector with IVFFlat indexes, hybrid search combines keyword + semantic
4. **Database indexes**: 150+ indexes for performance optimization
