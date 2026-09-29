import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";
import { buildMetaCatalogCsv, type MetaFeedProduct } from "@/lib/metaCatalogFeed";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Live Meta Commerce Manager product feed (CSV).
 * URL: https://thestemsflowers.co.ke/feeds/meta-catalog.csv
 * All products are exported as availability=in stock and status=active.
 */
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return new NextResponse("Database not configured\n", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, title, description, short_description, price, sale_price, category, subcategory, tags, images, sku, stock, visibility"
      )
      .order("title", { ascending: true });

    if (error) {
      console.error("meta catalog feed error:", error);
      return new NextResponse("Failed to load products\n", {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const products = ((data || []) as MetaFeedProduct[]).filter((p) => {
      const visibility = (p.visibility || "published").toLowerCase();
      return visibility === "published" || visibility === "active";
    });

    const csv = buildMetaCatalogCsv(products);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'inline; filename="meta-catalog.csv"',
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (err) {
    console.error("meta catalog feed fatal:", err);
    return new NextResponse("Unexpected error\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
