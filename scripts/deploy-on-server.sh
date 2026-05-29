#!/bin/bash
# Run ON the DigitalOcean droplet after code is pushed to GitHub.
# Usage: cd /var/www/thestems && bash scripts/deploy-on-server.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Pulling latest from main..."
git pull origin main

echo "==> Installing dependencies..."
npm ci

echo "==> Building (production)..."
NODE_OPTIONS='--max-old-space-size=4096' npm run build

echo "==> Restarting PM2..."
mkdir -p logs
if pm2 describe thestems &>/dev/null; then
  pm2 restart thestems
else
  pm2 start ecosystem.config.js
fi
pm2 save

echo "==> Done. Check: curl -s http://127.0.0.1:3000/api/health"
