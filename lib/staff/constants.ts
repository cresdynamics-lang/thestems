import { SHOP_INFO } from "@/lib/constants";

export const STAFF_BRAND = {
  name: SHOP_INFO.name,
  shortName: "The Stems",
  domain: "thestemsflowers.co.ke",
  tagline: "Nairobi · Flowers, teddy bears & gift hampers",
  location: "Nairobi, Kenya",
  address: SHOP_INFO.address,
} as const;

export const STAFF_TOKEN_KEY = "staff_token";
export const STAFF_SESSION_MS = 30 * 60 * 1000;

export type StaffRole = "super_admin" | "staff" | "admin";

export const CATEGORY_LABELS: Record<string, string> = {
  flowers: "Flower Bouquets",
  teddy: "Teddy Bears",
  hampers: "Gift Hampers",
  chocolates: "Chocolates",
  wines: "Wines",
  cards: "Cards",
};

export const ORDER_FULFILLMENT_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  mpesa: "M-PESA",
  mpesa_till: "M-PESA Till",
  mpesa_paybill: "Paybill",
  card: "Card",
  whatsapp: "WhatsApp",
};

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  superOnly?: boolean;
  group?: string;
};

/** Plain array export — avoids undefined re-exports in some bundler caches */
export const NAV_GROUPS: string[] = [
  "Overview",
  "Shop",
  "Customers",
  "Operations",
  "Site",
  "Admin",
];

export const NAV_ITEMS: NavItem[] = [
  { href: "/staff", label: "Dashboard", icon: "home", group: "Overview" },
  { href: "/staff/live-visitors", label: "Live visitors", icon: "eye", group: "Overview" },
  { href: "/staff/shop", label: "Shop preview", icon: "store", group: "Overview" },
  { href: "/staff/orders", label: "Orders", icon: "shopping-bag", group: "Shop" },
  { href: "/staff/products", label: "Products", icon: "cube", group: "Shop" },
  { href: "/staff/products/categories", label: "Categories", icon: "tag", group: "Shop" },
  { href: "/staff/customers", label: "Customers", icon: "users", group: "Customers" },
  { href: "/staff/coupons", label: "Coupons", icon: "ticket", group: "Customers" },
  { href: "/staff/delivery", label: "Delivery", icon: "truck", group: "Operations" },
  { href: "/staff/messages", label: "Enquiries", icon: "mail", group: "Operations" },
  { href: "/staff/content", label: "Content", icon: "document", group: "Site" },
  { href: "/staff/finance", label: "Revenue", icon: "currency", superOnly: true, group: "Admin" },
  { href: "/staff/audit", label: "Activity log", icon: "clipboard", group: "Admin" },
  { href: "/staff/settings", label: "Settings", icon: "cog", group: "Admin" },
];

/** Safe nav groups for sidebar / mobile menu */
export function getStaffNavGroups(items: NavItem[] = NAV_ITEMS): string[] {
  const fromItems = [...new Set(items.map((i) => i.group).filter((g): g is string => Boolean(g)))];
  const ordered = NAV_GROUPS.filter((g) => fromItems.includes(g));
  return ordered.length ? ordered : fromItems.length ? fromItems : [...NAV_GROUPS];
}
