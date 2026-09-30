#!/usr/bin/env node
/**
 * Phase 5 smoke: verify critical SEO routes respond 200.
 * Usage: BASE_URL=http://127.0.0.1:3004 node scripts/qa-seo-routes.mjs
 */
const BASE = process.env.BASE_URL || "http://127.0.0.1:3004";

const PATHS = [
  "/",
  "/flowers",
  "/gifts",
  "/occasions",
  "/graduation",
  "/weddings-events",
  "/gift-hampers-nairobi",
  "/same-day-flower-delivery-nairobi",
  "/contact",
  "/flower-delivery-nairobi",
  "/florist-nairobi",
  "/flower-shop-nairobi",
  "/flowers-and-gifts-nairobi",
  "/roses-nairobi",
  "/corporate-flowers-nairobi",
  "/flowers-across-kenya",
  "/graduation-bouquets-nairobi",
  "/teddy-bears-nairobi",
  "/fruit-baskets-nairobi",
  "/funeral-flowers-nairobi",
  "/flower-delivery-lavington-nairobi",
  "/flower-delivery-upper-hill-nairobi",
  "/white-roses-nairobi",
  "/collections/flowers",
  "/collections/gift-hampers",
  "/collections/teddy-bears",
];

async function main() {
  let fails = 0;
  for (const path of PATHS) {
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
      const ok = res.status === 200;
      if (!ok) {
        console.log(`FAIL ${res.status} ${path}`);
        fails += 1;
      } else {
        console.log(`OK   ${res.status} ${path}`);
      }
    } catch (err) {
      console.log(`FAIL ERR ${path} ${err.message}`);
      fails += 1;
    }
  }
  console.log(`\nDone. fails=${fails}`);
  process.exit(fails ? 1 : 0);
}

main();
