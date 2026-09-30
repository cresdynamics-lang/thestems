/**
 * Phase 1 MAIN NAV taxonomy for The Stems.
 * Vertical single-column menus; leaf hrefs use existing landings/collections
 * until Phase 2–3 dedicated pages exist.
 */

export type NavLeaf = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** Vertical submenu (single column) */
  children?: NavLeaf[];
};

/** Flowers submenu — vertical list */
export const FLOWERS_NAV: NavLeaf[] = [
  { label: "All Flowers", href: "/collections/flowers" },
  { label: "Roses", href: "/red-roses-nairobi" },
  { label: "Pink Roses", href: "/pink-roses-nairobi" },
  { label: "White Roses", href: "/white-roses-nairobi" },
  { label: "Mixed Flower Bouquets", href: "/collections/flowers" },
  { label: "Lilies", href: "/collections/flowers" },
  { label: "Sunflowers", href: "/collections/flowers" },
  { label: "Gypsophila / Baby's Breath", href: "/collections/flowers" },
  { label: "Flower Boxes", href: "/collections/flowers" },
  { label: "Hat Boxes", href: "/collections/flowers" },
  { label: "Premium & Luxury Flowers", href: "/collections/flowers" },
];

/** Gifts submenu */
export const GIFTS_NAV: NavLeaf[] = [
  { label: "All Gifts", href: "/gifts" },
  { label: "Teddy Bears", href: "/collections/teddy-bears" },
  { label: "Gift Hampers", href: "/collections/gift-hampers" },
  { label: "Chocolates & Sweet Gifts", href: "/collections/chocolates" },
  { label: "Wines", href: "/collections/wines" },
  { label: "Gift Cards", href: "/collections/cards" },
  { label: "Flowers + Chocolate", href: "/collections/flowers" },
  { label: "Flowers + Teddy Bear", href: "/collections/teddy-bears" },
  { label: "Fruit Baskets", href: "/gifts" },
  { label: "Corporate Gifts", href: "/corporate-gift-hampers-nairobi" },
];

/** Occasions submenu */
export const OCCASIONS_NAV: NavLeaf[] = [
  { label: "All Occasions", href: "/occasions" },
  { label: "Birthday", href: "/birthday-flowers-nairobi" },
  { label: "Anniversary", href: "/anniversary-flowers-nairobi" },
  { label: "Get Well Soon", href: "/collections/flowers" },
  { label: "Congratulations", href: "/collections/flowers" },
  { label: "Thank You", href: "/collections/flowers" },
  { label: "Apology", href: "/apology-flowers-nairobi" },
  { label: "New Baby", href: "/collections/flowers" },
  { label: "Just Because", href: "/collections/flowers" },
  { label: "Valentine's Day", href: "/red-roses-nairobi" },
  { label: "Mother's Day", href: "/collections/flowers" },
  { label: "International Women's Day", href: "/collections/flowers" },
  { label: "Sympathy", href: "/collections/flowers" },
];

/** Graduation submenu */
export const GRADUATION_NAV: NavLeaf[] = [
  { label: "Graduation Bouquets", href: "/collections/flowers" },
  { label: "PP2 Graduation", href: "/collections/flowers" },
  { label: "Grade 3 Graduation", href: "/collections/flowers" },
  { label: "Grade 6 Graduation", href: "/collections/flowers" },
  { label: "Grade 9 Graduation", href: "/collections/flowers" },
  { label: "Graduation Snack Bouquets", href: "/collections/gift-hampers" },
  { label: "Graduation Teddy Bears", href: "/collections/teddy-bears" },
  { label: "Graduation Gift Hampers", href: "/collections/gift-hampers" },
];

/** Weddings & Events submenu */
export const WEDDINGS_NAV: NavLeaf[] = [
  { label: "Wedding Flowers Nairobi", href: "/wedding-flowers-nairobi" },
  { label: "Bridal Bouquets", href: "/wedding-flowers-nairobi" },
  { label: "Bridesmaid Bouquets", href: "/wedding-flowers-nairobi" },
  { label: "Wedding Car Flowers", href: "/wedding-car-decor-nairobi" },
  { label: "Wedding Centrepieces", href: "/wedding-flowers-nairobi" },
  { label: "Reception Décor", href: "/wedding-flowers-nairobi" },
  { label: "Wedding Arches", href: "/wedding-flowers-nairobi" },
];

/** Gift Hampers submenu */
export const HAMPERS_NAV: NavLeaf[] = [
  { label: "All Gift Hampers", href: "/collections/gift-hampers" },
  { label: "Luxury Gift Hampers", href: "/collections/gift-hampers" },
  { label: "Chocolate Hampers", href: "/collections/chocolates" },
  { label: "Flower Hampers", href: "/flower-wine-hamper-nairobi" },
  { label: "Corporate Hampers", href: "/corporate-gift-hampers-nairobi" },
  { label: "Custom Gift Hampers", href: "/collections/gift-hampers" },
];

/**
 * Combined MAIN NAV — Home, Flowers, Gifts, Occasions, Graduation,
 * Weddings & Events, Gift Hampers, Same-Day Delivery, Contact
 */
export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Flowers", href: "/collections/flowers", children: FLOWERS_NAV },
  { label: "Gifts", href: "/gifts", children: GIFTS_NAV },
  { label: "Occasions", href: "/occasions", children: OCCASIONS_NAV },
  { label: "Graduation", href: "/collections/flowers", children: GRADUATION_NAV },
  {
    label: "Weddings & Events",
    href: "/wedding-flowers-nairobi",
    children: WEDDINGS_NAV,
  },
  {
    label: "Gift Hampers",
    href: "/collections/gift-hampers",
    children: HAMPERS_NAV,
  },
  { label: "Same-Day Delivery", href: "/same-day-flower-delivery-nairobi" },
  { label: "Contact", href: "/contact" },
];

/** Hero promo chips → Occasions / Gifts taxonomy */
export const HERO_GIFT_AUDIENCES: NavLeaf[] = [
  { label: "Women's Gifts", href: "/occasions" },
  { label: "Girlfriend Gifts", href: "/anniversary-flowers-nairobi" },
  { label: "Men's Gifts", href: "/gifts" },
];
