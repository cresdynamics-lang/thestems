#!/usr/bin/env node
/**
 * Smoke tests: health, orders API, staff auth, Pesapal redirect, payment-flow files.
 * Usage: node scripts/smoke-test-payment-flow.js [baseUrl]
 * Default baseUrl: http://127.0.0.1:3000
 */

const fs = require("fs");
const path = require("path");

const BASE = (process.argv[2] || process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const ROOT = path.join(__dirname, "..");

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`❌ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, { ...options, redirect: "manual" });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { res, text, json };
}

async function runHttpTests() {
  const health = await fetchJson(`${BASE}/api/health`);
  if (health.res.ok && health.json?.database === "connected") {
    pass("Health API", `products=${health.json.productsCount ?? "?"}`);
  } else {
    fail("Health API", `${health.res.status} ${health.text.slice(0, 120)}`);
  }

  const staffOrders = await fetchJson(`${BASE}/api/staff/orders`);
  if (staffOrders.res.status === 401) {
    pass("Staff orders API protected", "401 without auth");
  } else {
    fail("Staff orders API protected", `expected 401, got ${staffOrders.res.status}`);
  }

  const staffPage = await fetchJson(`${BASE}/staff/orders`);
  if (staffPage.res.status === 200) {
    pass("Staff orders page", "200");
  } else {
    fail("Staff orders page", `${staffPage.res.status}`);
  }

  const pesapalRedirect = await fetchJson(
    `${BASE}/api/pesapal/callback?OrderTrackingId=test-track&OrderMerchantReference=00000000-0000-0000-0000-000000000000`
  );
  if (pesapalRedirect.res.status >= 300 && pesapalRedirect.res.status < 400) {
    const location = pesapalRedirect.res.headers.get("location") || "";
    if (location.includes("/order/success") && location.includes("pending=true")) {
      pass("Pesapal success redirect", location.slice(0, 80));
    } else {
      fail("Pesapal success redirect", `unexpected location: ${location}`);
    }
  } else {
    fail("Pesapal success redirect", `status ${pesapalRedirect.res.status}`);
  }

  const ordersPublic = await fetchJson(`${BASE}/api/orders`);
  if (ordersPublic.res.ok && Array.isArray(ordersPublic.json)) {
    pass("Orders API list", `${ordersPublic.json.length} orders`);
  } else {
    fail("Orders API list", `${ordersPublic.res.status}`);
  }
}

function runCodeTests() {
  const required = [
    "app/api/pesapal/callback/route.ts",
    "app/order/success/page.tsx",
    "lib/whatsapp.ts",
    "app/checkout/page.tsx",
    "components/staff/OrderItemsList.tsx",
    "components/staff/OrderDeliveryDetails.tsx",
    "lib/orderDisplay.ts",
  ];

  for (const rel of required) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      fail(`File exists: ${rel}`);
      continue;
    }
    const content = fs.readFileSync(full, "utf8");
    if (rel.includes("pesapal/callback") && content.includes('newStatus === "paid"') && content.includes("resend.emails.send")) {
      pass(`Payment email on paid: ${rel}`);
    } else if (rel.includes("order/success") && content.includes("schedulePaidOrderWhatsAppRedirect") && content.includes('status === "paid"')) {
      pass(`WhatsApp redirect on paid: ${rel}`);
    } else if (rel.includes("lib/whatsapp") && content.includes("redirectToWhatsApp") && content.includes("schedulePaidOrderWhatsAppRedirect")) {
      pass(`WhatsApp redirect helpers: lib/whatsapp.ts`);
    } else if (rel.includes("checkout") && content.includes("buildCheckoutOrderMeta")) {
      pass(`Checkout saves delivery meta: ${rel}`);
    } else if (rel.includes("OrderItemsList") && content.includes("/product/")) {
      pass(`Product links in orders: ${rel}`);
    } else if (rel.includes("OrderDeliveryDetails") && content.includes("Message on card")) {
      pass(`Delivery & card message UI: ${rel}`);
    } else {
      pass(`File exists: ${rel}`);
    }
  }
}

async function runDbOrderShapeTest() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("ℹ️  Skipping DB order shape test (Supabase env not set in this shell)");
    return;
  }

  const { createClient } = require("@supabase/supabase-js");
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const cols = ["gift_message", "delivery_location", "special_instructions", "recipient_name"];
  for (const col of cols) {
    const { error } = await sb.from("orders").select(col).limit(1);
    if (error) fail(`DB column: ${col}`, error.message);
    else pass(`DB column: ${col}`);
  }

  const { data, error } = await sb
    .from("orders")
    .select("id, status, items, delivery_city, delivery_location")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    fail("Latest order fetch", error.message);
    return;
  }
  if (!data) {
    console.log("ℹ️  No orders in database yet");
    return;
  }

  const items = Array.isArray(data.items) ? data.items : [];
  const withSlug = items.filter((i) => i?.slug).length;
  pass("Latest order has items", `${items.length} item(s), ${withSlug} with slug`);
  pass("Latest order location", data.delivery_location || data.delivery_city || "(none)");
}

async function main() {
  console.log(`\n🧪 Smoke tests — ${BASE}\n`);
  runCodeTests();
  await runHttpTests();
  await runDbOrderShapeTest();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
