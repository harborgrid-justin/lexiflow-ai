# LexiFlow AI Type System

## Overview

This project implements a comprehensive type-safe API communication layer between the React frontend and NestJS backend. The type system ensures compile-time safety while handling the difference between frontend (camelCase) and backend (snake_case) naming conventions.

## Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd nestjs && npm install
```

### 2. Basic API Usage

```typescript
import { ApiService } from './services/apiService';
import { transformApiCase } from './utils/type-transformers';
import { ApiCase, CreateCaseRequest } from './shared-types';

// Fetch data
const apiCases: ApiCase[] = await ApiService.getCases();
const cases = apiCases.map(transformApiCase);

// Create data
const request: CreateCaseRequest = {
  title: 'New Case',
  client_name: 'ACME Corp',  // Note: snake_case
  status: 'active',
};
const newCase = await ApiService.createCase(request);
```

## Directory Structure

```
lexiflow-ai/
├── shared-types/          # API contract types (shared between FE/BE)
│   └── index.ts          # ApiUser, ApiCase, CreateXRequest, etc.
│
├── types/                # Frontend-specific types
│   └── api-types.ts      # Type guards and API service types
│
├── utils/                # Utility functions
│   └── type-transformers.ts  # Transform API ↔ Frontend types
│
├── types.ts              # Legacy frontend types (UI layer)
│
├── services/
│   └── apiService.ts     # API client
│
├── docs/
│   └── API_TYPE_SAFETY.md    # Comprehensive documentation
│
├── examples/
│   └── api-usage-examples.tsx # Usage examples
│
└── nestjs/
    └── src/
        ├── models/            # Database models
        ├── modules/
        │   └── */dto/        # Request/Response DTOs
        └── common/
            └── dto/          # Shared DTOs
