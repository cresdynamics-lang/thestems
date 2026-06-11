#!/bin/bash
# Deploy to production and run smoke tests on the server + public URL
set -e

SERVER_IP="${1:-178.128.70.10}"
SERVER_USER="${2:-root}"
PROJECT_PATH="${3:-/var/www/thestems}"
PUBLIC_URL="${4:-https://thestemsflowers.co.ke}"

echo "🚀 Deploying to ${SERVER_USER}@${SERVER_IP}:${PROJECT_PATH}..."
ssh "${SERVER_USER}@${SERVER_IP}" "cd ${PROJECT_PATH} && git pull origin main && npm ci && NODE_OPTIONS='--max-old-space-size=4096' npm run build && (pm2 restart thestems || pm2 start ecosystem.config.js) && pm2 save"

echo "🧪 Running smoke tests on server (localhost)..."
ssh "${SERVER_USER}@${SERVER_IP}" "cd ${PROJECT_PATH} && export \$(grep -E '^NEXT_PUBLIC_SUPABASE_URL=|^SUPABASE_SERVICE_ROLE_KEY=' .env | xargs) && node scripts/smoke-test-payment-flow.js http://127.0.0.1:3000"

echo "🧪 Running smoke tests on public URL..."
npm run test:smoke:live

echo "✅ Deploy and smoke tests complete"
