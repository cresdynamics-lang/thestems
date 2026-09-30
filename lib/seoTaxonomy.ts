/**
 * Phase 0 foundation — canonical IA map for SEO category structure.
 * Nav menus consume lib/navTaxonomy.ts; this file documents hubs, product
 * filters, and which leaves still need dedicated landings (Phase 2–3).
 */

import {
  FLOWERS_NAV,
  GIFTS_NAV,
  OCCASIONS_NAV,
  GRADUATION_NAV,
  WEDDINGS_NAV,
  HAMPERS_NAV,
  MAIN_NAV,
} from "./navTaxonomy";

export type ProductFilter = {
  category?: "flowers" | "hampers" | "teddy" | "wines" | "chocolates" | "cards";
  /** Match product.subcategory or product.tags */
  tags?: string[];
};

export type TaxonomyLeaf = {
  label: string;
  href: string;
  filter?: ProductFilter;
  /** true = dedicated SEO page still to build in Phase 2/3 */
  needsLanding?: boolean;
};

export const SEO_HUBS = {
  flowers: { path: "/collections/flowers", leaves: FLOWERS_NAV },
  gifts: { path: "/gifts", leaves: GIFTS_NAV },
  occasions: { path: "/occasions", leaves: OCCASIONS_NAV },
  graduation: { path: "/collections/flowers", leaves: GRADUATION_NAV },
  weddings: { path: "/wedding-flowers-nairobi", leaves: WEDDINGS_NAV },
  hampers: { path: "/collections/gift-hampers", leaves: HAMPERS_NAV },
} as const;

export { MAIN_NAV };

/** Leaves that currently only hit a collection (need unique SEO pages later). */
export function leavesNeedingLandings(): TaxonomyLeaf[] {
  const all = [
    ...FLOWERS_NAV,
    ...GIFTS_NAV,
    ...OCCASIONS_NAV,
    ...GRADUATION_NAV,
    ...WEDDINGS_NAV,
    ...HAMPERS_NAV,
  ];
  return all
    .filter(
      (l) =>
        l.href.startsWith("/collections/") ||
        l.href === "/gifts" ||
        l.href === "/occasions"
    )
    .map((l) => ({ ...l, needsLanding: true }));
}
