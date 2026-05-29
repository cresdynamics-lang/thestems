import { supabaseAdmin } from "@/lib/supabase";

export const BLOG_LIST_SELECT =
  "id, slug, title, excerpt, author, published_at, image, category, tags, read_time, featured, created_at, updated_at";

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  tags: string[] | null;
  read_time: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export function mapBlogPost(p: BlogPostRow) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content ?? "",
    author: p.author,
    published_at: p.published_at,
    image: p.image,
    category: p.category,
    tags: p.tags || [],
    read_time: p.read_time,
    featured: p.featured,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

export async function listBlogPosts(options?: {
  category?: string;
  tag?: string;
  featured?: boolean;
  includeContent?: boolean;
}) {
  const select = options?.includeContent ? "*" : BLOG_LIST_SELECT;
  let query = supabaseAdmin.from("blog_posts").select(select).order("published_at", {
    ascending: false,
  });

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.tag) {
    query = query.contains("tags", [options.tag]);
  }
  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured);
  }

  const { data, error } = await query;
  return { data: (data || []) as unknown as BlogPostRow[], error };
}

export async function getBlogPostById(id: string) {
  return supabaseAdmin.from("blog_posts").select("*").eq("id", id).single();
}
