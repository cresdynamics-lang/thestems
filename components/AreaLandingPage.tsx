import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SeoInternalLinks from "@/components/SeoInternalLinks";
import JsonLd from "@/components/JsonLd";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import type { AreaLandingConfig } from "@/lib/areaLandings";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { whatsappUrl } from "@/lib/contact";

interface AreaLandingPageProps {
  config: AreaLandingConfig;
}

export default async function AreaLandingPage({ config }: AreaLandingPageProps) {
  const [dbFlowers, dbHampers] = await Promise.all([
    getProducts({ category: "flowers" }),
    getProducts({ category: "hampers" }),
  ]);

  const flowers =
    dbFlowers.length > 0 ? dbFlowers : getPredefinedProducts("flowers");
  const featured = [...flowers.slice(0, 6), ...dbHampers.slice(0, 2)].slice(0, 8);

  const pageUrl = absoluteUrl(`/${config.slug}`);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do you deliver flowers to ${config.areaName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. The Stems Flowers delivers fresh flowers, roses and gift hampers to ${config.areaName} and nearby Nairobi areas. Same-day delivery is available for orders placed by 4PM.`,
        },
      },
      {
        "@type": "Question",
        name: `How much is flower delivery to ${config.areaName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Delivery to ${config.areaName} is ${config.deliveryFee || "calculated at checkout"} depending on your exact address. Bouquets start from around KSh 3,500.`,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `Flower delivery ${config.areaName}`,
        item: pageUrl,
      },
    ],
  };

  const areaLinks = config.nearbyAreas.map((area) => {
    const slugMap: Record<string, string> = {
      CBD: "/flower-delivery-nairobi-cbd",
      Westlands: "/flower-delivery-westlands-nairobi",
      Kilimani: "/flower-delivery-kilimani-nairobi",
      Karen: "/flower-delivery-karen-nairobi",
      Parklands: "/flower-delivery-westlands-nairobi",
      Lavington: "/flower-delivery-kilimani-nairobi",
      Kileleshwa: "/flower-delivery-kilimani-nairobi",
      Langata: "/flower-delivery-karen-nairobi",
      "Ngong Road": "/flower-delivery-karen-nairobi",
      "South B": "/same-day-flower-delivery-nairobi",
      "Upper Hill": "/same-day-flower-delivery-nairobi",
      "Nairobi West": "/flower-delivery-westlands-nairobi",
    };
    return {
      href: slugMap[area] || "/same-day-flower-delivery-nairobi",
      label: `Flowers ${area}`,
    };
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <div className="py-10 md:py-16 lg:py-20 bg-brand-blush">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
            {config.h1}
          </h1>
          <p className="text-brand-gray-700 text-base md:text-lg mb-4">{config.intro}</p>
          <p className="text-brand-gray-700 text-base md:text-lg mb-8">{config.details}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mb-10">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price}
                image={product.images?.[0] || "/images/products/flowers/BouquetFlowers3.jpg"}
                slug={product.slug}
                shortDescription={product.short_description}
                category={product.category}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center mb-10">
            <Link href="/collections/flowers" className="btn-primary text-sm md:text-base">
              Shop Flowers
            </Link>
            <Link href="/collections/gift-hampers" className="btn-outline text-sm md:text-base">
              Gift Hampers
            </Link>
            <a
              href={whatsappUrl(`Hello! I'd like flower delivery to ${config.areaName}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm md:text-base"
            >
              Order on WhatsApp
            </a>
          </div>

          <SeoInternalLinks title={`More delivery areas near ${config.areaName}`} links={areaLinks} />
        </div>
      </div>
    </>
  );
}
