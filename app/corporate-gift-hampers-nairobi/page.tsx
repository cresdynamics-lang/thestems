import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, type Product } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Corporate Gift Hampers Nairobi | Business Gifting | The Stems",
  description:
    "Corporate gift hampers in Nairobi for clients, teams and events. Same-day and scheduled delivery with custom bundles. WhatsApp +254113700549.",
  alternates: {
    canonical: `${baseUrl}/corporate-gift-hampers-nairobi`,
  },
};

const hamperFallback: Product[] = [
  {
    id: "corporate-hamper-gentlepaw",
    slug: "gentlepaw-hamper",
    title: "GentlePaw Hamper",
    description: "Premium corporate hamper with flower and wine pairing",
    short_description: "Premium corporate hamper with flower and wine pairing",
    price: 2050000,
    category: "hampers",
    tags: ["corporate"],
    images: ["/images/products/hampers/GiftAmper3.jpg"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "corporate-hamper-signature",
    slug: "signature-celebration-basket",
    title: "Signature Celebration Basket",
    description: "Executive gift basket for business celebrations",
    short_description: "Executive gift basket for business celebrations",
    price: 1050000,
    category: "hampers",
    tags: ["corporate"],
    images: ["/images/products/hampers/GiftAmper6.jpg"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function CorporateGiftHampersNairobiPage() {
  const [dbHampers, dbFlowers] = await Promise.all([
    getProducts({ category: "hampers" }),
    getProducts({ category: "flowers" }),
  ]);

  const flowerFallback = getPredefinedProducts("flowers");
  const hampers = dbHampers.length > 0 ? dbHampers : hamperFallback;
  const flowers = dbFlowers.length > 0 ? dbFlowers : flowerFallback;
  const featuredProducts = [...hampers.slice(0, 6), ...flowers.slice(0, 2)];

  return (
    <div className="py-10 md:py-16 lg:py-20 bg-brand-blush">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Corporate Gift Hampers in Nairobi - Client and Team Gifting
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Need reliable corporate gift hampers in Nairobi for clients, staff appreciation or office celebrations? The Stems
          Flowers prepares premium hamper bundles with flowers, chocolates, wine and custom add-ons for professional gifting.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          We support one-off executive gifts and recurring corporate orders, with delivery across Nairobi CBD, Westlands, Karen,
          Kilimani and surrounding business districts. Share your budget and occasion on WhatsApp and we will curate options.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mb-10">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.title}
              price={product.price}
              image={product.images?.[0] || "/images/products/hampers/GiftAmper3.jpg"}
              slug={product.slug}
              shortDescription={product.short_description}
              category={product.category}
              hideDetailsButton={product.category !== "hampers"}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link href="/collections/gift-hampers" className="btn-primary text-sm md:text-base">
            Browse Corporate Hampers
          </Link>
          <Link href="https://wa.me/254725707143" className="btn-outline text-sm md:text-base">
            Request Corporate Quote on WhatsApp
          </Link>
        </div>
      </div>
    </div>
  );
}
