import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/db";
import { getCachedAllProducts } from "@/lib/cache";
import { getProductRecommendations } from "@/lib/relatedProducts";
import { getCategoryFallbackImage } from "@/lib/utils";

function ProductGrid({
  title,
  products,
  bgClass,
}: {
  title: string;
  products: Product[];
  bgClass: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className={`py-10 md:py-14 ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-brand-gray-900 mb-6 md:mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => {
            const imageUrl =
              product.images?.[0] || getCategoryFallbackImage(product.category);
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price}
                image={imageUrl}
                slug={product.slug}
                category={product.category}
                images={product.images}
                variantLabel={product.teddy_color}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default async function ProductRecommendations({
  product,
}: {
  product: Product;
}) {
  const allProducts = await getCachedAllProducts();
  const { youMayAlsoLike, othersAlsoOrder } = getProductRecommendations(
    product,
    allProducts
  );

  if (youMayAlsoLike.length === 0 && othersAlsoOrder.length === 0) {
    return null;
  }

  return (
    <>
      <ProductGrid
        title="You May Also Like"
        products={youMayAlsoLike}
        bgClass="bg-white"
      />
      <ProductGrid
        title="Others Also Order"
        products={othersAlsoOrder}
        bgClass="bg-brand-blush"
      />
    </>
  );
}
