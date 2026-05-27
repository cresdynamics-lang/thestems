import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";
import type { Product } from "@/lib/db";
import { isProductPublished } from "@/lib/db";
import { pickUniqueProducts } from "@/lib/productDisplay";
import { stableSortByKey } from "@/lib/seo";

export type HomepageSectionRow = {
  id: string;
  key: string;
  title: string;
  product_ids: string[];
  is_active: boolean;
  sort_order: number;
  updated_at?: string;
};

export type HomepageSectionConfig = HomepageSectionRow & {
  link_href?: string;
};

export const HOMEPAGE_SECTIONS_SETTINGS_KEY = "homepage_sections";

/** Default sections matching the current homepage layout */
export const DEFAULT_HOMEPAGE_SECTIONS: Omit<
  HomepageSectionRow,
  "id" | "updated_at"
>[] = [
  {
    key: "anniversary_gifts",
    title: "Anniversary Gifts - Celebrate Love, Every Year",
    product_ids: [],
    is_active: true,
    sort_order: 1,
  },
  {
    key: "birthday_surprises",
    title: "Birthday Surprises - Make Their Day Extraordinary",
    product_ids: [],
    is_active: true,
    sort_order: 2,
  },
  {
    key: "same_day_flowers",
    title: "Same-Day Flower Delivery - Express Your Feelings Today",
    product_ids: [],
    is_active: true,
    sort_order: 3,
  },
  {
    key: "apology_flowers",
    title: "Apology Flowers - Say Sorry with Beautiful Blooms",
    product_ids: [],
    is_active: true,
    sort_order: 4,
  },
  {
    key: "gift_hampers",
    title: "Premium Gift Hampers - Thoughtful Combinations",
    product_ids: [],
    is_active: true,
    sort_order: 5,
  },
  {
    key: "teddy_bears",
    title: "Cuddly Teddy Bears - Warm Hugs, Lasting Memories",
    product_ids: [],
    is_active: true,
    sort_order: 6,
  },
];

const SECTION_LINKS: Record<string, string> = {
  anniversary_gifts: "/collections/flowers?tags=anniversary",
  birthday_surprises: "/birthday-flowers-nairobi",
  same_day_flowers: "/collections/flowers",
  apology_flowers: "/apology-flowers-nairobi",
  gift_hampers: "/collections/gift-hampers",
  teddy_bears: "/collections/teddy-bears",
  featured_flowers: "/collections/flowers",
  featured_bouquets: "/collections/flowers",
};

type ProductPools = {
  flowers: Product[];
  hampers: Product[];
  teddy: Product[];
  mixed: Product[];
};

type FallbackRule = {
  pool: keyof ProductPools | "mixed";
  tags?: string[];
  limit?: number;
};

const FALLBACK_RULES: Record<string, FallbackRule> = {
  anniversary_gifts: { pool: "mixed", tags: ["anniversary"], limit: 8 },
  birthday_surprises: { pool: "mixed", tags: ["birthday"], limit: 8 },
  same_day_flowers: { pool: "flowers", limit: 8 },
  apology_flowers: { pool: "flowers", tags: ["apology", "sorry"], limit: 8 },
  gift_hampers: { pool: "hampers", limit: 8 },
  teddy_bears: { pool: "teddy", limit: 8 },
  featured_flowers: { pool: "flowers", limit: 8 },
  featured_bouquets: { pool: "flowers", limit: 8 },
};

export function normalizeProductIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => String(id)).filter(Boolean);
}

function filterByTags(products: Product[], tags: string[]) {
  if (!tags.length) return products;
  return products.filter((product) =>
    product.tags?.some((t) =>
      tags.some((tag) => t.toLowerCase().includes(tag.toLowerCase()))
    )
  );
}

