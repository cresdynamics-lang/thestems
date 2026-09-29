import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { mapBlogPost } from "@/lib/blog-admin-service";
import { blogUpdateFromBody } from "@/lib/blog-write";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const { data, error } = await (supabaseAdmin
      .from("blog_posts") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ message: error.message || "Failed to fetch blog post" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(mapBlogPost(data));
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const updateData = blogUpdateFromBody(body);

    const { data, error } = await (supabaseAdmin
      .from("blog_posts") as any)
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message || "Failed to update blog post" }, { status: 400 });
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(mapBlogPost(data));
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const { data: existing, error: fetchError } = await (supabaseAdmin
      .from("blog_posts") as any)
      .select("slug")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ message: fetchError.message || "Failed to fetch blog post" }, { status: 400 });
    }

    const { error } = await (supabaseAdmin
      .from("blog_posts") as any)
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ message: error.message || "Failed to delete blog post" }, { status: 400 });
    }

    revalidatePath("/blog");
    if (existing?.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ message: "Blog post deleted" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
