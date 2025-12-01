# LexiFlow AI - Docker Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available for containers

### 1. Environment Setup

Copy the environment template and configure your values:

```bash
cp .env.docker.template .env.docker
```

Edit `.env.docker` with your secure values:
- `POSTGRES_PASSWORD`: Strong database password
- `JWT_SECRET`: Random secure string (e.g., `openssl rand -base64 64`)
- `GEMINI_API_KEY`: Your Google Gemini API key

### 2. Launch Application

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose --env-file .env.docker up -d

# View logs
docker-compose logs -f

# Check service health
docker-compose ps
```

### 3. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Docs**: http://localhost:3001/api/docs
- **PostgreSQL**: localhost:5432

### 4. Initial Database Setup

The database will automatically:
- Create `lexiflow` database
- Enable `pgvector`, `uuid-ossp`, and `pg_trgm` extensions
- Run migrations when backend starts

## 🏗️ Architecture

### Three-Agent Docker Optimization

This Dockerfile implements **three specialized build agents** for optimal production deployments:

#### Agent 1: Backend Build Optimization
- **Layer Caching**: Dependencies installed before source copy
- **Security**: `--ignore-scripts` prevents malicious package scripts
- **Size Reduction**: Dev dependencies pruned post-build
- **Reproducibility**: `npm ci` ensures consistent builds

#### Agent 2: Frontend Build Optimization
- **Selective Copying**: Only necessary source directories included
- **Cache Efficiency**: `package.json` copied separately from source
- **Production Bundle**: Optimized Vite build with tree-shaking

#### Agent 3: Production Runtime Security
- **Non-root Users**: Services run as `nestjs` (1001) and `reactuser` (1001)
- **Minimal Attack Surface**: Alpine Linux base (5MB vs 900MB+ full images)
- **Health Checks**: Built-in wget for container orchestration
- **Signal Handling**: Exec form CMD for proper SIGTERM propagation

### Multi-Stage Build Targets

```bash
# Build specific stage
docker build --target server-production -t lexiflow-backend .
docker build --target client-production -t lexiflow-frontend .

# Legacy combined stage
docker build --target production -t lexiflow-combined .
```

## 🗄️ PostgreSQL Configuration

### Database Details
- **Image**: `ankane/pgvector:latest` (PostgreSQL 16 + pgvector)
- **Database**: `lexiflow`
- **User**: `lexiflow_user`
- **Extensions**: vector, uuid-ossp, pg_trgm

### Data Persistence

Data is persisted in Docker volumes:
```bash
# List volumes
docker volume ls | grep lexiflow

# Backup database
docker-compose exec postgres pg_dump -U lexiflow_user lexiflow > backup.sql

# Restore database
docker-compose exec -T postgres psql -U lexiflow_user lexiflow < backup.sql
```

### Access Database

```bash
# Via docker-compose
docker-compose exec postgres psql -U lexiflow_user -d lexiflow

# Direct connection
psql postgresql://lexiflow_user:your_password@localhost:5432/lexiflow
```

## 🔧 Development Workflow

### Local Development with Docker

```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Run backend locally (connected to Docker PostgreSQL)
cd server
npm install
DATABASE_URL=postgresql://lexiflow_user:your_password@localhost:5432/lexiflow npm run start:dev

# Run frontend locally
cd client
npm install
npm run dev
```

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild all services
docker-compose build
docker-compose up -d
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

## 🛡️ Security Features

### Container Security
✅ **Non-root users** in all production containers  
✅ **Read-only filesystem** for static assets  
✅ **No shell access** in production images  
✅ **Minimal base images** (Alpine Linux)  
✅ **Security scanning** ready (Trivy, Snyk compatible)

### Environment Security
✅ **Secrets via environment variables** (not hardcoded)  
✅ **`.dockerignore`** prevents sensitive file leaks  
✅ **Health checks** for automated failure detection  
✅ **Network isolation** via Docker bridge network

### Recommendations
- **Change default passwords** in `.env.docker`
- **Use Docker secrets** in production (Swarm/Kubernetes)
- **Enable TLS** with reverse proxy (nginx, Traefik)
- **Scan images** regularly: `docker scan lexiflow-backend`

## 🚢 Production Deployment

### Environment Variables (Production)

```bash
# Database (use managed PostgreSQL in production)
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/lexiflow?sslmode=require

# Backend
NODE_ENV=production
PORT=3001
JWT_SECRET=<64-char-random-string>
JWT_EXPIRATION=1h
CORS_ORIGIN=https://lexiflow.example.com

# Frontend
VITE_API_URL=https://api.lexiflow.example.com
GEMINI_API_KEY=<your-key>
```

### Reverse Proxy (nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name lexiflow.example.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Monitoring

```bash
# Resource usage
docker stats

# Health checks
docker-compose ps
curl http://localhost:3001/api/v1/health
```

## 🧹 Maintenance

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Update Images

```bash
# Pull latest base images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### Clean Docker System

```bash
# Remove unused images/containers
docker system prune -a

# Remove unused volumes (⚠️ check first)
docker volume prune
```

## 📊 Performance Optimization

### Build Optimization
- **Layer caching**: Dependencies before source code
- **Multi-stage builds**: Only production artifacts in final image
- **Parallel builds**: Docker BuildKit enabled by default

### Runtime Optimization
- **Production mode**: `NODE_ENV=production`
- **Connection pooling**: Sequelize configured for efficient DB access
- **Static file serving**: `serve` with SPA fallback
- **Health checks**: Prevent traffic to unhealthy containers

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify network connectivity
docker-compose exec backend ping postgres
```

### Build Failures

```bash
# Clear build cache
docker-compose build --no-cache backend

# Check Docker disk space
docker system df
```

### Port Conflicts

```bash
# Find process using port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill conflicting process
kill -9 <PID>
```

## 📚 Additional Resources

- **NestJS Docs**: https://docs.nestjs.com
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **pgvector Guide**: https://github.com/pgvector/pgvector
- **Project Structure**: See `server/PROJECT_STRUCTURE.md`

---

**🎯 Three-Agent Review Summary:**
1. **Build Agent**: Optimized layer caching, security, reproducibility
2. **Security Agent**: Non-root users, minimal images, secrets management
3. **Operations Agent**: Health checks, monitoring, production readiness
