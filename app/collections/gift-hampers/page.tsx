import { Metadata } from "next";
import GiftHampersPageClient from "./GiftHampersPageClient";
import { getProducts } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://the.stems.ke";

export const metadata: Metadata = {
  title: "Gift Hampers Nairobi | Anniversary Hampers, Birthday Surprises & Apology Gifts | Chocolate, Wine, Flowers | Same-Day Delivery",
  description:
    "Luxury gift hampers Nairobi: anniversary hampers, birthday surprises, apology gifts & thoughtful combinations with flowers, chocolates, wine, teddy bears. Same-day delivery across CBD, Westlands, Karen, Lavington, Kilimani.",
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
    title: "Gift Hampers Nairobi | Anniversary Hampers, Birthday Surprises & Apology Gifts | Chocolate, Wine, Flowers",
    description: "Luxury gift hampers Nairobi: anniversary hampers, birthday surprises, apology gifts & thoughtful combinations with flowers, chocolates, wine, teddy bears. Same-day delivery across Nairobi.",
    url: `${baseUrl}/collections/gift-hampers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Hampers Nairobi | Anniversary Hampers, Birthday Surprises & Apology Gifts",
    description: "Luxury gift hampers Nairobi: anniversary hampers, birthday surprises, apology gifts & thoughtful combinations with flowers, chocolates, wine, teddy bears. Same-day delivery.",
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

export default async function GiftHampersPage() {
  try {
    const products = await getProducts({ category: "hampers" });
    const safeProducts = Array.isArray(products) ? products : [];
    return <GiftHampersPageClient products={safeProducts} allHamperImages={HAMPER_IMAGES} hamperProducts={HAMPER_PRODUCTS} />;
  } catch (error) {
    return <GiftHampersPageClient products={[]} allHamperImages={HAMPER_IMAGES} hamperProducts={HAMPER_PRODUCTS} />;
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

