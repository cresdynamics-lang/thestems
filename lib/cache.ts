import { unstable_cache } from "next/cache";
import { getProducts, type Product } from "@/lib/db";
import { getActiveHeroSlides } from "@/lib/hero";
import type { HeroSlideConfig } from "@/components/HeroCarousel";
import {
  getCachedHomepageSections as getCachedHomepageSectionsImpl,
  type HomepageSectionConfig,
} from "@/lib/homepage-sections";

/** One Supabase round-trip for homepage/collections instead of three. */
export const getCachedAllProducts = unstable_cache(
  async (): Promise<Product[]> => getProducts(),
  ["all-products"],
  { revalidate: 60, tags: ["products"] }
);

export const getCachedHeroSlides = unstable_cache(
  async (): Promise<HeroSlideConfig[]> => getActiveHeroSlides(),
  ["hero-slides"],
  { revalidate: 300, tags: ["hero"] }
);

export const getCachedHomepageSections: () => Promise<HomepageSectionConfig[]> =
  getCachedHomepageSectionsImpl;
