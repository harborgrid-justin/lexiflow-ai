# Authentication Module

Complete authentication and security infrastructure for LexiFlow AI legal case management system.

## Overview

This module provides comprehensive JWT-based authentication with Passport strategies for both local (email/password) and JWT token validation. It implements industry-standard security practices for password hashing, token management, and route protection.

## Architecture

```
auth/
├── auth.module.ts           # Main module configuration
├── auth.service.ts          # Authentication business logic
├── auth.controller.ts       # HTTP endpoints
├── jwt.strategy.ts          # JWT validation strategy
├── local.strategy.ts        # Email/password validation strategy
├── jwt-auth.guard.ts        # JWT authentication guard
├── local-auth.guard.ts      # Local authentication guard
├── current-user.decorator.ts # Extract user from request
├── public.decorator.ts      # Mark routes as public
├── index.ts                 # Module exports
└── dto/
    ├── login.dto.ts         # Login request validation
    ├── register.dto.ts      # Registration request validation
    └── index.ts             # DTO exports
```

## API Endpoints

All endpoints are prefixed with `/api/v1/auth/`

### POST /login
Authenticate user with email and password.

**Request:**
```json
{
  "email": "attorney@firm.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "attorney@firm.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "Attorney",
    "organization_id": "org-uuid"
  }
}
```

### POST /register
Register a new user account.

**Request:**
```json
{
  "email": "newattorney@firm.com",
  "password": "SecurePassword123!",
  "first_name": "Jane",
  "last_name": "Smith",
  "organization_id": "org-uuid"
}
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "newattorney@firm.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "user",
  "organization_id": "org-uuid"
}
```

### GET /me
Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "attorney@firm.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "Attorney",
  "organization_id": "org-uuid",
  ...
}
```

### POST /logout
Logout current user (client-side token removal).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logged out successfully",
  "note": "Please remove the JWT token from client storage"
}
```

## Security Features

### Password Security
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with configurable salt rounds
- **Default Rounds**: 10 (configurable via `BCRYPT_ROUNDS` environment variable)
- **No Plain Text Storage**: Passwords are never stored in plain text
- **Secure Comparison**: bcrypt.compare() used for password verification

### JWT Token Security
- **Token Structure**:
  ```typescript
  {
    sub: userId,              // User ID (subject)
    email: user.email,        // User email
    organization_id: orgId,   // Organization ID for multi-tenancy
    role: user.role          // User role for authorization
  }
  ```
- **Expiration**: 24 hours default (configurable via `JWT_EXPIRY`)
- **Secret Key**: Stored in environment variable `JWT_SECRET`
- **Bearer Token**: Extracted from `Authorization: Bearer <token>` header

### Database Validation
- **User Existence**: JWT strategy validates user still exists in database on each request
- **Fresh Data**: Retrieves current user data from database, not relying solely on token
- **Email Uniqueness**: Enforced at database level with unique index
- **Organization Isolation**: All queries filtered by organization_id

### Route Protection
- **JwtAuthGuard**: Protects routes requiring authentication
- **LocalAuthGuard**: Validates email/password during login
- **@Public() Decorator**: Bypass authentication for public routes
- **Default Protection**: Routes are protected by default (opt-in public access)

## Environment Variables

Required configuration in `server/.env`:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRY=24h  # Optional, defaults to 24h

# Password Hashing
BCRYPT_ROUNDS=10  # Optional, defaults to 10
```

## Usage Examples

### Protecting Routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '../auth';

@Controller('cases')
export class CasesController {
  // Protected route - requires JWT token
  @Get()
  @UseGuards(JwtAuthGuard)
  async getCases(@CurrentUser() user: any) {
    // user.userId, user.email, user.organization_id available
    return this.casesService.findAll(user.organization_id);
  }
}
```

### Public Routes

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth';

@Controller('health')
export class HealthController {
  // Public route - no authentication required
  @Public()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

### Using CurrentUser Decorator

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '../auth';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    // Access authenticated user data
    console.log(user.userId);
    console.log(user.email);
    console.log(user.organization_id);
    console.log(user.role);
    return user;
  }
}
```

## Testing

### Login Test
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Register Test
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "password":"password123",
    "first_name":"John",
    "last_name":"Doe",
    "organization_id":"org-uuid"
  }'
```

