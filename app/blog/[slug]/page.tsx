import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getBlogPost, getBlogPosts } from "@/lib/blogData";
import { markdownToHtml } from "@/lib/markdown";
import JsonLd from "@/components/JsonLd";
import SeoInternalLinks from "@/components/SeoInternalLinks";
import { whatsappUrl } from "@/lib/contact";
import { resolveBlogTopicChain } from "@/lib/seoLinkMatrix";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return {};

  const rawTitle = (post.metaTitle || post.title).trim();
  const title =
    rawTitle.length <= 55
      ? `${rawTitle} | The Stems`
      : `${rawTitle.slice(0, 52).trim()}… | The Stems`;
  const description = (
    post.metaDescription ||
    post.excerpt ||
    `Flower and gift tips from The Stems Flowers — Nairobi florist at Delta Hotel, University Way. Same-day delivery across CBD, Westlands, Karen and Kilimani.`
  ).slice(0, 160);
  const keywords = [
    post.focusKeyword,
    ...(post.tags || []),
    "florist Nairobi",
    "flower delivery Nairobi",
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: post.image ? [{ url: post.image.startsWith("http") ? post.image : `${baseUrl}${post.image}` }] : [],
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const topicChain = resolveBlogTopicChain({
    slug: post.slug,
    title: post.title,
    category: post.category,
    tags: post.tags,
    focusKeyword: post.focusKeyword,
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: `${baseUrl}${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    keywords: post.focusKeyword || (post.tags || []).join(", "),
    author: {
      "@type": "Person",
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Florist",
      name: "The Stems Flowers",
      url: baseUrl,
      telephone: "+254725707143",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Delta Hotel Building, University Way",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo/thestemslogo.jpeg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <article className="min-h-screen bg-brand-blush">
        {/* Breadcrumb */}
        <div className="bg-brand-blush border-b border-brand-gray-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-brand-gray-600">
              <Link href="/" className="hover:text-brand-green transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-brand-green transition-colors">
                Blog
              </Link>
              <span>/</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4 md:mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-gray-600 mb-8">
            <span className="font-medium text-brand-gray-800">{post.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>
              Published {format(new Date(post.publishedAt), "MMM d, yyyy")}
            </time>
            <span aria-hidden>·</span>
            <span>Last updated {format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
            <span aria-hidden>·</span>
            <span>{post.readTime} min read</span>
          </div>

          {/* Article Image */}
          <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-lg bg-brand-gray-100 mb-8 md:mb-12">
            <Image
              src={post.image}
              alt={
                post.focusKeyword
                  ? `${post.focusKeyword} — ${post.title}`
                  : post.title
              }
              fill
              className="object-cover"
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brand-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-brand-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline prose-strong:text-brand-gray-900 prose-strong:font-semibold prose-ul:text-brand-gray-700 prose-ol:text-brand-gray-700 prose-li:text-brand-gray-700 prose-li:mb-2 prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-6 prose-ol:ml-6 prose-table:w-full prose-table:text-sm prose-th:bg-brand-gray-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-brand-gray-200 prose-th:border prose-th:border-brand-gray-200 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />

          <div className="mt-10 rounded-xl border border-brand-gray-200 bg-white p-5 md:p-6">
            <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-gray-900 mb-2">
              Ready to send flowers or a gift today?
            </h2>
            <p className="text-brand-gray-700 text-sm md:text-base mb-4">
              Order on WhatsApp or continue through this gift path from the article.
            </p>
            <div className="flex flex-wrap gap-3 mb-2">
              <a
                href={whatsappUrl(topicChain.whatsappPrompt)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto justify-center items-center rounded-md bg-brand-green px-4 py-3 text-sm font-medium text-white hover:bg-brand-green/90"
              >
                Order on WhatsApp
              </a>
              {topicChain.chain.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex w-full sm:w-auto justify-center items-center rounded-md border border-brand-gray-300 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:bg-brand-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <SeoInternalLinks title={topicChain.title} links={topicChain.chain} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-brand-gray-200">
              <h3 className="font-heading font-semibold text-lg text-brand-gray-900 mb-4">
                Explore more
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-brand-gray-100 hover:bg-brand-green hover:text-white text-brand-gray-700 text-sm rounded-md transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-brand-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-brand-green font-medium hover:gap-2 transition-all group"
            >
              <svg
                className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
