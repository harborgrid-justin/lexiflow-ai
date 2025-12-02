# syntax=docker/dockerfile:1
# Multi-stage build for LexiFlow AI Enterprise Legal Case Management Platform
# Security: Using specific Node version with Alpine for minimal attack surface
FROM node:20-alpine AS base

# Set build arguments with defaults
ARG NODE_ENV=production
ARG BUILD_TIME
ARG VERSION

# Add labels for better container management
LABEL org.opencontainers.image.title="LexiFlow AI"
LABEL org.opencontainers.image.description="Enterprise Legal Case Management Platform with AI capabilities"
LABEL org.opencontainers.image.version="${VERSION:-latest}"
LABEL org.opencontainers.image.created="${BUILD_TIME}"
LABEL maintainer="LexiFlow Team"

# Install security updates and essential tools
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init wget curl && \
    rm -rf /var/cache/apk/*

# Backend Build Stage - Optimized for NestJS
FROM base AS server-builder
WORKDIR /app/server

# Create non-root user early for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app/server

# Copy package files with correct ownership for better layer caching
COPY --chown=nestjs:nodejs server/package*.json ./

# Switch to non-root user for npm install
USER nestjs

# Install all dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source files after dependencies for optimal layer caching
COPY --chown=nestjs:nodejs server/tsconfig.json server/nest-cli.json ./
COPY --chown=nestjs:nodejs server/src ./src

# Build with TypeScript compiler directly (nest build uses tsc under the hood)
RUN npx -y @nestjs/cli@^11.0.14 build

# Dedicated base image for frontend with Node 20 for better Vite performance
FROM node:20-alpine AS client-base

# Install security updates
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Frontend Build Stage - Optimized for React/Vite
FROM client-base AS client-builder
WORKDIR /app/client

# Create non-root user early for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactuser -u 1001 && \
    chown -R reactuser:nodejs /app/client

# Copy package files with correct ownership
COPY --chown=reactuser:nodejs client/package*.json ./

# Switch to non-root user
USER reactuser

# Use npm ci for reproducible builds
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copy application source
COPY --chown=reactuser:nodejs client/ ./

# Build optimized production bundle
RUN npm run build

# Backend Production Runtime - Secure and minimal
FROM base AS server-production
WORKDIR /app/server

# Create application directories with proper permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    mkdir -p /app/server/logs /app/server/uploads && \
    chown -R nestjs:nodejs /app/server

# Copy package files for production dependencies
COPY --chown=nestjs:nodejs server/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=server-builder --chown=nestjs:nodejs /app/server/dist ./dist

# Switch to non-root user for security
USER nestjs

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:3001/api/v1/health || exit 1

# Expose backend port
EXPOSE 3001

# Use dumb-init and exec form for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]

# Frontend Production Runtime - Secure static file serving
FROM client-base AS client-production
WORKDIR /app/client

# Create application user with proper permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactuser -u 1001 && \
    chown -R reactuser:nodejs /app/client

# Install serve with pinned version for stability
RUN npm install -g serve@14.2.1 && \
    npm cache clean --force

# Copy built client from builder stage
COPY --from=client-builder --chown=reactuser:nodejs /app/client/dist ./dist

# Switch to non-root user
USER reactuser

# Health check for frontend
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Expose frontend port
EXPOSE 3000

# Use dumb-init for proper signal handling and serve with SPA fallback
ENTRYPOINT ["dumb-init", "--"]
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard", "--no-port-switching"]

# Legacy Combined Production Stage (Deprecated)
# NOTE: This stage is maintained for backward compatibility only
# Use docker-compose with separate services for production deployments
FROM base AS production
WORKDIR /app

# Create application user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Install production dependencies for server
COPY --chown=appuser:nodejs server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copy built server
COPY --from=server-builder --chown=appuser:nodejs /app/server/dist ./dist

# Copy built client
WORKDIR /app
COPY --from=client-builder --chown=appuser:nodejs /app/client/dist ./client/dist

# Install serve for frontend with pinned version
RUN npm install -g serve@14.2.1 && \
    npm cache clean --force

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 3001 3000

# Create startup script with proper error handling and signal forwarding
WORKDIR /app
RUN echo '#!/bin/sh' > start.sh && \
    echo 'set -e' >> start.sh && \
    echo '# Function to handle shutdown' >> start.sh && \
    echo 'shutdown() {' >> start.sh && \
    echo '  echo "Shutting down services..."' >> start.sh && \
    echo '  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true' >> start.sh && \
    echo '  wait' >> start.sh && \
    echo '  exit 0' >> start.sh && \
    echo '}' >> start.sh && \
    echo 'trap shutdown TERM INT' >> start.sh && \
    echo '# Start backend' >> start.sh && \
    echo 'cd /app/server && node dist/main.js &' >> start.sh && \
    echo 'BACKEND_PID=$!' >> start.sh && \
    echo '# Start frontend' >> start.sh && \
    echo 'serve -s /app/client/dist -l 3000 --no-clipboard --no-port-switching &' >> start.sh && \
    echo 'FRONTEND_PID=$!' >> start.sh && \
    echo '# Wait for processes' >> start.sh && \
    echo 'wait $BACKEND_PID $FRONTEND_PID' >> start.sh && \
    chmod +x start.sh

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "./start.sh"]
