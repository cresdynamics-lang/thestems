"use client";

import dynamic from "next/dynamic";
import type { HeroSlideConfig } from "@/components/HeroCarousel.types";

const HeroCarouselClient = dynamic(
  () => import("@/components/HeroCarouselClient"),
  { ssr: false }
);

export default function HeroCarouselLoader({
  slides,
}: {
  slides: HeroSlideConfig[];
}) {
  return <HeroCarouselClient slides={slides} />;
}
