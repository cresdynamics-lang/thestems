import { Metadata } from "next";
import TeddyBearsPageClient from "./TeddyBearsPageClient";
import { getProducts, type Product } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Teddy Bears Nairobi | Same Day Delivery from KSh 3,500 | The Stems",
  description:
    "Order teddy bears in Nairobi with same-day delivery from KSh 3,500. Giant teddy bears and teddy plus flower combos. WhatsApp +254113700549 to order.",
  keywords: [
    // Valentine's Teddy Bears Core Keywords
    "valentine's teddy bears Nairobi",
    "valentine's cuddly teddy bears Nairobi",
    "romantic valentine's teddy bears Nairobi",
    "valentine's teddy bear gifts Nairobi",
    "cuddly valentine's teddy bears Nairobi",

    // Valentine's Teddy Bears for Relationships
    "valentine's teddy bear for wife Nairobi",
    "valentine's teddy bear for girlfriend Nairobi",
    "valentine's teddy bear for mom Nairobi",
    "valentine's teddy bear for husband Nairobi",
    "romantic teddy bears valentine's Nairobi",

    // Valentine's Teddy Bear Sizes
    "large valentine's teddy bears Nairobi",
    "big valentine's teddy bears Nairobi",
    "25cm valentine's teddy bear Nairobi",
    "50cm valentine's teddy bear Nairobi",
    "100cm valentine's teddy bear Nairobi",
    "200cm valentine's teddy bear Nairobi",

    // Valentine's Teddy Bear Colors
    "red valentine's teddy bear Nairobi",
    "pink valentine's teddy bear Nairobi",
    "white valentine's teddy bear Nairobi",
    "brown valentine's teddy bear Nairobi",
    "blue valentine's teddy bear Nairobi",

    // Valentine's Planning
    "pre valentine's teddy bears Nairobi",
    "valentine's teddy bear delivery Nairobi",
    "early valentine's teddy bear orders Nairobi",
    "plan valentine's teddy bear surprise Nairobi",

    // Valentine's Delivery
    "same day valentine's teddy bears Nairobi",
    "valentine's teddy bears CBD Nairobi",
    "valentine's teddy bears Westlands",
    "valentine's teddy bears Karen Nairobi",
    "valentine's teddy bears Lavington",
    "valentine's teddy bears Kilimani",

    // Valentine's AI Search
    "where to buy valentine's teddy bears Nairobi",
    "best valentine's teddy bear gifts Nairobi",
    "cuddly teddy bears near me Nairobi",
    "how to surprise with valentine's teddy bear Nairobi",

    // Valentine's Voice Search
    "order valentine's teddy bears online Nairobi",
    "find big teddy bears near me Nairobi",
    "valentine's teddy bear delivery near me",

    // Valentine's Long-tail
    "luxury valentine's teddy bear collections Nairobi",
    "romantic valentine's teddy bear hampers Nairobi",
    "personalized valentine's teddy bear gifts Nairobi",
    "thoughtful valentine's cuddly teddy bears Nairobi",

    // Valentine's Seasonal
    "february valentine's teddy bears Nairobi",
    "2025 valentine's teddy bears Nairobi",
    "love month teddy bears Nairobi Kenya",

    // Keeping traditional keywords
    "teddy bears Kenya",
    "romantic teddy bears Nairobi",
    "surprise gifts Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/teddy-bears`,
  },
  openGraph: {
    title: "Teddy Bears Nairobi | Cuddly Gift Teddy Bears | Same Day Delivery",
    description: "Shop teddy bears in Nairobi with same-day delivery. Sizes from 25cm to 200cm in multiple colors, plus teddy and flower gift combos.",
    url: `${baseUrl}/collections/teddy-bears`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teddy Bears Nairobi | Cuddly Gift Teddy Bears | Same Day Delivery",
    description: "Order teddy bears in Nairobi with same-day delivery and easy WhatsApp ordering.",
  },
};

