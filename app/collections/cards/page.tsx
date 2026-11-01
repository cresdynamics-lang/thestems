import { Metadata } from "next";
import CardsPageClient from "./CardsPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thestemsflowers.co.ke";

export const metadata: Metadata = {
  title: "Greeting Cards Nairobi | With Flowers & Hampers",
  description:
    "Greeting cards delivered in Nairobi together with fresh flowers and gift hampers. Add a personal message to every bouquet, teddy bear or gift hamper order from The Stems Flowers, Nairobi CBD.",
  alternates: {
    canonical: `${baseUrl}/collections/cards`,
  },
  openGraph: {
    title: "Greeting Cards Nairobi | The Stems Flowers",
    description: "Greeting cards for birthdays, anniversaries and congratulations, delivered with flowers and hampers across Nairobi.",
    url: `${baseUrl}/collections/cards`,
    type: "website",
  },
};

export default function CardsPage() {
  return <CardsPageClient />;
}