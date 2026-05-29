import { Metadata } from "next";
import FlowersPageClient from "./FlowersPageClient";
import { getProducts, type Product } from "@/lib/db";

import { SITE_URL, toAbsoluteImageUrl } from "@/lib/seo";
import { FLOWERS_SEO_KEYWORDS } from "@/lib/seo-keywords";

const baseUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Flower Delivery Nairobi | Fresh Roses & Bouquets from KSh 3,500 | The Stems",
  description:
    "Order fresh flowers in Nairobi from KSh 3,500. Shop red roses, mixed bouquets, birthday and anniversary flowers with same-day delivery in Nairobi CBD and fast citywide delivery.",
  keywords: FLOWERS_SEO_KEYWORDS,
  alternates: {
    canonical: `${baseUrl}/collections/flowers`,
  },
  openGraph: {
    title: "Flower Delivery Nairobi | Fresh Roses & Bouquets from KSh 3,500",
    description: "Shop fresh roses and bouquets in Nairobi for birthdays, anniversaries and romantic surprises. Same-day flower delivery from The Stems Flowers.",
    url: `${baseUrl}/collections/flowers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flower Delivery Nairobi | Fresh Roses & Bouquets",
    description: "Buy fresh flowers in Nairobi from KSh 3,500 with same-day delivery. Roses, bouquets and celebration flowers by The Stems.",
  },
};

function flowerImageUrl(imagePath?: string) {
  return toAbsoluteImageUrl(imagePath, "/images/products/flowers/BouquetFlowers4.jpg");
}

function buildFlowersItemListJsonLd(products: Product[]) {
  const normalized = products
    .filter((product) => product.slug && product.title && typeof product.price === "number")
    .slice(0, 12);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fresh Flowers in Nairobi",
    description: "Fresh roses and flower bouquets for same-day delivery in Nairobi.",
    url: `${baseUrl}/collections/flowers`,
    itemListElement: normalized.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.short_description || product.description,
        image: flowerImageUrl(product.images?.[0]),
        url: `${baseUrl}/product/${product.slug}`,
        brand: {
          "@type": "Brand",
          name: "The Stems Flowers",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "KES",
          price: (product.price / 100).toFixed(0),
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/product/${product.slug}`,
        },
      },
    })),
  };
}

// Flower product details mapped to existing images only (BouquetFlowers3, 4, 5)
const FLOWER_PRODUCTS = [
  {
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    title: "Classic Rose Romance",
    description: "Mixed Roses with a touch of gypsophilia, Cuddburry Chocolate 80g",
    price: 550000, // 5,500 KES in cents
    slug: "classic-rose-romance",
  },
  {
    image: "/images/products/flowers/BouquetFlowers4.jpg",
    title: "Sweet Whisper Bouquet",
    description: "60 Roses with touch of gypsophilia, Ferrero rocher chocolate T8",
    price: 550000, // 5,500 KES in cents
    slug: "sweet-whisper-bouquet",
  },
  {
    image: "/images/products/flowers/BouquetFlowers4.jpg",
    title: "Blush and Bloom Dreams",
    description: "Baby Pink and white Roses with a touch of gypsophila, Cuddburry chocolate",
    price: 350000, // 3,500 KES in cents
    slug: "blush-and-bloom-dreams",
  },
  {
    image: "/images/products/flowers/BouquetFlowers5.jpg",
    title: "Pure Serenity Bouquet",
    description: "Yellow mumbs mixed with white and Red Roses, Ferrero rocher chocolate T8",
    price: 550000, // 5,500 KES in cents
    slug: "pure-serenity-bouquet",
  },
];

// Extract just the image URLs for backward compatibility
const FLOWER_IMAGES = FLOWER_PRODUCTS.map(p => p.image);

export default async function FlowersPage() {
  try {
    const products = await getProducts({ category: "flowers" });
    const safeProducts = Array.isArray(products) ? products : [];
    const itemListJsonLd = buildFlowersItemListJsonLd(safeProducts);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <FlowersPageClient products={safeProducts} allFlowerImages={FLOWER_IMAGES} flowerProducts={FLOWER_PRODUCTS} />
      </>
    );
  } catch (error) {
    const fallbackProducts = FLOWER_PRODUCTS.map((flower) => ({
      id: `fallback-${flower.slug}`,
      slug: flower.slug,
      title: flower.title,
      description: flower.description,
      short_description: flower.description,
      price: flower.price,
      category: "flowers" as const,
      tags: [],
      images: [flower.image],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const itemListJsonLd = buildFlowersItemListJsonLd(fallbackProducts);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <FlowersPageClient products={[]} allFlowerImages={FLOWER_IMAGES} flowerProducts={FLOWER_PRODUCTS} />
      </>
    );
  }
}

// Enable static generation with revalidation for fast loading
export const revalidate = 60; // Revalidate every 60 seconds
