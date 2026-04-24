import { Metadata } from "next";
import WinesPageClient from "./WinesPageClient";
import { getProducts, type Product } from "@/lib/db";
import { WINE_PRODUCTS, getPredefinedProducts } from "@/lib/predefinedProducts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Wine Gifts Nairobi from KSh 2,000 | Same-Day Delivery | The Stems",
  description:
    "Shop premium wine gifts in Nairobi from KSh 2,000. Robertson, Luc Belaire and Rosso Nobile bottles with same-day delivery in CBD and fast citywide delivery from The Stems.",
  keywords: [
    // Valentine's Wine Core Keywords
    "valentine's wine gifts Nairobi",
    "valentine's wine hampers Nairobi",
    "romantic valentine's wines Nairobi",
    "valentine's celebration wines Nairobi",
    "premium valentine's wine Nairobi",

    // Valentine's Wine Gifts
    "valentine's wine for wife Nairobi",
    "valentine's wine for husband Nairobi",
    "valentine's wine for girlfriend Nairobi",
    "romantic wine gifts valentine's Nairobi",
    "valentine's wine hampers Nairobi",

    // Valentine's Wine Types
    "valentine's belaire brut Nairobi",
    "valentine's robertson red wine Nairobi",
    "valentine's rosso nobile red wine Nairobi",
    "luxury valentine's wines Nairobi",
    "celebration wines valentine's Nairobi",

    // Valentine's Planning
    "pre valentine's wine gifts Nairobi",
    "valentine's wine delivery Nairobi",
    "early valentine's wine orders Nairobi",
    "plan valentine's wine surprise Nairobi",

    // Valentine's Delivery
    "same day valentine's wine Nairobi",
    "valentine's wine delivery CBD Nairobi",
    "valentine's wines Westlands",
    "valentine's wines Karen Nairobi",
    "valentine's wines Lavington",
    "valentine's wines Kilimani",

    // Valentine's AI Search
    "where to buy valentine's wine Nairobi",
    "best valentine's wine gifts Nairobi",
    "romantic wine hampers near me Nairobi",
    "how to surprise with valentine's wine Nairobi",

    // Valentine's Voice Search
    "order valentine's wine online Nairobi",
    "find premium wines near me Nairobi",
    "valentine's wine delivery near me",

    // Valentine's Long-tail
    "luxury valentine's wine collections Nairobi",
    "romantic valentine's wine hampers Nairobi",
    "personalized valentine's wine gifts Nairobi",
    "thoughtful valentine's celebration wines Nairobi",

    // Valentine's Seasonal
    "february valentine's wines Nairobi",
    "2025 valentine's wines Nairobi",
    "love month wines Nairobi Kenya",

    // Keeping traditional keywords
    "wines Nairobi",
    "wine gift hampers Kenya",
    "premium wines Nairobi",
    "celebration wines Kenya",
    "gift wines Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/collections/wines`,
  },
  openGraph: {
    title: "Wine Gifts Nairobi from KSh 2,000 | Same-Day Delivery",
    description: "Buy premium wines in Nairobi with same-day delivery. Robertson, Luc Belaire and Rosso Nobile available from The Stems.",
    url: `${baseUrl}/collections/wines`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wine Gifts Nairobi from KSh 2,000 | The Stems",
    description: "Order wine gifts online in Nairobi with same-day delivery. Premium bottles for celebrations and gifting.",
  },
};

// Extract just the image URLs for backward compatibility
const WINE_IMAGES = WINE_PRODUCTS.map(p => p.image);

function toAbsoluteImageUrl(imagePath?: string) {
  if (!imagePath) return `${baseUrl}/images/products/wines/Wines1.jpg`;
  return imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

function buildWinesItemListJsonLd(products: Product[]) {
  const normalized = products
    .filter((product) => product.slug && product.title && typeof product.price === "number")
    .slice(0, 12);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Wine Gifts in Nairobi",
    description: "Premium wine gifts and celebration bottles in Nairobi.",
    url: `${baseUrl}/collections/wines`,
    itemListElement: normalized.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        description: product.short_description || product.description,
        image: toAbsoluteImageUrl(product.images?.[0]),
        url: `${baseUrl}/product/${product.slug}`,
        brand: { "@type": "Brand", name: "The Stems Flowers" },
        offers: {
          "@type": "Offer",
          priceCurrency: "KES",
          price: (product.price / 100).toFixed(0),
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/product/${product.slug}`,
        },
      },
    })),
  };
}

export default async function WinesPage() {
  try {
    const dbProducts = await getProducts({ category: "wines" });
    const predefinedProducts = getPredefinedProducts("wines");
    const dbSlugs = new Set(dbProducts.map(p => p.slug));
    const uniquePredefined = predefinedProducts.filter(p => !dbSlugs.has(p.slug));
    const allProducts = [...dbProducts, ...uniquePredefined];
    const itemListJsonLd = buildWinesItemListJsonLd(allProducts);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <WinesPageClient products={allProducts} allWineImages={WINE_IMAGES} wineProducts={WINE_PRODUCTS} />
      </>
    );
  } catch (error) {
    const predefinedProducts = getPredefinedProducts("wines");
    const itemListJsonLd = buildWinesItemListJsonLd(predefinedProducts);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <WinesPageClient products={predefinedProducts} allWineImages={WINE_IMAGES} wineProducts={WINE_PRODUCTS} />
      </>
    );
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

