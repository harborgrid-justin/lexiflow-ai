# Multi-stage build for LexiFlow AI
FROM node:18-alpine AS base

# Build backend
FROM base AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Build frontend
FROM base AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy built server
COPY --from=server-builder /app/server/dist ./dist

# Copy built client
WORKDIR /app
COPY --from=client-builder /app/client/dist ./client/dist

# Install serve for frontend
RUN npm install -g serve concurrently

# Expose ports
EXPOSE 3001 3000

# Create startup script
WORKDIR /app
RUN echo '#!/bin/sh' > start.sh && \
    echo 'cd /app/server && node dist/main.js &' >> start.sh && \
    echo 'serve -s /app/client/dist -l 3000' >> start.sh && \
    chmod +x start.sh

CMD ["sh", "./start.sh"]
