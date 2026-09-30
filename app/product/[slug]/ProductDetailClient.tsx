"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { Analytics } from "@/lib/analytics";
import { generateProductWhatsAppLink } from "@/lib/whatsapp";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/db";

interface ProductDetailClientProps {
  product: Product;
}

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const onSale =
    typeof product.sale_price === "number" &&
    product.sale_price > 0 &&
    product.sale_price < product.price;
  const displayPrice = onSale ? (product.sale_price as number) : product.price;

  useEffect(() => {
    Analytics.trackProductView(product.id, product.title, product.category, product.price, {
      onSale,
      salePrice: onSale ? (product.sale_price as number) : undefined,
    });
  }, [product.id, product.title, product.category, product.price, product.sale_price, onSale]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.title,
        price: displayPrice,
        image: product.images[0] || "",
        slug: product.slug,
      });
    }
    Analytics.trackAddToCart(product.id, product.title, displayPrice, quantity);
  };

  const whatsappLink = generateProductWhatsAppLink(product.title, displayPrice, quantity);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium text-brand-gray-900">
          Quantity:
        </label>
        <div className="flex items-center gap-2 border-2 border-brand-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-brand-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:bg-brand-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn-primary animate-atc-shake flex flex-1 items-center justify-center gap-2"
          aria-label={`Add ${quantity} ${product.title} to cart`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          Add to Cart
        </button>

        {/* Gift-wrapped WhatsApp order button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            Analytics.trackWhatsAppOrder("product_detail", {
              content_ids: [product.id],
              content_name: product.title,
              value: displayPrice / 100,
              currency: "KES",
            })
          }
          className="group relative flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105 sm:h-14 sm:w-14"
          style={{
            background:
              "linear-gradient(145deg, #fce7f3 0%, #fbcfe8 40%, #f9a8d4 100%)",
          }}
          aria-label={`Order ${product.title} via WhatsApp`}
          title="Order on WhatsApp"
        >
          {/* Ribbon vertical */}
          <span
            className="pointer-events-none absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-[#25D366]/90"
            aria-hidden
          />
          {/* Ribbon horizontal */}
          <span
            className="pointer-events-none absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-[#25D366]/90"
            aria-hidden
          />
          {/* Bow knot */}
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#128C7E] ring-2 ring-white/70"
            aria-hidden
          />
          <svg
            className="relative z-[2] h-6 w-6 text-white drop-shadow-sm sm:h-7 sm:w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d={WA_PATH} />
          </svg>
        </a>
      </div>
    </div>
  );
}
