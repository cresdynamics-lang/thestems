import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SHOP_INFO } from "@/lib/constants";
import { whatsappUrl } from "@/lib/contact";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

const description =
  "The Stems Flowers is a Nairobi florist known for large events and wedding decor, plus fresh bouquets and same-day delivery from University Way, CBD.";

export const metadata: Metadata = {
  title: "About Us | Wedding Decor & Event Florist Nairobi",
  description,
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About The Stems Flowers | Wedding Decor & Event Florist Nairobi",
    description,
    url: `${baseUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About The Stems Flowers | Wedding Decor & Event Florist Nairobi",
    description,
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
      name: "About Us",
      item: `${baseUrl}/about`,
    },
  ],
};

const EVENT_WORK = [
  "Wedding decor for ceremonies and receptions",
  "Bridal bouquets, bridesmaid flowers and boutonnières",
  "Centrepieces, arches and ceremony arrangements",
  "Wedding car flower decoration",
  "Floral decor for large events and celebrations",
  "Flowers for corporate events and offices",
];

const headingClass = "font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-3 md:mb-4";
const copyClass = "text-brand-gray-700 mb-3 md:mb-4 text-sm md:text-base";
const linkClass = "text-brand-green hover:underline";

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="py-12 bg-brand-blush">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
              About The Stems Flowers
            </h1>
            <p className="text-brand-gray-600 text-lg max-w-2xl mx-auto">
              A Nairobi florist behind large events and wedding decor, with a shop on University Way
              for everyday flowers and gifts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center mb-12">
            <div className="order-2 md:order-1">
              <Image
                src="/weddingblog.jpeg"
                alt="Wedding flowers and decor by The Stems Flowers, Nairobi"
                width={600}
                height={400}
                className="rounded-lg shadow-card w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className={headingClass}>Events and weddings are what we do best</h2>
              <p className={copyClass}>
                The Stems Flowers has done extensive work in events and wedding decor across Nairobi.
                From a bride&apos;s bouquet to the flowers that fill a whole venue, we plan, build and
                set up the floral side of the day so that you and your family don&apos;t have to.
              </p>
              <p className={copyClass}>
                That experience carries into every order. Working to fixed ceremony times has taught
                us to prepare early, handle flowers carefully and arrive when we say we will.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className={headingClass}>What we do for events</h2>
            <ul className="grid sm:grid-cols-2 gap-2 list-disc list-inside text-brand-gray-700 text-sm md:text-base mb-4">
              {EVENT_WORK.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={copyClass}>
              See our <Link href="/weddings-events" className={linkClass}>weddings and events services</Link>,{" "}
              <Link href="/wedding-flowers-nairobi" className={linkClass}>wedding flowers</Link> and{" "}
              <Link href="/wedding-car-decor-nairobi" className={linkClass}>wedding car decor</Link>.
            </p>
          </div>

          <div className="mb-12">
            <h2 className={headingClass}>Planning an event with us</h2>
            <ol className="list-decimal list-inside space-y-2 text-brand-gray-700 text-sm md:text-base mb-4">
              <li>Send us your date, venue, colours, guest count and any inspiration photos.</li>
              <li>We suggest a design and give you a quote to match your budget.</li>
              <li>We prepare the flowers and set up at the venue before your guests arrive.</li>
            </ol>
            <a
              href={whatsappUrl("Hello! I'd like a quote for wedding or event decor.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Get an event quote on WhatsApp
            </a>
          </div>

          <div className="mb-12">
            <h2 className={headingClass}>Everyday flowers and gifts</h2>
            <p className={copyClass}>
              Between events, our University Way shop makes{" "}
              <Link href="/collections/flowers" className={linkClass}>fresh bouquets</Link>,{" "}
              <Link href="/collections/gift-hampers" className={linkClass}>gift hampers</Link> and{" "}
              <Link href="/collections/teddy-bears" className={linkClass}>teddy bear gifts</Link> for birthdays,
              anniversaries, apologies and graduations. Order by 4PM for{" "}
              <Link href="/same-day-flower-delivery-nairobi" className={linkClass}>same-day delivery</Link> across
              Nairobi. Delivery is free within the CBD, and you can pay with M-Pesa or card.
            </p>
          </div>

          <div className="border-t border-brand-gray-200 pt-6 md:pt-8">
            <h2 className={headingClass}>Visit us</h2>
            <div className="space-y-2 text-brand-gray-700 text-sm md:text-base mb-6">
              <p>
                <span className="font-semibold">Location:</span> {SHOP_INFO.address}{" "}
                <a href={SHOP_INFO.mapUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  View on map
                </a>
              </p>
              <p>
                <span className="font-semibold">Hours:</span> {SHOP_INFO.hours}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a href={`tel:+${SHOP_INFO.phone}`} className={linkClass}>
                  +{SHOP_INFO.phone}
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a href={`mailto:${SHOP_INFO.email}`} className={`${linkClass} break-all`}>
                  {SHOP_INFO.email}
                </a>
              </p>
            </div>
            <Link href="/collections" className="btn-primary inline-block">
              Browse Our Collections
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
