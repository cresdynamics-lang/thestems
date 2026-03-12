import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    requireAdmin(request);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await (supabaseAdmin
    .from("hero_slides") as any)
    .update({
      title: body.title,
      subtitle: body.subtitle,
      image_url: body.image_url,
      cta_text: body.cta_text,
      cta_link: body.cta_link,
      sort_order: body.sort_order ?? 1,
      is_active: body.is_active ?? true,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json({ message: "Failed to update hero slide" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    requireAdmin(request);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error } = await (supabaseAdmin
    .from("hero_slides") as any)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json({ message: "Failed to delete hero slide" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

