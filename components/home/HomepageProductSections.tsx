import { Suspense } from "react";
import HomeProductSection, {
  HomeProductSectionSkeleton,
} from "@/components/home/HomeProductSection";
import type { Product } from "@/lib/db";
import { getCachedAllProducts } from "@/lib/cache";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import { pickUniqueProducts } from "@/lib/productDisplay";
import { getHomepageProductSections } from "@/lib/homepage-sections";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";
import { stableSortByKey } from "@/lib/seo";

function filterByTags(products: Product[], tags: string[]) {
  if (tags.length === 0) return products;
  return products.filter(
    (product) =>
      product.tags &&
      tags.some((tag) =>
        product.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
      )
  );
}

async function HomepageProductSectionsInner() {
  const allProducts = await getCachedAllProducts();

  const dbFlowers = allProducts.filter((p) => p.category === "flowers");
  const dbHampers = allProducts.filter((p) => p.category === "hampers");
  const dbTeddy = allProducts.filter((p) => p.category === "teddy");

  const predefinedFlowers = getPredefinedProducts("flowers");
  const dbFlowerSlugs = new Set(dbFlowers.map((p) => p.slug));
  const uniquePredefinedFlowers = predefinedFlowers.filter(
    (p) => !dbFlowerSlugs.has(p.slug)
  );
  const allFlowers = [...dbFlowers, ...uniquePredefinedFlowers];

  const now = new Date().toISOString();
  const HAMPER_FALLBACK: Product[] = [
    {
      id: "hamper-gentlepaw-hamper",
      slug: "gentlepaw-hamper",
      title: "GentlePaw Hamper",
      price: 2050000,
      images: ["/images/products/hampers/GiftAmper3.jpg"],
      short_description:
        "100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch",
      description:
        "100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch",
      category: "hampers",
      tags: [],
      created_at: now,
      updated_at: now,
    },
    {
      id: "hamper-signature-celebration-basket",
      slug: "signature-celebration-basket",
      title: "Signature Celebration Basket",
      price: 1050000,
      images: ["/images/products/hampers/GiftAmper6.jpg"],
      short_description: "Luxury gift hamper with curated items",
      description: "Luxury gift hamper with curated items",
      category: "hampers",
      tags: [],
      created_at: now,
      updated_at: now,
    },
  ];

  const TEDDY_FALLBACK: Product[] = [
    {
      id: "teddy-dream-soft-teddy",
      slug: "dream-soft-teddy",
      title: "Dream Soft Teddy",
      price: 250000,
      images: ["/images/products/teddies/Teddybear1.jpg"],
      short_description:
        "25cm pink teddy bear. Available in brown, white, red, pink, and blue.",
      description:
        "25cm pink teddy bear. Available in brown, white, red, pink, and blue.",
      category: "teddy",
      tags: [],
      created_at: now,
      updated_at: now,
    },
    {
      id: "teddy-fluffyjoy-bear",
      slug: "fluffyjoy-bear",
      title: "FluffyJoy Bear",
      price: 450000,
      images: ["/images/products/teddies/TeddyBears1.jpg"],
      short_description:
        "50cm teddy bear. Available in brown, white, red, pink, and blue.",
      description:
        "50cm teddy bear. Available in brown, white, red, pink, and blue.",
      category: "teddy",
      tags: [],
      created_at: now,
      updated_at: now,
    },
    {
      id: "teddy-tender-heart-bear",
      slug: "tender-heart-bear",
      title: "Tender Heart Bear",
      price: 1250000,
      images: ["/images/products/teddies/TeddyBears3.jpg"],
      short_description:
        "120cm teddy bear with customized Stanley mug. Available in brown, white, red, pink, and blue.",
      description:
        "120cm teddy bear with customized Stanley mug. Available in brown, white, red, pink, and blue.",
      category: "teddy",
      tags: [],
      created_at: now,
      updated_at: now,
    },
  ];

  const allHampers = dbHampers.length > 0 ? dbHampers : HAMPER_FALLBACK;
  const allTeddy = dbTeddy.length > 0 ? dbTeddy : TEDDY_FALLBACK;

  const flowerPool = stableSortByKey(allFlowers);
  const hamperPool = stableSortByKey(allHampers);
  const teddyPool = stableSortByKey(allTeddy);
  const mixedPool = stableSortByKey([...flowerPool, ...hamperPool, ...teddyPool]);
  const usedOnHomepage = new Set<string>();

  const anniversaryProducts = pickUniqueProducts(
    filterByTags(mixedPool, ["anniversary"]).length
      ? filterByTags(mixedPool, ["anniversary"])
      : mixedPool,
    8,
    usedOnHomepage
  );
  const birthdayProducts = pickUniqueProducts(
    filterByTags(mixedPool, ["birthday"]).length
      ? filterByTags(mixedPool, ["birthday"])
      : mixedPool,
    8,
    usedOnHomepage
  );
  const sameDayFlowers = pickUniqueProducts(flowerPool, 8, usedOnHomepage);
  const apologyFlowers = pickUniqueProducts(
    filterByTags(flowerPool, ["apology", "sorry"]).length
      ? filterByTags(flowerPool, ["apology", "sorry"])
      : flowerPool,
    8,
    usedOnHomepage
  );
  const giftHampers = pickUniqueProducts(hamperPool, 8, usedOnHomepage);
  const teddyBears = pickUniqueProducts(teddyPool, 8, usedOnHomepage);

  const allCatalogueProducts = [...allFlowers, ...allHampers, ...allTeddy];
  const seenProductIds = new Set<string>();
  const uniqueCatalogueProducts = allCatalogueProducts.filter((p) => {
    if (seenProductIds.has(p.id)) return false;
    seenProductIds.add(p.id);
    return true;
  });

  const configuredHomepageSections = isSupabaseConfigured()
    ? await getHomepageProductSections(uniqueCatalogueProducts)
    : [];

  if (configuredHomepageSections.length > 0) {
    return (
      <>
        {configuredHomepageSections.map((section, index) => (
          <HomeProductSection
            key={section.key}
            title={section.title}
            products={section.products}
            bgColor="bg-brand-blush"
            linkHref={section.linkHref}
            eagerImages={index === 0}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <HomeProductSection
        title="Anniversary Gifts - Celebrate Love, Every Year"
        products={anniversaryProducts}
        bgColor="bg-brand-blush"
        linkHref="/collections/flowers?tags=anniversary"
        eagerImages
      />
      <HomeProductSection
        title="Birthday Surprises - Make Their Day Extraordinary"
        products={birthdayProducts}
        bgColor="bg-brand-blush"
        linkHref="/birthday-flowers-nairobi"
      />
      <HomeProductSection
        title="Same-Day Flower Delivery - Express Your Feelings Today"
        products={sameDayFlowers}
        bgColor="bg-brand-blush"
        linkHref="/collections/flowers"
      />
      <HomeProductSection
        title="Apology Flowers - Say Sorry with Beautiful Blooms"
        products={apologyFlowers}
        bgColor="bg-brand-blush"
        linkHref="/apology-flowers-nairobi"
      />
      <HomeProductSection
        title="Premium Gift Hampers - Thoughtful Combinations"
        products={giftHampers}
        bgColor="bg-brand-blush"
        linkHref="/collections/gift-hampers"
      />
      <HomeProductSection
        title="Cuddly Teddy Bears - Warm Hugs, Lasting Memories"
        products={teddyBears}
        bgColor="bg-brand-blush"
        linkHref="/collections/teddy-bears"
      />
    </>
  );
}

export default function HomepageProductSections() {
  return (
    <Suspense fallback={<HomeProductSectionSkeleton />}>
      <HomepageProductSectionsInner />
    </Suspense>
  );
}
