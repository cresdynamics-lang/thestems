import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { SITE_URL } from "@/lib/seo";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: products }, { data: posts }] = await Promise.all([
    (supabaseAdmin.from("products") as any).select("slug, updated_at"),
    (supabaseAdmin.from("blog_posts") as any).select("slug, updated_at"),
  ]).catch(() => [{ data: null }, { data: null }]) as [
    { data: { slug: string; updated_at?: string }[] | null },
    { data: { slug: string; updated_at?: string }[] | null },
  ];

  const staticPages: SitemapEntry[] = [
    staticPage("/", 1.0, "daily"),
    staticPage("/collections", 0.9, "daily"),
    staticPage("/collections/flowers", 0.95, "daily"),
    staticPage("/collections/gift-hampers", 0.9, "daily"),
    staticPage("/collections/teddy-bears", 0.9, "weekly"),
    staticPage("/collections/wines", 0.85, "weekly"),
    staticPage("/collections/chocolates", 0.85, "weekly"),
    staticPage("/collections/cards", 0.75, "weekly"),
    staticPage("/blog", 0.8, "weekly"),
    staticPage("/about", 0.7, "monthly"),
    staticPage("/services", 0.75, "monthly"),
    staticPage("/contact", 0.7, "monthly"),
    staticPage("/florist-nairobi-cbd", 0.95, "weekly"),
    staticPage("/flower-delivery-westlands-nairobi", 0.9, "weekly"),
    staticPage("/flower-delivery-kilimani-nairobi", 0.9, "weekly"),
    staticPage("/flower-delivery-karen-nairobi", 0.9, "weekly"),
    staticPage("/flower-delivery-nairobi-cbd", 0.9, "weekly"),
    staticPage("/same-day-flower-delivery-nairobi", 0.9, "weekly"),
    staticPage("/birthday-flowers-nairobi", 0.9, "weekly"),
    staticPage("/anniversary-flowers-nairobi", 0.9, "weekly"),
    staticPage("/apology-flowers-nairobi", 0.85, "weekly"),
    staticPage("/wedding-flowers-nairobi", 0.9, "weekly"),
    staticPage("/wedding-car-decor-nairobi", 0.85, "weekly"),
    staticPage("/corporate-gift-hampers-nairobi", 0.9, "weekly"),
    staticPage("/red-roses-nairobi", 0.9, "weekly"),
    staticPage("/pink-roses-nairobi", 0.9, "weekly"),
    staticPage("/white-roses-nairobi", 0.9, "weekly"),
    staticPage("/flower-wine-hamper-nairobi", 0.9, "weekly"),
    staticPage("/send-gifts-to-kenya", 0.85, "weekly"),
    staticPage("/terms-of-service", 0.3, "yearly"),
    staticPage("/refund-policy", 0.3, "yearly"),
  ];

  const productUrls: SitemapEntry[] = (products ?? []).map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogUrls: SitemapEntry[] = (posts ?? []).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticPages, ...productUrls, ...blogUrls];
}
