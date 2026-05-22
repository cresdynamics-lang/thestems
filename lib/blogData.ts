import { supabase } from "./supabase";
import {
  formatSupabaseError,
  isSupabaseConfigured,
  warnIfSupabaseNotConfigured,
} from "./supabaseConfig";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
}

// Database interface (matches Supabase schema)
export interface BlogPostDB {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image: string;
  category: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// Convert DB format to app format
export function convertBlogPost(dbPost: BlogPostDB): BlogPost {
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    author: dbPost.author,
    publishedAt: dbPost.published_at,
    image: dbPost.image,
    category: dbPost.category,
    tags: dbPost.tags || [],
    readTime: dbPost.read_time,
    featured: dbPost.featured,
  };
}

// Static blog posts — informational guides (not transactional landing pages)
const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-keep-red-roses-fresh-nairobi",
    title: "How to Keep Red Roses Fresh Longer in Nairobi's Climate",
    excerpt:
      "Practical tips for Nairobi households: trimming stems, water changes, indoor placement, and what to avoid so your roses last beyond delivery day.",
    content: `
<p>Nairobi's warm days and dry indoor air can shorten the life of cut roses. With a few simple habits, you can keep bouquets looking full and vibrant for several extra days after delivery.</p>
<h2>Start with a clean vase</h2>
<p>Wash the vase with soap, rinse well, and fill with cool water. Add the flower food sachet if your bouquet includes one.</p>
<h2>Trim stems at an angle</h2>
<p>Cut 2–3 cm off each stem under running water at a 45° angle. This helps stems absorb water efficiently.</p>
<h2>Keep roses cool and away from fruit</h2>
<p>Place the vase away from direct sun, heaters, and ripening fruit (ethylene gas speeds wilting). Change the water every two days and re-trim stems lightly.</p>
<h2>When to order fresh roses in Nairobi</h2>
<p>For the longest vase life, order from a florist who prepares bouquets the same day. Browse our <a href="/collections/flowers">fresh flower collection</a> or see <a href="/red-roses-nairobi">red roses for Nairobi delivery</a>.</p>
    `.trim(),
    author: "The Stems Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers4.jpg",
    category: "Flower Care",
    tags: ["roses", "flower care", "nairobi", "tips"],
    readTime: 5,
    featured: true,
  },
  {
    slug: "rose-colors-meaning-anniversaries",
    title: "What Different Rose Colors Mean for Anniversaries",
    excerpt:
      "Red, pink, white, and yellow roses each carry a different message. A simple guide to choosing the right anniversary bouquet in Kenya.",
    content: `
<p>Anniversary flowers are never just decorative — colour sends a message. Here is what guests and partners commonly understand in Kenya.</p>
<h2>Red roses</h2>
<p>Deep love and passion. Best for romantic milestones such as your wedding anniversary or Valentine's gestures.</p>
<h2>Pink roses</h2>
<p>Admiration, gratitude, and gentle romance. Ideal when you want something softer than all-red.</p>
<h2>White roses</h2>
<p>Purity, new beginnings, and respect. Popular for first anniversaries or formal celebrations.</p>
<h2>Yellow roses</h2>
<p>Friendship and joy — wonderful for long-term partners who want a cheerful, non-traditional palette.</p>
<h2>Ready to send anniversary flowers?</h2>
<p>See our <a href="/anniversary-flowers-nairobi">anniversary flower ideas in Nairobi</a> or shop <a href="/collections/flowers">mixed bouquets</a> with same-day delivery.</p>
    `.trim(),
    author: "The Stems Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    category: "Occasions",
    tags: ["anniversary", "roses", "meaning", "gifts"],
    readTime: 4,
    featured: true,
  },
  {
    slug: "non-alcoholic-wines-gift-hampers-guide",
    title: "A Guide to Non-Alcoholic Wines for Gift Hampers in Nairobi",
    excerpt:
      "Why alcohol-free wine works in hampers, how to pair it with chocolates and flowers, and what to look for when gifting in Kenya.",
    content: `
<p>Not every recipient drinks alcohol — yet many love the ritual of opening a beautiful bottle with a celebration meal. Non-alcoholic sparkling wines and red blends are a thoughtful hamper addition in Nairobi.</p>
<h2>Who appreciates alcohol-free wine?</h2>
<p>Colleagues, parents, guests who drive, and anyone observing personal or faith-based preferences. It keeps hampers inclusive without feeling like an afterthought.</p>
<h2>Pairing ideas</h2>
<p>Combine alcohol-free wine with Ferrero Rocher chocolates, a small flower bouquet, and a greeting card. For premium surprises, add a teddy bear or personalised mug.</p>
<h2>Shop hamper-ready wines</h2>
<p>Explore our <a href="/collections/wines">wine gifts collection</a> or the curated <a href="/collections/gift-hampers">GentlePaw Hamper</a> with flowers, teddy, and chocolates.</p>
    `.trim(),
    author: "The Stems Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/hampers/GiftAmper3.jpg",
    category: "Gift Guides",
    tags: ["wine", "hampers", "non-alcoholic", "gifts"],
    readTime: 5,
    featured: true,
  },
  {
    slug: "fresh-flowers-nairobi-same-day-delivery",
    title: "How Same-Day Flower Delivery Works in Nairobi",
    excerpt:
      "Cut-off times, delivery zones, and what happens after you pay — a clear guide to ordering flowers online in Nairobi.",
    content: `
<p>Same-day delivery sounds simple, but knowing the process helps you plan surprises without stress.</p>
<h2>Order before the cut-off</h2>
<p>At The Stems, orders placed by 4PM on weekdays can reach most Nairobi neighbourhoods the same day. CBD deliveries are typically fastest.</p>
<h2>What we need from you</h2>
<p>Recipient name, phone number, and a precise address (estate, building, floor). Add delivery instructions for gated communities.</p>
<h2>Payment and confirmation</h2>
<p>M-Pesa checkout confirms instantly. Our florists then prepare your bouquet at Delta Hotel, University Way, and dispatch a rider.</p>
<p>Read more on our <a href="/same-day-flower-delivery-nairobi">same-day delivery page</a> or browse <a href="/collections/flowers">flowers</a>.</p>
    `.trim(),
    author: "The Stems Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers5.jpg",
    category: "Delivery Guide",
    tags: ["delivery", "nairobi", "flowers", "how-to"],
    readTime: 4,
    featured: false,
  },
  {
    slug: "wedding-flowers-nairobi-the-stems",
    title: "How to Plan Wedding Flowers on a Budget in Nairobi",
    excerpt:
      "Prioritise bridal bouquets, simplify centrepieces, and book early — practical wedding flower planning for Kenyan couples.",
    content: `
<p>Wedding flowers set the mood, but costs add up quickly. Start with three priorities: bridal bouquet, ceremony focal point, and one reception feature (head table or entrance).</p>
<h2>Choose seasonal blooms</h2>
<p>Roses, gypsophila, and greens stay available year-round in Nairobi and photograph beautifully.</p>
<h2>Book a consultation early</h2>
<p>Share inspiration photos, venue access times, and your colour palette. We prepare quotes based on stem counts, not vague ranges.</p>
<p>Explore <a href="/wedding-flowers-nairobi">wedding flowers at The Stems</a> or <a href="/contact">contact our florists</a>.</p>
    `.trim(),
    author: "The Stems Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/weddingblog.jpeg",
    category: "Wedding",
    tags: ["wedding", "planning", "nairobi", "budget"],
    readTime: 5,
    featured: false,
  },
  {
    slug: "birthday-flowers-gift-hampers-nairobi",
    title: "How to Pick Birthday Flowers Based on Personality",
    excerpt:
      "Outgoing, romantic, or minimalist? Match bouquet style and colour to the person you're celebrating in Nairobi.",
    content: `
<p>The best birthday flowers reflect who you're celebrating — not just what is in season.</p>
<h2>For the romantic</h2>
<p>Red or pink roses with a handwritten card. Add chocolates for a classic surprise.</p>
<h2>For the fun-loving friend</h2>
<p>Mixed bright bouquets or a teddy-and-flower combo hamper.</p>
<h2>For the minimalist</h2>
<p>Single-colour roses in a simple wrap — elegant without feeling over the top.</p>
<p>Shop <a href="/birthday-flowers-nairobi">birthday flowers in Nairobi</a> or <a href="/collections/gift-hampers">gift hampers</a>.</p>
    `.trim(),
    author: "The Stems Team",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/hampers/GiftAmper6.jpg",
    category: "Birthday",
    tags: ["birthday", "flowers", "personality", "gifts"],
    readTime: 4,
    featured: false,
  },
];

