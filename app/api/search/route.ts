import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], count: 0, query: "" });
    }

    const searchTerm = query.trim().toLowerCase();
    const dbProducts = await getProducts({});

    const predefinedFlowers = getPredefinedProducts("flowers");
    const predefinedWines = getPredefinedProducts("wines");
    const predefinedChocolates = getPredefinedProducts("chocolates");
    const allPredefined = [...predefinedFlowers, ...predefinedWines, ...predefinedChocolates];

    const dbSlugs = new Set(dbProducts.map((p) => p.slug));
    const uniquePredefined = allPredefined.filter((p) => !dbSlugs.has(p.slug));
    const allProducts = [...dbProducts, ...uniquePredefined];

    const matchingProducts = allProducts.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
      const shortDescriptionMatch = product.short_description?.toLowerCase().includes(searchTerm);
      const tagsMatch = product.tags?.some((tag) => tag.toLowerCase().includes(searchTerm));
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      const slugMatch = product.slug.toLowerCase().includes(searchTerm);

      return (
        titleMatch ||
        descriptionMatch ||
        shortDescriptionMatch ||
        tagsMatch ||
        categoryMatch ||
        slugMatch
      );
    });

    // Prefer title matches first, then others
    matchingProducts.sort((a, b) => {
      const aTitle = a.title.toLowerCase().startsWith(searchTerm) ? 0 : a.title.toLowerCase().includes(searchTerm) ? 1 : 2;
      const bTitle = b.title.toLowerCase().startsWith(searchTerm) ? 0 : b.title.toLowerCase().includes(searchTerm) ? 1 : 2;
      return aTitle - bTitle;
    });

    const limitedResults = matchingProducts.slice(0, 16);

    const response = NextResponse.json({
      results: limitedResults,
      count: matchingProducts.length,
      query: query.trim(),
    });
    response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to search products";
    console.error("Search error:", error);
    return NextResponse.json({ message, results: [], count: 0 }, { status: 500 });
  }
}
