import { NextRequest, NextResponse } from "next/server";
import { getBlogPost } from "@/lib/blogData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getBlogPost(slug);

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
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
