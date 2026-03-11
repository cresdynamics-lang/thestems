/**
 * One-off script to verify Supabase (database) connection.
 * Loads .env from project root and runs a simple query.
 * Run: node scripts/check-db-connection.js
 */

const fs = require("fs");
const path = require("path");

// Load .env
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match) {
      const value = match[2].replace(/^["']|["']$/g, "").trim();
      process.env[match[1]] = value;
    }
  });
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const { createClient } = require("@supabase/supabase-js");

// Use service role key if set (bypasses RLS), else anon
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const key = serviceKey && serviceKey.length > 20 ? serviceKey : anonKey;
const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function check() {
  try {
    // Simple REST check first (use anon for public access)
    const restRes = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (!restRes.ok && restRes.status !== 404) {
      const body = await restRes.text();
      console.error("❌ Supabase API key rejected:", restRes.status, body);
      console.error("\n   → Check .env: NEXT_PUBLIC_SUPABASE_ANON_KEY must match");
      console.error("     Supabase Dashboard → Project Settings → API → anon public");
      process.exit(1);
    }

    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("❌ Database error:", error.message || "(no message)");
      console.error("   Code:", error.code);
      console.error("   Details:", JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log("✅ Database connection OK");
    console.log("   Supabase URL:", url);
    console.log("   Products count:", count ?? 0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    if (err.cause) console.error("   Cause:", err.cause);
    process.exit(1);
  }
}

check();
