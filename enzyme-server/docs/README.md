# LexiFlow AI Server Documentation

Welcome to the LexiFlow AI server documentation. This directory contains comprehensive documentation for the NestJS backend.

## Documentation Index

### 📚 API Documentation

- **[JSDOC_SUMMARY.md](./JSDOC_SUMMARY.md)** - Complete summary of JSDoc documentation added to the codebase
- **[API_JSDOC_GUIDE.md](./API_JSDOC_GUIDE.md)** - Quick reference guide for documented files

### 📖 Existing Documentation

- **[API_CONFIGURATION.md](../API_CONFIGURATION.md)** - API endpoint reference and configuration
- **[FRONTEND_INTEGRATION_SUMMARY.md](../FRONTEND_INTEGRATION_SUMMARY.md)** - Frontend-backend integration guide
- **[PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)** - Complete project structure overview

## Newly Documented Files

### Controllers
1. **AuthController** (`/src/modules/auth/auth.controller.ts`)
   - Login, registration, and user profile endpoints
   - JWT authentication flow
   - Security best practices

2. **CasesController** (`/src/modules/cases/cases.controller.ts`)
   - Case CRUD operations
   - Filtering and searching
   - Case lifecycle management

### Services
1. **AuthService** (`/src/modules/auth/auth.service.ts`)
   - User authentication logic
   - Password hashing with bcrypt
   - JWT token generation

2. **VectorSearchService** (`/src/services/vector-search.service.ts`)
   - Semantic search using pgvector
   - Vector similarity algorithms
   - Document search optimization

### Modules
1. **AppModule** (`/src/app.module.ts`)
   - Application bootstrap
   - Module dependencies
   - Database configuration

## Documentation Standards

All documented code includes:

✅ **Class-level documentation**
- Purpose and responsibility
- Usage examples
- Related components

✅ **Method-level documentation**
- Parameter descriptions
- Return value types
- Exception handling
- Real-world examples

✅ **Special tags**
- `@security` - Security considerations
- `@performance` - Performance notes
- `@throws` - Error conditions
- `@example` - Usage examples

## Viewing Documentation

### In Your IDE
Hover over any documented function or class to see inline documentation with:
- Full description
- Parameter details
- Return type information
- Usage examples

### Generate HTML Documentation

Install TypeDoc:
```bash
npm install --save-dev typedoc
```

Generate documentation:
```bash
npx typedoc --out docs/api src/
```

Open `docs/api/index.html` in your browser.

### Using Compodoc (NestJS-specific)

Install Compodoc:
```bash
npm install --save-dev @compodoc/compodoc
```

Generate and serve:
```bash
npx compodoc -p tsconfig.json -s
```

Opens interactive documentation at `http://localhost:8080`.

## Quick Start Examples

### Authentication Flow

```typescript
// Login
POST /api/v1/auth/login
{
  "email": "attorney@firm.com",
  "password": "SecurePass123!"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "attorney@firm.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "Partner"
  }
}
```

### Case Management

```typescript
// Create case
POST /api/v1/cases
{
  "title": "Smith v. Johnson",
  "client_name": "John Smith",
  "matter_type": "Civil Litigation",
  "jurisdiction": "New York"
}

// Get all cases
GET /api/v1/cases?orgId=org-uuid
```

### Vector Search

```typescript
// Semantic document search
const results = await vectorSearchService.semanticSearch(
  queryEmbedding,
  {
    query: "contract termination clause",
    limit: 10,
    threshold: 0.75,
    filters: { organizationId: "org-123" }
  }
);
```

## Documentation Coverage

| Module | Coverage | Status |
|--------|----------|--------|
| Authentication | 100% | ✅ Complete |
| Cases (Controller) | 90% | ✅ Complete |
| Vector Search | 100% | ✅ Complete |
| Documents | 0% | ⏳ Pending |
| Evidence | 0% | ⏳ Pending |
| Tasks | 0% | ⏳ Pending |
| Billing | 0% | ⏳ Pending |

**Overall Coverage**: ~20%
**Target**: 80%

## Contributing to Documentation

When adding new features:

1. **Document all public methods** with JSDoc
2. **Include @example tags** showing real usage
3. **Document exceptions** with @throws
4. **Add security notes** where applicable
5. **Update this README** with new documentation

### Template

```typescript
/**
 * Brief description of what this does
 * 
 * Detailed description explaining the functionality,
 * use cases, and any important considerations.
 * 
 * @param {Type} paramName - Parameter description
 * @returns {ReturnType} Description of return value
 * 
 * @throws {ExceptionType} When this exception occurs
 * 
 * @example
 * const result = await myMethod(param);
 * console.log(result); // Expected output
 */
```

## Resources

- [JSDoc Official Docs](https://jsdoc.app/)
- [TypeDoc Documentation](https://typedoc.org/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Compodoc](https://compodoc.app/)

## Support

For questions about documentation:
- Review existing documented files for examples
- Check [JSDOC_SUMMARY.md](./JSDOC_SUMMARY.md) for detailed coverage
- Contact the development team

---

**Last Updated**: November 30, 2024
**Maintained By**: LexiFlow Development Team
