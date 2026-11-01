import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Contact Us | Delta Hotel, University Way",
  description:
    "Contact The Stems Flowers in Nairobi CBD for fresh flowers, roses, gift hampers and teddy bears with same-day delivery. Visit us at Delta Hotel, University Way or call +254 725 707 143. Pay with M-Pesa or card.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact The Stems Flowers | Delta Hotel, University Way",
    description: "Call or WhatsApp The Stems Flowers at Delta Hotel Building, University Way, Nairobi CBD. Same-day flower delivery across Nairobi.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact The Stems Flowers | Delta Hotel, University Way",
    description: "Call or WhatsApp The Stems Flowers at Delta Hotel Building, University Way, Nairobi CBD. Same-day flower delivery across Nairobi.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        name: "Contact Us",
        item: `${baseUrl}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}

