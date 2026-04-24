import { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import ProductDetailClient from "./ProductDetailClient";
import { getProductBySlug } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";
  const title = `${product.title} — ${product.category === "flowers" ? "Flowers" : product.category === "teddy" ? "Teddy Bears" : product.category === "hampers" ? "Gift Hampers" : "Gifts"} Delivered in Nairobi | The Stems Flowers`;
  const description = `${
    product.short_description || product.description || product.title
  } — Same-day delivery across Nairobi. Pay with M-Pesa and order from The Stems Flowers at Delta Hotel, University Way, Nairobi CBD.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images:
        product.images && product.images.length > 0
          ? [
              {
                url: product.images[0].startsWith("http") ? product.images[0] : `${baseUrl}${product.images[0]}`,
              },
            ]
          : [],
      url: `${baseUrl}/product/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const { data, error } = await supabase.from("products").select("slug");
  if (error || !data) return [];
  return data.map((p: { slug: string }) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const categoryMap: Record<string, string> = {
    flowers: "Florist",
    teddy: "Toy",
    hampers: "Gift",
    wines: "Wine",
    chocolates: "Food",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: `${baseUrl}/collections`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category === "flowers" ? "Flowers" : product.category === "teddy" ? "Teddy Bears" : product.category === "hampers" ? "Gift Hampers" : product.category === "wines" ? "Wines" : "Chocolates",
        item: `${baseUrl}/collections/${product.category === "flowers" ? "flowers" : product.category === "teddy" ? "teddy-bears" : product.category === "hampers" ? "gift-hampers" : product.category === "wines" ? "wines" : "chocolates"}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.short_description,
    image: product.images && product.images.length > 0 ? product.images[0] : undefined,
    brand: { "@type": "Brand", name: "The Stems Flowers" },
    offers: {
      "@type": "Offer",
      price: product.price / 100,
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
      url: productUrl,
      areaServed: { "@type": "City", name: "Nairobi" },
      availableDeliveryMethod: "https://schema.org/DeliveryModeOnSitePickup",
      seller: {
        "@type": "LocalBusiness",
        name: "The Stems Flowers",
        address: "Delta Hotel, University Way, Nairobi CBD",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-12 bg-brand-blush">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ImageGallery images={product.images} productName={product.title} category={product.category} />
            </div>

            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
                {product.title} — Nairobi Flowers & Gifts
              </h1>

              <div className="mb-6">
                <p className="font-mono font-semibold text-brand-green text-3xl mb-2">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {product.short_description && (
                <p className="text-brand-gray-700 mb-6 text-lg">{product.short_description}</p>
              )}

              {product.description && (
                <div className="mb-6">
                  <h2 className="font-heading font-semibold text-xl mb-3">Description</h2>
                  <div
                    className="text-brand-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br />") }}
                  />
                </div>
              )}

              {product.category === "teddy" && (
                <div className="mb-6 space-y-2">
                  {product.teddy_size && (
                    <p className="text-brand-gray-700">
                      <span className="font-semibold">Size:</span> {product.teddy_size} cm
                    </p>
                  )}
                  {product.teddy_color && (
                    <p className="text-brand-gray-700">
                      <span className="font-semibold">Color:</span>{" "}
                      {product.teddy_color.charAt(0).toUpperCase() + product.teddy_color.slice(1)}
                    </p>
                  )}
                </div>
              )}

              {product.category === "hampers" && product.included_items && product.included_items.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-heading font-semibold text-xl mb-3">Included Items</h2>
                  <ul className="space-y-2">
                    {product.included_items.map((item, index) => (
                      <li key={index} className="text-brand-gray-700">
                        {item.qty}x {item.name}
                        {item.note && <span className="text-brand-gray-500"> ({item.note})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ProductDetailClient product={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

