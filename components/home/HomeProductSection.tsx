import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function HomeProductSection({
  title,
  subtitle,
  products,
  bgColor = "bg-brand-blush",
  linkHref,
  eagerImages = false,
}: {
  title: string;
  subtitle?: string;
  products: any[];
  bgColor?: string;
  linkHref?: string;
  /** Prioritize image loading for above-the-fold sections */
  eagerImages?: boolean;
}) {
  return (
    <section className={`py-5 md:py-7 lg:py-8 ${bgColor} relative overflow-hidden`}>
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 md:mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-product font-semibold text-xl sm:text-2xl md:text-3xl tracking-tight text-brand-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-brand-gray-600 mt-0.5 md:mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {linkHref && (
            <Link
              href={linkHref}
              className="text-brand-red hover:text-brand-red/80 font-medium text-sm md:text-base transition-colors"
            >
              View all
            </Link>
          )}
        </div>
        {products.length > 0 ? (
          <div className="flex overflow-x-auto gap-2.5 md:gap-3.5 lg:gap-4 pb-2 scrollbar-thin scrollbar-thumb-brand-gray-300 scrollbar-track-transparent -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] xs:min-w-[140px] xs:max-w-[140px] sm:min-w-[280px] sm:max-w-[300px] md:w-[320px]"
              >
                <ProductCard
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  image={product.images[0] || "/images/products/hampers/GiftAmper3.jpg"}
                  slug={product.slug}
                  shortDescription={product.short_description}
                  category={product.category}
                  images={product.images}
                  variantLabel={product.teddy_color}
                  homePage={true}
                  priority={eagerImages && index < 6}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-gray-600 text-center py-8">No products available at the moment.</p>
        )}
      </div>
    </section>
  );
}

export function HomeProductSectionSkeleton() {
  return (
    <section className="py-5 md:py-7 bg-brand-blush">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-56 bg-brand-gray-200 rounded animate-pulse mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] product-card animate-pulse bg-white">
              <div className="aspect-[4/5] bg-brand-gray-200" />
              <div className="space-y-1.5 px-2.5 py-3">
                <div className="h-2.5 w-3/4 rounded bg-brand-gray-200" />
                <div className="h-px w-full bg-brand-gray-200" />
                <div className="h-2 w-1/3 rounded bg-brand-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
