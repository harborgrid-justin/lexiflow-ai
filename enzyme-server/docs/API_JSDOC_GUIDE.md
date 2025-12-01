# LexiFlow AI - JSDoc Documentation Guide

Comprehensive JSDoc documentation has been added to key server files including:

## Documented Files

### Controllers
- `/modules/auth/auth.controller.ts` - Authentication endpoints with full JSDoc
- `/modules/cases/cases.controller.ts` - Case management endpoints with examples

### Services  
- `/modules/auth/auth.service.ts` - Authentication business logic with security notes
- `/services/vector-search.service.ts` - Vector search with algorithm documentation

### Module
- `/app.module.ts` - Main application module with file overview

## JSDoc Standards Applied

All documented code includes:
- Class-level documentation with `@class`, `@description`, `@example`
- Method-level documentation with `@param`, `@returns`, `@throws`
- Security considerations with `@security` tags
- Performance notes with `@performance` tags
- Real-world usage examples

## Viewing Documentation

Documentation can be viewed:
1. **In IDE** - Hover over any documented function/class
2. **Generate HTML** - Use TypeDoc: `npx typedoc --out docs/api src/`
3. **Source code** - Read inline comments

## Example Usage

See the documented files for examples of:
- JWT authentication flow
- Case CRUD operations
- Vector similarity search
- Password hashing and validation

All public methods now have comprehensive documentation for improved developer experience.
