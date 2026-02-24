import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SHOP_INFO } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Flower & Gift Delivery Services Nairobi | Same-Day Anniversary Flowers, Birthday Gifts & Apology Bouquets | The Stems",
  description:
    "Professional flower and gift delivery services Nairobi: same-day anniversary flowers, birthday surprises, apology bouquets & thoughtful hampers. Express delivery across CBD, Westlands, Karen, Lavington, Kilimani. Order online with guaranteed delivery.",
  keywords: [
    // Delivery Services
    "flower delivery services nairobi",
    "gift delivery services nairobi",
    "same day flower delivery nairobi",
    "express gift delivery nairobi",
    "urgent flower delivery nairobi",

    // Service Areas
    "flower delivery CBD nairobi",
    "flowers westlands delivery",
    "gifts karen delivery",
    "hampers lavington delivery",
    "flowers kilimani delivery",

    // Customization
    "custom flower arrangements nairobi",
    "personalized gifts nairobi",
    "surprise gift packages nairobi",
    "custom hampers nairobi",
    "bespoke flowers nairobi",

    // Delivery Timing
    "rush flower delivery nairobi",
    "last minute gifts nairobi",
    "urgent flower delivery nairobi",
    "emergency gift delivery nairobi",
    "guaranteed delivery nairobi",

    // Service Types
    "flower styling nairobi",
    "romantic arrangements nairobi",
    "gift wrapping nairobi",
    "hamper assembly nairobi",
    "personalization services nairobi",

    // Occasion-based Services
    "anniversary flower delivery nairobi",
    "birthday gift delivery nairobi",
    "apology flower delivery nairobi",
    "surprise delivery nairobi",
    "just because delivery nairobi",

    // Long-tail Services
    "professional flower delivery service nairobi",
    "reliable gift delivery kenya",
    "experienced florist services nairobi",
    "trusted delivery partner nairobi",

    // Traditional services keywords
    "wedding flowers Nairobi",
    "corporate gifts Nairobi",
    "surprise gift delivery Nairobi",
    "romantic flower arrangements Nairobi",
    "funeral flowers Nairobi",
    "graduation gifts Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/services`,
  },
  openGraph: {
    title: "Flower & Gift Delivery Services Nairobi | Same-Day Anniversary Flowers, Birthday Gifts & Apology Bouquets",
    description: "Professional flower and gift delivery services Nairobi: same-day anniversary flowers, birthday surprises, apology bouquets & thoughtful hampers. Express delivery across Nairobi.",
    url: `${baseUrl}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flower & Gift Delivery Services Nairobi | Same-Day Delivery",
    description: "Professional flower and gift delivery services Nairobi: same-day anniversary flowers, birthday surprises, apology bouquets & thoughtful hampers. Express delivery across Nairobi.",
  },
};

const services = [
  {
    title: "Wedding Flowers",
    description:
      "Complete wedding floral services including bridal bouquets, centerpieces, ceremony arrangements, and reception decorations. Let us bring your dream wedding to life.",
    image: "/weddingblog.jpeg",
    features: [
      "Bridal bouquets",
      "Bridal party flowers",
      "Ceremony arrangements",
      "Reception centerpieces",
      "Boutonnières & corsages",
    ],
  },
  {
    title: "Graduation Celebrations",
    description:
      "Celebrate academic achievements with stunning graduation bouquets and gift hampers. Perfect for congratulating graduates on their success.",
    image: "/graduation.jpeg",
    features: [
      "Graduation bouquets",
      "Congratulations hampers",
      "Teddy bears with graduation accessories",
      "Custom arrangements",
    ],
  },
  {
    title: "Corporate Gifts",
    description:
      "Professional gift solutions for your business needs. Luxury hampers, elegant arrangements, and branded gifts that impress clients and employees.",
    image: "/images/products/hampers/GiftAmper3.jpg",
    // Video demonstrating corporate gifting – served from public/corporate-gifting.mp4
    video: "/corporate-gifting.mp4",
    features: [
      "Corporate gift hampers",
      "Executive bouquets",
      "Employee appreciation gifts",
      "Client thank-you arrangements",
      "Bulk ordering available",
    ],
  },
  {
    title: "Flower Styling & Design",
    description:
      "Professional floral design services for events, parties, and special occasions. Custom arrangements tailored to your style and theme.",
    image: "/images/products/flowers/BouquetFlowers4.jpg",
    // Video demonstrating flower styling – served from public/flower-styling.mp4
    video: "/flower-styling.mp4",
    features: [
      "Event styling",
      "Custom arrangements",
      "Theme-based designs",
      "Seasonal collections",
      "Consultation services",
    ],
  },
  {
    title: "Sympathy & Condolences",
    description:
      "Thoughtful and respectful arrangements for expressing condolences. Elegant funeral flowers and sympathy bouquets delivered with care.",
    image: "/sympathy.jpeg",
    features: [
      "Funeral wreaths",
      "Sympathy bouquets",
      "Casket arrangements",
      "Memorial tributes",
    ],
  },
  {
    title: "Special Occasions",
    description:
      "Birthdays, anniversaries, apologies, surprises, graduations, Mother&apos;s Day, and more. We have the perfect arrangement for every special moment that matters.",
    image: "/images/products/flowers/BouquetFlowers5.jpg",
    features: [
      "Birthday bouquets & surprises",
      "Anniversary arrangements",
      "Apology flowers & reconciliation gifts",
      "Just-because surprises",
      "Get well soon flowers",
      "Graduation celebrations",
    ],
  },
];

export default function ServicesPage() {
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
        name: "Services",
        item: `${baseUrl}/services`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="py-12 bg-brand-blush">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-brand-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive floral and gift services for every occasion in Nairobi and beyond
          </p>
        </div>

        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 mb-12 pb-3 md:pb-0 scrollbar-visible md:scrollbar-hide">
          {services.map((service, index) => (
            <div key={index} className="flex-shrink-0 w-[70vw] sm:w-[65vw] md:w-auto card overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                {"video" in service && service.video ? (
                  <video
                    src={service.video}
                    poster={service.image}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={service.image}
                    alt={`${service.title} - The Stems Nairobi`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 70vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-3 group-hover:text-brand-green transition-colors">
                  {service.title}
                </h2>
                <p className="text-brand-gray-700 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-brand-gray-600 flex items-start">
                      <span className="text-brand-green mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-green text-white rounded-lg p-8 md:p-12 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Ready to Make Your Event Special?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Contact us to discuss your needs. We offer consultations and custom quotes for all our
            services.
          </p>
          <div className="flex flex-row gap-3 md:gap-4 justify-center">
            <Link href="/contact" className="btn-primary bg-white text-brand-green hover:bg-brand-gray-100 inline-block text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
              Contact Us
            </Link>
            <Link href="/collections" className="btn-outline bg-transparent border-white text-white hover:bg-white/10 inline-block text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
              Browse Collections
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:gap-8">
          <div className="card p-3 md:p-6">
            <h3 className="font-heading font-bold text-sm md:text-xl text-brand-gray-900 mb-2 md:mb-4">
              Delivery Information
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-base text-brand-gray-700 mb-4">
              <li>
                <span className="font-semibold">Nairobi CBD:</span> Complimentary same-day delivery - your gifts arrive fresh and on time
              </li>
              <li>
                <span className="font-semibold">Outside Nairobi:</span> Swift next-day delivery with transparent, location-based pricing
              </li>
              <li>
                <span className="font-semibold">Nationwide:</span> Reliable 24-hour delivery service across Kenya, bringing joy everywhere
              </li>
              <li>
                <span className="font-semibold">Rush Orders:</span> Express delivery available - we&apos;ll make it happen when you need it most
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-brand-gray-200">
              <p className="text-xs md:text-sm text-brand-gray-600 italic">
                <span className="font-semibold text-brand-green">💡 Pro Tip:</span> During checkout, review your cart to see location-specific delivery fees and estimated arrival times tailored to your delivery address.
              </p>
            </div>
          </div>

          <div className="card p-3 md:p-6">
            <h3 className="font-heading font-bold text-sm md:text-xl text-brand-gray-900 mb-2 md:mb-4">
              Payment Options
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-base text-brand-gray-700">
              <li>
                <span className="font-semibold">M-Pesa:</span> Pay via STK Push on checkout
              </li>
              <li>
                <span className="font-semibold">Till Number:</span>{" "}
                <span className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.till}</span>
              </li>
              <li>
                <span className="font-semibold">PayBill:</span>{" "}
                <span className="font-mono font-semibold text-brand-green">{SHOP_INFO.mpesa.paybill}</span>
              </li>
              <li>
                <span className="font-semibold">WhatsApp:</span> Order and arrange payment via
                WhatsApp
              </li>
              <li>
                <span className="font-semibold">Corporate:</span> Credit terms available for bulk
                orders
              </li>
              <li>
                <span className="font-semibold">Cash on Delivery:</span> Available for Nairobi
                orders
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

