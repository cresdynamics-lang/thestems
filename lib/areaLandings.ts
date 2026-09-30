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
  {
    slug: "flower-delivery-lavington-nairobi",
    areaName: "Lavington",
    deliveryFee: "from KSh 400",
    metaTitle: "Flower Delivery Lavington Nairobi | Same Day | The Stems",
    metaDescription:
      "Same-day flower delivery in Lavington Nairobi. Fresh roses, bouquets and gift hampers from The Stems Flowers CBD florist.",
    h1: "Flower Delivery Lavington Nairobi — Same Day",
    intro:
      "Send fresh flowers and gift hampers to Lavington with The Stems Flowers. We prepare bouquets at our Nairobi CBD studio and deliver to Lavington homes, offices and event venues.",
    details:
      "Lavington customers often choose rose bouquets, anniversary arrangements and luxury gift hampers. Order by 4PM for same-day delivery. Pay with M-Pesa online or WhatsApp us for custom colour requests.",
    nearbyAreas: ["Kilimani", "Kileleshwa", "Westlands", "Karen"],
  },
  {
    slug: "flower-delivery-kileleshwa-nairobi",
    areaName: "Kileleshwa",
    deliveryFee: "from KSh 350",
    metaTitle: "Flower Delivery Kileleshwa Nairobi | Roses & Hampers | The Stems",
    metaDescription:
      "Flower delivery Kileleshwa — roses, mixed bouquets and gift hampers with same-day service from The Stems Flowers Nairobi.",
    h1: "Flower Delivery Kileleshwa — Fresh Bouquets Delivered",
    intro:
      "The Stems Flowers delivers to Kileleshwa apartments, offices and residences. Perfect for birthdays, apologies, thank-yous and romantic surprises.",
    details:
      "Popular Kileleshwa gifts include red roses, soft mixed bouquets and teddy-and-flower combos. Same-day delivery when you order before 4PM. Secure M-Pesa checkout online.",
    nearbyAreas: ["Kilimani", "Lavington", "Westlands", "CBD"],
  },
  {
    slug: "flower-delivery-runda-nairobi",
    areaName: "Runda",
    deliveryFee: "from KSh 700",
    metaTitle: "Flower Delivery Runda Nairobi | Premium Gifts | The Stems",
    metaDescription:
      "Premium flower and gift delivery to Runda Nairobi. Same-day roses, bouquets and luxury hampers from The Stems Flowers.",
    h1: "Flower Delivery Runda — Premium Same-Day Gifts",
    intro:
      "Deliver elegant flowers and luxury gift hampers to Runda with The Stems Flowers. Ideal for celebrations, corporate hosting and thoughtful family gifts.",
    details:
      "Runda deliveries often include premium rose arrangements, wine-and-chocolate hampers and large celebration bouquets. Share gate instructions on WhatsApp so our rider arrives smoothly.",
    nearbyAreas: ["Gigiri", "Muthaiga", "Westlands", "CBD"],
  },
  {
    slug: "flower-delivery-gigiri-nairobi",
    areaName: "Gigiri",
    deliveryFee: "from KSh 700",
    metaTitle: "Flower Delivery Gigiri Nairobi | Same Day Florist | The Stems",
    metaDescription:
      "Flower delivery Gigiri Nairobi — bouquets, roses and gift hampers for homes and offices. Same-day options from The Stems Flowers.",
    h1: "Flower Delivery Gigiri Nairobi",
    intro:
      "Send flowers to Gigiri with The Stems Flowers. Fresh bouquets and gift hampers for residential compounds, offices and celebrations near the UN area.",
    details:
      "We coordinate delivery windows for gated communities. Choose roses, mixed bouquets or corporate thank-you hampers. Order by 4PM for same-day where possible.",
    nearbyAreas: ["Runda", "Westlands", "Muthaiga", "CBD"],
  },
  {
    slug: "flower-delivery-upper-hill-nairobi",
    areaName: "Upper Hill",
    deliveryFee: "from KSh 350",
    metaTitle: "Flower Delivery Upper Hill Nairobi | Office & Gifts | The Stems",
    metaDescription:
      "Flower delivery Upper Hill Nairobi for offices, hospitals and events. Same-day bouquets and corporate gifts from The Stems Flowers.",
    h1: "Flower Delivery Upper Hill — Offices & Celebrations",
    intro:
      "The Stems Flowers delivers to Upper Hill offices, hotels and nearby venues. Perfect for corporate gifts, client thank-yous and celebration bouquets.",
    details:
      "Upper Hill orders often include professional mixed bouquets, get-well arrangements and corporate gift hampers. Same-day delivery for orders before 4PM with M-Pesa payment online.",
    nearbyAreas: ["Nairobi CBD", "Kilimani", "Westlands", "South C"],
  },
];

export function getAreaLandingBySlug(slug: string): AreaLandingConfig | undefined {
  return AREA_LANDINGS.find((a) => a.slug === slug);
}
