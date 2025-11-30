# Claude AI Agent Team for LexiFlow

## Overview
This directory contains 10 specialized AI agent configurations designed to work with Claude AI in the LexiFlow platform. Each agent is an expert in specific aspects of enterprise full-stack development.

## Agent Directory

### 🏗️ Backend & Infrastructure
1. **[backend-architect.md](backend-architect.md)**
   - NestJS & API Design Expert
   - Module architecture, authentication, performance

2. **[database-expert.md](database-expert.md)**
   - PostgreSQL & Sequelize Expert
   - Schema design, query optimization, pgvector

### ⚛️ Frontend & UI
3. **[frontend-architect.md](frontend-architect.md)**
   - React & TypeScript Expert
   - Component architecture, state management, hooks

4. **[dom-ui-specialist.md](dom-ui-specialist.md)**
   - Browser API & DOM Expert
   - UI interactions, animations, accessibility

### 🔗 Integration & Documentation
5. **[api-integration-specialist.md](api-integration-specialist.md)**
   - REST API & Client-Server Expert
   - API clients, error handling, authentication

6. **[swagger-documentation-expert.md](swagger-documentation-expert.md)**
   - Swagger/OpenAPI Expert
   - API documentation, schema generation

### 🛡️ Quality & Security
7. **[typescript-guru.md](typescript-guru.md)**
   - Advanced TypeScript Specialist
   - Type safety, generics, validation

8. **[testing-qa-expert.md](testing-qa-expert.md)**
   - Full-Stack Testing Specialist
   - Unit, integration, E2E testing

9. **[performance-optimizer.md](performance-optimizer.md)**
   - Performance Engineering Expert
   - Optimization, caching, monitoring

10. **[security-specialist.md](security-specialist.md)**
    - Application Security Expert
    - OWASP, authentication, compliance

## How to Use These Agents with Claude

### Method 1: Custom Instructions
Copy the content of any agent file and paste it into Claude's custom instructions or system prompt:

```
Use the agent file as your persona for the conversation.
Example: "Act as the Backend Architecture Specialist from backend-architect.md"
```

### Method 2: Direct Reference
When asking Claude for help, reference the agent directly:

```
"Using the guidance from the database-expert agent, help me optimize this query..."
```

### Method 3: Multi-Agent Collaboration
For complex tasks, engage multiple agents in sequence:

```
"First, consult the typescript-guru agent to design types for a new feature.
Then, consult the database-expert agent to design the schema.
Finally, consult the backend-architect agent to implement the API."
```

## Common Workflows

### New Feature Development
```
1. typescript-guru → Define shared types
2. database-expert → Design schema & models
3. backend-architect → Build API endpoints
4. swagger-documentation-expert → Document API
5. api-integration-specialist → Create frontend client
6. frontend-architect → Build UI components
7. testing-qa-expert → Write tests
```

### Performance Optimization
```
1. performance-optimizer → Profile & identify bottlenecks
2. database-expert → Optimize queries
3. frontend-architect → Optimize rendering
4. dom-ui-specialist → Optimize DOM operations
```

### Security Review
```
1. security-specialist → Conduct security audit
2. backend-architect → Review authentication
3. typescript-guru → Add input validation
4. testing-qa-expert → Add security tests
```

## Quick Reference Table

| Task | Primary Agent | Supporting Agents |
|------|---------------|-------------------|
| New API endpoint | backend-architect | typescript-guru, swagger-documentation-expert |
| Database schema | database-expert | typescript-guru |
| React component | frontend-architect | dom-ui-specialist, typescript-guru |
| Complex UI | dom-ui-specialist | frontend-architect |
| API client | api-integration-specialist | typescript-guru |
| API docs | swagger-documentation-expert | backend-architect |
| Type safety | typescript-guru | - |
| Testing | testing-qa-expert | - |
| Performance | performance-optimizer | database-expert, frontend-architect |
| Security | security-specialist | backend-architect, typescript-guru |

## Agent Capabilities

Each agent includes:
- **Role & Expertise** - Clear definition of specialization
- **Specializations** - Detailed technical skills
- **Primary Responsibilities** - What they focus on
- **LexiFlow Context** - Project-specific knowledge
- **Communication Style** - How they explain concepts
- **Example Tasks** - Common use cases

## Tips for Effective Agent Usage

1. **Be Specific**: Reference the exact agent and task
2. **Provide Context**: Share relevant code or requirements
3. **Sequential Consultation**: For complex tasks, engage agents in order
4. **Cross-Reference**: Agents can reference each other's recommendations
5. **Ask for Rationale**: Agents explain their decisions

## Integration with LexiFlow

All agents are pre-configured with:
- LexiFlow architecture (React + NestJS)
- Tech stack (TypeScript, PostgreSQL, Sequelize, Swagger)
- Project structure (component organization, API patterns)
- Current conventions (Tailwind CSS, JWT auth, RBAC)

## Example Usage

### Simple Query
```
"Hey Claude, act as the backend-architect agent and help me design 
a new module for invoice management with CRUD operations."
```

### Complex Task
```
"I need to add a document versioning feature. Let's consult:
1. typescript-guru for the types
2. database-expert for the schema
3. backend-architect for the API
4. frontend-architect for the UI
Walk me through each step."
```

### Code Review
```
"As the security-specialist agent, review this authentication 
middleware for vulnerabilities."
```

## Notes

- Agents have varying experience levels (Senior to Principal)
- All agents are context-aware of LexiFlow architecture
- Agents can work independently or collaboratively
- Each agent provides tool and library recommendations
- Agents consider best practices and industry standards

---

**Version**: 1.0.0  
**Platform**: LexiFlow AI - Enterprise Legal Case Management  
**Created**: 2025-11-30