// Teddy bear product details mapped to images
const TEDDY_PRODUCTS = [
  {
    image: "/images/products/teddies/Teddybear1.jpg",
    title: "Dream Soft Teddy",
    description: "25cm pink teddy bear",
    price: 250000, // 2,500 KES in cents
    slug: "dream-soft-teddy",
    size: 25,
    color: "pink",
  },
  {
    image: "/images/products/teddies/TeddyBears1.jpg",
    title: "FluffyJoy Bear",
    description: "50cm teddy bear",
    price: 450000, // 4,500 KES in cents
    slug: "fluffyjoy-bear",
    size: 50,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears2.jpg",
    title: "BlissHug Teddy",
    description: "100cm teddy bear",
    price: 850000, // 8,500 KES in cents
    slug: "blisshug-teddy",
    size: 100,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears3.jpg",
    title: "Tender Heart Bear",
    description: "120cm teddy bear with customized Stanley mug",
    price: 1250000, // 12,500 KES in cents
    slug: "tender-heart-bear",
    size: 120,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears5.jpg",
    title: "RossyHugs Bear",
    description: "180cm brown teddy bear",
    price: 1750000, // 17,500 KES in cents
    slug: "rossyhugs-bear",
    size: 180,
    color: "brown",
  },
  {
    image: "/images/products/teddies/TeddyBears6.jpg",
    title: "MarshMallow Bear",
    description: "160cm teddy bear",
    price: 1550000, // 15,500 KES in cents
    slug: "marshmallow-bear",
    size: 160,
    color: null,
  },
  {
    image: "/images/products/teddies/TeddyBears7.jpg",
    title: "Moonlight Snuggle Bear",
    description: "200cm teddy bear",
    price: 1950000, // 19,500 KES in cents
    slug: "moonlight-snuggle-bear",
    size: 200,
    color: null,
  },
];

// Extract just the image URLs for backward compatibility
const TEDDY_IMAGES = TEDDY_PRODUCTS.map(p => p.image);

function toAbsoluteImageUrl(imagePath?: string) {
  if (!imagePath) return `${baseUrl}/images/products/teddies/Teddybear1.jpg`;
  return imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

function buildTeddyItemListJsonLd(products: Product[]) {
  const normalized = products
    .filter((product) => product.slug && product.title && typeof product.price === "number")
    .slice(0, 12);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Teddy Bears in Nairobi",
    description: "Gift teddy bears in different sizes with same-day delivery in Nairobi.",
    url: `${baseUrl}/collections/teddy-bears`,
    itemListElement: normalized.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.short_description || product.description,
        image: toAbsoluteImageUrl(product.images?.[0]),
        url: `${baseUrl}/product/${product.slug}`,
        brand: { "@type": "Brand", name: "The Stems Flowers" },
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

export default async function TeddyBearsPage() {
  try {
    const products = await getProducts({ category: "teddy" });
    const safeProducts = Array.isArray(products) ? products : [];
    const itemListJsonLd = buildTeddyItemListJsonLd(safeProducts);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <TeddyBearsPageClient products={safeProducts} allTeddyImages={TEDDY_IMAGES} teddyProducts={TEDDY_PRODUCTS} />
      </>
    );
  } catch (error) {
    const fallbackProducts = TEDDY_PRODUCTS.map((teddy) => ({
      id: `fallback-${teddy.slug}`,
      slug: teddy.slug,
      title: teddy.title,
      description: teddy.description,
      short_description: teddy.description,
      price: teddy.price,
      category: "teddy" as const,
      tags: [],
      images: [teddy.image],
      teddy_size: teddy.size,
      teddy_color: teddy.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const itemListJsonLd = buildTeddyItemListJsonLd(fallbackProducts);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <TeddyBearsPageClient products={[]} allTeddyImages={TEDDY_IMAGES} teddyProducts={TEDDY_PRODUCTS} />
      </>
    );
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

