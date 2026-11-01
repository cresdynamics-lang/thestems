#!/bin/bash
# Run on the server from the repo root, as a sudo user:
#   sudo bash nginx/apply-thestems-cache.sh
# Adds the page micro-cache and a per-site access log to The Stems' vhost only.
# Reloads nginx only if the config test passes; otherwise restores the backup.
set -euo pipefail

VHOST=/etc/nginx/sites-available/thestemsflowers
BACKUP_DIR=/var/backups/thestems-20261101
CACHE_CONF=/etc/nginx/conf.d/thestems-cache.conf

if grep -q "proxy_cache thestems_pages" "$VHOST"; then
  echo "Already applied."
  exit 0
fi

mkdir -p "$BACKUP_DIR" /var/cache/nginx/thestems
chown www-data:www-data /var/cache/nginx/thestems
cp -p "$VHOST" "$BACKUP_DIR/thestemsflowers.nginx.bak"
cp nginx/thestems-cache.conf "$CACHE_CONF"

python3 - "$VHOST" <<'PY'
import sys
path = sys.argv[1]
s = open(path).read()
a = "    client_max_body_size 50m;\n"
b = "    location / {\n        proxy_pass http://127.0.0.1:3004;\n"
if s.count(a) != 1 or s.count(b) != 1:
    sys.exit("vhost layout changed; nothing edited")
s = s.replace(a, a + '''    access_log /var/log/nginx/thestemsflowers.access.log;

    set $skip_cache 0;
    if ($request_method !~ ^(GET|HEAD)$) { set $skip_cache 1; }
    if ($http_cookie ~* "staff_token|admin_token|connect.sid") { set $skip_cache 1; }
    if ($request_uri ~* "^/(api|staff|admin|_next|order|checkout|cart|payment|supadb)") { set $skip_cache 1; }
''')
s = s.replace(b, '''    location / {
        proxy_cache thestems_pages;
        proxy_cache_valid 200 301 30s;
        proxy_cache_valid 404 10s;
        proxy_cache_bypass $skip_cache;
        proxy_no_cache $skip_cache;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_lock on;
        add_header X-Cache-Status $upstream_cache_status always;

        proxy_pass http://127.0.0.1:3004;
''')
open(path, "w").write(s)
PY

if nginx -t; then
  systemctl reload nginx
  echo "Applied and reloaded."
else
  cp -p "$BACKUP_DIR/thestemsflowers.nginx.bak" "$VHOST"
  mv "$CACHE_CONF" "$BACKUP_DIR/thestems-cache.conf.failed"
  echo "Config test failed; restored the backup. nginx was not reloaded." >&2
  exit 1
fi
