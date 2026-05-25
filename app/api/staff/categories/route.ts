import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORY_LABELS } from "@/lib/staff/constants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { data } = await supabaseAdmin.from("product_categories").select("*").order("sort_order");
    if (data?.length) return NextResponse.json(data);
    return NextResponse.json(
      Object.entries(CATEGORY_LABELS).map(([db_category, name], i) => ({
        id: db_category,
        slug: db_category,
        name,
        db_category,
        sort_order: i,
      }))
    );
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireStaff(request);
    const body = await request.json();
    const { data, error } = await supabaseAdmin.from("product_categories").insert(body).select().single();
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
