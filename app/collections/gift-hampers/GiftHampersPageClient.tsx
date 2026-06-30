"use client";

import { useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCategoryFallbackImage } from "@/lib/utils";
import { Analytics } from "@/lib/analytics";
import SeoInternalLinks from "@/components/SeoInternalLinks";
import { whatsappUrl } from "@/lib/contact";

interface HamperProduct {
  image: string;
  title: string;
  description: string;
  price: number;
  slug: string;
}

interface GiftHampersPageClientProps {
  products: Product[];
  allHamperImages?: string[];
  hamperProducts?: HamperProduct[];
}

export default function GiftHampersPageClient({ products, allHamperImages = [], hamperProducts = [] }: GiftHampersPageClientProps) {
  // Create display items from predefined hamper products
  const allDisplayItems = useMemo(() => {
    const productImageUrls = new Set(
      products.flatMap(p => p.images || []).filter(Boolean)
    );
    
    // Convert predefined hamper products to display format
    const hamperProductItems = hamperProducts.map((hp, index) => ({
      id: `hamper-product-${index}`,
      title: hp.title,
      price: hp.price,
      images: [hp.image],
      slug: hp.slug,
      short_description: hp.description,
      category: "hampers" as const,
      tags: [] as string[],
      subcategory: null,
    }));

    // Combine database products with predefined products only
    // Removed auto-generation of products from unmapped images
    return [...products, ...hamperProductItems];
  }, [products, hamperProducts]);

  // Gift hampers have no subcategories - just show all products

  // Track collection view
  useEffect(() => {
    Analytics.trackCollectionView("hampers", allDisplayItems.length);
  }, [allDisplayItems.length]);

  return (
    <div className="py-6 md:py-8 lg:py-12 bg-brand-blush">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2">
            Gift Hampers Nairobi - Luxury Baskets Delivered Same Day
          </h1>
          <p className="text-brand-gray-600 text-sm md:text-base">
            Send premium gift hampers in Nairobi with flowers, wine, chocolates and teddy bears. Prices start from around KSh
            8,500, with same-day delivery in Nairobi CBD and fast delivery across the city. Every hamper is hand-curated by The
            Stems Flowers for birthdays, anniversaries, apologies and corporate gifting.
          </p>
          <p className="text-brand-gray-600 text-sm md:text-base mt-3 max-w-3xl">
            Our luxury hampers combine Ferrero Rocher chocolates, non-alcoholic or alcoholic wine, fresh flower bouquets,
            cuddly teddy bears and personalised accessories — ideal when you want one impressive gift delivered in Nairobi.
            Corporate teams choose us for employee appreciation and client thank-you baskets, while couples love our romantic
            surprise hampers for anniversaries and Valentine&apos;s gestures. Order online with M-Pesa or message us on
            WhatsApp; we deliver to Westlands, Karen, Kilimani, Lavington, Runda and all major Nairobi zones.
          </p>
          <p className="text-brand-gray-500 text-xs md:text-sm mt-1">
            Showing {allDisplayItems.length} {allDisplayItems.length === 1 ? 'product' : 'products'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={whatsappUrl("Hello! I'd like to order a gift hamper in Nairobi.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto justify-center items-center rounded-md bg-brand-green px-4 py-3 text-sm font-medium text-white hover:bg-brand-green/90"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>

        <SeoInternalLinks
          links={[
            { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
            { href: "/flower-wine-hamper-nairobi", label: "Flower & wine hampers" },
            { href: "/collections/flowers", label: "Add fresh flowers" },
            { href: "/collections/wines", label: "Wine gifts" },
            { href: "/birthday-flowers-nairobi", label: "Birthday gifts" },
            { href: "/contact", label: "Custom hamper quote" },
          ]}
        />

        {allDisplayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-gray-600 text-base mb-2">No gift hampers available at the moment.</p>
            <p className="text-brand-gray-500 text-sm">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {allDisplayItems.map((product) => {
              const imageUrl = product.images && product.images.length > 0 && product.images[0] 
                ? product.images[0] 
                : getCategoryFallbackImage(product.category);
              
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  image={imageUrl}
                  slug={product.slug}
                  shortDescription={product.short_description}
                  category={product.category}
                  images={product.images}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

