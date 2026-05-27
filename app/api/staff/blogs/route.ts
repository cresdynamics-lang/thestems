import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { listBlogPosts, mapBlogPost } from "@/lib/blog-admin-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const tag = searchParams.get("tag") ?? undefined;
    const featuredParam = searchParams.get("featured");
    const featured =
      featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;
    const includeContent = searchParams.get("full") === "true";

    const { data, error } = await listBlogPosts({ category, tag, featured, includeContent });

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch blog posts" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.map((p) => mapBlogPost(p)));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to fetch blog posts";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireStaff(request);
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

    const insertData = {
      slug,
      title,
      excerpt,
      content,
      author: author || "The Stems Team",
      published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      image,
      category,
      tags: Array.isArray(tags) ? tags : [],
      read_time: typeof readTime === "number" ? readTime : 5,
      featured: !!featured,
    };

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to create blog post" },
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
    const message = error instanceof Error ? error.message : "Failed to create blog post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
