#!/usr/bin/env node
/**
 * Build-time / ops helper: writes public/sitemap.xml snapshot from the same
 * URL set the live app/sitemap.ts exposes (static hubs + intentional blogs).
 * Production crawlers use Next.js /sitemap.xml; this file is a CDN/backup snapshot.
 */
const fs = require("fs");
const path = require("path");

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

const staticPaths = [
  "/",
  "/collections",
  "/collections/flowers",
  "/collections/gift-hampers",
  "/collections/teddy-bears",
  "/collections/wines",
  "/collections/chocolates",
  "/collections/cards",
  "/gifts",
  "/occasions",
  "/flowers",
  "/graduation",
  "/weddings-events",
  "/blog",
  "/about",
  "/services",
  "/contact",
  "/florist-nairobi",
  "/florist-nairobi-cbd",
  "/flower-delivery-nairobi",
  "/flower-shop-nairobi",
  "/flowers-and-gifts-nairobi",
  "/same-day-flower-delivery-nairobi",
  "/flower-delivery-westlands-nairobi",
  "/flower-delivery-karen-nairobi",
  "/flower-delivery-kileleshwa-nairobi",
  "/flower-delivery-kilimani-nairobi",
  "/flower-delivery-lavington-nairobi",
  "/flower-delivery-nairobi-cbd",
  "/flower-delivery-upper-hill-nairobi",
  "/graduation-bouquets-nairobi",
  "/gift-hampers-nairobi",
  "/teddy-bears-nairobi",
  "/roses-nairobi",
  "/red-roses-nairobi",
  "/pink-roses-nairobi",
  "/white-roses-nairobi",
  "/birthday-flowers-nairobi",
  "/anniversary-flowers-nairobi",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
];

const intentionalBlogs = [
  "send-flowers-to-kenya-from-abroad",
  "flower-delivery-nairobi",
  "flower-prices-nairobi",
  "what-flowers-to-send-occasion-kenya",
  "valentines-mothers-day-christmas-flowers-kenya",
  "how-to-make-flowers-last-longer",
  "gifts-for-women-and-girlfriends-nairobi",
  "best-gifts-for-men-nairobi",
  "graduation-and-kids-gifts-nairobi",
  "flower-delivery-westlands-karen-kileleshwa-nairobi",
];

const lastmod = new Date().toISOString();

function urlEntry(locPath, priority = "0.8", changefreq = "weekly") {
  const loc = locPath === "/" ? baseUrl : `${baseUrl}${locPath}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const body = [
  ...staticPaths.map((p) =>
    urlEntry(p, p === "/" ? "1.0" : p.startsWith("/flower-delivery") || p === "/blog" ? "0.95" : "0.85")
  ),
  ...intentionalBlogs.map((slug) => urlEntry(`/blog/${slug}`, "0.85")),
].join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outDir = path.join(process.cwd(), "exports");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const sitemapPath = path.join(outDir, "sitemap-snapshot.xml");
fs.writeFileSync(sitemapPath, sitemap);

const robots = `User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /staff/
Disallow: /cart
Disallow: /checkout
Disallow: /_next/image

User-Agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /staff/
Disallow: /cart
Disallow: /checkout

Host: ${baseUrl}
Sitemap: ${baseUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(outDir, "robots-snapshot.txt"), robots);

console.log("Wrote", sitemapPath);
console.log("Wrote", path.join(outDir, "robots-snapshot.txt"));
console.log(`URLs in snapshot: ${staticPaths.length + intentionalBlogs.length}`);
console.log("Note: Live site uses app/sitemap.ts and app/robots.ts — do not put these in public/.");
