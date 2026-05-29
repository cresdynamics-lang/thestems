"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroSlideConfig {
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HeroCarouselProps {
  slides: HeroSlideConfig[];
}

function slideIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

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

  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden">
      {slides.map((slide, index) => {
        if (!visibleIndexes.has(index)) return null;

        const isActive = index === currentSlide;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                  <div className="text-left text-white max-w-2xl flex-1">
                    <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-2 md:mb-3 lg:mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg xl:text-xl mb-4 md:mb-6 lg:mb-8 text-white/90">
                      {slide.subtitle}
                    </p>
                    {slide.ctaText && slide.ctaLink ? (
                      <Link
                        href={slide.ctaLink}
                        className="btn-primary inline-block text-xs md:text-sm lg:text-base px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4"
                      >
                        {slide.ctaText}
                      </Link>
                    ) : null}
                  </div>

                  <div className="hidden md:flex items-center justify-end flex-shrink-0 relative">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                      <div
                        className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg border-2 border-white/20 z-10"
                        style={{ transform: "translate(68px, 68px)" }}
                      >
                        <Image
                          src={slides[slideIndex(index + 1, slides.length)].image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="192px"
                          loading="lazy"
                        />
                      </div>
                      <div
                        className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg border-2 border-white/20 z-20"
                        style={{ transform: "translate(-68px, -68px)" }}
                      >
                        <Image
                          src={slides[slideIndex(index + 2, slides.length)].image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="192px"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 sr-only focus:not-sr-only"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 sr-only focus:not-sr-only"
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75 w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
