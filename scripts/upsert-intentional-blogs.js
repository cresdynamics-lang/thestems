#!/usr/bin/env node
/**
 * Upsert SEO pillar + intentional blogs into Postgres.
 * Usage: DATABASE_URL=postgres://... node scripts/upsert-intentional-blogs.js
 */
const { Client } = require("pg");

function loadPosts() {
  const posts = [];
  try {
    posts.push(...require("./seo-pillar-blogs-data.js"));
  } catch (e) {
    console.warn("seo-pillar-blogs-data.js missing:", e.message);
  }
  try {
    posts.push(...require("./intentional-blogs-data.js"));
  } catch (e) {
    console.warn("intentional-blogs-data.js missing:", e.message);
  }
  // Prefer first occurrence of a slug (pillars first)
  const map = new Map();
  for (const p of posts) {
    if (p?.slug && !map.has(p.slug)) map.set(p.slug, p);
  }
  return [...map.values()];
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    console.error("Set DATABASE_URL");
    process.exit(1);
  }
  const posts = loadPosts();
  if (!posts.length) {
    console.error("No posts loaded");
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    for (const p of posts) {
      await client.query(
        `INSERT INTO blog_posts (
          slug, title, excerpt, content, author, published_at, image, category,
          tags, read_time, featured, meta_title, meta_description, focus_keyword,
          updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6::timestamptz,$7,$8,$9,$10,$11,$12,$13,$14, NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          author = EXCLUDED.author,
          published_at = EXCLUDED.published_at,
          image = EXCLUDED.image,
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          read_time = EXCLUDED.read_time,
          featured = EXCLUDED.featured,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          focus_keyword = EXCLUDED.focus_keyword,
          updated_at = NOW()`,
        [
          p.slug,
          p.title,
          p.excerpt,
          p.content,
          p.author || "The Stems Team",
          p.publishedAt
            ? new Date(p.publishedAt).toISOString()
            : new Date().toISOString(),
          p.image,
          p.category,
          p.tags || [],
          p.readTime || 5,
          !!p.featured,
          p.metaTitle || null,
          p.metaDescription || null,
          p.focusKeyword || null,
        ]
      );
      console.log("upserted", p.slug, "len", (p.content || "").length);
    }

    const { rows } = await client.query(
      `SELECT slug, length(content) AS len, left(meta_title, 55) AS meta
       FROM blog_posts
       WHERE slug = ANY($1::text[])
       ORDER BY slug`,
      [posts.map((p) => p.slug)]
    );
    console.table(rows);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
