import { supabaseAdmin } from "@/lib/supabase";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

  const [{ data: products }, { data: posts }] = await Promise.all([
    (supabaseAdmin.from("products") as any).select("slug, updated_at"),
    (supabaseAdmin.from("blog_posts") as any).select("slug, updated_at"),
  ]).catch(() => [{ data: null }, { data: null }]) as any;

  const staticPages = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${base}/collections/flowers`, priority: 0.95 },
    { url: `${base}/collections/teddy-bears`, priority: 0.9 },
    { url: `${base}/collections/gift-hampers`, priority: 0.9 },
    { url: `${base}/collections/cards`, priority: 0.8 },
    { url: `${base}/flower-delivery-nairobi`, priority: 0.95 },
    { url: `${base}/florist-nairobi-cbd`, priority: 0.95 },
    { url: `${base}/red-roses-nairobi`, priority: 0.9 },
    { url: `${base}/pink-roses-nairobi`, priority: 0.9 },
    { url: `${base}/white-roses-nairobi`, priority: 0.9 },
    { url: `${base}/anniversary-flowers-nairobi`, priority: 0.9 },
    { url: `${base}/birthday-flowers-nairobi`, priority: 0.9 },
    { url: `${base}/wedding-flowers-nairobi`, priority: 0.9 },
    { url: `${base}/corporate-gift-hampers-nairobi`, priority: 0.9 },
    { url: `${base}/apology-flowers-nairobi`, priority: 0.85 },
    { url: `${base}/same-day-flower-delivery-nairobi`, priority: 0.9 },
    { url: `${base}/get-well-soon-flowers-nairobi`, priority: 0.85 },
    { url: `${base}/wedding-car-decor-nairobi`, priority: 0.85 },
    { url: `${base}/contact`, priority: 0.7 },
  ];

  const productUrls =
    (products ?? []).map((p: { slug: string; updated_at?: string }) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  const blogUrls =
    (posts ?? []).map((p: { slug: string; updated_at?: string }) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  return [...staticPages, ...productUrls, ...blogUrls];
}

