/**
 * MAIN NAV taxonomy — vertical single-column menus.
 * Phase 2: hubs + dedicated SEO landings wired where available.
 */

export type NavLeaf = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavLeaf[];
};

export const FLOWERS_NAV: NavLeaf[] = [
  { label: "All Flowers", href: "/collections/flowers" },
  { label: "Roses", href: "/roses-nairobi" },
  { label: "Pink Roses", href: "/pink-roses-nairobi" },
  { label: "White Roses", href: "/white-roses-nairobi" },
  { label: "Mixed Flower Bouquets", href: "/mixed-bouquets-nairobi" },
  { label: "Lilies", href: "/lilies-nairobi" },
  { label: "Sunflowers", href: "/sunflowers-nairobi" },
  { label: "Gypsophila / Baby's Breath", href: "/gypsophila-nairobi" },
  { label: "Flower Boxes", href: "/flower-boxes-nairobi" },
  { label: "Hat Boxes", href: "/hat-boxes-nairobi" },
  { label: "Premium & Luxury Flowers", href: "/premium-luxury-flowers-nairobi" },
];

export const GIFTS_NAV: NavLeaf[] = [
  { label: "All Gifts", href: "/gifts" },
  { label: "Teddy Bears", href: "/teddy-bears-nairobi" },
  { label: "Gift Hampers", href: "/gift-hampers-nairobi" },
  { label: "Chocolates & Sweet Gifts", href: "/chocolates-nairobi" },
  { label: "Wines", href: "/collections/wines" },
  { label: "Gift Cards", href: "/collections/cards" },
  { label: "Flowers + Chocolate", href: "/chocolates-nairobi" },
  { label: "Flowers + Teddy Bear", href: "/teddy-bears-nairobi" },
  { label: "Fruit Baskets", href: "/fruit-baskets-nairobi" },
  { label: "Corporate Gifts", href: "/corporate-gift-hampers-nairobi" },
];

export const OCCASIONS_NAV: NavLeaf[] = [
  { label: "All Occasions", href: "/occasions" },
  { label: "Birthday", href: "/birthday-flowers-nairobi" },
  { label: "Anniversary", href: "/anniversary-flowers-nairobi" },
  { label: "Get Well Soon", href: "/get-well-soon-flowers-nairobi" },
  { label: "Congratulations", href: "/graduation-bouquets-nairobi" },
  { label: "Thank You", href: "/thank-you-flowers-nairobi" },
  { label: "Apology", href: "/apology-flowers-nairobi" },
  { label: "New Baby", href: "/new-baby-flowers-nairobi" },
  { label: "Just Because", href: "/mixed-bouquets-nairobi" },
  { label: "Valentine's Day", href: "/red-roses-nairobi" },
  { label: "Mother's Day", href: "/mothers-day-flowers-nairobi" },
  { label: "International Women's Day", href: "/occasions" },
  { label: "Sympathy", href: "/funeral-flowers-nairobi" },
];

export const GRADUATION_NAV: NavLeaf[] = [
  { label: "Graduation Bouquets", href: "/graduation-bouquets-nairobi" },
  { label: "PP2 Graduation", href: "/graduation-bouquets-nairobi" },
  { label: "Grade 3 Graduation", href: "/graduation-bouquets-nairobi" },
  { label: "Grade 6 Graduation", href: "/graduation-bouquets-nairobi" },
  { label: "Grade 9 Graduation", href: "/graduation-bouquets-nairobi" },
  { label: "Graduation Snack Bouquets", href: "/gift-hampers-nairobi" },
  { label: "Graduation Teddy Bears", href: "/teddy-bears-nairobi" },
  { label: "Graduation Gift Hampers", href: "/gift-hampers-nairobi" },
];

export const WEDDINGS_NAV: NavLeaf[] = [
  { label: "Wedding Flowers Nairobi", href: "/wedding-flowers-nairobi" },
  { label: "Bridal Bouquets", href: "/wedding-flowers-nairobi" },
  { label: "Bridesmaid Bouquets", href: "/wedding-flowers-nairobi" },
  { label: "Wedding Car Flowers", href: "/wedding-car-decor-nairobi" },
  { label: "Wedding Centrepieces", href: "/wedding-flowers-nairobi" },
  { label: "Reception Décor", href: "/wedding-flowers-nairobi" },
  { label: "Wedding Arches", href: "/weddings-events" },
];

export const HAMPERS_NAV: NavLeaf[] = [
  { label: "All Gift Hampers", href: "/gift-hampers-nairobi" },
  { label: "Luxury Gift Hampers", href: "/gift-hampers-nairobi" },
  { label: "Chocolate Hampers", href: "/chocolates-nairobi" },
  { label: "Flower Hampers", href: "/flower-wine-hamper-nairobi" },
  { label: "Corporate Hampers", href: "/corporate-gift-hampers-nairobi" },
  { label: "Custom Gift Hampers", href: "/gift-hampers-nairobi" },
];

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Flowers", href: "/flowers", children: FLOWERS_NAV },
  { label: "Gifts", href: "/gifts", children: GIFTS_NAV },
  { label: "Occasions", href: "/occasions", children: OCCASIONS_NAV },
  { label: "Graduation", href: "/graduation", children: GRADUATION_NAV },
  {
    label: "Weddings & Events",
    href: "/weddings-events",
    children: WEDDINGS_NAV,
  },
  {
    label: "Gift Hampers",
    href: "/gift-hampers-nairobi",
    children: HAMPERS_NAV,
  },
  { label: "Same-Day Delivery", href: "/same-day-flower-delivery-nairobi" },
];

/** Left hero category card — gift audiences + shop filters (overlaps some MAIN NAV). */
export const HERO_GIFT_AUDIENCES: NavLeaf[] = [
  { label: "Women's Gifts", href: "/occasions" },
  { label: "Girlfriend Gifts", href: "/anniversary-flowers-nairobi" },
  { label: "Men's Gifts", href: "/gifts" },
  { label: "Flowers", href: "/flowers" },
  { label: "Gift Hampers", href: "/gift-hampers-nairobi" },
  { label: "Teddy Bears", href: "/teddy-bears-nairobi" },
  { label: "Graduation", href: "/graduation" },
  { label: "Same-Day Delivery", href: "/same-day-flower-delivery-nairobi" },
];
