# API Type Safety Guide

## Overview

This document explains the type-safe API communication strategy between the LexiFlow AI frontend and backend.

## Architecture

### Three-Layer Type System

1. **Shared Types** (`/shared-types/index.ts`)
   - Defines the actual API contract
   - Uses snake_case to match backend database schema
   - Types prefixed with `Api` (e.g., `ApiUser`, `ApiCase`)
   - Shared between frontend and backend

2. **Frontend Types** (`/types.ts`)
   - UI-focused types using camelCase
   - Optimized for React component props
   - May include computed/derived fields
   - Not always 1:1 with API responses

3. **Backend DTOs** (`/nestjs/src/modules/*/dto/`)
   - Request validation types
   - Response DTOs for Swagger documentation
   - Uses snake_case to match database

## Key Differences: Frontend vs API Types

### User Entity

**API Response (snake_case):**
```typescript
interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  organization_id: string;
  created_at: Date;
  updated_at: Date;
}
```

**Frontend Type (camelCase):**
```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  office?: string;
  orgId?: string;
  avatar?: string;
}
```

### Case Entity

**API Response:**
```typescript
interface ApiCase {
  id: string;
  title: string;
  client_name: string;
  opposing_counsel?: string;
  filing_date?: Date;
  owner_org_id?: string;
  created_at: Date;
  updated_at: Date;
}
```

**Frontend Type:**
```typescript
interface Case {
  id: string;
  title: string;
  client: string;
  opposingCounsel: string;
  filingDate: string;
  ownerOrgId?: string;
}
```

## Using Type Transformers

### Import the Transformers

```typescript
import { transformApiUser, transformApiCase, transformers } from '../utils/type-transformers';
import { ApiUser, ApiCase } from '../shared-types';
```

### Single Entity Transformation

```typescript
// Fetch from API (returns snake_case)
const apiUser: ApiUser = await ApiService.getUser(userId);

// Transform to frontend format (camelCase)
const user: User = transformApiUser(apiUser);

// Now use in React components
<UserProfile user={user} />
```

### Batch Transformation

```typescript
// Fetch multiple entities
const apiCases: ApiCase[] = await ApiService.getCases();

// Transform all at once
const cases: Case[] = transformers.cases(apiCases);

// Use in UI
setCases(cases);
```

## Available Transformers

- `transformApiUser(apiUser)` → `User`
- `transformApiCase(apiCase)` → `Case`
- `transformApiDocument(apiDoc)` → `LegalDocument`
- `transformApiEvidence(apiEvidence)` → `EvidenceItem`
- `transformApiTask(apiTask)` → `WorkflowTask`
- `transformApiMotion(apiMotion)` → `Motion`
- `transformApiDiscovery(apiDiscovery)` → `DiscoveryRequest`
- `transformApiClient(apiClient)` → `Client`
- `transformApiOrganization(apiOrg)` → `Organization`

Batch versions available via `transformers` object.

## Creating API Requests

When sending data to the API, use the Request DTOs:

```typescript
import { CreateCaseRequest, UpdateUserRequest } from '../shared-types';

// Creating a case
const caseData: CreateCaseRequest = {
  title: 'Smith vs. Jones',
  client_name: 'ABC Corp',  // Note: snake_case
  filing_date: '2024-01-15',
  matter_type: 'Litigation',
};

const newCase = await ApiService.createCase(caseData);
```

## Backend DTO Structure

Each backend module should have:

```
/nestjs/src/modules/users/dto/
  ├── create-user.dto.ts      # Validation for POST requests
  ├── update-user.dto.ts      # Validation for PATCH requests
  ├── user-response.dto.ts    # Response format (optional)
  └── index.ts                # Export all DTOs
```

## Type Safety Checklist

- [ ] Use `ApiUser`, `ApiCase`, etc. when calling `ApiService` methods
- [ ] Transform API responses before passing to React components
- [ ] Use `CreateXRequest` types when creating entities
- [ ] Use `UpdateXRequest` types when updating entities
- [ ] Never mix frontend types with API calls
- [ ] Always use snake_case for API request bodies

