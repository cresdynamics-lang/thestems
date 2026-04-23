import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, type Product } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Wedding Flowers Nairobi | Bridal Bouquets & Decor | The Stems",
  description:
    "Wedding flowers in Nairobi for bridal bouquets, car decor and venue styling. Same-day and pre-booked flower delivery available. WhatsApp +254113700549.",
  alternates: {
    canonical: `${baseUrl}/wedding-flowers-nairobi`,
  },
};

const hamperFallback: Product[] = [
  {
    id: "wedding-hamper-signature",
    slug: "signature-celebration-basket",
    title: "Signature Celebration Basket",
    description: "Luxury celebration hamper for wedding gifting",
    short_description: "Luxury celebration hamper for wedding gifting",
    price: 1050000,
    category: "hampers",
    tags: ["wedding"],
    images: ["/images/products/hampers/GiftAmper6.jpg"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function WeddingFlowersNairobiPage() {
  const [dbFlowers, dbHampers] = await Promise.all([
    getProducts({ category: "flowers" }),
    getProducts({ category: "hampers" }),
  ]);

  const flowerFallback = getPredefinedProducts("flowers");
  const flowers = dbFlowers.length > 0 ? dbFlowers : flowerFallback;
  const hampers = dbHampers.length > 0 ? dbHampers : hamperFallback;
  const featuredProducts = [...flowers.slice(0, 6), ...hampers.slice(0, 2)];

  return (
    <div className="py-10 md:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Wedding Flowers in Nairobi - Bridal Bouquets, Car Decor and Gift Flowers
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          The Stems Flowers designs wedding flowers in Nairobi for brides, grooms and families who want elegant floral styling.
          We provide bridal bouquets, bridesmaid bouquets, romantic table flowers and wedding gift bouquets with reliable delivery.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          You can combine bridal flowers with our wedding car decor service and curated wedding gift hampers for a complete
          wedding-day setup. We operate from Nairobi CBD and deliver to Westlands, Karen, Kilimani, Lavington and neighboring
          estates.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mb-10">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.title}
              price={product.price}
              image={product.images?.[0] || "/images/products/flowers/BouquetFlowers3.jpg"}
              slug={product.slug}
              shortDescription={product.short_description}
              category={product.category}
              hideDetailsButton={product.category !== "hampers"}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Link href="/collections/flowers" className="btn-primary text-sm md:text-base">
            Shop Wedding Flowers
          </Link>
          <Link href="/wedding-car-decor-nairobi" className="btn-outline text-sm md:text-base">
            View Wedding Car Decor
          </Link>
        </div>
      </div>
    </div>
  );
}
