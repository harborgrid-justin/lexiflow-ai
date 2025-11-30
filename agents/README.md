# Enterprise AI Agent Team

## Overview
This directory contains configurations for 10 specialized AI engineering agents designed to support the LexiFlow AI platform development and maintenance.

## Agent Roster

### 1. Backend Architecture Specialist (agent-001)
**Expertise**: NestJS module design, API patterns, dependency injection, authentication
**Best For**: Designing scalable backend features, refactoring APIs, implementing auth flows

### 2. Database & ORM Specialist (agent-002)
**Expertise**: PostgreSQL, Sequelize, query optimization, pgvector, migrations
**Best For**: Schema design, complex queries, vector search, database performance tuning

### 3. Frontend Architecture Specialist (agent-003)
**Expertise**: React 18+, TypeScript, state management, component patterns
**Best For**: Component hierarchies, custom hooks, performance optimization, architecture decisions

### 4. DOM & UI Engineering Specialist (agent-004)
**Expertise**: DOM manipulation, browser APIs, Tailwind CSS, animations
**Best For**: Complex UI interactions, accessibility, responsive design, event handling

### 5. API Integration Specialist (agent-005)
**Expertise**: REST clients, HTTP protocols, error handling, authentication flows
**Best For**: Building API clients, request optimization, auth state management

### 6. API Documentation Specialist (agent-006)
**Expertise**: Swagger/OpenAPI, NestJS decorators, API documentation
**Best For**: API documentation, schema generation, client SDK creation

### 7. TypeScript Type System Expert (agent-007)
**Expertise**: Advanced TypeScript, generics, type guards, validation
**Best For**: Type safety, runtime validation, complex type patterns, monorepo type sharing

### 8. Testing & QA Expert (agent-008)
**Expertise**: Jest, Playwright, integration testing, TDD/BDD
**Best For**: Test strategy, CI/CD pipelines, test coverage, E2E testing

### 9. Performance Engineering Specialist (agent-009)
**Expertise**: Full-stack optimization, caching, bundle size, Core Web Vitals
**Best For**: Performance profiling, optimization, monitoring, scalability

### 10. Security & DevOps Expert (agent-010)
**Expertise**: OWASP, authentication, RBAC, secrets management, auditing
**Best For**: Security audits, auth implementation, compliance, vulnerability scanning

## Usage Patterns

### Single Agent Consultation
For focused tasks, consult the relevant specialist:
```
Task: Optimize a slow database query
Agent: agent-002-database-expert
```

### Multi-Agent Collaboration
For complex features, engage multiple agents in sequence:

**New Feature Development**:
1. agent-007-typescript-guru → Define types
2. agent-002-database-expert → Create models & migrations
3. agent-001-backend-architect → Build API endpoints
4. agent-006-swagger-documentation → Document API
5. agent-005-api-integration → Create frontend client
6. agent-003-frontend-architect → Build UI components
7. agent-008-testing-qa → Write tests

**Performance Optimization**:
1. agent-009-performance-optimizer → Profile & analyze
2. agent-002-database-expert → Optimize queries
3. agent-003-frontend-architect → Optimize rendering
4. agent-004-dom-ui-specialist → Optimize DOM operations

**Security Review**:
1. agent-010-security-specialist → Conduct audit
2. agent-001-backend-architect → Review auth implementation
3. agent-007-typescript-guru → Add input validation

## Quick Reference

| Task Type | Primary Agent | Supporting Agents |
|-----------|---------------|-------------------|
| New API endpoint | agent-001 | agent-007, agent-006 |
| Database schema change | agent-002 | agent-007 |
| React component | agent-003 | agent-004, agent-007 |
| Complex UI interaction | agent-004 | agent-003 |
| API client | agent-005 | agent-007 |
| API docs | agent-006 | agent-001 |
| Type definitions | agent-007 | - |
| Testing | agent-008 | - |
| Performance issue | agent-009 | agent-002, agent-003 |
| Security concern | agent-010 | agent-001, agent-007 |

## Configuration File
See `agent-configurations.json` for detailed agent specifications including:
- Expertise areas
- Specializations
- Responsibilities
- Recommended tools
- Experience levels

## Integration with LexiFlow
All agents are pre-configured with knowledge of:
- LexiFlow architecture (React frontend + NestJS backend)
- Tech stack (TypeScript, PostgreSQL, Sequelize, Swagger)
- Project structure and conventions
- Current codebase patterns

## Notes
- All agents available 24/7
- Experience levels range from Senior Engineer to Principal Engineer
- Agents can work independently or collaboratively
- Each agent has specific tool recommendations for their domain
