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

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index <= 1}
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                {/* Left side - Text content (no H1 here to keep homepage H1 focused on Nairobi SEO) */}
                <div className="text-left text-white max-w-2xl flex-1">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-2 md:mb-3 lg:mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-sm md:text-base lg:text-lg xl:text-xl mb-4 md:mb-6 lg:mb-8 text-white/90">
                    {slide.subtitle}
                  </p>
                  {slide.ctaText && slide.ctaLink && (
                    <Link
                      href={slide.ctaLink}
                      className="btn-primary inline-block text-xs md:text-sm lg:text-base px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4"
                    >
                      {slide.ctaText}
                    </Link>
                  )}
                </div>
                
                {/* Right side - Two overlapping images */}
                <div className="hidden md:flex items-center justify-end flex-shrink-0 relative">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                    {/* First image - behind, positioned at top-left, bottom-right corner overlaps second image's top-left by 68px */}
                    <div
                      className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg border-2 border-white/20 z-10"
                      style={{ transform: "translate(68px, 68px)" }}
                    >
                      <Image
                        src={slides[(index + 1) % slides.length].image}
                        alt={slides[(index + 1) % slides.length].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                        quality={75}
                        loading="lazy"
                      />
                    </div>
                    {/* Second image - in front, positioned so its top-left corner overlaps first image's bottom-right corner by 68px */}
                    <div
                      className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg border-2 border-white/20 z-20"
                      style={{ transform: "translate(-68px, -68px)" }}
                    >
                      <Image
                        src={slides[(index + 2) % slides.length].image}
                        alt={slides[(index + 2) % slides.length].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                        quality={75}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

