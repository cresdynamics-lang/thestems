/** Shared mapping for blog create/update payloads (admin + staff APIs). */

export type BlogWriteBody = {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  publishedAt?: string;
  image?: string;
  category?: string;
  tags?: unknown;
  readTime?: number;
  featured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
};

function cleanOptional(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function blogInsertFromBody(body: BlogWriteBody) {
  return {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    author: body.author || "The Stems Team",
    published_at: body.publishedAt
      ? new Date(body.publishedAt).toISOString()
      : new Date().toISOString(),
    image: body.image,
    category: body.category,
    tags: Array.isArray(body.tags) ? body.tags : [],
    read_time: typeof body.readTime === "number" ? body.readTime : 5,
    featured: !!body.featured,
    meta_title: cleanOptional(body.metaTitle),
    meta_description: cleanOptional(body.metaDescription),
    focus_keyword: cleanOptional(body.focusKeyword),
  };
}

export function blogUpdateFromBody(body: BlogWriteBody) {
  const updateData: Record<string, unknown> = {
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    author: body.author || "The Stems Team",
    image: body.image,
    category: body.category,
    tags: Array.isArray(body.tags) ? body.tags : [],
    read_time: typeof body.readTime === "number" ? body.readTime : undefined,
    featured: body.featured,
    meta_title: cleanOptional(body.metaTitle),
    meta_description: cleanOptional(body.metaDescription),
    focus_keyword: cleanOptional(body.focusKeyword),
  };

  if (body.publishedAt) {
    updateData.published_at = new Date(body.publishedAt).toISOString();
  }

  return updateData;
}
