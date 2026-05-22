import type { Product } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

/** Strip SEO suffixes accidentally stored in product titles */
const TITLE_SUFFIX_PATTERNS = [
  /\s*[-–—|]\s*Premium flower delivery Nairobi.*$/i,
  /\s*[-–—|]\s*Nairobi Flowers? & Gifts.*$/i,
  /\s*[-–—|]\s*The Stems Flowers?.*$/i,
  /\s*[-–—|]\s*Delivered in Nairobi.*$/i,
  /\s*[-–—|]\s*Flower delivery Nairobi.*$/i,
  /\s*[-–—|]\s*Teddy bears? Kenya.*$/i,
  /\s*[-–—|]\s*Gift hampers? Kenya.*$/i,
];

export function getCleanProductTitle(title: string): string {
  let clean = title.trim();
  for (const pattern of TITLE_SUFFIX_PATTERNS) {
    clean = clean.replace(pattern, "");
  }
  return clean.trim() || title.trim();
}

const CATEGORY_LABELS: Record<string, string> = {
  flowers: "Bouquet",
  hampers: "Gift Hamper",
  teddy: "Teddy Bear",
  wines: "Wine Gift",
  chocolates: "Chocolate Gift",
  cards: "Gift Card",
};

/** Optional display suffix when title has no product-type word */
export function getDisplayProductTitle(title: string, category?: string): string {
  const clean = getCleanProductTitle(title);
  const lower = clean.toLowerCase();
  const hasType =
    /\b(bouquet|hamper|bear|wine|chocolate|card|roses?|arrangement|basket)\b/i.test(clean);
  if (hasType || !category) return clean;
  const label = CATEGORY_LABELS[category];
  return label && !lower.includes(label.toLowerCase()) ? `${clean} ${label}` : clean;
}

/** SEO title for SERP (~60 chars), bypasses layout template when used as absolute */
export function getProductMetaTitle(title: string, category?: string): string {
  const clean = getDisplayProductTitle(title, category);
  const absolute = `${clean} | The Stems`;
  if (absolute.length <= 60) return absolute;
  const short = `${clean.slice(0, 60 - " | The Stems".length - 1).trim()}… | The Stems`;
  return short.length <= 60 ? short : `${clean.slice(0, 48).trim()}… | The Stems`;
}

const LOCATION_META =
  "Same-day delivery across Nairobi CBD, Westlands, Karen, Kilimani and Lavington.";

export function getProductMetaDescription(product: {
  slug?: string;
  title: string;
  category: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
}): string {
  const copy = resolveProductCopy({
    slug: product.slug || product.title,
    title: product.title,
    short_description: product.short_description,
    description: product.description,
    category: product.category,
  });
  const snippet = (copy.short || copy.description || getDisplayProductTitle(product.title, product.category))
    .replace(/\s+/g, " ")
    .trim();
  const trimmed = snippet.length > 120 ? `${snippet.slice(0, 117)}…` : snippet;
  return `${trimmed} From ${formatCurrency(product.price)}. ${LOCATION_META} Pay with M-Pesa at The Stems Flowers.`;
}

export function getProductImageAlt(title: string, category?: string): string {
  const clean = getDisplayProductTitle(title, category);
  return `${clean} — The Stems Flowers Nairobi`;
}

/** Slug-specific fixes and mismatch guards for descriptions */
const COPY_OVERRIDES: Record<string, { short_description: string; description: string }> = {
  "get-well-soon-fruit-basket": {
    short_description:
      "Fresh seasonal fruit basket with greens and citrus — a thoughtful get-well gift with same-day Nairobi delivery.",
    description:
      "Our Get Well Soon Fruit Basket includes fresh, seasonal fruits beautifully arranged for hospital visits, home recovery, or office wellness wishes. We deliver across Nairobi with a personal message card. Order by 4PM for same-day delivery in most areas.",
  },
  "get-well-soon-fruit-basket-nairobi": {
    short_description:
      "Fresh seasonal fruit basket with greens and citrus — a thoughtful get-well gift with same-day Nairobi delivery.",
    description:
      "Our Get Well Soon Fruit Basket includes fresh, seasonal fruits beautifully arranged for hospital visits, home recovery, or office wellness wishes. We deliver across Nairobi with a personal message card. Order by 4PM for same-day delivery in most areas.",
  },
};

function looksLikeChocolateCopy(text: string): boolean {
  return /ferrero|rocher|chocolate gift box|chocolate hamper/i.test(text);
}

function looksLikeFruitProduct(title: string): boolean {
  return /fruit|get well/i.test(title);
}

export function resolveProductCopy(product: {
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  category?: string;
}): { short: string; description: string } {
  const slugKey = product.slug.toLowerCase();
  if (COPY_OVERRIDES[slugKey]) {
    return {
      short: COPY_OVERRIDES[slugKey].short_description,
      description: COPY_OVERRIDES[slugKey].description,
    };
  }

  const short = (product.short_description || "").trim();
  const long = (product.description || short).trim();
  const title = getCleanProductTitle(product.title);

  if (looksLikeFruitProduct(title) && looksLikeChocolateCopy(short + long)) {
    const fallback = COPY_OVERRIDES["get-well-soon-fruit-basket"];
    return { short: fallback.short_description, description: fallback.description };
  }

  return {
    short: short || long || `${title} — available for delivery in Nairobi.`,
    description: long || short || `${title} — available for delivery in Nairobi.`,
  };
}

export function normalizeProduct<T extends Product>(product: T): T {
  const copy = resolveProductCopy(product);
  return {
    ...product,
    title: getCleanProductTitle(product.title),
    short_description: copy.short,
    description: copy.description,
  };
}

export function pickUniqueProducts(
  candidates: Product[],
  count: number,
  usedIds: Set<string>
): Product[] {
  const picked: Product[] = [];

  for (const product of candidates) {
    if (picked.length >= count) break;
    if (product?.id && !usedIds.has(product.id)) {
      picked.push(product);
      usedIds.add(product.id);
    }
  }

  if (picked.length < count) {
    for (const product of candidates) {
      if (picked.length >= count) break;
      if (product?.id && !picked.some((p) => p.id === product.id)) {
        picked.push(product);
        usedIds.add(product.id);
      }
    }
  }

  return picked;
}
