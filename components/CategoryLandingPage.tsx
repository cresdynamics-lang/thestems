import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import SeoInternalLinks from "@/components/SeoInternalLinks";
import { getProducts, type Product } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import type { CategoryLandingConfig } from "@/lib/categoryLandings";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { whatsappUrl } from "@/lib/contact";

function scoreProduct(p: Product, keywords: string[]): number {
  if (!keywords.length) return 0;
  const hay = `${p.title} ${p.short_description || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
  return keywords.reduce((score, kw) => (hay.includes(kw.toLowerCase()) ? score + 1 : score), 0);
}

async function loadFeatured(config: CategoryLandingConfig): Promise<Product[]> {
  const limit = config.productLimit ?? 8;
  const keywords = config.preferKeywords || [];

  const lists = await Promise.all(
    config.productCategories.map(async (cat) => {
      const db = await getProducts({ category: cat });
      if (db.length > 0) return db;
      try {
        return getPredefinedProducts(cat as "flowers" | "hampers" | "teddy" | "wines" | "chocolates");
      } catch {
        return [] as Product[];
      }
    })
  );

  const merged = lists.flat();
  const ranked = [...merged].sort(
    (a, b) => scoreProduct(b, keywords) - scoreProduct(a, keywords)
  );

  // Prefer products whose tags/title match landing keywords so admin checkboxes drive grids
  const matched = keywords.length
    ? ranked.filter((p) => scoreProduct(p, keywords) > 0)
    : ranked;
  const pool = matched.length > 0 ? matched : ranked;

  const seen = new Set<string>();
  const unique: Product[] = [];
  for (const p of pool) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    unique.push(p);
    if (unique.length >= limit) break;
  }
  return unique;
}

export default async function CategoryLandingPage({
  config,
}: {
  config: CategoryLandingConfig;
}) {
  const products = await loadFeatured(config);
  const pageUrl = absoluteUrl(`/${config.slug}`);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: config.breadcrumbLabel,
        item: pageUrl,
      },
    ],
  };

  const wa = whatsappUrl(
    `Hello! I'd like to order: ${config.breadcrumbLabel}. Please help me choose.`
  );

  return (
    <div className="bg-brand-blush py-10 md:py-14 lg:py-16">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-brand-gray-500 mb-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-brand-rose-deep">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-brand-gray-800 font-medium">{config.breadcrumbLabel}</li>
          </ol>
        </nav>

        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          {config.h1}
        </h1>

        {config.intro.map((p) => (
          <p key={p.slice(0, 40)} className="text-brand-gray-700 text-base md:text-lg mb-4 max-w-3xl">
            {p}
          </p>
        ))}

        <div className="flex flex-wrap gap-3 mb-10">
          <Link href={config.ctaPrimary.href} className="btn-primary text-sm md:text-base">
            {config.ctaPrimary.label}
          </Link>
          {config.ctaSecondary ? (
            <Link href={config.ctaSecondary.href} className="btn-outline text-sm md:text-base">
              {config.ctaSecondary.label}
            </Link>
          ) : null}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-[#25D366] px-5 py-3 text-sm font-medium text-white hover:bg-[#20BA5A]"
          >
            Order on WhatsApp
          </a>
        </div>

        {products.length > 0 ? (
          <section className="mb-12" aria-labelledby="featured-heading">
            <h2
              id="featured-heading"
              className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-5"
            >
              Popular picks
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  image={product.images?.[0] || "/images/products/flowers/BouquetFlowers3.jpg"}
                  slug={product.slug}
                  shortDescription={product.short_description}
                  category={product.category}
                  images={product.images}
                />
              ))}
            </div>
          </section>
        ) : null}

        {config.sections?.map((s) => (
          <section key={s.heading} className="mb-8 max-w-3xl">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-2">
              {s.heading}
            </h2>
            <p className="text-brand-gray-700 text-base md:text-lg">{s.body}</p>
          </section>
        ))}

        <section className="mb-10 max-w-3xl" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-4"
          >
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-3">
            {config.faqs.map((f) => (
              <details
                key={f.question}
                className="rounded-lg border border-brand-gray-200 bg-white px-4 py-3"
              >
                <summary className="cursor-pointer font-medium text-brand-gray-900">
                  {f.question}
                </summary>
                <p className="mt-2 text-brand-gray-700 text-sm md:text-base">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-sm text-brand-gray-600 mb-6 max-w-3xl">
          Delivery across Nairobi including CBD, Westlands, Kilimani, Karen and Lavington. Pay with
          M-Pesa or card. The Stems Flowers — Delta Hotel, University Way.
        </p>

        <SeoInternalLinks title="Related gifts & delivery" links={config.relatedLinks} />
      </div>
    </div>
  );
}
