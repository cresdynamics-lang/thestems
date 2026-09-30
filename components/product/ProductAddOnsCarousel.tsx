"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/db";
import { useCartStore } from "@/lib/store/cart";
import PriceDisplay from "@/components/PriceDisplay";

const ADDON_CATEGORIES = ["cards", "wines", "chocolates"] as const;
const VISIBLE = 8;
const ROTATE_MS = 9000;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Mix gift cards, wines & chocolates — horizontal scroll, rotates randomly. */
export default function ProductAddOnsCarousel({
  excludeProductId,
}: {
  excludeProductId?: string;
}) {
  const [pool, setPool] = useState<Product[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  const pickRandom = useCallback((source: Product[]) => {
    if (!source.length) {
      setItems([]);
      return;
    }
    setItems(shuffle(source).slice(0, Math.min(VISIBLE, source.length)));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          ADDON_CATEGORIES.map(async (category) => {
            try {
              const res = await fetch(`/api/products?category=${category}`);
              if (!res.ok) return [] as Product[];
              const data = await res.json();
              return Array.isArray(data) ? (data as Product[]) : [];
            } catch {
              return [] as Product[];
            }
          })
        );
        if (cancelled) return;
        const mixed = shuffle(
          results.flat().filter((p) => p.id !== excludeProductId)
        );
        setPool(mixed);
        pickRandom(mixed);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [excludeProductId, pickRandom]);

  useEffect(() => {
    if (pool.length <= VISIBLE) return;
    const id = setInterval(() => pickRandom(pool), ROTATE_MS);
    return () => clearInterval(id);
  }, [pool, pickRandom]);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(320, el.clientWidth * 0.7), behavior: "smooth" });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-8 md:py-10 bg-brand-cream-light/60 border-y border-brand-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-heading font-bold text-lg md:text-xl text-brand-gray-900">
              Add-ons
            </h2>
            <p className="text-xs sm:text-sm text-brand-gray-600 mt-0.5">
              Gift cards, wines &amp; chocolates — perfect extras for your order
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="rounded-full border border-brand-gray-200 bg-white p-2 text-brand-gray-700 hover:border-brand-rose-deep hover:text-brand-rose-deep shadow-sm"
              aria-label="Scroll add-ons left"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="rounded-full border border-brand-gray-200 bg-white p-2 text-brand-gray-700 hover:border-brand-rose-deep hover:text-brand-rose-deep shadow-sm"
              aria-label="Scroll add-ons right"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 w-36 shrink-0 animate-pulse rounded-xl bg-brand-gray-100"
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory"
          >
            {items.map((product) => {
              const img =
                product.images?.[0] || "/images/products/Chocolates/Chocolates1.jpg";
              return (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[9.5rem] sm:w-40 rounded-xl border border-brand-gray-100 bg-white p-2.5 shadow-sm"
                >
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-brand-gray-50">
                      <Image
                        src={img}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                    <p className="line-clamp-2 text-xs font-semibold text-brand-gray-900 min-h-[2rem]">
                      {product.title}
                    </p>
                    <p className="mt-1 text-sm font-bold text-brand-rose-deep">
                      <PriceDisplay amountCents={product.price} size="sm" />
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.title,
                        price: product.price,
                        image: img,
                        slug: product.slug,
                      })
                    }
                    className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-brand-rose-deep px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-rose-deep/90"
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <ShoppingCartIcon className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
