#!/bin/bash
# LexiFlow AI - DigitalOcean Quick Reference

cat << 'EOF'

╔════════════════════════════════════════════════════════════════════╗
║            LEXIFLOW AI - DIGITALOCEAN QUICK REFERENCE              ║
╚════════════════════════════════════════════════════════════════════╝

🚀 DEPLOY NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ./deploy.sh                    # Interactive wizard (recommended)
  ./deploy-digitalocean.sh       # Direct droplet deployment

📊 CHECK STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  doctl account get              # Verify authentication
  doctl compute droplet list     # List all droplets
  doctl apps list                # List App Platform apps

🔑 YOUR CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Account: justin.saadein@harborgrid.com
  Token: Saved in ~/.config/doctl/config.yaml
  Status: ✓ Active and authenticated

📁 KEY FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  deploy.sh                      # Interactive deployment wizard
  deploy-digitalocean.sh         # Automated droplet setup
  Dockerfile                     # Container configuration
  .do/app.yaml                   # App Platform spec
  DEPLOYMENT.md                  # Full documentation
  .env.production.template       # Environment vars template

💰 PRICING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Droplet (s-2vcpu-4gb):         $24/month
  App Platform:                  $12-24/month per service
  Container Registry:            $5/month (basic)

🌍 DEFAULT CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Region: NYC3 (New York)
  Size: 2 vCPU, 4GB RAM
  OS: Ubuntu 20.04 with Docker
  Ports: 80 (frontend), 3001 (backend)

📖 LEARN MORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  cat DEPLOYMENT.md              # Read full deployment guide
  doctl compute size list        # View available droplet sizes
  doctl compute region list      # View available regions

EOF