## Common Patterns

### React Hook with Transformation

```typescript
const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiCases = await ApiService.getCases();
        const transformedCases = transformers.cases(apiCases);
        setCases(transformedCases);
      } catch (error) {
        console.error('Failed to fetch cases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  return { cases, loading };
};
```

### Form Submission

```typescript
const handleCreateCase = async (formData: any) => {
  // Convert form data to API format
  const request: CreateCaseRequest = {
    title: formData.title,
    client_name: formData.clientName,  // Convert camelCase to snake_case
    filing_date: formData.filingDate,
    matter_type: formData.matterType,
  };

  const apiCase = await ApiService.createCase(request);
  const newCase = transformApiCase(apiCase);

  // Update UI
  setCases(prev => [...prev, newCase]);
};
```

## Backend Response Best Practices

### Always Exclude Sensitive Fields

```typescript
// In auth.service.ts
async login(loginDto: LoginDto) {
  const user = await this.validateUser(loginDto.email, loginDto.password);

  // Remove password_hash before returning
  const { password_hash, ...safeUser } = user.toJSON();

  return {
    access_token: this.jwtService.sign(payload),
    user: safeUser,
  };
}
```

### Use Response DTOs

```typescript
// user-response.dto.ts
export class UserResponseDto {
  static fromModel(user: User): UserResponseDto {
    const { password_hash, ...userData } = user.toJSON();
    return userData as UserResponseDto;
  }
}

// In controller
@Get(':id')
async getUser(@Param('id') id: string) {
  const user = await this.usersService.findOne(id);
  return UserResponseDto.fromModel(user);
}
```

## Validation

### Backend Request Validation

```typescript
// create-case.dto.ts
export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  client_name: string;

  @IsOptional()
  @IsDateString()
  filing_date?: string;

  @IsOptional()
  @IsUUID()
  owner_org_id?: string;
}
```

### Frontend Type Guards

```typescript
import { isApiUser, isApiCase } from '../types/api-types';

const data = await fetch('/api/users/123').then(r => r.json());

if (isApiUser(data)) {
  // TypeScript knows data is ApiUser
  const user = transformApiUser(data);
}
```

## Migration Strategy

If you have existing code using the old type system:

1. **Identify API calls**: Find all `ApiService` method calls
2. **Add transformations**: Wrap results with transformers
3. **Update types**: Change variable types from `User` to `ApiUser` at API boundaries
4. **Test**: Ensure data flows correctly

Example migration:

```typescript
// Before
const users: User[] = await ApiService.getUsers();
setUsers(users);

// After
const apiUsers: ApiUser[] = await ApiService.getUsers();
const users: User[] = transformers.users(apiUsers);
setUsers(users);
```

## Troubleshooting

### "Property does not exist" errors

**Problem:** `user.firstName` is undefined
**Cause:** API returns `first_name`, not `firstName`
**Solution:** Use transformer or access `user.first_name` directly

### Type mismatch in API calls

**Problem:** TypeScript error when calling `ApiService.createUser()`
**Cause:** Using frontend `User` type instead of `CreateUserRequest`
**Solution:** Use the correct Request DTO type

### Missing fields after transformation

**Problem:** Transformed object missing fields
**Cause:** Transformer doesn't map all fields
**Solution:** Update transformer function or use fields from API type directly

## Future Improvements

1. **Automated type generation**: Generate types from OpenAPI/Swagger spec
2. **Runtime validation**: Use Zod or io-ts for runtime type checking
3. **Shared schema**: Single source of truth for types using JSON Schema
4. **Code generation**: Generate transformers automatically

## Additional Resources

- Shared Types: `/shared-types/index.ts`
- Type Transformers: `/utils/type-transformers.ts`
- Frontend Types: `/types.ts`
- API Service: `/services/apiService.ts`
- Backend Models: `/nestjs/src/models/`
- Backend DTOs: `/nestjs/src/modules/*/dto/`
