import { getCleanProductTitle } from "@/lib/productDisplay";
import { absoluteUrl, SITE_NAME, toAbsoluteImageUrl } from "@/lib/seo";
import { SHOP_INFO } from "@/lib/constants";

export type MetaFeedProduct = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  short_description?: string | null;
  price: number;
  sale_price?: number | null;
  category: string;
  subcategory?: string | null;
  tags?: string[] | null;
  images?: string[] | null;
  sku?: string | null;
  stock?: number | null;
  visibility?: string | null;
};

const GOOGLE_CATEGORY: Record<string, string> = {
  flowers: "Arts & Entertainment > Party & Celebration > Gift Giving > Fresh Cut Flowers",
  hampers: "Arts & Entertainment > Party & Celebration > Gift Giving > Gift Baskets",
  teddy: "Toys & Games > Toys > Dolls, Playsets & Toy Figures > Stuffed Animals & Plush Toys",
  wines: "Food, Beverages & Tobacco > Beverages > Alcoholic Beverages > Wine",
  chocolates: "Food, Beverages & Tobacco > Food Items > Candy & Chocolate > Chocolate Bars & Chocolate Packs",
  cards: "Arts & Entertainment > Party & Celebration > Gift Giving > Greeting & Note Cards",
};

function csvEscape(value: string): string {
  const cleaned = value.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
  if (/[",]/.test(cleaned)) {
    return `"${cleaned.replace(/"/g, '""')}"`;
  }
  return cleaned;
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function kesPrice(cents: number): string {
  const amount = (Math.max(0, cents) / 100).toFixed(2);
  return `${amount} KES`;
}

function productType(product: MetaFeedProduct): string {
  const parts = ["Home", "The Stems", product.category];
  if (product.subcategory) parts.push(product.subcategory);
  return parts.join(" > ");
}

/**
 * Build a Meta Commerce Manager CSV catalog feed.
 * All listed products are forced to availability=in stock and status=active.
 */
export function buildMetaCatalogCsv(products: MetaFeedProduct[]): string {
  const headers = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "additional_image_link",
    "google_product_category",
    "product_type",
    "sale_price",
    "item_group_id",
    "custom_label_0",
    "custom_label_1",
    "quantity_to_sell_on_facebook",
    "status",
    "inventory",
  ];

  const rows = products.map((product) => {
    const title = getCleanProductTitle(product.title).slice(0, 150);
    const description = stripHtml(
      product.short_description ||
        product.description ||
        `${title} from The Stems Flowers Nairobi. Same-day delivery across Nairobi.`
    ).slice(0, 5000);

    const images = (product.images || []).filter(Boolean);
    const imageLink = toAbsoluteImageUrl(images[0]);
    const additionalImages = images
      .slice(1, 11)
      .map((img) => toAbsoluteImageUrl(img))
      .join(",");

    const regularPrice = product.price;
    const sale =
      typeof product.sale_price === "number" &&
      product.sale_price > 0 &&
      product.sale_price < regularPrice
        ? product.sale_price
        : null;

    // User requirement: all products active + available for Commerce Manager
    const inventory =
      typeof product.stock === "number" && product.stock > 0 ? product.stock : 100;

    return [
      csvEscape(product.sku || product.slug || product.id),
      csvEscape(title),
      csvEscape(description || title),
      "in stock",
      "new",
      csvEscape(kesPrice(regularPrice)),
      csvEscape(absoluteUrl(`/product/${product.slug}`)),
      csvEscape(imageLink),
      csvEscape(SHOP_INFO.name),
      csvEscape(additionalImages),
      csvEscape(GOOGLE_CATEGORY[product.category] || "Arts & Entertainment > Party & Celebration > Gift Giving"),
      csvEscape(productType(product)),
      sale ? csvEscape(kesPrice(sale)) : "",
      csvEscape(product.category),
      csvEscape(product.category),
      csvEscape((product.tags || []).slice(0, 3).join("|") || "nairobi"),
      String(inventory),
      "active",
      String(inventory),
    ].join(",");
  });

  return `${headers.join(",")}\n${rows.join("\n")}\n`;
}

export function metaCatalogFilename(): string {
  return "meta-catalog.csv";
}

export function metaCatalogBrandLine(): string {
  return SITE_NAME;
}
