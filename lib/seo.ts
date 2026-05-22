import { SHOP_INFO } from "@/lib/constants";
import { getCleanProductTitle } from "@/lib/productDisplay";

export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const SITE_NAME = "The Stems Flowers Nairobi";

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function toAbsoluteImageUrl(imagePath?: string, fallback?: string): string {
  const path = imagePath || fallback || "/images/logo/thestemslogo.jpeg";
  return absoluteUrl(path);
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SHOP_INFO.name,
    url: SITE_URL,
    logo: absoluteUrl("/images/logo/thestemslogo.jpeg"),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${SHOP_INFO.phone}`,
      contactType: "Customer Service",
      areaServed: "KE",
      availableLanguage: ["English", "Swahili"],
    },
    sameAs: [
      `https://www.instagram.com/${SHOP_INFO.instagram}`,
      `https://www.facebook.com/${SHOP_INFO.facebook}`,
    ],
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": `${SITE_URL}#business`,
    name: SITE_NAME,
    image: absoluteUrl("/images/logo/thestemslogo.jpeg"),
    url: SITE_URL,
    telephone: `+${SHOP_INFO.phone}`,
    priceRange: "$$",
    currenciesAccepted: "KES",
    email: SHOP_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Delta Hotel, University Way",
      addressLocality: "Nairobi CBD",
      addressRegion: "Nairobi",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2833,
      longitude: 36.8172,
    },
    areaServed: { "@type": "City", name: "Nairobi" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    description:
      "Nairobi CBD florist at Delta Hotel, University Way. Fresh roses, bouquets, gift hampers and teddy bears with same-day delivery across Nairobi. Pay with M-Pesa.",
    paymentAccepted: ["M-Pesa", "Cash", "Card"],
    hasMap: SHOP_INFO.mapUrl,
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SHOP_INFO.name,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/collections?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Year-round service links for sitewide ItemList rich results */
export function buildServicesItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Flower & Gift Delivery Services in Nairobi",
    description:
      "Same-day flower delivery, gift hampers, wines, chocolates and teddy bears across Nairobi from The Stems Flowers.",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Flower Delivery Nairobi", url: absoluteUrl("/collections/flowers") },
      { "@type": "ListItem", position: 2, name: "Gift Hampers Nairobi", url: absoluteUrl("/collections/gift-hampers") },
      { "@type": "ListItem", position: 3, name: "Same-Day Delivery", url: absoluteUrl("/same-day-flower-delivery-nairobi") },
      { "@type": "ListItem", position: 4, name: "Birthday Flowers", url: absoluteUrl("/birthday-flowers-nairobi") },
      { "@type": "ListItem", position: 5, name: "Anniversary Flowers", url: absoluteUrl("/anniversary-flowers-nairobi") },
      { "@type": "ListItem", position: 6, name: "Wedding Flowers", url: absoluteUrl("/wedding-flowers-nairobi") },
      { "@type": "ListItem", position: 7, name: "Corporate Gift Hampers", url: absoluteUrl("/corporate-gift-hampers-nairobi") },
      { "@type": "ListItem", position: 8, name: "Florist Nairobi CBD", url: absoluteUrl("/florist-nairobi-cbd") },
      { "@type": "ListItem", position: 9, name: "Flower Delivery Westlands", url: absoluteUrl("/flower-delivery-westlands-nairobi") },
      { "@type": "ListItem", position: 10, name: "Flower Delivery Kilimani", url: absoluteUrl("/flower-delivery-kilimani-nairobi") },
    ],
  };
}

export function buildSitewideFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where is The Stems Flowers located in Nairobi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We are at Delta Hotel, University Way, Nairobi CBD — open Monday to Saturday 8AM to 8PM. We deliver across all Nairobi neighbourhoods.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer same-day flower delivery in Nairobi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Order by 4PM for same-day delivery across Nairobi including Westlands, Karen, Kilimani, Lavington, South B and Runda.",
        },
      },
      {
        "@type": "Question",
        name: "How can I pay for flowers at The Stems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pay with M-Pesa (Till 4202044, Paybill 880100), card or cash at our Delta Hotel, University Way shop.",
        },
      },
      {
        "@type": "Question",
        name: "What gift hampers do you deliver in Nairobi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Luxury hampers with flowers, wine, Ferrero Rocher chocolates and teddy bears — ideal for birthdays, anniversaries and corporate gifting.",
        },
      },
    ],
  };
}

export function buildProductJsonLd(product: {
  title: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  price: number;
  images?: string[] | null;
  category: string;
}) {
  const productUrl = absoluteUrl(`/product/${product.slug}`);
  const images = (product.images ?? [])
    .filter(Boolean)
    .map((img) => toAbsoluteImageUrl(img));
  const priceKes = (product.price / 100).toFixed(0);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: getCleanProductTitle(product.title),
    description: product.description || product.short_description || getCleanProductTitle(product.title),
    sku: product.slug,
    image: images.length > 0 ? images : [absoluteUrl("/images/logo/thestemslogo.jpeg")],
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: priceKes,
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: productUrl,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      areaServed: { "@type": "City", name: "Nairobi" },
      seller: {
        "@type": "Florist",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  };
}

/** Deterministic ordering for SSR/crawl consistency (avoids random shuffle per request) */
export function stableSortByKey<T extends { slug?: string; id?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const keyA = (a.slug || a.id || "").toLowerCase();
    const keyB = (b.slug || b.id || "").toLowerCase();
    return keyA.localeCompare(keyB);
  });
}