```

## Type Layers Explained

### Layer 1: API Types (`shared-types/index.ts`)

**Purpose:** Define the actual API contract
**Naming:** snake_case (matches backend database)
**Location:** Shared between frontend and backend

```typescript
export interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  organization_id: string;
  created_at: Date | string;
  updated_at: Date | string;
}
```

### Layer 2: Frontend Types (`types.ts`)

**Purpose:** UI component data structures
**Naming:** camelCase
**Location:** Frontend only

```typescript
export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  orgId?: string;
}
```

### Layer 3: Request/Response DTOs (`nestjs/src/modules/*/dto/`)

**Purpose:** Validation and documentation
**Naming:** snake_case
**Location:** Backend only

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
```

## Key Files

### 1. Shared Types (`shared-types/index.ts`)

Defines all API contracts:
- API response types: `ApiUser`, `ApiCase`, `ApiDocument`, etc.
- Request DTOs: `CreateCaseRequest`, `UpdateUserRequest`, etc.
- Auth types: `LoginRequest`, `RegisterRequest`, `AuthResponse`
- Common types: `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`

### 2. Type Transformers (`utils/type-transformers.ts`)

Converts between API and frontend formats:

```typescript
// Single transformations
transformApiUser(apiUser: ApiUser): User
transformApiCase(apiCase: ApiCase): Case
transformApiDocument(apiDoc: ApiDocument): LegalDocument

// Batch transformations
transformers.users(apiUsers: ApiUser[]): User[]
transformers.cases(apiCases: ApiCase[]): Case[]
transformers.documents(apiDocs: ApiDocument[]): LegalDocument[]
```

### 3. API Service (`services/apiService.ts`)

Type-safe API client:

```typescript
export const ApiService = {
  // Auth
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (userData: RegisterRequest) => Promise<AuthResponse>

  // Cases
  getCases: () => Promise<ApiCase[]>
  createCase: (data: CreateCaseRequest) => Promise<ApiCase>
  updateCase: (id: string, data: UpdateCaseRequest) => Promise<ApiCase>

  // ... more methods
}
```

## Common Patterns

### Pattern 1: Fetch and Display

```typescript
const [cases, setCases] = useState<Case[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const apiCases = await ApiService.getCases();
    const transformed = transformers.cases(apiCases);
    setCases(transformed);
  };
  fetchData();
}, []);
```

### Pattern 2: Create Entity

```typescript
const handleCreate = async (formData: any) => {
  const request: CreateCaseRequest = {
    title: formData.title,
    client_name: formData.clientName,  // camelCase → snake_case
    status: 'active',
  };

  const apiCase = await ApiService.createCase(request);
  const newCase = transformApiCase(apiCase);

  setCases(prev => [...prev, newCase]);
};
```

### Pattern 3: Custom Hook

```typescript
const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getCases()
      .then(transformers.cases)
      .then(setCases)
      .finally(() => setLoading(false));
  }, []);

  const createCase = async (request: CreateCaseRequest) => {
    const apiCase = await ApiService.createCase(request);
    const newCase = transformApiCase(apiCase);
    setCases(prev => [...prev, newCase]);
    return newCase;
  };

  return { cases, loading, createCase };
};
```

## Backend DTOs

Each module should define:

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;
}

// update-user.dto.ts
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  status?: string;
}

// user-response.dto.ts
export class UserResponseDto {
  static fromModel(user: User): UserResponseDto {
    const { password_hash, ...userData } = user.toJSON();
    return userData;
  }
}
```

## Field Mapping Reference

### User

| Frontend | API/Backend | Type |
|----------|-------------|------|
| name | name | string |
| - | first_name | string |
| - | last_name | string |
| orgId | organization_id | string |
| - | created_at | Date |

### Case

| Frontend | API/Backend | Type |
|----------|-------------|------|
| client | client_name | string |
| opposingCounsel | opposing_counsel | string |
| filingDate | filing_date | Date/string |
| ownerOrgId | owner_org_id | string |

### Document

| Frontend | API/Backend | Type |
|----------|-------------|------|
| uploadDate | created_at | Date/string |
| lastModified | updated_at | Date/string |
| uploadedBy | created_by | string |
| - | file_path | string |
| - | file_size | number |

### Evidence

| Frontend | API/Backend | Type |
|----------|-------------|------|
| collectionDate | collected_date | Date/string |
| collectedBy | collected_by | string |
| collectedByUserId | custodian_id | string |

## Type Safety Best Practices

1. **Always use API types at the boundary**
   ```typescript
   // Good
   const apiUser: ApiUser = await ApiService.getUser(id);
   const user = transformApiUser(apiUser);

   // Bad
   const user: User = await ApiService.getUser(id); // Type mismatch!
   ```

2. **Transform before passing to components**
   ```typescript
   // Good
   const apiCases = await ApiService.getCases();
   <CaseList cases={transformers.cases(apiCases)} />

   // Bad
   const cases = await ApiService.getCases();
   <CaseList cases={cases} /> // Wrong type!
   ```

3. **Use Request DTOs for mutations**
   ```typescript
   // Good
   const request: CreateCaseRequest = { ... };
   await ApiService.createCase(request);

   // Bad
   const case: Case = { ... };
   await ApiService.createCase(case); // Wrong type!
   ```

4. **Never mix types**
   ```typescript
   // Bad - mixing API and frontend types
   const hybrid = {
     ...apiUser,
     ...frontendUser
   };

   // Good - transform then use
   const user = transformApiUser(apiUser);
   ```

## Error Handling

```typescript
try {
  const apiCases = await ApiService.getCases();
  const cases = transformers.cases(apiCases);
  setCases(cases);
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('401')) {
      // Redirect to login
      ApiService.clearAuthToken();
      window.location.href = '/login';
    } else {
      console.error('API Error:', error.message);
    }
  }
}
```

## Migration Guide

If you have existing code:

1. **Identify API calls**
   - Find all `ApiService.*` calls
   - Note the expected return types

2. **Add type annotations**
   ```typescript
   // Before
   const cases = await ApiService.getCases();

   // After
   const apiCases: ApiCase[] = await ApiService.getCases();
   ```

3. **Add transformations**
   ```typescript
   const cases = transformers.cases(apiCases);
   ```

4. **Update component props**
   - Ensure components receive frontend types
   - Update prop types if needed

5. **Test thoroughly**
   - Check data flows correctly
   - Verify no runtime errors

## Testing

```typescript
import { transformApiUser } from '../utils/type-transformers';
import { ApiUser } from '../shared-types';

describe('Type Transformers', () => {
  it('transforms ApiUser to User', () => {
    const apiUser: ApiUser = {
      id: '123',
      first_name: 'John',
      last_name: 'Doe',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Attorney',
      organization_id: 'org-1',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const user = transformApiUser(apiUser);

    expect(user.id).toBe('123');
    expect(user.name).toBe('John Doe');
    expect(user.orgId).toBe('org-1');
  });
});
```

## Resources

- **Full Documentation:** [docs/API_TYPE_SAFETY.md](./docs/API_TYPE_SAFETY.md)
- **Usage Examples:** [examples/api-usage-examples.tsx](./examples/api-usage-examples.tsx)
- **Shared Types:** [shared-types/index.ts](./shared-types/index.ts)
- **Transformers:** [utils/type-transformers.ts](./utils/type-transformers.ts)

## Support

For questions or issues:
1. Check the documentation in `docs/API_TYPE_SAFETY.md`
2. Review examples in `examples/api-usage-examples.tsx`
3. Examine transformer implementations in `utils/type-transformers.ts`

## Contributing

When adding new entities:

1. **Add API type** in `shared-types/index.ts`:
   ```typescript
   export interface ApiNewEntity {
     id: string;
     field_name: string;  // snake_case
   }
   ```

2. **Add Request DTOs** in shared-types:
   ```typescript
   export interface CreateNewEntityRequest {
     field_name: string;
   }
   ```

3. **Add Backend DTO** in `nestjs/src/modules/entity/dto/`:
   ```typescript
   export class CreateNewEntityDto {
     @IsString()
     field_name: string;
   }
   ```

4. **Add transformer** in `utils/type-transformers.ts`:
   ```typescript
   export function transformApiNewEntity(api: ApiNewEntity): NewEntity {
     return {
       id: api.id,
       fieldName: api.field_name,  // camelCase
     };
   }
   ```

5. **Add to transformers object**:
   ```typescript
   export const transformers = {
     // ... existing
     newEntities: (items: ApiNewEntity[]) => items.map(transformApiNewEntity),
   };
   ```

6. **Update API service** in `services/apiService.ts`:
   ```typescript
   getNewEntities: () => fetchJson<ApiNewEntity[]>('/new-entities'),
   createNewEntity: (data: CreateNewEntityRequest) => postJson<ApiNewEntity>('/new-entities', data),
   ```
