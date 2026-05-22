export type AreaLandingConfig = {
  slug: string;
  areaName: string;
  deliveryFee?: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  details: string;
  nearbyAreas: string[];
};

export const AREA_LANDINGS: AreaLandingConfig[] = [
  {
    slug: "flower-delivery-westlands-nairobi",
    areaName: "Westlands",
    deliveryFee: "from KSh 300",
    metaTitle: "Flower Delivery Westlands Nairobi | Same Day | The Stems",
    metaDescription:
      "Same-day flower delivery in Westlands, Parklands and Nairobi West. Fresh roses, bouquets and gift hampers from KSh 3,500. Order online or WhatsApp The Stems Flowers.",
    h1: "Flower Delivery Westlands Nairobi — Same Day Roses & Bouquets",
    intro:
      "Send fresh flowers to Westlands, Parklands, Nairobi West and surrounding areas with The Stems Flowers. We prepare every bouquet at our Nairobi CBD studio and dispatch for fast delivery across Westlands business and residential zones.",
    details:
      "Popular choices in Westlands include red roses for anniversaries, mixed bouquets for birthdays, apology flowers, and luxury gift hampers with wine and chocolates. Order by 4PM for same-day delivery. Pay with M-Pesa at checkout or message us on WhatsApp for custom arrangements.",
    nearbyAreas: ["Parklands", "Kilimani", "Lavington", "CBD"],
  },
  {
    slug: "flower-delivery-kilimani-nairobi",
    areaName: "Kilimani",
    deliveryFee: "from KSh 300",
    metaTitle: "Flower Delivery Kilimani Nairobi | Roses & Hampers | The Stems",
    metaDescription:
      "Flower delivery Kilimani and Kileleshwa — roses, bouquets and gift hampers with same-day service. Florist delivery from KSh 3,500 across Nairobi.",
    h1: "Flower Delivery Kilimani & Kileleshwa — Fresh Bouquets Delivered",
    intro:
      "The Stems Flowers delivers to Kilimani, Kileleshwa, Yaya Centre area and nearby estates. Whether you need romantic roses, a birthday surprise, or a corporate thank-you hamper, we deliver beautifully wrapped gifts with your personal message.",
    details:
      "Kilimani customers often order premium rose bouquets, teddy bear and flower combos, and Ferrero Rocher gift hampers. We serve apartments, offices and restaurants with reliable same-day delivery when you order before 4PM. M-Pesa payment is available online for instant confirmation.",
    nearbyAreas: ["Kileleshwa", "Lavington", "Westlands", "CBD"],
  },
  {
    slug: "flower-delivery-karen-nairobi",
    areaName: "Karen",
    deliveryFee: "from KSh 600",
    metaTitle: "Flower Delivery Karen Nairobi | Gift Hampers & Roses | The Stems",
    metaDescription:
      "Flower and gift delivery Karen, Langata and Ngong Road. Same-day roses, hampers and teddy bears from Nairobi florist The Stems Flowers.",
    h1: "Flower Delivery Karen & Langata — Premium Gifts Delivered",
    intro:
      "Deliver flowers and gift hampers to Karen, Langata, Hardy and Ngong Road with The Stems Flowers. Our Nairobi team crafts fresh bouquets and curated hampers perfect for birthdays, anniversaries, and elegant surprises in Karen's residential estates.",
    details:
      "Karen deliveries include luxury rose arrangements, giant teddy bears, wine and chocolate hampers, and wedding anniversary bouquets. We coordinate delivery times with your recipient and include a handwritten-style message card. Order online from our Nairobi CBD florist with secure M-Pesa payment.",
    nearbyAreas: ["Langata", "Ngong Road", "Lavington", "CBD"],
  },
  {
    slug: "flower-delivery-nairobi-cbd",
    areaName: "Nairobi CBD",
    deliveryFee: "from KSh 0 in CBD",
    metaTitle: "Flower Delivery Nairobi CBD | Florist University Way | The Stems",
    metaDescription:
      "Nairobi CBD flower delivery from Delta Hotel, University Way. Same-day roses, bouquets and hampers. Walk-in or order online with M-Pesa.",
    h1: "Flower Delivery Nairobi CBD — Florist at University Way",
    intro:
      "The Stems Flowers is based at Delta Hotel, University Way, Nairobi CBD — your local florist for same-day flower delivery across the central business district and greater Nairobi. Collect in-store Monday–Saturday 8AM–8PM or order for delivery to offices, hotels and homes.",
    details:
      "CBD customers benefit from the fastest turnaround: urgent apology flowers, last-minute birthday bouquets, and corporate gift hampers for teams and clients. We deliver from University Way to surrounding CBD addresses and coordinate citywide delivery to Westlands, Karen, Kilimani and more.",
    nearbyAreas: ["Westlands", "South B", "Parklands", "Upper Hill"],
  },
];

export function getAreaLandingBySlug(slug: string): AreaLandingConfig | undefined {
  return AREA_LANDINGS.find((a) => a.slug === slug);
}
