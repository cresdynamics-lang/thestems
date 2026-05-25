# Floral Whispers Gifts – Staff Admin Panel

Staff admin is available at **`/staff`** (login at **`/staff/login`**).

## Setup

1. Run the SQL migration in Supabase SQL Editor:
   - `supabase/migrations/staff_admin_schema.sql`

2. Ensure staff users exist in the `admins` table:

```sql
INSERT INTO admins (email, password_hash, role, name, is_active)
VALUES (
  'admin@floralwhispersgifts.co.ke',
  'YourSecurePassword',
  'super_admin',
  'Store Manager',
  true
)
ON CONFLICT (email) DO UPDATE SET role = 'super_admin', is_active = true;
```

3. Environment variables (same as main app):
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (password reset & email replies)

## Roles

| Role | Access |
|------|--------|
| **super_admin** | Full access including delete, finance, staff management |
| **staff** | Products, orders, customers, coupons, delivery — no delete, no finance |

## Session

- JWT expires after **30 minutes** of inactivity (client-side timer + 30m token TTL)
- Login attempts logged in `staff_login_audit`
- Actions logged in `staff_audit_logs`

## Footer

A **Staff** link in the site footer points to `/staff/login`.
