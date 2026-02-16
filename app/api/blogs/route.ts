import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/blogData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const tag = searchParams.get("tag") ?? undefined;
    const featuredParam = searchParams.get("featured");
    const featured = featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;

    const posts = await getBlogPosts({ category, tag, featured });
    // Return in API shape (snake_case for compatibility)
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
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

