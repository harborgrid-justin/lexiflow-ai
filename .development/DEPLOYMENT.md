# LexiFlow AI - DigitalOcean Deployment Guide

## Prerequisites
- DigitalOcean API Token (configured ✓)
- doctl CLI installed and authenticated (configured ✓)

## Deployment Options

### Option 1: Droplet with Docker (Full Control)

This deploys the app to a DigitalOcean Droplet with Docker.

```bash
./deploy-digitalocean.sh
```

**What it does:**
- Creates a Droplet with Docker pre-installed
- Builds a Docker image with both frontend and backend
- Runs the containerized application
- Exposes ports 80 (frontend) and 3001 (backend API)

**Droplet Specifications:**
- Region: NYC3
- Size: 2 vCPU, 4GB RAM ($24/month)
- OS: Ubuntu 20.04 with Docker

**After Deployment:**
- Frontend: http://DROPLET_IP
- Backend API: http://DROPLET_IP:3001/api/v1
- API Docs: http://DROPLET_IP:3001/api/docs

### Option 2: App Platform (Managed, Easier)

Deploy using DigitalOcean's managed App Platform (similar to Heroku).

```bash
# Create the app
doctl apps create --spec .do/app.yaml

# Or update existing app
doctl apps update YOUR_APP_ID --spec .do/app.yaml
```

**Benefits:**
- Automatic deployments on git push
- Built-in SSL/TLS certificates
- Auto-scaling support
- Managed infrastructure
- Zero-downtime deployments

**Pricing:** ~$12-24/month per service

### Option 3: Manual Docker Build & Push

For custom registry deployment:

```bash
# Build the image
docker build -t lexiflow-ai:latest .

# Tag for DigitalOcean Container Registry
docker tag lexiflow-ai:latest registry.digitalocean.com/your-registry/lexiflow-ai:latest

# Push to registry
docker push registry.digitalocean.com/your-registry/lexiflow-ai:latest
```

## Environment Variables

Before deploying, ensure these environment variables are set:

### Backend (.env in server/)
```env
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_JxVMIUH4dvQ9@ep-aged-shape-adexd9x0-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_secure_jwt_secret_here
PORT=3001
```

### Frontend (.env.local in client/)
```env
VITE_API_URL=http://YOUR_DROPLET_IP:3001/api/v1
GEMINI_API_KEY=your_gemini_api_key_here
```

## Post-Deployment Steps

1. **Configure DNS** (if using a domain)
   ```bash
   doctl compute domain records create yourdomain.com \
     --record-type A \
     --record-name @ \
     --record-data DROPLET_IP
   ```

2. **Set up SSL with Let's Encrypt**
   ```bash
   ssh root@DROPLET_IP
   apt-get install certbot
   certbot --nginx -d yourdomain.com
   ```

3. **Configure Firewall**
   ```bash
   doctl compute firewall create \
     --name lexiflow-firewall \
     --inbound-rules "protocol:tcp,ports:80,sources:addresses:0.0.0.0/0 protocol:tcp,ports:443,sources:addresses:0.0.0.0/0 protocol:tcp,ports:22,sources:addresses:0.0.0.0/0" \
     --droplet-ids DROPLET_ID
   ```

4. **Enable monitoring**
   ```bash
   doctl monitoring alert-policy create \
     --type v1/insights/droplet/cpu \
     --description "High CPU Alert" \
     --compare GreaterThan \
     --value 80 \
     --window 5m \
     --entities DROPLET_ID
   ```

## Useful Commands

```bash
# List all droplets
doctl compute droplet list

# Get droplet info
doctl compute droplet get DROPLET_ID

# SSH into droplet
doctl compute ssh DROPLET_NAME

# View droplet logs (when using docker)
ssh root@DROPLET_IP "docker logs lexiflow-ai"

# Restart application
ssh root@DROPLET_IP "docker restart lexiflow-ai"

# Delete droplet
doctl compute droplet delete DROPLET_ID
```

## Troubleshooting

### Check application logs
```bash
ssh root@DROPLET_IP "docker logs -f lexiflow-ai"
```

### Rebuild and restart
```bash
ssh root@DROPLET_IP "cd /opt/lexiflow-ai && docker build -t lexiflow-ai:latest . && docker stop lexiflow-ai && docker rm lexiflow-ai && docker run -d --name lexiflow-ai --restart unless-stopped -p 80:3000 -p 3001:3001 lexiflow-ai:latest"
```

### Check container status
```bash
ssh root@DROPLET_IP "docker ps -a"
```

## API Token Storage

Your DigitalOcean API token has been saved in:
- `~/.config/doctl/config.yaml` (doctl configuration)

To use it manually:
```bash
export DIGITALOCEAN_ACCESS_TOKEN=your_digitalocean_token_here
```

## Next Steps

1. Run `./deploy-digitalocean.sh` to deploy to a Droplet
2. Or configure `.do/app.yaml` and use App Platform
3. Set up your domain and SSL certificate
4. Configure environment variables for production
5. Set up automated backups for the database
