# LexiFlow AI Backend API Configuration

## Overview

The NestJS backend is configured for production-grade frontend-backend communication with comprehensive security, validation, and error handling.

## Server Configuration

- **Base URL**: `http://localhost:3001`
- **API Prefix**: `/api/v1`
- **Full API Base**: `http://localhost:3001/api/v1`
- **Documentation**: `http://localhost:3001/api/docs`

## CORS Configuration

The backend accepts requests from:
- `http://localhost:3000` (Alternative frontend port)
- `http://localhost:5173` (Vite default dev server)
- Environment variable `FRONTEND_URL` (configurable)

### CORS Settings:
```typescript
{
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}
```

## Security Features

### 1. Helmet Security Headers
- Content Security Policy (disabled in development)
- XSS Protection
- HSTS (HTTP Strict Transport Security)
- Frame options
- Content type sniffing prevention

### 2. JWT Authentication
- **Secret**: Configured via `JWT_SECRET` environment variable
- **Token Expiry**: 1 day (24 hours)
- **Strategy**: Bearer token in Authorization header
- **Format**: `Authorization: Bearer <token>`

### 3. Password Security
- **Algorithm**: bcrypt with 10 salt rounds
- **Minimum Length**: 6 characters
- **Storage**: Never returned in API responses

## Global Configuration

### Validation Pipeline
```typescript
ValidationPipe({
  whitelist: true,              // Strip non-whitelisted properties
  transform: true,              // Auto-transform payloads to DTO instances
  forbidNonWhitelisted: true,   // Throw error on non-whitelisted properties
  transformOptions: {
    enableImplicitConversion: true
  },
  errorHttpStatusCode: 422      // Unprocessable Entity for validation errors
})
```

### Exception Filter
- Global exception handling for consistent error responses
- Structured error format:
```json
{
  "statusCode": 400,
  "timestamp": "2025-11-29T12:00:00.000Z",
  "path": "/api/v1/auth/login",
  "method": "POST",
  "error": "Bad Request",
  "message": "Validation failed"
}
```

## Authentication Endpoints

### POST /api/v1/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "attorney",
    "organization_id": "org-uuid"
  }
}
```

### POST /api/v1/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "first_name": "Jane",
  "last_name": "Smith",
  "organization_id": "org-uuid" // optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "attorney",
  "organization_id": "org-uuid",
  "created_at": "2025-11-29T12:00:00.000Z"
}
```

### GET /api/v1/auth/me
Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "attorney",
  "organization_id": "org-uuid",
  "created_at": "2025-11-29T12:00:00.000Z",
  "updated_at": "2025-11-29T12:00:00.000Z"
}
```

## Frontend Integration

### API Service Configuration

The frontend `apiService.ts` is configured to:
1. Use base URL: `http://localhost:3001/api/v1`
2. Automatically include JWT token in Authorization header
3. Handle 401 responses by redirecting to login
4. Properly handle CORS with credentials

### Example Usage

```typescript
// Login
const response = await ApiService.login('user@example.com', 'password');
ApiService.setAuthToken(response.access_token);

// Get current user
const currentUser = await ApiService.getCurrentUser();

// Make authenticated requests
const cases = await ApiService.getCases();
```

## Environment Variables

Required environment variables in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

## Error Handling

### Validation Errors (422)
```json
{
  "statusCode": 422,
  "timestamp": "2025-11-29T12:00:00.000Z",
  "path": "/api/v1/auth/login",
  "method": "POST",
  "error": "Unprocessable Entity",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "errors": ["Please provide a valid email address"]
    }
  ]
}
```

### Authentication Errors (401)
```json
{
  "statusCode": 401,
  "timestamp": "2025-11-29T12:00:00.000Z",
  "path": "/api/v1/auth/login",
  "method": "POST",
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### Conflict Errors (409)
```json
{
  "statusCode": 409,
  "timestamp": "2025-11-29T12:00:00.000Z",
  "path": "/api/v1/auth/register",
  "method": "POST",
  "error": "Conflict",
  "message": "User with this email already exists"
}
```

## Development

### Start the server
```bash
cd nestjs
npm run start:dev
```

### View API documentation
Navigate to: http://localhost:3001/api/docs

### Test authentication
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get current user
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

## Security Checklist

- [x] CORS configured for allowed origins
- [x] Helmet security headers enabled
- [x] JWT authentication with secure tokens
- [x] Password hashing with bcrypt
- [x] Global validation pipeline
- [x] Global exception filter
- [x] Input sanitization (whitelist, forbidNonWhitelisted)
- [x] Sensitive data excluded from responses (password_hash)
- [ ] Rate limiting (TODO: Add rate limiting middleware)
- [ ] Request logging (TODO: Add logging interceptor)

## Production Considerations

Before deploying to production:

1. **Update JWT_SECRET**: Use a strong, randomly generated secret
2. **Enable HTTPS**: Configure SSL/TLS certificates
3. **Database Security**: Use connection pooling and SSL for database
4. **Environment Variables**: Use secure secret management
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Logging**: Add comprehensive logging and monitoring
7. **CORS**: Update allowed origins to production frontend URL
8. **Helmet CSP**: Configure Content Security Policy for production
