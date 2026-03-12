import type { Metadata } from "next";
import { Montserrat, Lato, Roboto_Mono, Dancing_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { SHOP_INFO } from "@/lib/constants";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Florist Nairobi CBD | Flowers, Teddy Bears & Gift Hampers | The Stems Flowers",
    template: "%s | The Stems Flowers Nairobi",
  },
  description:
    "The Stems Flowers is a Nairobi CBD florist at Delta Hotel, University Way. Fresh roses, flower bouquets, teddy bears and luxury gift hampers with same-day delivery across Nairobi. Order online and pay with M-Pesa.",
  keywords: [
    // Core florist & location
    "florist Nairobi",
    "florist Nairobi CBD",
    "flower shop Nairobi",
    "online flower shop Nairobi",
    "Nairobi CBD flower delivery",
    "flowers Nairobi",
    "flower delivery Nairobi",
    "same-day flower delivery Nairobi",
    "M-Pesa flower delivery Nairobi",

    // Product pillars
    "roses Nairobi",
    "red roses Nairobi",
    "pink roses Nairobi",
    "white roses Nairobi",
    "mixed bouquets Nairobi",
    "gift hampers Nairobi",
    "teddy bears Nairobi",

    // Occasion keywords
    "birthday flowers Nairobi",
    "anniversary flowers Nairobi",
    "apology flowers Nairobi",
    "get well soon flowers Nairobi",
    "wedding flowers Nairobi",
    "wedding car decor Nairobi",

    // Intent & neighbourhoods
    "same day flowers Nairobi",
    "urgent flower delivery Nairobi",
    "flower delivery Westlands",
    "flower delivery Karen",
    "flower delivery Lavington",
    "flower delivery Kilimani",
  ],
  authors: [{ name: "The Stems" }],
  creator: "The Stems",
  publisher: "The Stems",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke"),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke",
    siteName: "The Stems Flowers Nairobi",
    title:
      "Florist Nairobi CBD | Flowers, Teddy Bears & Gift Hampers | The Stems Flowers",
    description:
      "Nairobi CBD florist at Delta Hotel, University Way. Fresh roses, bouquets, teddy bears and luxury gift hampers with same-day delivery across Nairobi. Pay with M-Pesa.",
    images: [
      {
        url: "/images/logo/thestemslogo.jpeg",
        width: 1200,
        height: 630,
        alt: "The Stems Flowers - Florist in Nairobi CBD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Florist Nairobi CBD | Flowers, Teddy Bears & Gift Hampers | The Stems Flowers",
    description:
      "Nairobi CBD florist at Delta Hotel, University Way. Fresh flowers, teddy bears and gift hampers delivered same day across Nairobi. Order online and pay with M-Pesa.",
    images: ["/images/logo/thestemslogo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SHOP_INFO.name,
  url: baseUrl,
  logo: `${baseUrl}/images/logo/thestemslogo.jpeg`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: `+${SHOP_INFO.phone}`,
    contactType: "Customer Service",
    areaServed: "KE",
    availableLanguage: ["English", "Swahili"],
  },
  sameAs: [
    `https://www.instagram.com/${SHOP_INFO.instagram}`,
    `https://www.facebook.com/${SHOP_INFO.facebook}`,
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${baseUrl}#business`,
  name: "The Stems Flowers",
  image: `${baseUrl}/images/logo/thestemslogo.jpeg`,
  url: baseUrl,
  telephone: `+${SHOP_INFO.phone}`,
  email: SHOP_INFO.email,
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
  priceRange: "KSh KSh",
  paymentAccepted: "M-Pesa, Cash, Card",
  hasMap: "https://maps.google.com/?q=Delta+Hotel+University+Way+Nairobi",
};

const modernGiftsItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Valentine's Gifts Nairobi - Romantic Flowers, Chocolates & Gift Hampers",
  description: "Premium Valentine's gifts including romantic flowers, premium chocolates, wine, teddy bears and surprise hampers for wives, husbands, girlfriends. Pre-Valentine's Day orders, same-day delivery across Nairobi.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Valentine's Gifts for Wife Nairobi",
      url: `${baseUrl}/blog/best-gifts-for-wives-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Valentine's Gifts for Husband Nairobi",
      url: `${baseUrl}/blog/best-gifts-for-men-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Romantic Valentine's Flowers Nairobi",
      url: `${baseUrl}/collections/flowers`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Valentine's Chocolates Nairobi",
      url: `${baseUrl}/collections/chocolates`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Valentine's Wine Gifts Nairobi",
      url: `${baseUrl}/collections/wines`,
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Valentine's Gift Hampers Nairobi",
      url: `${baseUrl}/collections/gift-hampers`,
    },
    {
      "@type": "ListItem",
      position: 7,
      name: "Valentine's Teddy Bears Nairobi",
      url: `${baseUrl}/collections/teddy-bears`,
    },
    {
      "@type": "ListItem",
      position: 8,
      name: "Pre-Valentine's Orders Nairobi",
      url: `${baseUrl}/contact`,
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SHOP_INFO.name,
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/collections?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const valentinesFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best Valentine's gifts for my wife in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best Valentine's gifts for your wife in Nairobi include romantic roses, premium chocolate hampers, luxury wine, personalized teddy bears, and surprise gift baskets. We offer same-day delivery across Nairobi with beautiful arrangements starting from KES 3,500."
      }
    },
    {
      "@type": "Question",
      name: "Can I order Valentine's flowers for delivery in Nairobi same day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer same-day Valentine's flower delivery in Nairobi CBD. For areas outside CBD (Westlands, Karen, Lavington, Kilimani), we provide next-day delivery. Place your order before 2 PM for guaranteed Valentine's Day delivery."
      }
    },
    {
      "@type": "Question",
      name: "What should I gift my girlfriend for Valentine's Day in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Valentine's Day in Nairobi, consider romantic red roses, premium Ferrero Rocher chocolates, cuddly teddy bears, personalized gift hampers, or luxury wine. We help you choose the perfect romantic gift with beautiful packaging and same-day delivery."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer pre-Valentine's Day orders in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We accept pre-Valentine's Day orders in Nairobi. Early booking ensures you get the best selection and avoids Valentine's Day rush. Order now for guaranteed delivery on February 14th across all Nairobi areas."
      }
    },
    {
      "@type": "Question",
      name: "What are Valentine's chocolate hamper options in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Valentine's chocolate hampers in Nairobi include premium Ferrero Rocher collections (8, 16, 24 pieces), gourmet chocolate baskets, and chocolate gift boxes. Perfect for romantic Valentine's surprises with same-day delivery available."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable} ${robotoMono.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <link rel="icon" href="/images/logo/thestemslogo.jpeg" type="image/jpeg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(modernGiftsItemListJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(valentinesFaqJsonLd) }}
        />
      </head>
      <body className={`${lato.className} flex flex-col min-h-screen`}>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DTDMCDNB9F"
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-DTDMCDNB9F');`,
          }}
        />
        <ErrorBoundary>
          <AnalyticsProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </AnalyticsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