async function getDatabaseBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    warnIfSupabaseNotConfigured("getBlogPosts");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts from database:", formatSupabaseError(error));
      return [];
    }

    return (data as BlogPostDB[]).map(convertBlogPost);
  } catch (error) {
    console.error("Unexpected error fetching blog posts from database:", formatSupabaseError(error));
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  // 1. Try database first
  if (!isSupabaseConfigured()) {
    const staticPost = STATIC_BLOG_POSTS.find((p) => p.slug === slug);
    return staticPost ?? undefined;
  }

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      return convertBlogPost(data as BlogPostDB);
    }
  } catch (error) {
    console.error("Error fetching blog post from database:", formatSupabaseError(error));
  }

  // 2. Fallback to static posts
  const staticPost = STATIC_BLOG_POSTS.find((p) => p.slug === slug);
  return staticPost ?? undefined;
}

export async function getBlogPosts(filters?: {
  category?: string;
  tag?: string;
  featured?: boolean;
}): Promise<BlogPost[]> {
  // Merge database posts (primary) with static posts (fallback/seed), de-duplicated by slug
  const [dbPosts, staticPosts] = await Promise.all([
    getDatabaseBlogPosts(),
    Promise.resolve(STATIC_BLOG_POSTS),
  ]);

  const combinedMap = new Map<string, BlogPost>();
  // Prefer DB posts when slugs collide
  for (const post of staticPosts) {
    combinedMap.set(post.slug, post);
  }
  for (const post of dbPosts) {
    combinedMap.set(post.slug, post);
  }

  let posts = Array.from(combinedMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (filters?.category) {
    posts = posts.filter((p) => p.category.toLowerCase() === filters!.category!.toLowerCase());
  }
  if (filters?.tag) {
    posts = posts.filter((p) => p.tags.some((t) => t.toLowerCase() === filters!.tag!.toLowerCase()));
  }
  if (filters?.featured !== undefined) {
    posts = posts.filter((p) => p.featured === filters!.featured);
  }

  return posts;
}

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  return Array.from(new Set(posts.map((post) => post.category)));
}

export async function getBlogTags(): Promise<string[]> {
  const posts = await getBlogPosts();
  return Array.from(new Set(posts.flatMap((post) => post.tags)));
}
