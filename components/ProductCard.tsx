"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/24/solid";
import { Analytics } from "@/lib/analytics";
import { getCleanProductTitle, getProductImageAlt } from "@/lib/productDisplay";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  shortDescription?: string;
  category?: string;
  hideDetailsButton?: boolean;
  homePage?: boolean;
  priority?: boolean;
  images?: string[];
  compareAtPrice?: number | null;
  variantLabel?: string | null;
  soldOut?: boolean;
}

function getFallbackImage(category?: string): string {
  switch (category) {
    case "flowers":
      return "/images/products/flowers/BouquetFlowers3.jpg";
    case "hampers":
      return "/images/products/hampers/GiftAmper3.jpg";
    case "teddy":
      return "/images/products/teddies/Teddybear1.jpg";
    case "chocolates":
      return "/images/products/Chocolates/Chocolates1.jpg";
    case "wines":
      return "/images/products/wines/Wines1.jpg";
    default:
      return "/images/products/hampers/GiftAmper3.jpg";
  }
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  slug,
  category,
  homePage = false,
  priority = false,
  images,
  compareAtPrice,
  soldOut = false,
}: ProductCardProps) {
  const displayName = getCleanProductTitle(name);
  const imageAlt = getProductImageAlt(name, category);
  const gallery = useMemo(() => {
    const list = (images?.length ? images : image ? [image] : []).filter(Boolean);
    return list.length ? list : [getFallbackImage(category)];
  }, [images, image, category]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] ?? gallery[0];
  const extraImages = gallery.length > 4 ? gallery.length - 4 : 0;

  const { addItem } = useCartStore();
  const [imageError, setImageError] = useState(false);

  const onSale =
    typeof compareAtPrice === "number" &&
    compareAtPrice > price;

  useEffect(() => {
    setImageError(false);
  }, [activeImage]);

  useEffect(() => {
    if (homePage || !id || !name || !category) return;
    Analytics.trackProductView(id, name, category, price);
  }, [id, name, category, price, homePage]);

  const resolvedImage = imageError ? getFallbackImage(category) : activeImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;

    addItem({
      id,
      name: displayName,
      price,
      image: resolvedImage,
      slug,
    });
    Analytics.trackAddToCart(id, displayName, price, 1);
  };

  return (
    <article className="product-card group/card flex h-full flex-col bg-white transition-shadow hover:shadow-cardHover">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-gray-50">
        <Link
          href={`/product/${slug}`}
          className="absolute inset-0 z-0 block"
          aria-label={`View ${displayName}`}
        >
          <Image
            src={resolvedImage}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setImageError(true)}
          />
        </Link>

        {soldOut ? (
          <span className="absolute left-2 top-2 z-10 rounded-sm bg-brand-gray-900 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white sm:text-[10px]">
            Sold out
          </span>
        ) : onSale ? (
          <span className="absolute left-2 top-2 z-10 rounded-sm bg-brand-red px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white sm:text-[10px]">
            Sale
          </span>
        ) : null}

        {!soldOut && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute right-1 top-1 z-20 p-1 transition-transform hover:scale-110 sm:right-1.5 sm:top-1.5"
            aria-label={`Add ${displayName} to cart`}
          >
            <ShoppingCartIconSolid className="h-4 w-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:h-5 sm:w-5" />
          </button>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex items-center justify-center gap-1 border-t border-brand-gray-100 bg-white px-2 py-2 sm:gap-1.5 sm:px-3">
          {gallery.slice(0, 4).map((thumb, index) => (
            <button
              key={`${thumb}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-6 w-6 shrink-0 overflow-hidden rounded-full border-2 transition-all sm:h-8 sm:w-8 ${
                activeIndex === index
                  ? "border-brand-gray-900 ring-1 ring-brand-gray-900"
                  : "border-brand-gray-200 hover:border-brand-gray-400"
              }`}
              aria-label={`Show image ${index + 1} of ${displayName}`}
            >
              <Image
                src={thumb}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            </button>
          ))}
          {extraImages > 0 && (
            <span className="text-[9px] font-medium text-brand-gray-500 sm:text-[11px]">
              +{extraImages} more
            </span>
          )}
        </div>
      )}

      {/* Name & price on white background below image */}
      <div className="bg-white px-2.5 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5 sm:pt-3">
        <Link href={`/product/${slug}`} className="block text-left">
          <h3 className="font-heading text-[10px] font-medium uppercase tracking-[0.14em] leading-snug text-brand-gray-900 line-clamp-2 xs:text-[11px] sm:text-xs md:text-sm group-hover/card:text-brand-rose-deep transition-colors duration-300">
            {displayName}
          </h3>
          <div
            className="my-2 h-px w-full bg-gradient-to-r from-brand-rose-deep/40 via-brand-rose-deep/20 to-transparent"
            aria-hidden
          />
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="font-heading text-[11px] font-semibold tracking-wide text-brand-rose-deep xs:text-xs sm:text-sm md:text-base">
              {formatCurrency(price)}
            </p>
            {onSale && (
              <p className="font-heading text-[9px] font-normal tracking-wide text-brand-gray-400 line-through xs:text-[10px] sm:text-xs">
                {formatCurrency(compareAtPrice!)}
              </p>
            )}
          </div>
        </Link>
      </div>
    </article>
  );
}
