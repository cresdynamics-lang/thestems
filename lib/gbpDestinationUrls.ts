/**
 * Google Business Profile → website landing page map.
 * Use these URLs on GBP products/services instead of always linking to the homepage.
 */

export type GbpDestination = {
  gbpLabel: string;
  href: string;
  absoluteHint: string;
};

const SITE = "https://thestemsflowers.co.ke";

export const GBP_DESTINATION_URLS: GbpDestination[] = [
  {
    gbpLabel: "Graduation Bouquet",
    href: "/graduation-bouquets-nairobi",
    absoluteHint: `${SITE}/graduation-bouquets-nairobi`,
  },
  {
    gbpLabel: "Birthday Flowers",
    href: "/birthday-flowers-nairobi",
    absoluteHint: `${SITE}/birthday-flowers-nairobi`,
  },
  {
    gbpLabel: "Get Well Soon Fruit Basket",
    href: "/fruit-baskets-nairobi",
    absoluteHint: `${SITE}/fruit-baskets-nairobi`,
  },
  {
    gbpLabel: "Get Well Soon Flowers",
    href: "/get-well-soon-flowers-nairobi",
    absoluteHint: `${SITE}/get-well-soon-flowers-nairobi`,
  },
  {
    gbpLabel: "Wedding Flowers",
    href: "/wedding-flowers-nairobi",
    absoluteHint: `${SITE}/wedding-flowers-nairobi`,
  },
  {
    gbpLabel: "Teddy Bear",
    href: "/teddy-bears-nairobi",
    absoluteHint: `${SITE}/teddy-bears-nairobi`,
  },
  {
    gbpLabel: "Gift Hampers",
    href: "/gift-hampers-nairobi",
    absoluteHint: `${SITE}/gift-hampers-nairobi`,
  },
  {
    gbpLabel: "Same-Day Flower Delivery",
    href: "/same-day-flower-delivery-nairobi",
    absoluteHint: `${SITE}/same-day-flower-delivery-nairobi`,
  },
  {
    gbpLabel: "Florist Nairobi / Flower Shop",
    href: "/florist-nairobi",
    absoluteHint: `${SITE}/florist-nairobi`,
  },
  {
    gbpLabel: "Flower Delivery Nairobi",
    href: "/flower-delivery-nairobi",
    absoluteHint: `${SITE}/flower-delivery-nairobi`,
  },
  {
    gbpLabel: "Red Roses",
    href: "/red-roses-nairobi",
    absoluteHint: `${SITE}/red-roses-nairobi`,
  },
  {
    gbpLabel: "Anniversary Flowers",
    href: "/anniversary-flowers-nairobi",
    absoluteHint: `${SITE}/anniversary-flowers-nairobi`,
  },
  {
    gbpLabel: "Apology / I'm Sorry Flowers",
    href: "/apology-flowers-nairobi",
    absoluteHint: `${SITE}/apology-flowers-nairobi`,
  },
  {
    gbpLabel: "Funeral / Sympathy Flowers",
    href: "/funeral-flowers-nairobi",
    absoluteHint: `${SITE}/funeral-flowers-nairobi`,
  },
  {
    gbpLabel: "Corporate Flowers & Gifts",
    href: "/corporate-flowers-nairobi",
    absoluteHint: `${SITE}/corporate-flowers-nairobi`,
  },
  {
    gbpLabel: "Corporate Gift Hampers",
    href: "/corporate-gift-hampers-nairobi",
    absoluteHint: `${SITE}/corporate-gift-hampers-nairobi`,
  },
  {
    gbpLabel: "Chocolates & Sweet Gifts",
    href: "/chocolates-nairobi",
    absoluteHint: `${SITE}/chocolates-nairobi`,
  },
  {
    gbpLabel: "Flower Delivery Westlands",
    href: "/flower-delivery-westlands-nairobi",
    absoluteHint: `${SITE}/flower-delivery-westlands-nairobi`,
  },
  {
    gbpLabel: "Flower Delivery Kilimani",
    href: "/flower-delivery-kilimani-nairobi",
    absoluteHint: `${SITE}/flower-delivery-kilimani-nairobi`,
  },
  {
    gbpLabel: "Flower Delivery Karen",
    href: "/flower-delivery-karen-nairobi",
    absoluteHint: `${SITE}/flower-delivery-karen-nairobi`,
  },
  {
    gbpLabel: "Flower Delivery Lavington",
    href: "/flower-delivery-lavington-nairobi",
    absoluteHint: `${SITE}/flower-delivery-lavington-nairobi`,
  },
  {
    gbpLabel: "Florist Nairobi CBD (shop address)",
    href: "/florist-nairobi-cbd",
    absoluteHint: `${SITE}/florist-nairobi-cbd`,
  },
];
