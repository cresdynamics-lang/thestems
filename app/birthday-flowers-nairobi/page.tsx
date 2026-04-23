import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, type Product } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Birthday Flowers Nairobi | Same Day Delivery from KSh 3,500 | The Stems",
  description:
    "Order birthday flowers in Nairobi with same-day delivery. Roses, bouquets, teddy and gift combos from KSh 3,500. WhatsApp +254113700549 to order.",
  alternates: {
    canonical: `${baseUrl}/birthday-flowers-nairobi`,
  },
};

const teddyFallback: Product[] = [
  {
    id: "birthday-teddy-dream-soft",
    slug: "dream-soft-teddy",
    title: "Dream Soft Teddy",
    description: "25cm pink teddy bear",
    short_description: "25cm pink teddy bear",
    price: 250000,
    category: "teddy",
    tags: ["birthday"],
    images: ["/images/products/teddies/Teddybear1.jpg"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const hamperFallback: Product[] = [
  {
    id: "birthday-hamper-signature",
    slug: "signature-celebration-basket",
    title: "Signature Celebration Basket",
    description: "Luxury gift hamper with curated items",
    short_description: "Luxury gift hamper with curated items",
    price: 1050000,
    category: "hampers",
    tags: ["birthday"],
    images: ["/images/products/hampers/GiftAmper6.jpg"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function BirthdayFlowersNairobiPage() {
  const [dbFlowers, dbTeddy, dbHampers] = await Promise.all([
    getProducts({ category: "flowers" }),
    getProducts({ category: "teddy" }),
    getProducts({ category: "hampers" }),
  ]);

  const flowerFallback = getPredefinedProducts("flowers");
  const flowers = dbFlowers.length > 0 ? dbFlowers : flowerFallback;
  const teddy = dbTeddy.length > 0 ? dbTeddy : teddyFallback;
  const hampers = dbHampers.length > 0 ? dbHampers : hamperFallback;

  const featuredProducts = [...flowers.slice(0, 4), ...teddy.slice(0, 2), ...hampers.slice(0, 2)];

  return (
    <div className="py-10 md:py-16 lg:py-20 bg-brand-blush">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Birthday Flowers in Nairobi - Delivered Same Day
        </h1>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Looking for birthday flowers in Nairobi that arrive fresh and on time? The Stems Flowers delivers same day across
          Nairobi for orders placed by 4PM. Choose red roses, mixed bouquets, flower and teddy combos, or luxury gift hampers
          for milestone birthdays.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          From our Nairobi CBD florist at Delta Hotel, University Way, we serve Westlands, Kilimani, Karen, Lavington, Parklands
          and nearby estates. Pay securely with M-Pesa and add a personal birthday message at checkout.
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
            Shop Birthday Flowers
          </Link>
          <Link href="/collections/gift-hampers" className="btn-outline text-sm md:text-base">
            View Birthday Gift Hampers
          </Link>
        </div>
      </div>
    </div>
  );
}
