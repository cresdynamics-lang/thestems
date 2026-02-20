#!/bin/bash
# Run this script ON the DigitalOcean droplet (178.128.70.10) after SSH login.
# Usage: ssh root@178.128.70.10, then paste or run this script.

set -e
echo "=== The Stems – Server setup ==="

# Node 20
if ! command -v node &>/dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v

# PM2
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

# Project dir
mkdir -p /var/www/thestems
cd /var/www/thestems

# Clone if not already present
if [ ! -f package.json ]; then
  git clone https://github.com/cresdynamics-lang/thestems.git .
else
  git pull origin main
fi

# Env file – create if missing
if [ ! -f .env.local ]; then
  echo "Create .env.local with your Supabase, Resend, JWT, etc. Then run: nano .env.local"
  touch .env.local
  echo "Edit .env.local now? (y/n)"
  read -r ans
  [ "$ans" = "y" ] && nano .env.local
fi

# Install and build
npm install
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# PM2
mkdir -p logs
pm2 delete thestems 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "=== Done. App running on port 3000. Visit http://178.128.70.10:3000 ==="
