import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await (supabaseAdmin
    .from("hero_slides") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json({ message: "Failed to fetch hero slides" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();

  const { data, error } = await (supabaseAdmin
    .from("hero_slides") as any)
    .insert({
      title: body.title,
      subtitle: body.subtitle,
      image_url: body.image_url,
      cta_text: body.cta_text,
      cta_link: body.cta_link,
      sort_order: body.sort_order ?? 1,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json({ message: "Failed to create hero slide" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

