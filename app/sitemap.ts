import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { SITE_URL } from "@/lib/seo";
import { INTENTIONAL_BLOG_POSTS } from "@/lib/intentionalBlogPosts";
import { SEO_PILLAR_BLOG_POSTS } from "@/lib/seoPillarBlogPosts";
import { MAIN_NAV } from "@/lib/navTaxonomy";
import { GBP_DESTINATION_URLS } from "@/lib/gbpDestinationUrls";

export const revalidate = 1800;

type SitemapEntry = MetadataRoute.Sitemap[number];

function staticPage(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "weekly"
): SitemapEntry {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

function collectNavPaths(): string[] {
  const paths = new Set<string>();
  for (const item of MAIN_NAV) {
    paths.add(item.href);
    for (const child of item.children ?? []) {
      paths.add(child.href);
    }
  }
  for (const d of GBP_DESTINATION_URLS) {
    paths.add(d.href);
  }
  return [...paths];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: products }, { data: posts }] = await Promise.all([
    (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .select("slug, updated_at, visibility")
      .or("visibility.is.null,visibility.eq.published"),
    (supabaseAdmin.from("blog_posts") as ReturnType<typeof supabaseAdmin.from>).select(
      "slug, updated_at"
    ),
  ]).catch(() => [{ data: null }, { data: null }]) as [
    { data: { slug: string; updated_at?: string }[] | null },
    { data: { slug: string; updated_at?: string }[] | null },
  ];

  const corePages: SitemapEntry[] = [
    staticPage("/", 1.0, "daily"),
    staticPage("/collections", 0.9, "daily"),
    staticPage("/collections/flowers", 0.95, "daily"),
    staticPage("/collections/gift-hampers", 0.9, "daily"),
    staticPage("/collections/teddy-bears", 0.9, "weekly"),
    staticPage("/collections/wines", 0.85, "weekly"),
    staticPage("/collections/chocolates", 0.85, "weekly"),
    staticPage("/collections/cards", 0.75, "weekly"),
    staticPage("/gifts", 0.9, "weekly"),
    staticPage("/occasions", 0.9, "weekly"),
    staticPage("/flowers", 0.95, "weekly"),
    staticPage("/graduation", 0.95, "weekly"),
    staticPage("/weddings-events", 0.9, "weekly"),
    staticPage("/blog", 0.85, "daily"),
    staticPage("/about", 0.7, "monthly"),
    staticPage("/services", 0.75, "monthly"),
    staticPage("/contact", 0.7, "monthly"),
    staticPage("/florist-nairobi-cbd", 0.95, "weekly"),
    staticPage("/florist-nairobi", 0.95, "weekly"),
    staticPage("/flower-delivery-nairobi", 0.95, "weekly"),
    staticPage("/flower-shop-nairobi", 0.9, "weekly"),
    staticPage("/flowers-and-gifts-nairobi", 0.9, "weekly"),
    staticPage("/same-day-flower-delivery-nairobi", 0.95, "weekly"),
    staticPage("/flower-delivery-westlands-nairobi", 0.95, "weekly"),
    staticPage("/flower-delivery-karen-nairobi", 0.95, "weekly"),
    staticPage("/flower-delivery-kileleshwa-nairobi", 0.95, "weekly"),
    staticPage("/flower-delivery-kilimani-nairobi", 0.9, "weekly"),
    staticPage("/flower-delivery-nairobi-cbd", 0.9, "weekly"),
    staticPage("/flower-delivery-lavington-nairobi", 0.9, "weekly"),
    staticPage("/flower-delivery-runda-nairobi", 0.85, "weekly"),
    staticPage("/flower-delivery-gigiri-nairobi", 0.85, "weekly"),
    staticPage("/flower-delivery-upper-hill-nairobi", 0.9, "weekly"),
    staticPage("/terms-of-service", 0.3, "yearly"),
    staticPage("/refund-policy", 0.3, "yearly"),
    staticPage("/privacy-policy", 0.3, "yearly"),
  ];

  const navExtra: SitemapEntry[] = collectNavPaths()
    .filter((p) => p.startsWith("/") && p !== "/")
    .map((p) => staticPage(p, 0.88, "weekly"));

  const seen = new Set<string>();
  const staticPages: SitemapEntry[] = [];
  for (const entry of [...corePages, ...navExtra]) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    staticPages.push(entry);
  }

  const productUrls: SitemapEntry[] = (products ?? []).map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogSlugDates = new Map<string, Date>();
  for (const p of [...SEO_PILLAR_BLOG_POSTS, ...INTENTIONAL_BLOG_POSTS]) {
    blogSlugDates.set(p.slug, new Date(p.publishedAt));
  }
  for (const p of posts ?? []) {
    blogSlugDates.set(p.slug, p.updated_at ? new Date(p.updated_at) : new Date());
  }

  const blogUrls: SitemapEntry[] = [...blogSlugDates.entries()].map(([slug, lastModified]) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productUrls, ...blogUrls];
}
