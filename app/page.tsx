import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import HomepageHero from "@/components/home/HomepageHero";
import HomepageProductSections from "@/components/home/HomepageProductSections";
import HomeBlogSection, { HomeBlogSectionSkeleton } from "@/components/home/HomeBlogSection";
import { SITE_URL } from "@/lib/seo";
import { HOME_SEO_KEYWORDS } from "@/lib/seo-keywords";

const baseUrl = SITE_URL;

/** ISR: cache rendered homepage for 60s (matches collection pages). */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Florist Nairobi CBD | Red Roses, Gift Hampers & Same-Day Delivery | The Stems Flowers",
  description:
    "Fresh flowers, gift hampers, wines and teddy bears delivered across Nairobi same day. Visit The Stems at Delta Hotel, University Way or order online with M-Pesa for fast delivery.",
  keywords: HOME_SEO_KEYWORDS,
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Express Love & Celebrate Moments | Anniversary Flowers, Birthday Gifts & Surprise Hampers Nairobi | The Stems Flowers",
    description: "Celebrate every moment that matters: anniversary flowers, birthday surprises, apology bouquets & thoughtful gift hampers in Nairobi. Same-day delivery across CBD, Westlands, Karen, Lavington.",
    url: baseUrl,
    siteName: "The Stems Flowers",
    images: [
      {
        url: "/images/logo/thestemslogo.jpeg",
        width: 1200,
        height: 630,
        alt: "The Stems Flowers - Express Love & Celebrate Every Moment in Nairobi",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Express Love & Celebrate Moments | Anniversary Flowers, Birthday Gifts & Surprise Hampers Nairobi",
    description: "Celebrate every moment that matters: anniversary flowers, birthday surprises, apology bouquets & thoughtful gift hampers in Nairobi. Same-day delivery across Nairobi.",
    images: ["/images/logo/thestemslogo.jpeg"],
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
  ],
};

const localBusinessHomeJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "The Stems Flowers",
  url: baseUrl,
  telephone: "+254725707143",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Delta Hotel, University Way",
    addressLocality: "Nairobi CBD",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.2833,
    longitude: 36.8172,
  },
  areaServed: { "@type": "City", name: "Nairobi" },
  openingHours: "Mo-Sa 08:00-20:00",
  description:
    "The Stems Flowers — Nairobi CBD florist at Delta Hotel, University Way. Fresh roses, flower bouquets, gift hampers and teddy bears with same-day delivery across Nairobi. Pay with M-Pesa.",
  priceRange: "$$",
  paymentAccepted: "M-Pesa, Cash, Card",
  hasMap: "https://maps.google.com/?q=Delta+Hotel+University+Way+Nairobi",
};

const homepageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is The Stems Flowers located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We are at Delta Hotel, University Way, Nairobi CBD — open Monday to Saturday 8AM to 8PM. We deliver flowers, gift hampers and teddy bears across all Nairobi.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer same-day flower delivery in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — order by 4PM for same-day delivery across Nairobi including Westlands, Karen, Kilimani, Lavington, South B and Runda.",
      },
    },
    {
      "@type": "Question",
      name: "How do I pay for flowers at The Stems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept M-Pesa (Till 4202044, Paybill 880100), card and cash at our Delta Hotel, University Way location.",
      },
    },
    {
      "@type": "Question",
      name: "What types of roses do you sell in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Red roses, pink roses, white roses, yellow roses and mixed bouquets — from small arrangements to 80-stem anniversary bouquets, delivered fresh same day across Nairobi.",
      },
    },
    {
      "@type": "Question",
      name: "Can I send apology flowers in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — our I'm Sorry collection has red roses and mixed bouquets delivered same day across Nairobi with a personal message.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={localBusinessHomeJsonLd} />
      <JsonLd data={homepageFaqJsonLd} />
      <div>
        <HomepageHero />
        <HomepageProductSections />

        {/* Explore Collections Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{
                 backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
               }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2 sm:mb-3 md:mb-4">
                Every Moment Deserves to Be Celebrated
              </h2>
              <p className="text-brand-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                Whether it's an anniversary, birthday, surprise, or apology—we help you express what words cannot. Premium flowers, luxury hampers, and cuddly teddy bears delivered same-day across Nairobi.
                <br />
                <span className="font-semibold text-brand-green">Because every feeling deserves the perfect gift.</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Gift Hampers Card */}
              <Link 
                href="/collections/gift-hampers"
                className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 overflow-hidden">
                  <Image
                    src="/images/products/hampers/GiftAmper3.jpg"
                    alt="Gift Hampers"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 text-white">
                    <h3 className="font-heading font-bold text-sm sm:text-base md:text-2xl lg:text-3xl mb-0.5 sm:mb-1 md:mb-2">Gift Hampers</h3>
                    <p className="text-xs sm:text-xs md:text-sm lg:text-base text-white/90 hidden sm:block">Thoughtful surprise packages</p>
                  </div>
                </div>
                <div className="p-2 sm:p-4 md:p-6">
                  <p className="text-brand-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-xs md:text-sm lg:text-base line-clamp-2 sm:line-clamp-none">
                    Luxury hampers with premium chocolates, wine, teddy bears, and beautiful flowers. Perfect for anniversaries, birthdays, surprises, or saying sorry. Same-day delivery across Nairobi.
                  </p>
                  <span className="inline-flex items-center text-brand-red font-semibold group-hover:gap-2 gap-1 transition-all duration-300 text-xs sm:text-xs md:text-sm">
                    Explore Hampers
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Flowers Card */}
              <Link 
                href="/collections/flowers"
                className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 overflow-hidden">
                  <Image
                    src="/images/products/flowers/BouquetFlowers3.jpg"
                    alt="Flowers"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 text-white">
                    <h3 className="font-heading font-bold text-sm sm:text-base md:text-2xl lg:text-3xl mb-0.5 sm:mb-1 md:mb-2">Fresh Flowers</h3>
                    <p className="text-xs sm:text-xs md:text-sm lg:text-base text-white/90 hidden sm:block">Express every emotion beautifully</p>
                  </div>
                </div>
                <div className="p-2 sm:p-4 md:p-6">
                  <p className="text-brand-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-xs md:text-sm lg:text-base line-clamp-2 sm:line-clamp-none">
                    Express love, celebrate anniversaries, surprise on birthdays, or say sorry with stunning roses, mixed bouquets, and elegant arrangements. Perfect for every occasion. Same-day delivery Nairobi.
                  </p>
                  <span className="inline-flex items-center text-brand-red font-semibold group-hover:gap-2 gap-1 transition-all duration-300 text-xs sm:text-xs md:text-sm">
                    Explore Flowers
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Teddy Bears Card */}
              <Link 
                href="/collections/teddy-bears"
                className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 overflow-hidden">
                  <Image
                    src="/images/products/teddies/Teddybear1.jpg"
                    alt="Teddy Bears"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 text-white">
                    <h3 className="font-heading font-bold text-sm sm:text-base md:text-2xl lg:text-3xl mb-0.5 sm:mb-1 md:mb-2">Teddy Bears</h3>
                    <p className="text-xs sm:text-xs md:text-sm lg:text-base text-white/90 hidden sm:block">Warm hugs, lasting memories</p>
                  </div>
                </div>
                <div className="p-2 sm:p-4 md:p-6">
                  <p className="text-brand-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-xs md:text-sm lg:text-base line-clamp-2 sm:line-clamp-none">
                    Soft and adorable teddy bears (25cm-200cm) perfect for birthdays, anniversaries, surprises, or just because. Available in brown, red, pink, white, and blue. A gift that brings comfort and joy.
                  </p>
                  <span className="inline-flex items-center text-brand-red font-semibold group-hover:gap-2 gap-1 transition-all duration-300 text-xs sm:text-xs md:text-sm">
                    Explore Teddy Bears
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* About The Stems Flowers Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{
                 backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
               }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text Content - Left Side */}
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4 md:mb-6 text-left">
                  About The Stems Flowers Nairobi
                </h2>
                <p className="text-brand-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed text-left">
                  Every feeling deserves the perfect expression. The Stems Flowers is a Nairobi CBD florist based at Delta Hotel,
                  University Way, specialising in fresh roses, flower bouquets, luxury gift hampers and teddy bears that help you
                  say what words cannot.
                </p>
                <p className="text-brand-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed text-left">
                  Whether you&apos;re celebrating an anniversary, surprising someone on their birthday, sending apology flowers or
                  simply showing you care — we deliver across Nairobi same day to Westlands, Karen, Kilimani, Lavington, South B,
                  Parklands and all neighbourhoods.
                </p>
                <p className="text-brand-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed text-left">
                  Pay securely with M-Pesa (Till 4202044, Paybill 880100) or card and our team will prepare every bouquet and
                  hamper with care so your message arrives beautifully.
                </p>
                <p className="text-brand-gray-600 text-sm md:text-base mb-8 md:mb-10 leading-relaxed text-left">
                  <span className="font-semibold text-brand-green">Because when words aren&apos;t enough, flowers speak volumes.</span> Our carefully curated collections ensure your sentiments are perfectly conveyed, every single time.
                </p>
                <Link
                  href="/about"
                  className="btn-primary inline-flex items-center gap-2 text-base md:text-lg px-8 md:px-10 py-3 md:py-4 hover:gap-3 transition-all duration-300"
                >
                  Learn More About Us
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Logo Image - Right Side */}
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-md md:max-w-lg">
                  <Image
                    src="/images/logo/thestemslogo.jpeg"
                    alt="The Stems Logo"
                    width={600}
                    height={600}
                    className="rounded-lg shadow-lg object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section — streams after main content */}
        <Suspense fallback={<HomeBlogSectionSkeleton />}>
          <HomeBlogSection />
        </Suspense>

        {/* Homepage FAQ Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-brand-blush border-t border-brand-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-6 md:mb-8">
                Frequently Asked Questions — The Stems Flowers Nairobi
              </h2>
              <div className="divide-y divide-brand-gray-200">
                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-heading font-semibold text-brand-gray-900 flex items-start justify-between gap-3">
                    <span>Where is The Stems Flowers located?</span>
                    <span className="text-brand-green text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-brand-gray-700 text-sm md:text-base">
                    We are at Delta Hotel, University Way, Nairobi CBD — open Monday to Saturday, 8AM to 8PM. From our central
                    Nairobi location we deliver fresh flowers, gift hampers and teddy bears across all Nairobi areas.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-heading font-semibold text-brand-gray-900 flex items-start justify-between gap-3">
                    <span>Do you offer same-day flower delivery in Nairobi?</span>
                    <span className="text-brand-green text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-brand-gray-700 text-sm md:text-base">
                    Yes — The Stems Flowers delivers fresh flowers, roses and gift hampers across Nairobi the same day. Order by
                    4PM for same-day delivery to Westlands, Karen, Kilimani, Lavington, South B, Runda and all Nairobi
                    neighbourhoods.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-heading font-semibold text-brand-gray-900 flex items-start justify-between gap-3">
                    <span>How do I pay for flowers at The Stems?</span>
                    <span className="text-brand-green text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-brand-gray-700 text-sm md:text-base">
                    You can pay with M-Pesa (Till 4202044, Paybill 880100), card payments or cash in-store at Delta Hotel,
                    University Way, Nairobi CBD. M-Pesa is available at checkout for fast, secure payment and instant
                    confirmation.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-heading font-semibold text-brand-gray-900 flex items-start justify-between gap-3">
                    <span>What types of roses do you sell in Nairobi?</span>
                    <span className="text-brand-green text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-brand-gray-700 text-sm md:text-base">
                    We stock red roses, pink roses, white roses, yellow roses and mixed rose bouquets — from single rose
                    surprises to large 80-stem anniversary bouquets. All our roses are sourced fresh in Nairobi and delivered
                    the same day across the city.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="cursor-pointer list-none font-heading font-semibold text-brand-gray-900 flex items-start justify-between gap-3">
                    <span>Can I send apology or I&apos;m sorry flowers in Nairobi?</span>
                    <span className="text-brand-green text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-brand-gray-700 text-sm md:text-base">
                    Yes — The Stems has a dedicated I&apos;m Sorry flower collection. Red roses and mixed bouquets are delivered
                    with your personal message, same day anywhere in Nairobi, to help you say &quot;I&apos;m sorry&quot; in the
                    most thoughtful way.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* SEO intro — above footer */}
        <section className="bg-brand-blush border-t border-brand-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-gray-900 mb-3">
              Florist in Nairobi CBD — Fresh Flowers, Roses & Gift Hampers Delivered
            </h1>
            <p className="text-brand-gray-700 text-sm sm:text-base md:text-lg max-w-3xl">
              The Stems Flowers is a Nairobi CBD florist at Delta Hotel, University Way. We deliver red roses, pink roses,
              mixed flower bouquets, gift hampers and teddy bears across all Nairobi areas with same-day delivery and secure
              M-Pesa payment.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
