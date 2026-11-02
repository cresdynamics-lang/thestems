import { revalidatePath, revalidateTag } from "next/cache";

const CATALOGUE_PATHS = [
  "/",
  "/collections",
  "/collections/flowers",
  "/collections/teddy-bears",
  "/collections/gift-hampers",
  "/collections/wines",
  "/collections/chocolates",
  "/collections/cards",
];

/** Expire product caches now, so the next visitor sees the change rather than a stale page. */
export function revalidateProductPages(slug?: string) {
  revalidateTag("products", { expire: 0 });
  CATALOGUE_PATHS.forEach((p) => revalidatePath(p));
  if (slug) {
    revalidatePath(`/product/${slug}`);
  } else {
    revalidatePath("/product/[slug]", "page");
  }
}