### Protected Route Test
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Security Considerations

### 1. Token Storage (Client-Side)
- **Recommended**: Store JWT in httpOnly cookie or secure localStorage
- **Avoid**: Storing in plain localStorage without additional protection
- **Best Practice**: Use httpOnly, secure, SameSite cookies

### 2. Token Refresh
- Current implementation: No refresh token (24-hour expiry)
- **Future Enhancement**: Implement refresh token mechanism
- **Alternative**: Reduce token expiry time and implement silent refresh

### 3. Password Requirements
- **Minimum Length**: 6 characters (enforced by validation)
- **Recommendation**: Implement stronger requirements:
  - Minimum 8-12 characters
  - Mix of uppercase, lowercase, numbers, special characters
  - Check against common password lists

### 4. Rate Limiting
- **Not Implemented**: Add rate limiting to prevent brute force attacks
- **Recommendation**: Use `@nestjs/throttler` package
- **Suggested Limits**: 5 login attempts per minute per IP

### 5. Multi-Factor Authentication (MFA)
- **Not Implemented**: Consider adding MFA for enhanced security
- **Options**: TOTP, SMS, Email verification

### 6. Session Management
- **Current**: JWT is stateless (no server-side session storage)
- **Enhancement**: Implement token blacklist using Redis for logout
- **Use Case**: Immediate token revocation on security events

### 7. HTTPS Requirement
- **Production**: Always use HTTPS in production
- **Development**: HTTP acceptable for local development only

### 8. CORS Configuration
- **Important**: Properly configure CORS origins in production
- **Environment Variable**: `CORS_ORIGINS` in `.env`

## Error Handling

### Common Errors

- **401 Unauthorized**: Invalid credentials or missing/expired token
- **409 Conflict**: Email already exists during registration
- **400 Bad Request**: Validation errors (invalid email, short password)

### Error Responses

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

## Dependencies

- `@nestjs/passport` - Passport integration
- `@nestjs/jwt` - JWT token generation and validation
- `passport-jwt` - Passport JWT strategy
- `passport-local` - Passport local (email/password) strategy
- `bcrypt` - Password hashing
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation

## Integration with Other Modules

### Import AuthModule

```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  // ...
})
export class AppModule {}
```

### Use AuthService

```typescript
import { Injectable } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';

@Injectable()
export class SomeService {
  constructor(private authService: AuthService) {}

  async doSomething() {
    const user = await this.authService.getCurrentUser(userId);
    // ...
  }
}
```

## Swagger Documentation

All endpoints are documented with Swagger decorators:
- Visit `/api/docs` for interactive API documentation
- `@ApiTags('authentication')` - Groups auth endpoints
- `@ApiOperation()` - Describes each endpoint
- `@ApiResponse()` - Documents response codes
- `@ApiBearerAuth()` - Indicates JWT requirement

## Future Enhancements

1. **Refresh Tokens**: Implement refresh token mechanism
2. **Token Blacklist**: Redis-based token revocation
3. **MFA Support**: Two-factor authentication
4. **Rate Limiting**: Prevent brute force attacks
5. **Password Reset**: Email-based password recovery
6. **Email Verification**: Verify email during registration
7. **OAuth Integration**: Google, Microsoft, etc.
8. **Audit Logging**: Track authentication events
9. **Session Management**: Track active sessions per user
10. **Password History**: Prevent password reuse

## Troubleshooting

### "Invalid credentials" on login
- Verify email exists in database
- Check password matches (case-sensitive)
- Ensure bcrypt rounds match between registration and login

### "Unauthorized" on protected routes
- Verify JWT token is included in `Authorization: Bearer <token>` header
- Check token hasn't expired (default 24 hours)
- Ensure JWT_SECRET matches between token generation and validation

### "User not found" after successful login
- JWT payload contains user ID that doesn't exist in database
- User may have been deleted after token was issued
- Database connection issues

## License

Copyright © 2024 LexiFlow AI. All rights reserved.
