import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff/auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { listBlogPosts, mapBlogPost } from "@/lib/blog-admin-service";
import { blogInsertFromBody } from "@/lib/blog-write";

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
    const insertData = blogInsertFromBody(body);

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
    revalidatePath("/sitemap.xml");

    return NextResponse.json(mapBlogPost(data as Parameters<typeof mapBlogPost>[0]));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Failed to create blog post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
