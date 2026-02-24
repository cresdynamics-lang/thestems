#!/bin/bash

# Digital Ocean Deployment Script
# Usage: ./deploy.sh [server_ip] [username] [project_path]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration – The Stems (DigitalOcean droplet 178.128.70.10)
SERVER_IP="${1:-178.128.70.10}"
SERVER_USER="${2:-root}"
PROJECT_PATH="${3:-/var/www/thestems}"

echo -e "${GREEN}🚀 Deploying The Stems to Digital Ocean (${SERVER_IP})...${NC}"

# Step 1: Pull latest changes from GitHub
echo -e "${YELLOW}📥 Pulling latest changes from GitHub...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && git pull origin main"

# Step 2: Install/update dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && npm install"

# Step 3: Build the application
echo -e "${YELLOW}🔨 Building the application...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && NODE_OPTIONS='--max-old-space-size=4096' npm run build"

# Step 4: Restart the application
echo -e "${YELLOW}🔄 Restarting the application...${NC}"

# If using PM2
if ssh ${SERVER_USER}@${SERVER_IP} "command -v pm2 &> /dev/null"; then
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pm2 restart thestems || pm2 start ecosystem.config.js"
# If using systemd
elif ssh ${SERVER_USER}@${SERVER_IP} "systemctl is-active --quiet thestems 2>/dev/null"; then
    ssh ${SERVER_USER}@${SERVER_IP} "sudo systemctl restart thestems"
# Otherwise, just kill and restart
else
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && pkill -f 'next start' || true"
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${PROJECT_PATH} && nohup npm start > /tmp/thestems.log 2>&1 &"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Site: http://${SERVER_IP}:3000 or https://thestemsflowers.co.ke (if DNS/nginx configured)${NC}"


