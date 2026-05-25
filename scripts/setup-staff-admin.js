/**
 * Runs staff_admin_schema.sql and creates/updates super_admin in admins.
 * Usage: node scripts/setup-staff-admin.js
 */

const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  fs.readFileSync(filePath, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const match = trimmed.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (match) {
        const value = match[2].replace(/^["']|["']$/g, "").trim();
        if (!process.env[match[1]]) process.env[match[1]] = value;
      }
    });
}

const root = path.join(__dirname, "..");
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@floralwhispersgifts.co.ke").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "FloralWhispers@2026";
const ADMIN_NAME = process.env.ADMIN_NAME || "Store Manager";

async function setupViaSupabaseApi() {
  const { createClient } = require("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: adminErr } = await supabase.from("admins").upsert(
    {
      email: ADMIN_EMAIL,
      password_hash: ADMIN_PASSWORD,
      role: "super_admin",
      name: ADMIN_NAME,
      is_active: true,
    },
    { onConflict: "email" }
  );

  if (adminErr) {
    throw new Error(`admins upsert: ${adminErr.message}. Run staff_admin_schema.sql in Supabase SQL Editor.`);
  }

  console.log(`✓ Super admin upserted via API: ${ADMIN_EMAIL}`);
  patchEnvLocal();
  printLoginInfo();
}

function patchEnvLocal() {
  const envLocalPath = path.join(root, ".env.local");
  let envContent = fs.existsSync(envLocalPath) ? fs.readFileSync(envLocalPath, "utf8") : "";
  const additions = [];
  if (!envContent.includes("NEXT_PUBLIC_SITE_URL=")) {
    additions.push("NEXT_PUBLIC_SITE_URL=https://floralwhispersgifts.co.ke");
  }
  if (
    !envContent.includes("JWT_SECRET=") ||
    envContent.includes("JWT_SECRET=SET_A_STRONG_RANDOM_SECRET")
  ) {
    const secret = require("crypto").randomBytes(32).toString("base64");
    if (envContent.includes("JWT_SECRET=SET_A_STRONG_RANDOM_SECRET")) {
      envContent = envContent.replace(
        /JWT_SECRET=SET_A_STRONG_RANDOM_SECRET/,
        `JWT_SECRET=${secret}`
      );
    } else {
      additions.push(`JWT_SECRET=${secret}`);
    }
  }
  if (additions.length) {
    envContent += "\n# Staff admin setup\n" + additions.join("\n") + "\n";
  }
  fs.writeFileSync(envLocalPath, envContent);
  console.log("✓ .env.local updated (JWT / site URL if needed)");
}

function printLoginInfo() {
  console.log("\n--- Staff login ---");
  console.log("URL:      http://localhost:3000/staff/login");
  console.log("Email:    " + ADMIN_EMAIL);
  console.log("Password: (ADMIN_PASSWORD in .env.local)");
  console.log("\nIf new tables are missing, run supabase/migrations/staff_admin_schema.sql in Supabase SQL Editor.");
  console.log("Run: npm run dev");
}

async function main() {
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL missing in .env.local");
    process.exit(1);
  }

  let pg;
  try {
    pg = require("pg");
  } catch {
    console.log("Installing pg…");
    require("child_process").execSync("npm install pg --no-save", {
      cwd: root,
      stdio: "inherit",
    });
    pg = require("pg");
  }

  const sqlPath = path.join(root, "supabase", "migrations", "staff_admin_schema.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  const passwordMatch = DATABASE_URL.match(/:\/\/([^:]+):([^@]+)@/);
  const dbPassword = passwordMatch ? passwordMatch[2] : "";
  const projectRef =
    process.env.SUPABASE_PROJECT_REF ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace("https://", "").split(".")[0];

  const connectionCandidates = [
    DATABASE_URL,
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
  ].filter(Boolean);

  let client;
  let lastErr;
  for (const conn of connectionCandidates) {
    try {
      client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
      console.log("Connecting to Supabase Postgres…");
      await client.connect();
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
      try {
        await client?.end();
      } catch {
        /* ignore */
      }
      client = null;
    }
  }
  if (!client) {
    console.log("Direct Postgres unavailable, using Supabase API for admin user only…");
    await setupViaSupabaseApi();
    return;
  }

  console.log("Running staff_admin_schema.sql…");
  await client.query(sql);
  console.log("✓ Migration applied");

  const upsertAdmin = `
    INSERT INTO admins (email, password_hash, role, name, is_active)
    VALUES ($1, $2, 'super_admin', $3, true)
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = 'super_admin',
      name = EXCLUDED.name,
      is_active = true;
  `;
  await client.query(upsertAdmin, [ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME]);
  console.log(`✓ Super admin ready: ${ADMIN_EMAIL}`);

  await client.end();
  patchEnvLocal();
  printLoginInfo();
}

main().catch((err) => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});
