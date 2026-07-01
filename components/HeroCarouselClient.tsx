"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroSlideConfig } from "@/components/HeroCarousel.types";

interface HeroCarouselClientProps {
  slides: HeroSlideConfig[];
}

function slideIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

/** Client-only carousel — loaded with ssr:false so it never hydrates against server HTML. */
export default function HeroCarouselClient({ slides }: HeroCarouselClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const staticHero = document.querySelector("[data-hero-static]");
    if (staticHero instanceof HTMLElement) {
      staticHero.hidden = true;
    }
    setReady(true);
    return () => {
      if (staticHero instanceof HTMLElement) {
        staticHero.hidden = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !slides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [ready, slides.length]);

  if (!ready || !slides.length) return null;

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide((prev) => slideIndex(prev - 1, slides.length));
  const goToNext = () =>
    setCurrentSlide((prev) => slideIndex(prev + 1, slides.length));

  const visibleIndexes = new Set([
    currentSlide,
    slideIndex(currentSlide + 1, slides.length),
    slideIndex(currentSlide - 1, slides.length),
  ]);

  const active = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-blush via-brand-cream-light to-brand-blush">
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

            <div className="relative min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === currentSlide
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3 pointer-events-none"
                  }`}
                  aria-hidden={index !== currentSlide}
                >
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-tight text-brand-gray-900 mb-3 sm:mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-brand-gray-600 leading-relaxed max-w-lg">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {active.ctaText && active.ctaLink ? (
              <Link
                href={active.ctaLink}
                className="btn-primary inline-flex items-center gap-2 self-start mt-2 sm:mt-4 text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                {active.ctaText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : null}

            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 bg-brand-rose-deep"
                        : "w-2 bg-brand-rose-deep/30 hover:bg-brand-rose-deep/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? "true" : undefined}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-rose-deep/30 text-brand-rose-deep hover:bg-brand-rose-deep hover:text-white transition-colors"
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-rose-deep/30 text-brand-rose-deep hover:bg-brand-rose-deep hover:text-white transition-colors"
                  aria-label="Next slide"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 min-h-[260px] sm:min-h-[320px] lg:min-h-0">
            <div className="relative h-full min-h-[inherit] lg:py-6 xl:py-8">
              <div
                className="pointer-events-none absolute -right-2 top-4 bottom-4 w-[calc(100%+0.5rem)] rounded-2xl lg:rounded-3xl border border-brand-rose-deep/20 bg-brand-rose-deep/5"
                aria-hidden
              />

              <div className="relative h-full min-h-[inherit] overflow-hidden rounded-2xl lg:rounded-3xl shadow-[0_20px_60px_-15px_rgba(231,84,128,0.35)] ring-1 ring-white/80">
                {slides.map((slide, index) => {
                  if (!visibleIndexes.has(index)) return null;

                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                      aria-hidden={index !== currentSlide}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        fetchPriority={index === 0 ? "high" : "auto"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-brand-blush/10 lg:to-brand-blush/20" />
                    </div>
                  );
                })}
              </div>

              <div
                className="pointer-events-none absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-brand-rose-deep/10 blur-xl"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