function mapRow(row: Record<string, unknown>): HomepageSectionRow {
  return {
    id: String(row.id),
    key: String(row.key),
    title: String(row.title),
    product_ids: normalizeProductIds(row.product_ids),
    is_active: row.is_active !== false,
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function attachLinks(sections: HomepageSectionRow[]): HomepageSectionConfig[] {
  return sections.map((section) => ({
    ...section,
    link_href: SECTION_LINKS[section.key],
  }));
}

export function getSectionLinkHref(key: string): string | undefined {
  return SECTION_LINKS[key];
}

function isMissingTableError(message: string): boolean {
  return (
    /homepage_sections/i.test(message) &&
    (/does not exist|relation.*not found|42P01/i.test(message) ||
      /schema cache/i.test(message))
  );
}

async function loadSectionsFromSettings(): Promise<HomepageSectionConfig[] | null> {
  try {
    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", HOMEPAGE_SECTIONS_SETTINGS_KEY)
      .maybeSingle();

    if (!data?.value) return null;

    const parsed = JSON.parse(String(data.value)) as HomepageSectionRow[];
    if (!Array.isArray(parsed) || !parsed.length) return null;
    return attachLinks(
      parsed.map((row) => ({
        ...row,
        product_ids: normalizeProductIds(row.product_ids),
      }))
    );
  } catch {
    return null;
  }
}

async function saveSectionsToSettings(sections: HomepageSectionRow[]): Promise<void> {
  const payload = sections.map((s) => ({
    id: s.id,
    key: s.key,
    title: s.title,
    product_ids: normalizeProductIds(s.product_ids),
    is_active: s.is_active,
    sort_order: s.sort_order,
    updated_at: s.updated_at || new Date().toISOString(),
  }));

  await supabaseAdmin.from("site_settings").upsert(
    {
      key: HOMEPAGE_SECTIONS_SETTINGS_KEY,
      value: JSON.stringify(payload),
      description: "Homepage featured product sections",
    },
    { onConflict: "key" }
  );
}

export async function ensureHomepageSectionsSeeded(): Promise<{
  ok: boolean;
  setupRequired?: boolean;
  message?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase is not configured" };
  }

  const { data: existing, error: readError } = await supabaseAdmin
    .from("homepage_sections")
    .select("id")
    .limit(1);

  if (readError) {
    if (isMissingTableError(readError.message)) {
      return {
        ok: false,
        setupRequired: true,
        message:
          "Run supabase/RUN_IN_SQL_EDITOR.sql in the Supabase SQL Editor to create homepage_sections.",
      };
    }
    return { ok: false, message: readError.message };
  }

  if (existing && existing.length > 0) return { ok: true };

  const { error: insertError } = await supabaseAdmin.from("homepage_sections").insert(
    DEFAULT_HOMEPAGE_SECTIONS.map((s) => ({
      ...s,
      updated_at: new Date().toISOString(),
    }))
  );

  if (insertError) {
    return { ok: false, message: insertError.message };
  }

  return { ok: true };
}

export type HomepageSectionsLoadResult = {
  sections: HomepageSectionConfig[];
  setupRequired?: boolean;
  message?: string;
};

export async function loadHomepageSections(): Promise<HomepageSectionsLoadResult> {
  if (!isSupabaseConfigured()) {
    return { sections: [], message: "Database not configured" };
  }

  const seed = await ensureHomepageSectionsSeeded();
  if (seed.setupRequired) {
    const fromSettings = await loadSectionsFromSettings();
    if (fromSettings?.length) {
      return { sections: fromSettings, message: seed.message };
    }
    return { sections: [], setupRequired: true, message: seed.message };
  }

  const { data, error } = await supabaseAdmin
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    const fromSettings = await loadSectionsFromSettings();
    if (fromSettings?.length) {
      return { sections: fromSettings, message: error.message };
    }
    return { sections: [], message: error.message };
  }

  if (data?.length) {
    return { sections: attachLinks(data.map((row) => mapRow(row as Record<string, unknown>))) };
  }

  const fromSettings = await loadSectionsFromSettings();
  return { sections: fromSettings ?? [] };
}

export async function getHomepageSections(): Promise<HomepageSectionConfig[]> {
  const { sections } = await loadHomepageSections();
  return sections;
}

export async function saveHomepageSections(
  sections: HomepageSectionRow[]
): Promise<HomepageSectionConfig[]> {
  const normalized = sections.map((s, i) => ({
    ...s,
    product_ids: normalizeProductIds(s.product_ids),
    sort_order: s.sort_order ?? i + 1,
    is_active: s.is_active !== false,
  }));

  await saveSectionsToSettings(normalized);

  const seed = await ensureHomepageSectionsSeeded();
  if (seed.ok) {
    for (const section of normalized) {
      const { error } = await supabaseAdmin
        .from("homepage_sections")
        .update({
          title: section.title,
          product_ids: section.product_ids,
          is_active: section.is_active,
          sort_order: section.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", section.id);

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  return getHomepageSections();
}

export const getCachedHomepageSections = unstable_cache(
  async (): Promise<HomepageSectionConfig[]> => getHomepageSections(),
  ["homepage-sections"],
  { revalidate: 60, tags: ["homepage-sections"] }
);

export function resolveSectionProducts(
  section: HomepageSectionRow,
  allProducts: Product[],
  pools: ProductPools,
  usedIds: Set<string>
): Product[] {
  const published = allProducts.filter(isProductPublished);
  const byId = new Map(published.map((p) => [String(p.id), p]));

  if (section.product_ids.length > 0) {
    const picked = section.product_ids
      .map((id) => byId.get(String(id)))
      .filter((p): p is Product => Boolean(p));
    picked.forEach((p) => usedIds.add(p.id));
    return picked;
  }

  const rule = FALLBACK_RULES[section.key];
  if (!rule) return [];

  const pool = pools[rule.pool === "mixed" ? "mixed" : rule.pool] || pools.mixed;
  const filtered = rule.tags?.length ? filterByTags(pool, rule.tags) : pool;
  const source = filtered.length ? filtered : pool;
  return pickUniqueProducts(source, rule.limit ?? 8, usedIds);
}

export type HomepageSectionRender = {
  key: string;
  title: string;
  products: Product[];
  linkHref?: string;
};

/** Sections to render on the homepage (DB-driven with automatic fallbacks). */
export async function getHomepageProductSections(
  allProducts: Product[]
): Promise<HomepageSectionRender[]> {
  const pools = buildProductPools(allProducts.filter(isProductPublished));
  const usedIds = new Set<string>();
  const sections = await getCachedHomepageSections();
  const active = sections.filter((s) => s.is_active);

  if (active.length === 0) {
    return [];
  }

  return active.map((section) => ({
    key: section.key,
    title: section.title,
    linkHref: section.link_href,
    products: resolveSectionProducts(section, allProducts, pools, usedIds),
  }));
}

export function buildProductPools(allProducts: Product[]): ProductPools {
  const sortProducts = <T extends { slug?: string; id?: string }>(array: T[]) =>
    stableSortByKey(array);

  const flowers = sortProducts(allProducts.filter((p) => p.category === "flowers"));
  const hampers = sortProducts(allProducts.filter((p) => p.category === "hampers"));
  const teddy = sortProducts(allProducts.filter((p) => p.category === "teddy"));

  return {
    flowers,
    hampers,
    teddy,
    mixed: sortProducts([...flowers, ...hampers, ...teddy]),
  };
}
