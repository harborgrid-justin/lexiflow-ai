# Contributing to LexiFlow AI

Thank you for your interest in contributing to LexiFlow AI! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Git
- PostgreSQL 14+ (or Neon account)
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lexiflow-ai.git
   cd lexiflow-ai
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd nestjs
   npm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env.local` (frontend)
   - Copy `nestjs/.env.example` to `nestjs/.env` (backend)
   - Update with your credentials

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd nestjs
   npm run start:dev
   ```

## Development Workflow

### Branching Strategy
We use Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation

### Creating a Branch
```bash
# Feature branch
git checkout -b feature/add-document-versioning

# Bug fix branch
git checkout -b bugfix/fix-case-search

# Hotfix branch
git checkout -b hotfix/security-patch
```

## Coding Standards

### TypeScript
- Use strict mode
- Avoid `any` types
- Prefer interfaces over types for object shapes
- Use enums for fixed sets of values
- Document complex type definitions

### React/Frontend
- **Components**: Use functional components with hooks
- **File naming**: PascalCase for components (`CaseDetail.tsx`)
- **Props**: Define interfaces for all component props
- **Hooks**: Prefix custom hooks with `use` (`useCaseDetail.ts`)
- **Styling**: Use Tailwind CSS utility classes
- **Imports**: Follow order - React → External → Local → Types → Services

Example:
```tsx
import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Card } from './common/Card';
import { Document } from '../types';
import { ApiService } from '../services/apiService';

interface DocumentListProps {
  caseId: string;
  onSelect: (doc: Document) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ caseId, onSelect }) => {
  // Component implementation
};
```

### NestJS/Backend
- **File naming**: kebab-case (`case.controller.ts`)
- **Modules**: One feature per module
- **DTOs**: Use class-validator decorators
- **Services**: Keep business logic in services
- **Controllers**: Keep controllers thin
- **Swagger**: Document all endpoints

Example:
```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CaseService } from './case.service';
import { CreateCaseDto } from './dto/create-case.dto';

@ApiTags('cases')
@Controller('api/v1/cases')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({ status: 201, description: 'Case created successfully' })
  async create(@Body() createCaseDto: CreateCaseDto) {
    return this.caseService.create(createCaseDto);
  }
}
```

### Database
- **Migrations**: Always create migrations for schema changes
- **Models**: Define proper associations
- **Queries**: Optimize with indexes
- **Transactions**: Use for multi-table operations

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

### Examples
```bash
feat(cases): add document versioning support

- Add version tracking to documents
- Implement version comparison UI
- Update API endpoints for versions

Closes #123

fix(auth): resolve JWT token expiration issue

The refresh token wasn't being properly validated.
Now checks expiration before refresh.

Fixes #456

docs(api): update Swagger documentation for case endpoints
```

## Pull Request Process

### Before Submitting
1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

2. **Run tests**
   ```bash
   npm test
   cd nestjs && npm test
   ```

3. **Lint your code**
   ```bash
   npm run lint
   cd nestjs && npm run lint
   ```

4. **Type check**
   ```bash
   npx tsc --noEmit
   ```

### Submitting PR
1. Push your branch to your fork
2. Create PR against `develop` branch
3. Fill out the PR template completely
4. Link related issues
5. Request review from maintainers

### PR Review Process
- At least one approval required
- All CI checks must pass
- No merge conflicts
- Code review feedback addressed
- Documentation updated (if needed)

## Testing Guidelines

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Aim for 80%+ coverage

```typescript
describe('CaseService', () => {
  it('should create a case', async () => {
    const dto = { title: 'Test Case' };
    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(result.title).toBe('Test Case');
  });
});
```

### Integration Tests
- Test API endpoints with Supertest
- Use test database
- Test database interactions

```typescript
describe('Cases API', () => {
  it('POST /api/v1/cases should create case', () => {
    return request(app)
      .post('/api/v1/cases')
      .send({ title: 'Test Case' })
      .expect(201);
  });
});
```

### E2E Tests
- Test critical user flows
- Use Playwright or Cypress
- Test across browsers

## Documentation

### Code Comments
- Use JSDoc for functions and classes
- Explain "why" not "what"
- Document complex algorithms

```typescript
/**
 * Calculates billable hours for a case with tier-based pricing
 * @param caseId - The case identifier
 * @param month - Month to calculate (YYYY-MM format)
 * @returns Total billable amount with breakdown by tier
 */
async calculateBillableHours(caseId: string, month: string): Promise<BillingBreakdown> {
  // Implementation
}
```

### API Documentation
- Use Swagger decorators
- Provide request/response examples
- Document error responses

### README Updates
- Update if adding new features
- Keep setup instructions current
- Add examples for new APIs

## Questions?

- Open a [discussion](https://github.com/lexiflow-ai/lexiflow/discussions)
- Join our [Discord](https://discord.gg/lexiflow)
- Email: developers@lexiflow.ai

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to LexiFlow AI! 🎉
