import type { Product } from "@/lib/db";
import { pickUniqueProducts } from "@/lib/productDisplay";
import { stableSortByKey } from "@/lib/seo";

const SECTION_SIZE = 8;

export function getProductRecommendations(current: Product, allProducts: Product[]) {
  const catalogue = allProducts.filter((p) => p.id !== current.id);
  const used = new Set<string>([current.id]);

  const sameCategory = stableSortByKey(
    catalogue.filter((p) => p.category === current.category)
  );

  const sharedTags =
    current.tags?.length > 0
      ? catalogue.filter(
          (p) =>
            p.id !== current.id &&
            p.tags?.some((t) => current.tags.some((ct) => ct.toLowerCase() === t.toLowerCase()))
        )
      : [];

  const youMayAlsoLike = pickUniqueProducts(
    sharedTags.length > 0 ? [...sharedTags, ...sameCategory] : sameCategory,
    SECTION_SIZE,
    used
  );

  const crossCategory = stableSortByKey(
    catalogue.filter((p) => p.category !== current.category)
  );

  const othersAlsoOrder = pickUniqueProducts(crossCategory, SECTION_SIZE, used);

  return { youMayAlsoLike, othersAlsoOrder };
}
