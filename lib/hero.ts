import { supabaseAdmin } from "@/lib/supabase";
import type { HeroSlideConfig } from "@/components/HeroCarousel.types";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";

export async function getActiveHeroSlides(): Promise<HeroSlideConfig[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await (supabaseAdmin.from("hero_slides") as any)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return [];

    return data.map((s: Record<string, unknown>) => ({
      id: s.id as string | number,
      image: s.image_url as string,
      title: s.title as string,
      subtitle: s.subtitle as string,
      ctaText: s.cta_text as string | undefined,
      ctaLink: s.cta_link as string | undefined,
    }));
  } catch {
    return [];
  }
}
