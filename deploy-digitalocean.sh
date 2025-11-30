#!/bin/bash

# LexiFlow AI - DigitalOcean Droplet Deployment Script

set -e

echo "🚀 LexiFlow AI - DigitalOcean Deployment"
echo "========================================"

# Configuration
DROPLET_NAME="lexiflow-ai-prod"
REGION="nyc3"
SIZE="s-2vcpu-4gb"
IMAGE="docker-20-04"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Step 1: Checking DigitalOcean authentication...${NC}"
doctl account get

echo -e "${BLUE}Step 2: Getting SSH key...${NC}"
SSH_KEY_ID=$(doctl compute ssh-key list --format ID --no-header | head -1)
echo -e "${GREEN}✓ Using SSH Key ID: $SSH_KEY_ID${NC}"

echo -e "${BLUE}Step 3: Creating Droplet with Docker...${NC}"
DROPLET_ID=$(doctl compute droplet create $DROPLET_NAME \
  --region $REGION \
  --size $SIZE \
  --image $IMAGE \
  --ssh-keys $SSH_KEY_ID \
  --wait \
  --format ID \
  --no-header)

echo -e "${GREEN}✓ Droplet created with ID: $DROPLET_ID${NC}"

echo -e "${BLUE}Step 4: Getting Droplet IP address...${NC}"
sleep 10
DROPLET_IP=$(doctl compute droplet get $DROPLET_ID --format PublicIPv4 --no-header)
echo -e "${GREEN}✓ Droplet IP: $DROPLET_IP${NC}"

echo -e "${BLUE}Step 5: Waiting for SSH to be ready...${NC}"
sleep 30

# Add SSH key temporarily
mkdir -p ~/.ssh
ssh-keyscan -H $DROPLET_IP >> ~/.ssh/known_hosts 2>/dev/null || true

echo -e "${BLUE}Step 6: Installing dependencies and deploying application...${NC}"

# Wait for cloud-init to finish
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'ENDSSH'
  cloud-init status --wait
  
  # Install Node.js 18
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs git
  
  # Verify installations
  node --version
  npm --version
  docker --version
ENDSSH

echo -e "${BLUE}Step 7: Cloning repository...${NC}"
ssh root@$DROPLET_IP << ENDSSH
  cd /opt
  mkdir -p /opt/lexiflow-ai
ENDSSH

echo -e "${BLUE}Step 8: Copying application files...${NC}"
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='*/dist' \
  -e "ssh -o StrictHostKeyChecking=no" \
  /workspaces/lexiflow-ai/ root@$DROPLET_IP:/opt/lexiflow-ai/

echo -e "${BLUE}Step 9: Building and starting application...${NC}"
ssh root@$DROPLET_IP << 'ENDSSH'
  cd /opt/lexiflow-ai
  
  # Build Docker image
  docker build -t lexiflow-ai:latest .
  
  # Run the application
  docker run -d \
    --name lexiflow-ai \
    --restart unless-stopped \
    -p 80:3000 \
    -p 3001:3001 \
    -e NODE_ENV=production \
    -e DATABASE_URL="${DATABASE_URL:-postgresql://neondb_owner:npg_JxVMIUH4dvQ9@ep-aged-shape-adexd9x0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require}" \
    -e JWT_SECRET="${JWT_SECRET:-your_jwt_secret_change_me}" \
    lexiflow-ai:latest
  
  # Show running containers
  docker ps
ENDSSH

echo ""
echo -e "${GREEN}======================================"
echo "✓ Deployment Complete!"
echo "======================================${NC}"
echo ""
echo "Droplet Details:"
echo "  Name: $DROPLET_NAME"
echo "  ID: $DROPLET_ID"
echo "  IP: $DROPLET_IP"
echo ""
echo "Access your application:"
echo "  Frontend: http://$DROPLET_IP"
echo "  Backend API: http://$DROPLET_IP:3001/api/v1"
echo "  API Docs: http://$DROPLET_IP:3001/api/docs"
echo ""
echo "SSH Access:"
echo "  ssh root@$DROPLET_IP"
echo ""
echo "Next Steps:"
echo "  1. Configure environment variables in the droplet"
echo "  2. Set up a domain name and SSL certificate"
echo "  3. Configure firewall rules"
echo ""
