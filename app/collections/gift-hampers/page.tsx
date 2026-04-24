import { Metadata } from "next";
import GiftHampersPageClient from "./GiftHampersPageClient";
import { getProducts, type Product } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Gift Hampers Nairobi from KSh 8,500 | Same-Day Delivery | The Stems",
  description:
    "Send luxury gift hampers in Nairobi with flowers, wine, chocolates and teddy bears. Prices from KSh 8,500 with same-day delivery in CBD and fast delivery citywide. Order online or WhatsApp The Stems.",
  keywords: [
    // Occasion-based Gift Hampers Keywords
    "gift hampers Nairobi",
    "anniversary hampers Nairobi",
    "birthday hampers Nairobi",
    "apology hampers Nairobi",
    "surprise hampers Nairobi",
    "luxury gift hampers Nairobi",
    "premium gift hampers Nairobi",

    // Hampers by Relationship
    "hamper for wife Nairobi",
    "hamper for husband Nairobi",
    "hamper for girlfriend Nairobi",
    "hamper for mom Nairobi",
    "hamper for dad Nairobi",
    "romantic hampers Nairobi",

    // Hamper Contents
    "chocolate hamper Nairobi",
    "wine hamper Nairobi",
    "flower hamper Nairobi",
    "teddy bear hamper Nairobi",
    "luxury hamper Nairobi",
    "chocolate and wine hamper Nairobi",

    // Occasion-specific Hampers
    "anniversary gift hampers Nairobi",
    "birthday surprise hampers Nairobi",
    "apology gift hampers Nairobi",
    "just because hampers Nairobi",
    "celebration hampers Nairobi",

    // Delivery Keywords
    "same day hampers Nairobi",
    "hamper delivery CBD Nairobi",
    "hampers Westlands",
    "hampers Karen Nairobi",
    "hampers Lavington",
    "hampers Kilimani",
    "urgent hamper delivery Nairobi",

    // Search Intent Keywords
    "where to buy gift hampers Nairobi",
    "best gift hampers Nairobi",
    "luxury hampers near me Nairobi",
    "how to surprise with hamper Nairobi",

    // Voice Search
    "order hampers online Nairobi",
    "find premium hampers near me Nairobi",
    "hamper delivery near me",

    // Long-tail Keywords
    "luxury chocolate wine hampers Nairobi",
    "romantic flower teddy bear hampers Nairobi",
    "personalized luxury gift hampers Nairobi",
    "thoughtful surprise hampers Nairobi",

    // Corporate Keywords
    "corporate hampers Nairobi",
    "office hampers Nairobi",
    "business gift hampers Nairobi",

    // Traditional Keywords
    "gift hampers Kenya",
    "romantic gift hampers Nairobi",
    "thoughtful gift hampers Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/gift-hampers`,
  },
  openGraph: {
    title: "Gift Hampers Nairobi from KSh 8,500 | Same-Day Delivery",
    description: "Shop premium gift hampers in Nairobi with flowers, wine and chocolates. Same-day delivery and easy WhatsApp ordering from The Stems.",
    url: `${baseUrl}/collections/gift-hampers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Hampers Nairobi from KSh 8,500 | The Stems",
    description: "Send premium gift hampers in Nairobi with same-day delivery. Flowers, chocolates, wine and curated surprise baskets.",
  },
};

// Gift hamper product details mapped to existing images only (GiftAmper3, GiftAmper6)
const HAMPER_PRODUCTS = [
  {
    image: "/images/products/hampers/GiftAmper3.jpg",
    title: "GentlePaw Hamper",
    description: "100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch",
    price: 2050000, // 20,500 KES in cents
    slug: "gentlepaw-hamper",
  },
  {
    image: "/images/products/hampers/GiftAmper6.jpg",
    title: "Signature Celebration Basket",
    description: "Luxury gift hamper with curated items",
    price: 1050000, // 10,500 KES in cents
    slug: "signature-celebration-basket",
  },
];

// All available hamper images in folder
const HAMPER_IMAGES = [
  "/images/products/hampers/GiftAmper3.jpg",
  "/images/products/hampers/GiftAmper6.jpg",
];

function toAbsoluteImageUrl(imagePath?: string) {
  if (!imagePath) return `${baseUrl}/images/products/hampers/GiftAmper3.jpg`;
  return imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

function buildHampersItemListJsonLd(products: Product[]) {
  const normalized = products
    .filter((product) => product.slug && product.title && typeof product.price === "number")
    .slice(0, 12);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gift Hampers in Nairobi",
    description: "Luxury gift hampers with flowers, wine and chocolates in Nairobi.",
    url: `${baseUrl}/collections/gift-hampers`,
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

export default async function GiftHampersPage() {
  try {
    const products = await getProducts({ category: "hampers" });
    const safeProducts = Array.isArray(products) ? products : [];
    const itemListJsonLd = buildHampersItemListJsonLd(safeProducts);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <GiftHampersPageClient products={safeProducts} allHamperImages={HAMPER_IMAGES} hamperProducts={HAMPER_PRODUCTS} />
      </>
    );
  } catch (error) {
    const fallbackProducts = HAMPER_PRODUCTS.map((hamper) => ({
      id: `fallback-${hamper.slug}`,
      slug: hamper.slug,
      title: hamper.title,
      description: hamper.description,
      short_description: hamper.description,
      price: hamper.price,
      category: "hampers" as const,
      tags: [],
      images: [hamper.image],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const itemListJsonLd = buildHampersItemListJsonLd(fallbackProducts);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <GiftHampersPageClient products={[]} allHamperImages={HAMPER_IMAGES} hamperProducts={HAMPER_PRODUCTS} />
      </>
    );
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

