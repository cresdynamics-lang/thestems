# The Stems – Deploy to DigitalOcean

**Droplet IP:** `13.140.33.232`

---

## First-time server setup (run once on the droplet)

### 1. SSH into the server

From your local machine:

```bash
ssh root@13.140.33.232
```

Use the droplet password when prompted (or use an SSH key if you’ve added one).

### 2. Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # should show v20.x
```

### 3. Install PM2 and create project directory

```bash
sudo npm install -g pm2
sudo mkdir -p /var/www/sites/thestemsflowers.co.ke
sudo chown $USER:$USER /var/www/sites/thestemsflowers.co.ke
cd /var/www/sites/thestemsflowers.co.ke
```

### 4. Clone the repo

```bash
git clone https://github.com/cresdynamics-lang/thestems.git .
# or with SSH: git clone git@github.com:cresdynamics-lang/thestems.git .
```

### 5. Environment file

Create production env and add your secrets (no quotes around values if they have no spaces):

```bash
nano .env.local
```

Paste the same variables as in your local `.env.example` / `.env.local`, e.g.:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `RESEND_API_KEY`, `JWT_SECRET`
- Pesapal keys if used

Save and exit (Ctrl+X, Y, Enter).

### 6. Build and run with PM2

```bash
npm ci
NODE_OPTIONS='--max-old-space-size=4096' npm run build
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # run the command it prints to start PM2 on boot
```

Verify the app is healthy:

```bash
curl -s http://127.0.0.1:3000/api/health
```

### 7. Nginx and HTTPS

To serve on port 80/443 with your domain:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo cp nginx/thestems.conf /etc/nginx/sites-available/thestems
sudo ln -sf /etc/nginx/sites-available/thestems /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# HTTPS (when DNS A record points to 13.140.33.232):
sudo certbot --nginx -d thestemsflowers.co.ke -d www.thestemsflowers.co.ke
```

---

## Deploy updates (from your local machine)

### Option A: Deploy script (recommended)

```bash
chmod +x deploy.sh
./deploy.sh
```

Defaults: IP `13.140.33.232`, user `root`, path `/var/www/sites/thestemsflowers.co.ke`.  
You’ll be prompted for the server password (or use SSH key so no password).

Override defaults:

```bash
./deploy.sh 13.140.33.232 root /var/www/sites/thestemsflowers.co.ke
```

### Option B: One-line SSH

```bash
ssh root@13.140.33.232 "cd /var/www/sites/thestemsflowers.co.ke && git pull origin main && npm ci --omit=dev && NODE_OPTIONS='--max-old-space-size=4096' npm run build && pm2 restart thestems"
```

### Option C: Manual

1. Push to GitHub: `git push origin main`
2. SSH in: `ssh root@13.140.33.232`
3. Run:

```bash
cd /var/www/sites/thestemsflowers.co.ke
bash scripts/deploy-on-server.sh
```

---

## Useful commands on the server

```bash
pm2 status
pm2 logs thestems
pm2 restart thestems
```

---

## Security note

- Do **not** commit the droplet password to the repo or store it in any script.
- Prefer SSH key login: `ssh-copy-id root@13.140.33.232` from your machine, then you can run `./deploy.sh` without typing the password.
