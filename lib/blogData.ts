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

// Static blog posts for The Stems (no Supabase required)
const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    slug: "fresh-flowers-nairobi-same-day-delivery",
    title: "Fresh Flowers Nairobi | Same-Day Delivery by The Stems",
    excerpt: "Order fresh flowers in Nairobi with same-day delivery. The Stems delivers bouquets, roses, and arrangements across CBD, Westlands, Karen, and more.",
    content: `
<p>The Stems offers same-day flower delivery across Nairobi. Whether you need a last-minute bouquet for a birthday, anniversary, or just because, we deliver fresh, hand-arranged flowers to your door.</p>
<h2>Why Choose The Stems?</h2>
<p>We source only the freshest blooms and create arrangements that make every occasion special. Our team is based at Delta Hotel Building, University Way, Nairobi CBD—ready to serve you.</p>
<h2>How to Order</h2>
<p>Browse our collections online, add to cart, and pay via M-Pesa (Till 4202044 or Paybill 880100, Account 433587). We deliver same day in CBD and next day in other Nairobi areas. Contact us on 0725 707 143 or thestemsflowers.ke@gmail.com.</p>
    `.trim(),
    author: "The Stems",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    category: "Flowers",
    tags: ["flowers", "nairobi", "same-day", "delivery"],
    readTime: 3,
    featured: true,
  },
  {
    slug: "valentines-day-flowers-nairobi-2026",
    title: "Valentine's Day Flowers Nairobi 2026 | The Stems",
    excerpt: "Surprise your loved one with Valentine's Day flowers from The Stems. Red roses, mixed bouquets, and gift hampers with same-day delivery in Nairobi.",
    content: `
<p>Valentine's Day is the perfect time to say it with flowers. The Stems offers romantic red roses, mixed bouquets, and gift hampers with chocolates and wine—all available for delivery across Nairobi.</p>
<h2>Pre-Order for Valentine's Day</h2>
<p>Book early to secure your preferred arrangement. We deliver on Valentine's Day across Nairobi CBD, Westlands, Karen, Lavington, Kilimani, and more. Pay with M-Pesa (Till 4202044 or Paybill 880100, Account 433587) or contact us on 0725 707 143.</p>
<h2>Gift Hampers</h2>
<p>Combine flowers with chocolates, wine, or teddy bears for the ultimate Valentine's surprise. Visit our shop at Delta Hotel Building, University Way, or order online at the.stems.ke.</p>
    `.trim(),
    author: "The Stems",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    category: "Valentine",
    tags: ["valentine", "roses", "nairobi", "gifts"],
    readTime: 4,
    featured: true,
  },
  {
    slug: "wedding-flowers-nairobi-the-stems",
    title: "Wedding Flowers Nairobi | Bouquets & Decor by The Stems",
    excerpt: "Wedding bouquets, centrepieces, and venue decor in Nairobi. The Stems creates bespoke wedding floral arrangements for your big day.",
    content: `
<p>Your wedding deserves beautiful, fresh flowers. The Stems works with couples across Nairobi to create bridal bouquets, centrepieces, aisle arrangements, and full venue decor.</p>
<h2>Consultation & Quotes</h2>
<p>Contact us at thestemsflowers.ke@gmail.com or 0725 707 143 to discuss your vision. We'll provide a quote and work with your budget and colour scheme. Visit us at Delta Hotel Building, University Way, Nairobi CBD.</p>
<h2>Why The Stems?</h2>
<p>We focus on quality blooms, timely delivery, and attention to detail. From intimate ceremonies to larger celebrations, we help make your day memorable.</p>
    `.trim(),
    author: "The Stems",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    category: "Wedding",
    tags: ["wedding", "bouquets", "nairobi", "events"],
    readTime: 3,
    featured: false,
  },
  {
    slug: "birthday-flowers-gift-hampers-nairobi",
    title: "Birthday Flowers & Gift Hampers Nairobi | The Stems",
    excerpt: "Send birthday flowers and gift hampers in Nairobi. Same-day delivery, M-Pesa payment, and a wide range of bouquets and hampers from The Stems.",
    content: `
<p>Make someone's birthday special with flowers or a gift hamper from The Stems. We deliver across Nairobi—same day in CBD and next day in other areas.</p>
<h2>What We Offer</h2>
<p>Fresh bouquets, mixed arrangements, gift hampers with chocolates and wine, and teddy bears. All can be paired with a personalised message. Order online or call 0725 707 143. Pay via M-Pesa Till 4202044 or Paybill 880100, Account 433587.</p>
<h2>Visit Us</h2>
<p>Delta Hotel Building, University Way, Nairobi CBD. Mon–Sat 8AM–8PM. Email: thestemsflowers.ke@gmail.com. Find us on the map: the.stems.ke</p>
    `.trim(),
    author: "The Stems",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    category: "Birthday",
    tags: ["birthday", "flowers", "hampers", "nairobi"],
    readTime: 3,
    featured: false,
  },
  {
    slug: "corporate-gifts-flowers-nairobi",
    title: "Corporate Gifts & Flowers Nairobi | The Stems",
    excerpt: "Corporate flower arrangements and gift hampers for offices, events, and clients in Nairobi. The Stems delivers to businesses across the city.",
    content: `
<p>Impress clients and colleagues with corporate flowers and gift hampers from The Stems. We deliver to offices, events, and venues across Nairobi.</p>
<h2>Services</h2>
<p>Regular office flowers, one-off thank-you bouquets, conference and event decor, and branded gift hampers. Contact us at thestemsflowers.ke@gmail.com or 0725 707 143 for bulk orders and quotes.</p>
<h2>Payment & Delivery</h2>
<p>M-Pesa (Till 4202044, Paybill 880100 Account 433587), invoice on request. We're at Delta Hotel Building, University Way, Nairobi CBD. Mon–Sat 8AM–8PM.</p>
    `.trim(),
    author: "The Stems",
    publishedAt: new Date().toISOString().split("T")[0],
    image: "/images/products/flowers/BouquetFlowers3.jpg",
    category: "Corporate",
    tags: ["corporate", "gifts", "nairobi", "offices"],
    readTime: 3,
    featured: false,
  },
];

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const post = STATIC_BLOG_POSTS.find((p) => p.slug === slug);
  return post ?? undefined;
}

export async function getBlogPosts(filters?: {
  category?: string;
  tag?: string;
  featured?: boolean;
}): Promise<BlogPost[]> {
  let posts = [...STATIC_BLOG_POSTS].sort(
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
