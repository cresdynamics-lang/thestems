import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getBlogPosts } from "@/lib/blogData";
import { BLOG_FALLBACK } from "@/lib/blog-fallback";

export function HomeBlogSectionSkeleton() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-brand-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-brand-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomeBlogSection() {
  const posts = await getBlogPosts();
  const allPosts = posts.length > 0 ? posts : BLOG_FALLBACK;
  const latestPosts = allPosts.slice(0, 8);

  return (
    <section className="py-10 md:py-14 lg:py-16 bg-brand-blush relative overflow-hidden">
      {/* Magazine-style background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
           }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900">
            Latest from Our Blog
          </h2>
          <Link
            href="/blog"
            className="text-brand-red hover:text-brand-red/80 font-medium text-base md:text-lg transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-3 md:gap-5 lg:gap-6 pb-4 scrollbar-thin scrollbar-thumb-brand-gray-300 scrollbar-track-transparent -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex-shrink-0 w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] xs:min-w-[140px] xs:max-w-[140px] sm:min-w-[280px] sm:max-w-[300px] md:w-[320px] card overflow-hidden group hover:shadow-cardHover transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-gray-100">
                <Image
                  src={post.image || "/images/products/flowers/BouquetFlowers3.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 280px, 320px"
                  loading="lazy"
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="text-xs text-brand-gray-500 mb-2">
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </div>
                <h3 className="font-heading font-semibold text-base md:text-lg text-brand-gray-900 mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-brand-gray-600 text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="text-brand-green font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
