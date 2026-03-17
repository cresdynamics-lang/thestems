import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Public endpoint: returns active hero slides for homepage
export async function GET() {
  try {
    const { data, error } = await (supabaseAdmin
      .from("hero_slides") as any)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[Hero] Failed to fetch hero slides:", error);
      return NextResponse.json(
        { message: "Failed to fetch hero slides" },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("[Hero] Unexpected error:", err);
    return NextResponse.json(
      { message: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

