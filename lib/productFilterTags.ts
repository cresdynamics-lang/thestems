/**
 * Canonical filter tags for products — used by admin checkboxes,
 * collection chips, nav leaves, and SEO landings.
 * Stored on product.tags (and first flower/occasion also in subcategory).
 */

export const FLOWER_TYPE_TAGS = [
  "Roses",
  "Lilies",
  "Sunflowers",
  "Gypsophila",
  "Mixed Bouquets",
  "Flower Boxes",
  "Hat Boxes",
  "Premium Luxury",
] as const;

export const OCCASION_TAGS = [
  "Anniversary",
  "Get Well Soon",
  "I'm Sorry",
  "Graduation",
  "Birthday",
  "Wedding",
  "Funeral",
  "Valentine",
  "Romantic",
  "Congratulations",
  "Thank You",
  "New Baby",
  "Just Because",
  "Mothers Day Gifts",
  "Men Gifts",
  "Girlfriend Day Gifts",
  "Mens Day Gifts",
] as const;

export const GIFT_TYPE_TAGS = [
  "Gift Hampers",
  "Luxury Hampers",
  "Chocolate Hampers",
  "Flower Hampers",
  "Corporate Hampers",
  "Fruit Baskets",
  "Teddy + Flowers",
  "Flowers + Chocolate",
  "Self-Care Hampers",
] as const;

export type FlowerTypeTag = (typeof FLOWER_TYPE_TAGS)[number];
export type OccasionTag = (typeof OCCASION_TAGS)[number];
export type GiftTypeTag = (typeof GIFT_TYPE_TAGS)[number];

/** All assignable shop filter tags (excludes teddy size / color:*) */
export const ALL_SHOP_FILTER_TAGS: readonly string[] = [
  ...FLOWER_TYPE_TAGS,
  ...OCCASION_TAGS,
  ...GIFT_TYPE_TAGS,
];

export type FilterTagGroup = {
  id: string;
  label: string;
  hint: string;
  tags: readonly string[];
};

export const FILTER_TAG_GROUPS: FilterTagGroup[] = [
  {
    id: "flower-types",
    label: "Flower types",
    hint: "Tick every flower style this product belongs to (drives Flowers menu & landings).",
    tags: FLOWER_TYPE_TAGS,
  },
  {
    id: "occasions",
    label: "Occasions",
    hint: "Tick every occasion this gift fits — it will show under those filters.",
    tags: OCCASION_TAGS,
  },
  {
    id: "gift-types",
    label: "Gift & hamper types",
    hint: "For hampers, teddy combos and sweet gifts — tick where this product should appear.",
    tags: GIFT_TYPE_TAGS,
  },
];

/** Map nav / landing slug → tags that qualify a product for that page */
export const LANDING_TAG_MAP: Record<string, string[]> = {
  "lilies-nairobi": ["Lilies"],
  "sunflowers-nairobi": ["Sunflowers"],
  "gypsophila-nairobi": ["Gypsophila"],
  "flower-boxes-nairobi": ["Flower Boxes"],
  "hat-boxes-nairobi": ["Hat Boxes"],
  "premium-luxury-flowers-nairobi": ["Premium Luxury"],
  "thank-you-flowers-nairobi": ["Thank You"],
  "new-baby-flowers-nairobi": ["New Baby"],
  "mothers-day-flowers-nairobi": ["Mothers Day Gifts"],
  "mixed-bouquets-nairobi": ["Mixed Bouquets"],
  "roses-nairobi": ["Roses"],
  "graduation-bouquets-nairobi": ["Graduation"],
  "get-well-soon-flowers-nairobi": ["Get Well Soon"],
  "funeral-flowers-nairobi": ["Funeral"],
  "gift-hampers-nairobi": ["Gift Hampers", "Luxury Hampers", "Flower Hampers"],
  "fruit-baskets-nairobi": ["Fruit Baskets"],
  "teddy-bears-nairobi": ["Teddy + Flowers"],
  "chocolates-nairobi": ["Flowers + Chocolate", "Chocolate Hampers"],
  "corporate-flowers-nairobi": ["Corporate Hampers"],
};

export function isShopFilterTag(tag: string): boolean {
  return ALL_SHOP_FILTER_TAGS.includes(tag);
}

export function shopFilterTagsFromProduct(tags: string[] | null | undefined, subcategory?: string | null): string[] {
  const fromTags = (tags || []).filter(isShopFilterTag);
  const fromSub =
    subcategory && isShopFilterTag(subcategory) ? [subcategory] : [];
  return [...new Set([...fromTags, ...fromSub])];
}
