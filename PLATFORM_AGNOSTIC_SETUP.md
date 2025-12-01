# Platform-Agnostic Configuration Guide

## Overview

LexiFlow has been configured to be **platform-agnostic**, **SaaS-agnostic**, and **server-agnostic**. All platform-specific configurations are managed through environment variables, making it easy to deploy to any infrastructure.

## Environment Variables

### Required Configuration (.env file)

Create a `.env` file in the `server/` directory with the following variables:

```bash
# Default Admin User Configuration
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
DEFAULT_ADMIN_FIRST_NAME=Admin
DEFAULT_ADMIN_LAST_NAME=User

# Database Configuration
DATABASE_URL=your_postgres_connection_string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Redis Configuration (optional - for real-time features)
REDIS_URL=your_redis_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

## Customizing for Your Organization

### 1. Change Default Admin Credentials

Update these variables in your `.env` file:

```bash
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
DEFAULT_ADMIN_FIRST_NAME=Your
DEFAULT_ADMIN_LAST_NAME=Name
```

### 2. Database Setup

LexiFlow works with any PostgreSQL database with pgvector extension:

- **Neon** (current default)
- **AWS RDS**
- **Google Cloud SQL**
- **Azure Database for PostgreSQL**
- **DigitalOcean Managed Databases**
- **Self-hosted PostgreSQL**

Simply update `DATABASE_URL` with your connection string.

### 3. Redis Cache (Optional)

LexiFlow supports any Redis provider:

- **Redis Cloud** (current default)
- **AWS ElastiCache**
- **Azure Cache for Redis**
- **DigitalOcean Managed Redis**
- **Self-hosted Redis**
- **Upstash**

Update `REDIS_URL` or individual Redis connection variables.

## First-Time Setup

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your values
```

### 3. Initialize Database

```bash
cd server
npm run db:sync
```

This will:
- Create all database tables
- Create the default admin user from environment variables
- Seed initial data

### 4. Start Development Servers

```bash
# Backend (from server directory)
npm run start:dev

# Frontend (from client directory)  
cd ../client
npm run dev
```

## Production Deployment

### Environment-Specific Settings

For production, update these variables:

```bash
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Use strong, randomly generated secrets
JWT_SECRET=$(openssl rand -base64 32)
DEFAULT_ADMIN_PASSWORD=$(openssl rand -base64 24)
```

### Database Migration

For production databases, use migrations instead of sync:

```bash
npm run migration:generate -- -n InitialSetup
npm run migration:run
```

## Platform Compatibility

### Tested On

- ✅ **Local Development** (macOS, Linux, Windows)
- ✅ **Docker** containers
- ✅ **GitHub Codespaces**
- ✅ **DigitalOcean** App Platform
- ✅ **Vercel** (frontend)
- ✅ **Render** (backend)
- ✅ **Railway** (full stack)
- ✅ **Fly.io** (full stack)

### Cloud Databases

- ✅ **Neon** (serverless PostgreSQL)
- ✅ **Supabase** (PostgreSQL with extras)
- ✅ **AWS RDS** (managed PostgreSQL)
- ✅ **Google Cloud SQL**
- ✅ **Azure Database for PostgreSQL**
- ✅ **DigitalOcean Managed Databases**
- ✅ **Railway PostgreSQL**
- ✅ **Render PostgreSQL**

### Redis Providers

- ✅ **Redis Cloud** (Upstash, Redis Labs)
- ✅ **AWS ElastiCache**
- ✅ **Azure Cache for Redis**
- ✅ **DigitalOcean Managed Redis**
- ✅ **Upstash Redis** (serverless)

## Default Login Credentials

After running `npm run db:sync`, you can login with:

- **Email**: Value of `DEFAULT_ADMIN_EMAIL` (default: admin@lexiflow.com)
- **Password**: Value of `DEFAULT_ADMIN_PASSWORD` (default: LexiFlow2024!)

**⚠️ IMPORTANT**: Change the default password immediately in production!

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong passwords** - Minimum 16 characters
3. **Rotate JWT secrets** - Change regularly in production
4. **Use HTTPS in production** - Always encrypt traffic
5. **Enable database SSL** - For production databases
6. **Restrict CORS origins** - Only allow your actual domains

## Troubleshooting

### Login fails with "Invalid credentials"

1. Check that the admin user exists in the database:
   ```sql
   SELECT email FROM users WHERE role = 'admin';
   ```

2. Verify environment variables are loaded:
   ```bash
   cd server
   node -e "require('dotenv').config(); console.log(process.env.DEFAULT_ADMIN_EMAIL)"
   ```

3. Re-run database sync:
   ```bash
   npm run db:sync
   ```

### Database connection errors

1. Verify `DATABASE_URL` is correct
2. Check database server is running
3. Ensure pgvector extension is installed:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Redis connection errors

1. Redis is **optional** - app works without it
2. Verify `REDIS_URL` or individual Redis vars
3. Check Redis server is accessible

## Migration Guide

### From Hardcoded Configuration

If you're updating from an older version with hardcoded values:

1. Review all `.env` changes
2. Update any hardcoded emails in your code
3. Run database sync to update admin user
4. Test login with new credentials

## Support

For issues or questions, please open an issue on GitHub.
