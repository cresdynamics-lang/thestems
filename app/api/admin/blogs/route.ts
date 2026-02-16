import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getBlogPosts } from "@/lib/blogData";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const tag = searchParams.get("tag") ?? undefined;
    const featuredParam = searchParams.get("featured");
    const featured = featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;

    const posts = await getBlogPosts({ category, tag, featured });
    const data = posts.map((p) => ({
      id: p.slug,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      published_at: p.publishedAt,
      image: p.image,
      category: p.category,
      tags: p.tags,
      read_time: p.readTime,
      featured: p.featured,
    }));
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    // Blog posts are currently static (The Stems). To add new posts, edit lib/blogData.ts STATIC_BLOG_POSTS.
    return NextResponse.json(
      { message: "Blog posts are managed in code (lib/blogData.ts). Add or edit STATIC_BLOG_POSTS to update." },
      { status: 501 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}

