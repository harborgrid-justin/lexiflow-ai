# Multi-stage build for LexiFlow AI
# Security: Using specific Node version with Alpine for minimal attack surface
FROM node:18-alpine AS base

# Agent 1: Backend Build Optimization
FROM base AS server-builder
WORKDIR /app/server

# Copy package files first for better layer caching
COPY server/package*.json ./

# Use npm ci for reproducible builds
RUN npm ci && npm cache clean --force

# Copy source after dependencies for optimal layer caching
COPY server/tsconfig.json server/nest-cli.json ./
COPY server/src ./src

# Build with production optimizations
RUN npm run build && \
    # Remove dev dependencies to reduce image size
    npm prune --production

# Dedicated base image for frontend so we can move to Node 20 without impacting the backend
FROM node:20-alpine AS client-base

# Agent 2: Frontend Build Optimization  
FROM client-base AS client-builder
WORKDIR /app/client

# Copy package files first for better layer caching
COPY client/package*.json ./

# Use npm ci for reproducible builds
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy application source (node_modules and dist are already excluded via .dockerignore)
COPY client/ ./

# Build optimized production bundle
RUN npm run build

# Agent 3: Backend Production Runtime
FROM node:18-alpine AS server-production
WORKDIR /app/server

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    mkdir -p /app/server/logs && \
    chown -R nestjs:nodejs /app/server

# Install production dependencies only
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=server-builder --chown=nestjs:nodejs /app/server/dist ./dist

# Install wget for healthchecks
RUN apk add --no-cache wget

# Switch to non-root user
USER nestjs

# Expose backend port
EXPOSE 3001

# Use exec form for proper signal handling
CMD ["node", "dist/main.js"]

# Agent 3: Frontend Production Runtime
FROM client-base AS client-production
WORKDIR /app/client

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactuser -u 1001 && \
    chown -R reactuser:nodejs /app/client

# Install serve globally with specific version for stability
RUN npm install -g serve@14.2.1 && npm cache clean --force

# Copy built client from builder
COPY --from=client-builder --chown=reactuser:nodejs /app/client/dist ./dist

# Switch to non-root user
USER reactuser

# Expose frontend port
EXPOSE 3000

# Serve static files with SPA fallback
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard"]

# Legacy combined production stage (deprecated - use docker-compose instead)
FROM node:18-alpine AS production
WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy built server
COPY --from=server-builder /app/server/dist ./dist

# Copy built client
WORKDIR /app
COPY --from=client-builder /app/client/dist ./client/dist

# Install serve for frontend
RUN npm install -g serve@14.2.1 concurrently@8.2.2 && npm cache clean --force

# Expose ports
EXPOSE 3001 3000

# Create startup script with proper error handling
WORKDIR /app
RUN echo '#!/bin/sh' > start.sh && \
    echo 'set -e' >> start.sh && \
    echo 'cd /app/server && node dist/main.js &' >> start.sh && \
    echo 'BACKEND_PID=$!' >> start.sh && \
    echo 'serve -s /app/client/dist -l 3000 --no-clipboard &' >> start.sh && \
    echo 'FRONTEND_PID=$!' >> start.sh && \
    echo 'wait $BACKEND_PID $FRONTEND_PID' >> start.sh && \
    chmod +x start.sh

CMD ["sh", "./start.sh"]
