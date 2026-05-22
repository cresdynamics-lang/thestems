import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Montserrat, Lato, Dancing_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
});
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import ClientGoogleAnalytics from "@/components/ClientGoogleAnalytics";
import StructuredData from "@/components/StructuredData";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
  display: "swap",
  preload: false,
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
    "florist Nairobi",
    "florist Nairobi CBD",
    "flower shop Nairobi",
    "flowers Nairobi",
    "flower delivery Nairobi",
    "same-day flower delivery Nairobi",
    "gift hampers Nairobi",
    "roses Nairobi",
    "birthday flowers Nairobi",
    "anniversary flowers Nairobi",
  ],
  authors: [{ name: "The Stems" }],
  creator: "The Stems",
  publisher: "The Stems",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: SITE_NAME,
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
    images: [absoluteUrl("/images/logo/thestemslogo.jpeg")],
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
  icons: {
    icon: "/images/logo/thestemslogo.jpeg",
    apple: "/images/logo/thestemslogo.jpeg",
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
  other: {
    "geo.region": "KE-30",
    "geo.placename": "Nairobi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-KE"
      className={`${montserrat.variable} ${lato.variable} ${dancingScript.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="" />
        ) : null}
        <StructuredData />
      </head>
      <body className={`${lato.className} flex flex-col min-h-screen`}>
        <ErrorBoundary>
          <AnalyticsProvider>
            <ClientGoogleAnalytics />
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
