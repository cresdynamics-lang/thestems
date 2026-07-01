import Image from "next/image";
import Link from "next/link";
import type { HeroSlideConfig } from "@/components/HeroCarousel.types";

/** Server-rendered first slide — always in HTML for SEO and first paint. */
export default function HeroStaticSection({ slide }: { slide: HeroSlideConfig }) {
  return (
    <section
      data-hero-static
      className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-brand-cream-light to-brand-blush"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(231, 84, 128, 0.15), transparent), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(248, 200, 220, 0.5), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[420px] grid-cols-1 items-stretch gap-0 lg:min-h-[520px] lg:grid-cols-2 lg:gap-8 xl:min-h-[560px]">
          <div className="relative z-10 flex flex-col justify-center py-8 sm:py-10 lg:py-14 order-2 lg:order-1">
            <p className="font-[family-name:var(--font-dancing)] text-2xl sm:text-3xl text-brand-rose-deep mb-2 sm:mb-3">
              Every moment deserves to bloom
            </p>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-brand-rose-deep/50" aria-hidden />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-gray-600">
                The Stems Flowers · Nairobi
              </span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-tight text-brand-gray-900 mb-3 sm:mb-4">
              {slide.title}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-brand-gray-600 leading-relaxed max-w-lg mb-4">
              {slide.subtitle}
            </p>
            {slide.ctaText && slide.ctaLink ? (
              <Link
                href={slide.ctaLink}
                className="btn-primary inline-flex items-center gap-2 self-start text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-md"
              >
                {slide.ctaText}
              </Link>
            ) : null}
          </div>
          <div className="relative order-1 lg:order-2 min-h-[260px] sm:min-h-[320px] lg:min-h-0">
            <div className="relative h-full min-h-[inherit] lg:py-6 xl:py-8">
              <div
                className="pointer-events-none absolute -right-2 top-4 bottom-4 w-[calc(100%+0.5rem)] rounded-2xl lg:rounded-3xl border border-brand-rose-deep/20 bg-brand-rose-deep/5"
                aria-hidden
              />
              <div className="relative h-full min-h-[inherit] overflow-hidden rounded-2xl lg:rounded-3xl shadow-[0_20px_60px_-15px_rgba(231,84,128,0.35)] ring-1 ring-white/80">
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-brand-blush/10 lg:to-brand-blush/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
