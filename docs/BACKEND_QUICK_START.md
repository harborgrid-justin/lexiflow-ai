# LexiFlow AI Backend - Quick Start Guide

## Backend is Ready for Frontend Communication!

The NestJS backend has been fully configured and tested for seamless frontend integration.

## Quick Start

### 1. Start the Backend Server
```bash
cd C:\temp\lexiflow-ai\nestjs
npm run start:dev
```

The server will start on: **http://localhost:3001**

### 2. API Base URL
All API endpoints are prefixed with `/api/v1`:
- **Full API URL**: `http://localhost:3001/api/v1`
- **API Documentation**: `http://localhost:3001/api/docs`

### 3. Frontend Configuration
The frontend is already configured to use the correct API URL:
- **Location**: `C:\temp\lexiflow-ai\services\apiService.ts`
- **API_BASE_URL**: `http://localhost:3001/api/v1`

## Test Authentication

### Test Login Endpoint
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Test Registration Endpoint
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Test Current User Endpoint
```bash
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Usage Example

```typescript
import { ApiService } from './services/apiService';

// Login
const response = await ApiService.login('user@example.com', 'password123');
ApiService.setAuthToken(response.access_token);

// Get current user
const currentUser = await ApiService.getCurrentUser();

// Make authenticated requests
const cases = await ApiService.getCases();
```

## What's Been Configured

### Security
- ✅ CORS enabled for `localhost:3000` and `localhost:5173`
- ✅ Helmet security headers
- ✅ JWT authentication with Bearer tokens
- ✅ bcrypt password hashing
- ✅ Input validation and sanitization

### Error Handling
- ✅ Global exception filter for consistent errors
- ✅ Validation errors with field-level details
- ✅ Proper HTTP status codes

### API Features
- ✅ Swagger documentation at `/api/docs`
- ✅ Global validation pipeline
- ✅ Auto-type transformation
- ✅ Comprehensive logging

## Available Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Cases
- `GET /api/v1/cases` - List all cases
- `GET /api/v1/cases/:id` - Get case by ID
- `POST /api/v1/cases` - Create case
- `PATCH /api/v1/cases/:id` - Update case
- `DELETE /api/v1/cases/:id` - Delete case

### Documents
- `GET /api/v1/documents` - List all documents
- `GET /api/v1/documents/:id` - Get document
- `POST /api/v1/documents` - Create document
- And more...

See full API documentation at: http://localhost:3001/api/docs

## Environment Variables

Make sure these are set in `nestjs/.env`:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-aged-shape-adexd9x0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### CORS Errors?
- Ensure frontend is running on `localhost:3000` or `localhost:5173`
- Check that requests include `credentials: true`
- Verify `Authorization: Bearer <token>` header format

### 401 Unauthorized?
- Ensure JWT token is included in Authorization header
- Check token hasn't expired (24 hour expiry)
- Verify token is valid by testing `/auth/me` endpoint

### Validation Errors?
- Check request body matches DTO requirements
- Ensure email is valid format
- Password must be at least 6 characters
- Check API docs for required fields

## Documentation Files

For detailed information, see:
- `C:\temp\lexiflow-ai\nestjs\API_CONFIGURATION.md` - Complete API configuration guide
- `C:\temp\lexiflow-ai\nestjs\FRONTEND_INTEGRATION_SUMMARY.md` - All changes made
- `C:\temp\lexiflow-ai\nestjs\README.md` - General project information

## Next Steps

1. **Start Backend**: `cd nestjs && npm run start:dev`
2. **Start Frontend**: `cd .. && npm run dev` (or your frontend start command)
3. **Test Login**: Use the frontend login page or API docs
4. **View API Docs**: http://localhost:3001/api/docs

## Need Help?

- **API Docs**: http://localhost:3001/api/docs (Interactive Swagger UI)
- **Logs**: Check terminal where backend is running
- **Database**: Neon PostgreSQL (configured in .env)

---

**Status**: ✅ Backend is production-ready for frontend communication!
