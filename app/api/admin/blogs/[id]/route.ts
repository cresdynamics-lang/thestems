import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getBlogPost } from "@/lib/blogData";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const post = await getBlogPost(id);
    if (!post) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      published_at: post.publishedAt,
      image: post.image,
      category: post.category,
      tags: post.tags,
      read_time: post.readTime,
      featured: post.featured,
    });
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
    return NextResponse.json(
      { message: "Blog posts are static. Edit lib/blogData.ts STATIC_BLOG_POSTS to update." },
      { status: 501 }
    );
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
    return NextResponse.json(
      { message: "Blog posts are static. Edit lib/blogData.ts STATIC_BLOG_POSTS to remove." },
      { status: 501 }
    );
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
