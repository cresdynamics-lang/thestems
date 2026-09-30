import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Robots for thestemsflowers.co.ke
 * Keep private app areas out of the index; point crawlers at the live sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/staff/",
          "/cart",
          "/checkout",
          "/_next/image",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/staff/", "/cart", "/checkout"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
