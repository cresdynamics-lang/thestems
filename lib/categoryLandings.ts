import type { Product } from "@/lib/db";

export type LandingFaq = { question: string; answer: string };

export type CategoryLandingConfig = {
  slug: string;
  /** SEO title (browser / Google) */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Opening paragraphs — unique per page */
  intro: string[];
  /** Optional H2 sections */
  sections?: { heading: string; body: string }[];
  faqs: LandingFaq[];
  /** Which product categories to pull */
  productCategories: Array<Product["category"]>;
  productLimit?: number;
  /** Prefer products whose title/tags match these (case-insensitive) */
  preferKeywords?: string[];
  ctaPrimary: { href: string; label: string };
  ctaSecondary?: { href: string; label: string };
  relatedLinks: { href: string; label: string }[];
  breadcrumbLabel: string;
};

export const CATEGORY_LANDINGS: Record<string, CategoryLandingConfig> = {
  "graduation-bouquets-nairobi": {
    slug: "graduation-bouquets-nairobi",
    metaTitle: "Graduation Bouquets Nairobi | PP2, Grade 3, 6 & 9 | Same-Day | The Stems",
    metaDescription:
      "Order graduation bouquets in Nairobi for PP2, Grade 3, Grade 6 and Grade 9. Same-day flower delivery, teddy bears and graduation gift hampers from The Stems Flowers CBD.",
    h1: "Graduation Bouquets Nairobi – Same-Day Delivery",
    intro: [
      "Celebrate every school milestone with fresh graduation bouquets in Nairobi. The Stems Flowers prepares colourful arrangements for PP2, Grade 3, Grade 6 and Grade 9 ceremonies, plus university and college graduations across the city.",
      "Order before 4PM for same-day delivery to Nairobi CBD, Westlands, Kilimani, Karen, Lavington and nearby estates. Pair flowers with a graduation teddy or snack hamper for a complete surprise.",
    ],
    sections: [
      {
        heading: "Graduation gifts for every stage",
        body: "From PP2 and primary school graduations to Grade 6, Grade 9 and campus ceremonies, we arrange bright mixed bouquets, roses and gift hampers that photograph well and arrive on time.",
      },
      {
        heading: "How to order",
        body: "Choose a bouquet online, add a teddy or hamper if you like, then pay with M-Pesa or card. Share the venue and ceremony time on WhatsApp so we can schedule delivery.",
      },
    ],
    faqs: [
      {
        question: "Do you deliver graduation flowers same day in Nairobi?",
        answer:
          "Yes. Orders placed by 4PM are eligible for same-day delivery across Nairobi, subject to traffic and exact venue.",
      },
      {
        question: "Can I order for PP2 or Grade 6 graduation?",
        answer:
          "Absolutely. Tell us the school stage and colour preference when ordering — we tailor bouquets for PP2, Grade 3, Grade 6 and Grade 9 events.",
      },
      {
        question: "Can I add a teddy or snack hamper?",
        answer:
          "Yes. Many families combine a graduation bouquet with a teddy bear or snack gift hamper for a fuller celebration gift.",
      },
    ],
    productCategories: ["flowers", "teddy", "hampers"],
    productLimit: 8,
    preferKeywords: ["graduation", "congratulat", "mixed", "rose"],
    ctaPrimary: { href: "/collections/flowers", label: "Shop graduation flowers" },
    ctaSecondary: { href: "/collections/gift-hampers", label: "Graduation gift hampers" },
    relatedLinks: [
      { href: "/graduation", label: "Graduation gifts hub" },
      { href: "/birthday-flowers-nairobi", label: "Birthday flowers Nairobi" },
      { href: "/collections/teddy-bears", label: "Teddy bears" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
      { href: "/contact", label: "Contact & WhatsApp" },
    ],
    breadcrumbLabel: "Graduation Bouquets Nairobi",
  },

  "get-well-soon-flowers-nairobi": {
    slug: "get-well-soon-flowers-nairobi",
    metaTitle: "Get Well Soon Flowers Nairobi | Soft Bouquets & Fruit | The Stems",
    metaDescription:
      "Send get well soon flowers in Nairobi — gentle bouquets, fruit baskets and gift hampers with same-day delivery from The Stems Flowers.",
    h1: "Get Well Soon Flowers Nairobi",
    intro: [
      "Brighten a recovery with thoughtful get well soon flowers in Nairobi. Soft pastel bouquets, cheerful mixed arrangements and flower-and-fruit combinations help you show care without overwhelming hospital or home rooms.",
      "The Stems Flowers offers same-day delivery across Nairobi. Add a short get-well note at checkout or on WhatsApp when you confirm the address.",
    ],
    sections: [
      {
        heading: "Gentle gifts that travel well",
        body: "We recommend medium bouquets, soft roses and fruit baskets for hospital visits — easy to place on a bedside table and suitable for most wards (always check hospital flower rules).",
      },
    ],
    faqs: [
      {
        question: "Can you deliver get well flowers to a hospital in Nairobi?",
        answer:
          "Yes, where the facility allows flowers. Share the ward and visiting hours so we can plan delivery.",
      },
      {
        question: "What pairs well with get well flowers?",
        answer:
          "Fruit baskets, light gift hampers and a simple card are popular add-ons for get well soon gifts.",
      },
    ],
    productCategories: ["flowers", "hampers"],
    productLimit: 8,
    preferKeywords: ["get well", "soft", "pastel", "mixed", "fruit"],
    ctaPrimary: { href: "/collections/flowers", label: "Shop get well flowers" },
    ctaSecondary: { href: "/fruit-baskets-nairobi", label: "Fruit baskets Nairobi" },
    relatedLinks: [
      { href: "/occasions", label: "All occasions" },
      { href: "/fruit-baskets-nairobi", label: "Fruit baskets" },
      { href: "/collections/gift-hampers", label: "Gift hampers" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    breadcrumbLabel: "Get Well Soon Flowers",
  },

  "fruit-baskets-nairobi": {
    slug: "fruit-baskets-nairobi",
    metaTitle: "Fruit Baskets Nairobi | Get Well & Corporate Delivery | The Stems",
    metaDescription:
      "Order fruit baskets in Nairobi for get well soon, corporate gifts and celebrations. Fresh arrangements with same-day delivery from The Stems Flowers.",
    h1: "Fruit Baskets Nairobi – Fresh & Same-Day",
    intro: [
      "Fresh fruit baskets in Nairobi for get well wishes, corporate clients and family celebrations. Pair fruit with flowers for a complete care package delivered the same day.",
      "From our CBD florist we deliver across Nairobi. Message us on WhatsApp for custom corporate fruit baskets or hospital delivery notes.",
    ],
    sections: [
      {
        heading: "Popular fruit gift styles",
        body: "Get well fruit baskets, premium mixed fruit arrangements, corporate client gifts and fruit-plus-flower combos are our most requested options.",
      },
    ],
    faqs: [
      {
        question: "Do you deliver fruit baskets same day in Nairobi?",
        answer: "Yes for orders placed by 4PM, depending on availability and delivery area.",
      },
      {
        question: "Can fruit baskets include flowers?",
        answer: "Yes — many customers choose fruit with a small bouquet for get well or thank-you gifts.",
      },
    ],
    productCategories: ["hampers", "flowers"],
    productLimit: 8,
    preferKeywords: ["fruit", "hamper", "basket", "get well"],
    ctaPrimary: { href: "/collections/gift-hampers", label: "Shop gift hampers" },
    ctaSecondary: { href: "/get-well-soon-flowers-nairobi", label: "Get well flowers" },
    relatedLinks: [
      { href: "/get-well-soon-flowers-nairobi", label: "Get well soon flowers" },
      { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers Nairobi" },
      { href: "/gifts", label: "All gifts" },
    ],
    breadcrumbLabel: "Fruit Baskets Nairobi",
  },

  "funeral-flowers-nairobi": {
    slug: "funeral-flowers-nairobi",
    metaTitle: "Funeral Flowers Nairobi | Wreaths & Sympathy Bouquets | The Stems",
    metaDescription:
      "Order funeral flowers and sympathy bouquets in Nairobi. Wreaths, condolence arrangements and same-day delivery from The Stems Flowers.",
    h1: "Funeral & Sympathy Flowers Nairobi",
    intro: [
      "Honour a loved one with dignified funeral flowers in Nairobi. We prepare sympathy bouquets, wreaths and condolence arrangements with care, delivered discreetly to homes, churches and funeral homes.",
      "Share the service time and venue on WhatsApp so we can schedule delivery respectfully. Same-day options are available for urgent requests.",
    ],
    sections: [
      {
        heading: "Sympathy options",
        body: "White and soft-toned bouquets, round and cross wreaths, and simple standing tributes — tell us your preference and budget and we will guide you.",
      },
    ],
    faqs: [
      {
        question: "Can funeral flowers be delivered same day?",
        answer:
          "Where possible, yes. Contact us early with the venue and time so we can confirm.",
      },
      {
        question: "Do you make wreaths?",
        answer:
          "Yes. Ask for funeral, cross, heart or round wreaths when you message us — we prepare them to order.",
      },
    ],
    productCategories: ["flowers"],
    productLimit: 8,
    preferKeywords: ["white", "sympathy", "funeral", "wreath", "condolence"],
    ctaPrimary: { href: "/collections/flowers", label: "View flower arrangements" },
    ctaSecondary: { href: "/contact", label: "WhatsApp for funeral flowers" },
    relatedLinks: [
      { href: "/occasions", label: "Occasions" },
      { href: "/collections/flowers", label: "All flowers" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
      { href: "/contact", label: "Contact" },
    ],
    breadcrumbLabel: "Funeral Flowers Nairobi",
  },

  "mixed-bouquets-nairobi": {
    slug: "mixed-bouquets-nairobi",
    metaTitle: "Mixed Flower Bouquets Nairobi | Colourful Same-Day Delivery | The Stems",
    metaDescription:
      "Shop mixed flower bouquets in Nairobi — colourful seasonal arrangements with same-day delivery from The Stems Flowers CBD.",
    h1: "Mixed Flower Bouquets Nairobi",
    intro: [
      "Colourful mixed flower bouquets for birthdays, thank-yous and everyday surprises in Nairobi. Our florists combine roses, seasonal blooms and filler flowers for full, photo-ready arrangements.",
      "Same-day delivery across Nairobi for orders by 4PM. Browse the collection or message WhatsApp for a custom colour mix.",
    ],
    faqs: [
      {
        question: "What is in a mixed bouquet?",
        answer:
          "A seasonal mix of focal flowers (often roses) with complementary blooms and greenery. Exact stems vary with market availability.",
      },
    ],
    productCategories: ["flowers"],
    productLimit: 8,
    preferKeywords: ["mixed", "bouquet", "colour", "color"],
    ctaPrimary: { href: "/collections/flowers", label: "Shop mixed bouquets" },
    relatedLinks: [
      { href: "/flowers", label: "Flowers hub" },
      { href: "/red-roses-nairobi", label: "Red roses Nairobi" },
      { href: "/birthday-flowers-nairobi", label: "Birthday flowers" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    breadcrumbLabel: "Mixed Bouquets Nairobi",
  },

  "gift-hampers-nairobi": {
    slug: "gift-hampers-nairobi",
    metaTitle: "Gift Hampers Nairobi | Luxury, Chocolate & Corporate | The Stems",
    metaDescription:
      "Order gift hampers in Nairobi — luxury, chocolate, flower and corporate hampers with same-day delivery from The Stems Flowers.",
    h1: "Gift Hampers Nairobi – Luxury & Same-Day",
    intro: [
      "Luxury gift hampers in Nairobi for birthdays, corporate clients, anniversaries and thank-yous. Choose chocolate-led hampers, flower hampers, self-care sets or fully custom baskets.",
      "The Stems Flowers delivers same day across Nairobi. Pay with M-Pesa or card and add a personal note for the recipient.",
    ],
    sections: [
      {
        heading: "Hamper styles",
        body: "Luxury celebration baskets, chocolate hampers, flower-and-wine combos, corporate client gifts and custom builds for special briefs.",
      },
    ],
    faqs: [
      {
        question: "Can I customise a gift hamper?",
        answer:
          "Yes. Message us on WhatsApp with your budget and preferences — chocolates, wine, teddy, flowers or corporate branding.",
      },
    ],
    productCategories: ["hampers", "chocolates", "wines"],
    productLimit: 8,
    preferKeywords: ["hamper", "gift", "luxury", "chocolate"],
    ctaPrimary: { href: "/collections/gift-hampers", label: "Shop gift hampers" },
    ctaSecondary: { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
    relatedLinks: [
      { href: "/collections/gift-hampers", label: "All hampers" },
      { href: "/corporate-gift-hampers-nairobi", label: "Corporate gifts" },
      { href: "/flower-wine-hamper-nairobi", label: "Flower & wine hampers" },
      { href: "/gifts", label: "All gifts" },
    ],
    breadcrumbLabel: "Gift Hampers Nairobi",
  },

  "teddy-bears-nairobi": {
    slug: "teddy-bears-nairobi",
    metaTitle: "Teddy Bears Nairobi | 25cm to Giant | Flowers Combo | The Stems",
    metaDescription:
      "Buy teddy bears in Nairobi — 25cm, 50cm, 100cm and giant sizes. Pair with flowers or chocolates. Same-day delivery from The Stems.",
    h1: "Teddy Bears Nairobi – Soft Gifts, Same-Day",
    intro: [
      "Soft teddy bears in Nairobi for birthdays, graduations, kids gifts and romantic surprises. Choose from compact 25cm bears to giant cuddle sizes, or pair a teddy with flowers and chocolates.",
      "Same-day delivery available across Nairobi from The Stems Flowers CBD florist.",
    ],
    faqs: [
      {
        question: "What teddy sizes do you stock?",
        answer:
          "Common sizes include 25cm, 50cm and 100cm, plus larger giant bears when available. Check the teddy collection for current stock.",
      },
    ],
    productCategories: ["teddy", "flowers"],
    productLimit: 8,
    preferKeywords: ["teddy", "bear", "soft"],
    ctaPrimary: { href: "/collections/teddy-bears", label: "Shop teddy bears" },
    ctaSecondary: { href: "/collections/flowers", label: "Add flowers" },
    relatedLinks: [
      { href: "/collections/teddy-bears", label: "Teddy collection" },
      { href: "/birthday-flowers-nairobi", label: "Birthday flowers" },
      { href: "/graduation-bouquets-nairobi", label: "Graduation bouquets" },
      { href: "/gifts", label: "All gifts" },
    ],
    breadcrumbLabel: "Teddy Bears Nairobi",
  },

  "chocolates-nairobi": {
    slug: "chocolates-nairobi",
    metaTitle: "Chocolates Nairobi | Ferrero & Flower Combos | The Stems",
    metaDescription:
      "Order chocolates in Nairobi — Ferrero Rocher, chocolate hampers and flower-and-chocolate gifts with same-day delivery from The Stems.",
    h1: "Chocolates & Sweet Gifts Nairobi",
    intro: [
      "Premium chocolates in Nairobi for romantic dates, birthdays and thank-yous. Ferrero Rocher boxes, chocolate hampers and classic flower-plus-chocolate combos are ready for same-day delivery.",
      "Shop online or WhatsApp us to build a custom sweet gift with roses or a teddy.",
    ],
    faqs: [
      {
        question: "Do you deliver Ferrero Rocher in Nairobi?",
        answer:
          "Yes when in stock. Pair Ferrero with flowers or a teddy for a complete gift.",
      },
    ],
    productCategories: ["chocolates", "flowers", "hampers"],
    productLimit: 8,
    preferKeywords: ["chocolate", "ferrero", "sweet"],
    ctaPrimary: { href: "/collections/chocolates", label: "Shop chocolates" },
    ctaSecondary: { href: "/collections/flowers", label: "Add flowers" },
    relatedLinks: [
      { href: "/collections/chocolates", label: "Chocolates collection" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/red-roses-nairobi", label: "Red roses" },
      { href: "/gifts", label: "All gifts" },
    ],
    breadcrumbLabel: "Chocolates Nairobi",
  },

  "flower-delivery-nairobi": {
    slug: "flower-delivery-nairobi",
    metaTitle: "Flower Delivery Nairobi | Same-Day Roses & Bouquets | The Stems",
    metaDescription:
      "Flower delivery Nairobi with same-day service. Fresh roses, mixed bouquets and gift hampers from The Stems Flowers CBD. Order online, pay M-Pesa.",
    h1: "Flower Delivery Nairobi – Fresh Flowers, Same Day",
    intro: [
      "Looking for reliable flower delivery in Nairobi? The Stems Flowers prepares fresh roses, mixed bouquets and gift hampers at our CBD florist (Delta Hotel, University Way) and delivers across the city the same day for orders placed by 4PM.",
      "Whether you need birthday flowers, anniversary roses, graduation bouquets or a last-minute apology arrangement, we make ordering simple online or on WhatsApp — with M-Pesa and card payment.",
    ],
    sections: [
      {
        heading: "Where we deliver in Nairobi",
        body: "We deliver to Nairobi CBD, Westlands, Kilimani, Karen, Lavington, Kileleshwa, Upper Hill, Runda, Gigiri and nearby estates. Check our area pages for local delivery details.",
      },
      {
        heading: "What you can send",
        body: "Red and mixed roses, colourful bouquets, flower boxes, teddy-and-flower combos, chocolate gifts and luxury hampers — prepared fresh for every delivery.",
      },
    ],
    faqs: [
      {
        question: "How fast is flower delivery in Nairobi?",
        answer:
          "Same-day delivery is available for orders placed by 4PM, depending on your area and traffic. CBD and nearby zones are typically fastest.",
      },
      {
        question: "How do I pay for flower delivery?",
        answer:
          "Pay securely online with M-Pesa or card via Pesapal, or confirm your order on WhatsApp.",
      },
    ],
    productCategories: ["flowers", "hampers"],
    productLimit: 8,
    preferKeywords: ["rose", "bouquet", "delivery"],
    ctaPrimary: { href: "/collections/flowers", label: "Order flowers now" },
    ctaSecondary: { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery info" },
    relatedLinks: [
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day flower delivery" },
      { href: "/florist-nairobi", label: "Florist Nairobi" },
      { href: "/flower-shop-nairobi", label: "Flower shop Nairobi" },
      { href: "/flowers-and-gifts-nairobi", label: "Flowers and gifts" },
      { href: "/flower-delivery-westlands-nairobi", label: "Westlands delivery" },
      { href: "/flower-delivery-kilimani-nairobi", label: "Kilimani delivery" },
    ],
    breadcrumbLabel: "Flower Delivery Nairobi",
  },

  "florist-nairobi": {
    slug: "florist-nairobi",
    metaTitle: "Florist Nairobi | The Stems Flowers CBD | Same-Day Delivery",
    metaDescription:
      "Trusted florist in Nairobi at Delta Hotel, University Way. Fresh flowers, roses, hampers and teddy bears. Walk in or order same-day delivery citywide.",
    h1: "Florist Nairobi – The Stems Flowers",
    intro: [
      "The Stems Flowers is a Nairobi florist based at Delta Hotel, University Way in the CBD. We craft fresh bouquets daily for walk-in customers and online orders, with same-day delivery across Nairobi.",
      "From romantic red roses to graduation bouquets, gift hampers and teddy bears, our florists help you choose the right gift — then deliver it looking fresh.",
    ],
    sections: [
      {
        heading: "Visit our Nairobi CBD flower shop",
        body: "Open Monday–Saturday for walk-ins. Prefer to order online? Browse flowers and gifts on this site and checkout with M-Pesa, or message us on WhatsApp for custom arrangements.",
      },
    ],
    faqs: [
      {
        question: "Where is your florist located in Nairobi?",
        answer:
          "Delta Hotel, University Way, Nairobi CBD. We also deliver citywide from this studio.",
      },
      {
        question: "Do you offer same-day florist delivery?",
        answer:
          "Yes. Order by 4PM for same-day delivery across most Nairobi areas.",
      },
    ],
    productCategories: ["flowers", "hampers", "teddy"],
    productLimit: 8,
    preferKeywords: ["rose", "bouquet", "florist"],
    ctaPrimary: { href: "/collections/flowers", label: "Shop as a florist customer" },
    ctaSecondary: { href: "/florist-nairobi-cbd", label: "CBD florist details" },
    relatedLinks: [
      { href: "/florist-nairobi-cbd", label: "Florist Nairobi CBD" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/flower-shop-nairobi", label: "Flower shop Nairobi" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
      { href: "/contact", label: "Contact / visit us" },
    ],
    breadcrumbLabel: "Florist Nairobi",
  },

  "flower-shop-nairobi": {
    slug: "flower-shop-nairobi",
    metaTitle: "Flower Shop Nairobi | Walk-In & Online Orders | The Stems",
    metaDescription:
      "Flower shop in Nairobi CBD — fresh bouquets, roses and gift hampers. Walk in at Delta Hotel, University Way or order online for same-day delivery.",
    h1: "Flower Shop Nairobi – Walk In or Order Online",
    intro: [
      "Need a flower shop in Nairobi you can trust? The Stems Flowers is a full-service flower shop in the CBD with ready bouquets, custom arrangements, gift hampers and teddy bears.",
      "Walk in at Delta Hotel, University Way, or shop online for delivery across Nairobi the same day.",
    ],
    faqs: [
      {
        question: "Can I walk into your flower shop?",
        answer:
          "Yes. Visit us at Delta Hotel, University Way, Nairobi CBD, Monday–Saturday during shop hours.",
      },
    ],
    productCategories: ["flowers", "hampers"],
    productLimit: 8,
    preferKeywords: ["bouquet", "rose", "shop"],
    ctaPrimary: { href: "/collections/flowers", label: "Shop flowers online" },
    ctaSecondary: { href: "/contact", label: "Get directions & hours" },
    relatedLinks: [
      { href: "/florist-nairobi", label: "Florist Nairobi" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery" },
      { href: "/flowers-and-gifts-nairobi", label: "Flowers and gifts" },
      { href: "/gifts", label: "Gift shop" },
    ],
    breadcrumbLabel: "Flower Shop Nairobi",
  },

  "flowers-and-gifts-nairobi": {
    slug: "flowers-and-gifts-nairobi",
    metaTitle: "Flowers and Gifts Nairobi | Bouquets, Hampers & Teddy Bears | The Stems",
    metaDescription:
      "Flowers and gifts in Nairobi — bouquets, roses, gift hampers, chocolates and teddy bears with same-day delivery from The Stems Flowers.",
    h1: "Flowers and Gifts Nairobi",
    intro: [
      "One place for flowers and gifts in Nairobi: fresh bouquets, red roses, luxury gift hampers, chocolates, wines and teddy bears — curated for birthdays, anniversaries, graduations and corporate thank-yous.",
      "Order online for same-day delivery or visit our CBD flower shop. Pay with M-Pesa or card.",
    ],
    sections: [
      {
        heading: "Build the perfect gift",
        body: "Combine flowers with a teddy, Ferrero chocolates or a hamper. Our team can also customise corporate gifts for clients and employees.",
      },
    ],
    faqs: [
      {
        question: "Do you sell more than flowers?",
        answer:
          "Yes — gift hampers, teddy bears, chocolates, wines and greeting cards, with or without flowers.",
      },
    ],
    productCategories: ["flowers", "hampers", "teddy", "chocolates"],
    productLimit: 8,
    preferKeywords: ["gift", "hamper", "rose", "teddy"],
    ctaPrimary: { href: "/gifts", label: "Browse all gifts" },
    ctaSecondary: { href: "/collections/flowers", label: "Browse flowers" },
    relatedLinks: [
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/teddy-bears-nairobi", label: "Teddy bears" },
      { href: "/chocolates-nairobi", label: "Chocolates" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery" },
      { href: "/occasions", label: "Shop by occasion" },
    ],
    breadcrumbLabel: "Flowers and Gifts Nairobi",
  },

  "roses-nairobi": {
    slug: "roses-nairobi",
    metaTitle: "Roses Nairobi | Red, Pink & White Rose Delivery | The Stems",
    metaDescription:
      "Order roses in Nairobi — red, pink and white rose bouquets with same-day delivery from The Stems Flowers CBD florist.",
    h1: "Roses Nairobi – Red, Pink & White Bouquets",
    intro: [
      "Fresh rose bouquets in Nairobi for romance, apologies, anniversaries and celebrations. Choose classic red roses, soft pink or elegant white — prepared daily at our CBD florist.",
      "Same-day rose delivery across Nairobi for orders by 4PM. Pair roses with chocolates or a teddy for a fuller gift.",
    ],
    faqs: [
      {
        question: "Do you deliver red roses same day in Nairobi?",
        answer:
          "Yes when in stock. Order by 4PM for same-day delivery to most Nairobi areas.",
      },
    ],
    productCategories: ["flowers"],
    productLimit: 8,
    preferKeywords: ["rose", "red", "pink", "white"],
    ctaPrimary: { href: "/red-roses-nairobi", label: "Red roses Nairobi" },
    ctaSecondary: { href: "/collections/flowers", label: "All flower bouquets" },
    relatedLinks: [
      { href: "/red-roses-nairobi", label: "Red roses" },
      { href: "/pink-roses-nairobi", label: "Pink roses" },
      { href: "/white-roses-nairobi", label: "White roses" },
      { href: "/anniversary-flowers-nairobi", label: "Anniversary flowers" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery" },
    ],
    breadcrumbLabel: "Roses Nairobi",
  },

  "corporate-flowers-nairobi": {
    slug: "corporate-flowers-nairobi",
    metaTitle: "Corporate Flowers Nairobi | Office & Client Gifts | The Stems",
    metaDescription:
      "Corporate flowers and gift hampers in Nairobi for offices, clients and employee appreciation. Same-day delivery from The Stems Flowers.",
    h1: "Corporate Flowers & Gifts Nairobi",
    intro: [
      "Impress clients and thank teams with corporate flowers and gift hampers in Nairobi. We deliver office bouquets, boardroom arrangements and branded-feel gift baskets across the CBD, Upper Hill, Westlands and beyond.",
      "Share your guest list or delivery schedule on WhatsApp — we handle multi-drop corporate orders with care.",
    ],
    sections: [
      {
        heading: "Corporate gift ideas",
        body: "Client thank-you bouquets, employee appreciation hampers, event centrepieces and welcome flowers for offices and hotels.",
      },
    ],
    faqs: [
      {
        question: "Can you deliver to multiple offices in one day?",
        answer:
          "Yes for scheduled corporate drops. Contact us with addresses and preferred time windows.",
      },
    ],
    productCategories: ["flowers", "hampers"],
    productLimit: 8,
    preferKeywords: ["corporate", "office", "hamper", "gift"],
    ctaPrimary: { href: "/corporate-gift-hampers-nairobi", label: "Corporate gift hampers" },
    ctaSecondary: { href: "/collections/flowers", label: "Office flower bouquets" },
    relatedLinks: [
      { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/flower-delivery-nairobi-cbd", label: "CBD delivery" },
      { href: "/flower-delivery-upper-hill-nairobi", label: "Upper Hill delivery" },
    ],
    breadcrumbLabel: "Corporate Flowers Nairobi",
  },

  "flowers-across-kenya": {
    slug: "flowers-across-kenya",
    metaTitle: "Flower Delivery Kenya | Send Flowers to Nairobi & Beyond | The Stems",
    metaDescription:
      "Send flowers in Kenya via The Stems Flowers. Primary same-day service covers Nairobi. Enquire on WhatsApp for delivery to other towns we serve.",
    h1: "Flower Delivery Across Kenya",
    intro: [
      "The Stems Flowers specialises in same-day flower and gift delivery across Nairobi. Friends and family abroad (and across Kenya) often order with us to surprise someone in the city.",
      "For towns outside Nairobi, message us on WhatsApp with the destination — we confirm if we can deliver or arrange a partner handoff before you pay. We only take orders for places we can reliably serve.",
    ],
    sections: [
      {
        heading: "Nairobi is our core coverage",
        body: "CBD, Westlands, Kilimani, Karen, Lavington, Kileleshwa, Upper Hill, Runda, Gigiri and nearby estates enjoy the fastest same-day options.",
      },
      {
        heading: "Ordering from outside Kenya",
        body: "Use our send-gifts-to-Kenya guide or WhatsApp with the recipient’s Nairobi address — we handle local delivery while you pay online.",
      },
    ],
    faqs: [
      {
        question: "Do you deliver flowers everywhere in Kenya?",
        answer:
          "Our reliable same-day network is Nairobi-focused. Contact us for other towns — we confirm coverage before accepting payment.",
      },
    ],
    productCategories: ["flowers", "hampers"],
    productLimit: 8,
    preferKeywords: ["flower", "gift", "delivery"],
    ctaPrimary: { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
    ctaSecondary: { href: "/send-gifts-to-kenya", label: "Send gifts to Kenya" },
    relatedLinks: [
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day Nairobi" },
      { href: "/send-gifts-to-kenya", label: "Send gifts to Kenya" },
      { href: "/contact", label: "Enquire for other towns" },
    ],
    breadcrumbLabel: "Flowers Across Kenya",
  },
};

export function getCategoryLanding(slug: string): CategoryLandingConfig | undefined {
  return CATEGORY_LANDINGS[slug];
}

export function allCategoryLandingSlugs(): string[] {
  return Object.keys(CATEGORY_LANDINGS);
}
