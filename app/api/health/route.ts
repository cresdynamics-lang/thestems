import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/health – verify database connection.
 * Returns 200 with { database: "connected", productsCount } if Supabase is reachable.
 */
export async function GET() {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http")) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (missing.length > 0) {
    return NextResponse.json(
      {
        database: "disconnected",
        error: "Missing or invalid Supabase env vars",
        missing,
      },
      { status: 503 }
    );
  }

  try {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        {
          database: "error",
          error: error.message,
          code: error.code,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      database: "connected",
      productsCount: count ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        database: "error",
        error: err?.message ?? "Unknown error",
      },
      { status: 503 }
    );
  }
}
