#!/bin/bash

# Quick Deploy LexiFlow AI to DigitalOcean
# This script provides interactive deployment options

set -e

echo "╔══════════════════════════════════════════════════╗"
echo "║   LexiFlow AI - DigitalOcean Quick Deploy       ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Check if doctl is authenticated
if ! doctl account get &>/dev/null; then
    echo "❌ DigitalOcean CLI not authenticated"
    echo "✓ Authentication already configured!"
    exit 1
fi

echo "✓ Authenticated as: $(doctl account get --format Email --no-header)"
echo ""

echo "Select deployment method:"
echo ""
echo "1) 🚀 Droplet Deploy (Docker) - Full control, ~\$24/month"
echo "   - 2 vCPU, 4GB RAM droplet"
echo "   - Docker containerized app"
echo "   - Direct server access"
echo ""
echo "2) ☁️  App Platform (Managed) - Easier, auto-scaling, ~\$12-24/month"
echo "   - Managed infrastructure"
echo "   - Auto-deployments from git"
echo "   - Built-in SSL/monitoring"
echo ""
echo "3) 📦 Container Registry - Build and push image only"
echo "   - For custom deployments"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting Droplet deployment..."
        echo ""
        
        read -p "Enter droplet name (default: lexiflow-ai-prod): " DROPLET_NAME
        DROPLET_NAME=${DROPLET_NAME:-lexiflow-ai-prod}
        
        read -p "Enter region (default: nyc3): " REGION
        REGION=${REGION:-nyc3}
        
        read -p "Enter JWT secret for production: " JWT_SECRET
        JWT_SECRET=${JWT_SECRET:-$(openssl rand -hex 32)}
        
        echo ""
        echo "Configuration:"
        echo "  Droplet: $DROPLET_NAME"
        echo "  Region: $REGION"
        echo "  Size: s-2vcpu-4gb (2 vCPU, 4GB RAM)"
        echo ""
        read -p "Proceed with deployment? [y/N]: " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            export JWT_SECRET
            ./deploy-digitalocean.sh
        else
            echo "Deployment cancelled."
        fi
        ;;
        
    2)
        echo ""
        echo "☁️  App Platform deployment..."
        echo ""
        
        if [ ! -f ".do/app.yaml" ]; then
            echo "❌ .do/app.yaml not found!"
            exit 1
        fi
        
        echo "This will create a new app from .do/app.yaml"
        echo "You'll need to:"
        echo "  1. Set up GitHub integration in DigitalOcean dashboard"
        echo "  2. Configure environment variables (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY)"
        echo ""
        read -p "Proceed? [y/N]: " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            doctl apps create --spec .do/app.yaml
            echo ""
            echo "✓ App created! View in dashboard: https://cloud.digitalocean.com/apps"
        else
            echo "Deployment cancelled."
        fi
        ;;
        
    3)
        echo ""
        echo "📦 Container Registry deployment..."
        echo ""
        
        read -p "Enter registry name (will create if doesn't exist): " REGISTRY_NAME
        REGISTRY_NAME=${REGISTRY_NAME:-lexiflow-registry}
        
        # Create registry if it doesn't exist
        doctl registry create $REGISTRY_NAME --subscription-tier basic || echo "Registry exists"
        
        # Login to registry
        doctl registry login
        
        # Build and push
        echo "Building Docker image..."
        docker build -t lexiflow-ai:latest .
        
        echo "Tagging image..."
        docker tag lexiflow-ai:latest registry.digitalocean.com/$REGISTRY_NAME/lexiflow-ai:latest
        
        echo "Pushing to registry..."
        docker push registry.digitalocean.com/$REGISTRY_NAME/lexiflow-ai:latest
        
        echo ""
        echo "✓ Image pushed to: registry.digitalocean.com/$REGISTRY_NAME/lexiflow-ai:latest"
        echo ""
        echo "Deploy this image to a droplet or Kubernetes cluster:"
        echo "  docker pull registry.digitalocean.com/$REGISTRY_NAME/lexiflow-ai:latest"
        ;;
        
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac
