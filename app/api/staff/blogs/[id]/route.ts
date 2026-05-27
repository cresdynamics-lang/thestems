import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { getBlogPostById, mapBlogPost } from "@/lib/blog-admin-service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;

    const { data, error } = await getBlogPostById(id);

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch blog post" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(mapBlogPost(data as Parameters<typeof mapBlogPost>[0]));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to fetch blog post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;
    const body = await request.json();

    const {
      slug,
      title,
      excerpt,
      content,
      author,
      publishedAt,
      image,
      category,
      tags,
      readTime,
      featured,
    } = body;

    const updateData: Record<string, unknown> = {
      slug,
      title,
      excerpt,
      content,
      author: author || "The Stems Team",
      image,
      category,
      tags: Array.isArray(tags) ? tags : [],
      read_time: typeof readTime === "number" ? readTime : undefined,
      featured,
    };

    if (publishedAt) {
      updateData.published_at = new Date(publishedAt).toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to update blog post" },
        { status: 400 }
      );
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to update blog post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireStaff(request);
    const { id } = await params;

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("blog_posts")
      .select("slug")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { message: fetchError.message || "Failed to fetch blog post" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to delete blog post" },
        { status: 400 }
      );
    }

    revalidatePath("/blog");
    if (existing?.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }

    return NextResponse.json({ message: "Blog post deleted" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to delete blog post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
