import HeroStaticSection from "@/components/home/HeroStaticSection";
import HeroCarouselLoader from "@/components/home/HeroCarouselLoader";
import type { HeroSlideConfig } from "@/components/HeroCarousel.types";
import { getCachedHeroSlides } from "@/lib/cache";

export const FALLBACK_HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 1,
    image: "/images/carrousell/Carrousell1.jpeg",
    title: "Every Moment Deserves to Bloom",
    subtitle:
      "Flowers, hampers & teddy bears. Same-day delivery Nairobi. Order online with M-Pesa.",
    ctaText: "Shop Now",
    ctaLink: "/collections",
  },
  {
    id: 2,
    image: "/images/carrousell/Carrousell2.jpeg",
    title: "Anniversary Flowers That Speak Your Heart",
    subtitle:
      "Roses, bouquets & hampers. Same-day delivery. Till 4202044 • Paybill 880100.",
    ctaText: "Anniversary Gifts",
    ctaLink: "/collections/flowers",
  },
  {
    id: 3,
    image: "/images/carrousell/Carrousell3.jpeg",
    title: "Surprise Someone Special Today",
    subtitle:
      "Fresh flowers, chocolates & hampers. Delta Hotel, University Way, Nairobi CBD. Mon–Sat 8AM–8PM.",
    ctaText: "View Collections",
    ctaLink: "/collections/gift-hampers",
  },
];

/** Server hero + client-only carousel (no hydration of interactive hero). */
export default async function HomepageHero() {
  const heroSlides = await getCachedHeroSlides();
  const slides = heroSlides.length ? heroSlides : FALLBACK_HERO_SLIDES;

  return (
    <div data-hero-root className="relative">
      <HeroStaticSection slide={slides[0]} />
      <div className="absolute inset-0 z-10">
        <HeroCarouselLoader slides={slides} />
      </div>
    </div>
  );
}
