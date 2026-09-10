# Local Postgres (replaced Supabase)

Database: `thestems` on 127.0.0.1:5432 on the app server (13.140.33.232).
Roles: `thestems_app` (owner, full access — used by DATABASE_URL), `thestems_anon` (read-only, used by PostgREST public reads).

PostgREST runs on 127.0.0.1:3012 (systemd `postgrest.service`, config `/etc/postgrest.conf`).
Next.js supabase-js clients are pointed at `https://thestemsflowers.co.ke/supadb` which nginx
proxies to PostgREST (`/supadb/rest/v1/*` → `/*`). Keys in server `.env` are JWTs signed with
the PostgREST `jwt-secret` (anon role = read-only, service role = thestems_app).

Apply schema + seed:
    sudo -u postgres psql -d thestems -f schema.sql
    sudo -u postgres psql -d thestems -f seed.sql
