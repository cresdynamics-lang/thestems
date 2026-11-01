/**
 * Internal linking matrix: topic → category chain → WhatsApp CTA context.
 * Used on blog posts and as the source of truth for SEO hub linking.
 */

export type SeoLink = { href: string; label: string };

export type SeoTopicChain = {
  id: string;
  /** Match against blog slug, title, tags, focusKeyword, category */
  match: RegExp;
  title: string;
  chain: SeoLink[];
  whatsappPrompt: string;
};

export const SEO_TOPIC_CHAINS: SeoTopicChain[] = [
  {
    id: "apology",
    match: /apology|i'?m sorry|say sorry|sorry flower/i,
    title: "Shop apology flowers",
    chain: [
      { href: "/apology-flowers-nairobi", label: "Apology flowers Nairobi" },
      { href: "/red-roses-nairobi", label: "Red roses" },
      { href: "/pink-roses-nairobi", label: "Pink roses" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    whatsappPrompt:
      "Hello! I need apology / I'm sorry flowers delivered in Nairobi.",
  },
  {
    id: "last-minute",
    match: /last.?minute|order.?now|urgent|same.?day.?gift/i,
    title: "Order same-day flowers now",
    chain: [
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
      { href: "/collections/flowers", label: "Shop flowers" },
      { href: "/birthday-flowers-nairobi", label: "Birthday flowers" },
      { href: "/blog/flower-prices-nairobi", label: "Price guide" },
    ],
    whatsappPrompt:
      "Hello! I need a last-minute same-day flower gift in Nairobi today.",
  },
  {
    id: "roses-count",
    match: /how.?many.?roses|dozen.?roses|stem.?count|12.?roses|24.?roses/i,
    title: "Shop rose bouquets",
    chain: [
      { href: "/roses-nairobi", label: "Roses Nairobi" },
      { href: "/red-roses-nairobi", label: "Red roses" },
      { href: "/pink-roses-nairobi", label: "Pink roses" },
      { href: "/anniversary-flowers-nairobi", label: "Anniversary flowers" },
      { href: "/blog/flower-prices-nairobi", label: "Price guide" },
    ],
    whatsappPrompt:
      "Hello! I need help choosing how many roses / which rose bouquet to send in Nairobi.",
  },
  {
    id: "diaspora",
    match: /send.?flowers.?to.?kenya|from.?abroad|diaspora|uk|usa|dubai|australia/i,
    title: "Send flowers to Kenya",
    chain: [
      { href: "/send-gifts-to-kenya", label: "Send gifts to Kenya" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/collections/flowers", label: "Shop flowers" },
      { href: "/blog/flower-prices-nairobi", label: "Flower prices" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    whatsappPrompt:
      "Hello! I'm abroad and would like to send flowers to someone in Nairobi / Kenya.",
  },
  {
    id: "flower-prices",
    match: /flower.?prices|how.?much.?do.?flowers|bouquet.?price|cost.?of.?roses/i,
    title: "Shop by budget",
    chain: [
      { href: "/collections/flowers", label: "Flowers from KES 3,000" },
      { href: "/roses-nairobi", label: "Roses Nairobi" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/blog/flower-delivery-nairobi", label: "Delivery guide" },
      { href: "/blog/what-flowers-to-send-occasion-kenya", label: "Occasion guide" },
    ],
    whatsappPrompt:
      "Hello! I'd like a bouquet recommendation within my budget in Nairobi.",
  },
  {
    id: "seasonal-peak",
    match: /valentine|mother.?s.?day|christmas.?flower/i,
    title: "Shop seasonal flowers",
    chain: [
      { href: "/red-roses-nairobi", label: "Red roses" },
      { href: "/mothers-day-flowers-nairobi", label: "Mother's Day flowers" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/blog/flower-prices-nairobi", label: "Price guide" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    whatsappPrompt:
      "Hello! I'd like to pre-order Valentine's / Mother's Day / Christmas flowers in Nairobi.",
  },
  {
    id: "flower-care",
    match: /last.?longer|keep.?flowers.?fresh|care.?for.?a.?bouquet|make.?roses.?last/i,
    title: "Order fresh flowers",
    chain: [
      { href: "/collections/flowers", label: "Shop fresh flowers" },
      { href: "/roses-nairobi", label: "Roses Nairobi" },
      { href: "/blog/flower-delivery-nairobi", label: "Delivery guide" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    whatsappPrompt:
      "Hello! I'd like to order a fresh bouquet in Nairobi today.",
  },
  {
    id: "gifts-women",
    match: /gifts?.for.?women|girlfriend|wives?|wife/i,
    title: "Shop gifts for women & girlfriends",
    chain: [
      { href: "/gifts", label: "All gifts" },
      { href: "/occasions", label: "Occasions" },
      { href: "/red-roses-nairobi", label: "Red roses" },
      { href: "/pink-roses-nairobi", label: "Pink roses" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/teddy-bears-nairobi", label: "Teddy bears" },
    ],
    whatsappPrompt:
      "Hello! I read your gifts for women & girlfriends guide and need help choosing in Nairobi.",
  },
  {
    id: "gifts-men",
    match: /gifts?.for.?men|wine.?hamper/i,
    title: "Shop gifts for men",
    chain: [
      { href: "/gifts", label: "All gifts" },
      { href: "/collections/wines", label: "Wine gifts" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/chocolates-nairobi", label: "Chocolates" },
      { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
    ],
    whatsappPrompt:
      "Hello! I'd like to order a gift for a man in Nairobi — wine hamper or flowers.",
  },
  {
    id: "location-delivery",
    match: /westlands|karen|kileleshwa|flower.?delivery.*(nairobi|westlands|karen)/i,
    title: "Order flower delivery near you",
    chain: [
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/flower-delivery-westlands-nairobi", label: "Westlands delivery" },
      { href: "/flower-delivery-karen-nairobi", label: "Karen delivery" },
      { href: "/flower-delivery-kileleshwa-nairobi", label: "Kileleshwa delivery" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    whatsappPrompt:
      "Hello! I'd like flower delivery in Westlands, Karen, Kileleshwa or Nairobi today.",
  },
  {
    id: "graduation",
    match: /graduation|pp2|grade\s*[369]|kids.?gifts|gifts?.for.?kids|children/i,
    title: "Shop graduation gifts",
    chain: [
      { href: "/graduation", label: "Graduation hub" },
      { href: "/graduation-bouquets-nairobi", label: "Graduation bouquets" },
      { href: "/gift-hampers-nairobi", label: "Graduation gift hampers" },
      { href: "/teddy-bears-nairobi", label: "Graduation teddy bears" },
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
    ],
    whatsappPrompt:
      "Hello! I read your graduation gifts guide and would like to order a graduation bouquet in Nairobi.",
  },
  {
    id: "birthday",
    match: /birthday/i,
    title: "Shop birthday flowers & gifts",
    chain: [
      { href: "/birthday-flowers-nairobi", label: "Birthday flowers Nairobi" },
      { href: "/roses-nairobi", label: "Roses Nairobi" },
      { href: "/chocolates-nairobi", label: "Flowers + chocolate" },
      { href: "/teddy-bears-nairobi", label: "Teddy bears" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
    ],
    whatsappPrompt:
      "Hello! I read your birthday flowers guide and would like to order a birthday gift in Nairobi.",
  },
  {
    id: "anniversary",
    match: /anniversary|romantic|rose.?color|valentine/i,
    title: "Shop anniversary & romantic gifts",
    chain: [
      { href: "/anniversary-flowers-nairobi", label: "Anniversary flowers" },
      { href: "/red-roses-nairobi", label: "Red roses" },
      { href: "/roses-nairobi", label: "All roses" },
      { href: "/gift-hampers-nairobi", label: "Romantic gift hampers" },
      { href: "/flower-wine-hamper-nairobi", label: "Flower & wine hamper" },
    ],
    whatsappPrompt:
      "Hello! I'd like to order anniversary flowers or a romantic gift hamper in Nairobi.",
  },
  {
    id: "same-day",
    match: /same.?day|delivery|keep.?.*roses.?fresh/i,
    title: "Order same-day flower delivery",
    chain: [
      { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/florist-nairobi", label: "Florist Nairobi" },
      { href: "/collections/flowers", label: "Shop flowers" },
      { href: "/flowers-and-gifts-nairobi", label: "Flowers and gifts" },
    ],
    whatsappPrompt:
      "Hello! I'd like same-day flower delivery in Nairobi today.",
  },
  {
    id: "wedding",
    match: /wedding|bridal|bridesmaid/i,
    title: "Shop wedding flowers",
    chain: [
      { href: "/weddings-events", label: "Weddings & events" },
      { href: "/wedding-flowers-nairobi", label: "Wedding flowers Nairobi" },
      { href: "/wedding-car-decor-nairobi", label: "Wedding car decor" },
      { href: "/contact", label: "Request a quote" },
    ],
    whatsappPrompt:
      "Hello! I'd like a quote for wedding flowers in Nairobi.",
  },
  {
    id: "funeral",
    match: /funeral|sympathy|condolence|wreath/i,
    title: "Sympathy & funeral flowers",
    chain: [
      { href: "/funeral-flowers-nairobi", label: "Funeral flowers Nairobi" },
      { href: "/collections/flowers", label: "Sympathy bouquets" },
      { href: "/contact", label: "WhatsApp for urgent orders" },
    ],
    whatsappPrompt:
      "Hello! I need sympathy or funeral flowers delivered in Nairobi.",
  },
  {
    id: "get-well",
    match: /get.?well|hospital|fruit.?basket/i,
    title: "Get well soon gifts",
    chain: [
      { href: "/get-well-soon-flowers-nairobi", label: "Get well flowers" },
      { href: "/fruit-baskets-nairobi", label: "Fruit baskets" },
      { href: "/gift-hampers-nairobi", label: "Get well hampers" },
      { href: "/teddy-bears-nairobi", label: "Teddy bears" },
    ],
    whatsappPrompt:
      "Hello! I'd like to send get-well flowers or a fruit basket in Nairobi.",
  },
  {
    id: "hampers",
    match: /hamper|wine|non.?alcoholic|chocolate/i,
    title: "Shop gift hampers",
    chain: [
      { href: "/gift-hampers-nairobi", label: "Gift hampers Nairobi" },
      { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
      { href: "/chocolates-nairobi", label: "Chocolates" },
      { href: "/flower-wine-hamper-nairobi", label: "Flower & wine" },
      { href: "/collections/gift-hampers", label: "Browse all hampers" },
    ],
    whatsappPrompt:
      "Hello! I'd like to order a gift hamper in Nairobi.",
  },
  {
    id: "teddy",
    match: /teddy/i,
    title: "Shop teddy bears",
    chain: [
      { href: "/teddy-bears-nairobi", label: "Teddy bears Nairobi" },
      { href: "/collections/teddy-bears", label: "All teddy sizes" },
      { href: "/birthday-flowers-nairobi", label: "Teddy + flowers" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
    ],
    whatsappPrompt:
      "Hello! I'd like to order a teddy bear gift in Nairobi.",
  },
  {
    id: "send-kenya",
    match: /abroad|send.*(kenya|nairobi)|diaspora|from.?overseas/i,
    title: "Send flowers to Kenya",
    chain: [
      { href: "/send-gifts-to-kenya", label: "Send gifts to Kenya" },
      { href: "/flowers-across-kenya", label: "Flowers across Kenya" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/contact", label: "Order for someone in Nairobi" },
    ],
    whatsappPrompt:
      "Hello! I'm abroad and would like to send flowers to someone in Nairobi.",
  },
  {
    id: "corporate",
    match: /corporate|office|client.?gift|employee/i,
    title: "Corporate flowers & gifts",
    chain: [
      { href: "/corporate-flowers-nairobi", label: "Corporate flowers" },
      { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
      { href: "/flower-delivery-upper-hill-nairobi", label: "Upper Hill delivery" },
      { href: "/flower-delivery-nairobi-cbd", label: "CBD delivery" },
    ],
    whatsappPrompt:
      "Hello! I need corporate flowers or gift hampers delivered in Nairobi.",
  },
];

export const DEFAULT_BLOG_CHAIN: SeoTopicChain = {
  id: "default",
  match: /.*/,
  title: "Shop flowers & gifts in Nairobi",
  chain: [
    { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
    { href: "/florist-nairobi", label: "Florist Nairobi" },
    { href: "/collections/flowers", label: "Shop flowers" },
    { href: "/gift-hampers-nairobi", label: "Gift hampers" },
    { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
  ],
  whatsappPrompt: "Hello! I read your blog and would like to order flowers or a gift in Nairobi.",
};

export function resolveBlogTopicChain(input: {
  slug: string;
  title: string;
  category?: string;
  tags?: string[];
  focusKeyword?: string;
}): SeoTopicChain {
  const haystack = [
    input.slug,
    input.title,
    input.category || "",
    input.focusKeyword || "",
    ...(input.tags || []),
  ].join(" ");

  return (
    SEO_TOPIC_CHAINS.find((topic) => topic.match.test(haystack)) ||
    DEFAULT_BLOG_CHAIN
  );
}

/** Primary homepage internal links (post-H1 supporting nav). */
export const HOMEPAGE_SEO_LINKS: SeoLink[] = [
  { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
  { href: "/florist-nairobi", label: "Florist Nairobi" },
  { href: "/flower-shop-nairobi", label: "Flower shop Nairobi" },
  { href: "/same-day-flower-delivery-nairobi", label: "Same-day delivery" },
  { href: "/flowers-and-gifts-nairobi", label: "Flowers and gifts" },
  { href: "/graduation-bouquets-nairobi", label: "Graduation bouquets" },
  { href: "/gift-hampers-nairobi", label: "Gift hampers" },
  { href: "/teddy-bears-nairobi", label: "Teddy bears" },
  { href: "/birthday-flowers-nairobi", label: "Birthday flowers" },
  { href: "/roses-nairobi", label: "Roses Nairobi" },
];

/** Suggested blog topics still worth publishing (editorial calendar). */
export const BLOG_SEO_CALENDAR = [
  "Graduation gifts for PP2, Grade 3, Grade 6 and Grade 9 in Nairobi",
  "Birthday flowers Nairobi — bouquet ideas by budget",
  "Anniversary flowers & rose meanings",
  "How same-day flower delivery works in Nairobi",
  "Wedding flowers Nairobi planning checklist",
  "Funeral and sympathy flower etiquette in Kenya",
  "Get well soon gifts: flowers vs fruit baskets",
  "Fruit baskets Nairobi for hospitals and offices",
  "Gift hampers Nairobi — what to include",
  "Teddy bear gift sizes for birthdays and graduations",
  "Send flowers to Kenya from abroad",
  "Corporate flowers and client gifts in Nairobi",
  "Nairobi flower delivery area guides (Westlands, Lavington, Karen)",
] as const;

const GUIDE_PRICES: SeoLink = { href: "/blog/flower-prices-nairobi", label: "Flower prices in Nairobi" };
const GUIDE_DELIVERY: SeoLink = { href: "/blog/flower-delivery-nairobi", label: "How delivery works in Nairobi" };
const GUIDE_OCCASIONS: SeoLink = { href: "/blog/what-flowers-to-send-occasion-kenya", label: "What flowers to send for each occasion" };
const GUIDE_CARE: SeoLink = { href: "/blog/how-to-make-flowers-last-longer", label: "How to make flowers last longer" };
const GUIDE_ROSES: SeoLink = { href: "/blog/how-many-roses-to-send-nairobi", label: "How many roses to send" };
const GUIDE_LAST_MINUTE: SeoLink = { href: "/blog/last-minute-same-day-flower-gifts-nairobi", label: "Last-minute same-day gifts" };

/** Sales page or product category → the blog guides that support it. First match wins. */
const GUIDE_RULES: { match: RegExp; guides: SeoLink[] }[] = [
  { match: /apolog/, guides: [{ href: "/blog/apology-flowers-nairobi-how-to-say-sorry", label: "How to say sorry with flowers" }, GUIDE_ROSES] },
  { match: /get-well|fruit/, guides: [{ href: "/blog/get-well-flowers-hospital-delivery-nairobi", label: "Get well flowers for hospital delivery" }, GUIDE_OCCASIONS] },
  { match: /graduation/, guides: [{ href: "/blog/graduation-and-kids-gifts-nairobi", label: "Graduation and kids gifts" }, { href: "/blog/best-gifts-for-children-nairobi", label: "Best gifts for children" }] },
  { match: /wedding/, guides: [{ href: "/blog/wedding-flowers-nairobi-the-stems", label: "Planning wedding flowers on a budget" }, { href: "/blog/best-gifts-for-couples-nairobi", label: "Best gifts for couples" }] },
  { match: /corporate/, guides: [{ href: "/blog/best-gift-hampers-for-corporate-gifting-nairobi", label: "Corporate gift hampers guide" }, { href: "/blog/best-gifts-for-colleagues-nairobi", label: "Best gifts for colleagues" }] },
  { match: /mothers-day|valentine/, guides: [{ href: "/blog/valentines-mothers-day-christmas-flowers-kenya", label: "When to order for peak dates" }, GUIDE_OCCASIONS] },
  { match: /kenya|send-gifts/, guides: [{ href: "/blog/send-flowers-to-kenya-from-abroad", label: "Sending flowers to Kenya from abroad" }, GUIDE_DELIVERY] },
  { match: /same-day/, guides: [GUIDE_LAST_MINUTE, GUIDE_DELIVERY, { href: "/blog/same-day-flower-delivery-nairobi-cbd", label: "Same-day delivery in the CBD" }] },
  { match: /flower-delivery-|florist|flower-shop/, guides: [GUIDE_DELIVERY, { href: "/blog/flower-delivery-westlands-karen-kileleshwa-nairobi", label: "Delivery to Westlands, Karen and Kileleshwa" }, GUIDE_PRICES] },
  { match: /roses?\b|roses-|anniversary/, guides: [GUIDE_ROSES, { href: "/blog/rose-colors-meaning-anniversaries", label: "What rose colours mean" }, { href: "/blog/how-to-keep-red-roses-fresh-nairobi", label: "Keeping red roses fresh" }] },
  { match: /teddy/, guides: [{ href: "/blog/teddy-bears-perfect-gifts-for-every-occasion", label: "Choosing a teddy bear size" }, { href: "/blog/best-gifts-for-children-nairobi", label: "Best gifts for children" }] },
  { match: /wine/, guides: [{ href: "/blog/non-alcoholic-wines-gift-hampers-guide", label: "Non-alcoholic wines for hampers" }, { href: "/blog/best-gifts-for-men-nairobi", label: "Best gifts for men" }] },
  { match: /hamper|chocolate/, guides: [{ href: "/blog/gifts-for-women-and-girlfriends-nairobi", label: "Gifts for women and girlfriends" }, { href: "/blog/best-gifts-for-wives-nairobi", label: "Best gifts for wives" }, { href: "/blog/best-gifts-for-men-nairobi", label: "Best gifts for men" }] },
  { match: /birthday/, guides: [{ href: "/blog/birthday-flowers-gift-hampers-nairobi", label: "Picking birthday flowers" }, GUIDE_OCCASIONS] },
  { match: /card|money/, guides: [{ href: "/blog/money-bouquet-nairobi", label: "Money bouquets explained" }, GUIDE_OCCASIONS] },
];

const DEFAULT_GUIDES: SeoLink[] = [GUIDE_PRICES, GUIDE_OCCASIONS, GUIDE_CARE];

export function resolveGuideLinks(key: string): SeoLink[] {
  return GUIDE_RULES.find((r) => r.match.test(key))?.guides ?? DEFAULT_GUIDES;
}
