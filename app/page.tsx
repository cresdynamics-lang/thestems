import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import { getBlogPosts } from "@/lib/blogData";
import { format } from "date-fns";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://the.stems.ke";

export const metadata: Metadata = {
  title: "Express Love & Celebrate Moments | Anniversary Flowers, Birthday Gifts, Surprise Hampers & Apology Flowers Nairobi | The Stems Flowers",
  description:
    "Celebrate every moment that matters: anniversary flowers, birthday surprises, apology bouquets & thoughtful gift hampers in Nairobi. Same-day delivery across CBD, Westlands, Karen, Lavington. Premium flowers, chocolates, wine & teddy bears. Order online with M-Pesa.",
  keywords: [
    // Occasion-based Core Keywords
    "anniversary flowers Nairobi",
    "anniversary gifts Nairobi",
    "birthday flowers Nairobi",
    "birthday gifts Nairobi",
    "surprise gifts Nairobi",
    "apology flowers Nairobi",
    "sorry flowers Nairobi",
    "romantic flowers Nairobi",
    "gift hampers Nairobi",
    "flower delivery Nairobi",
    "same-day delivery Nairobi",

    // Anniversary Keywords
    "anniversary flowers for wife Nairobi",
    "anniversary gifts for husband Nairobi",
    "wedding anniversary flowers Nairobi",
    "1st anniversary flowers Nairobi",
    "5th anniversary gifts Nairobi",
    "10th anniversary flowers Nairobi",
    "25th anniversary flowers Nairobi",
    "50th anniversary flowers Nairobi",
    "romantic anniversary gifts Nairobi",
    "anniversary surprise Nairobi",
    "anniversary bouquet Nairobi",
    "anniversary hampers Nairobi",

    // Birthday Keywords
    "birthday flowers for her Nairobi",
    "birthday flowers for him Nairobi",
    "birthday surprise gifts Nairobi",
    "birthday gift hampers Nairobi",
    "birthday bouquet Nairobi",
    "birthday flowers delivery Nairobi",
    "surprise birthday gifts Nairobi",
    "birthday flowers and chocolates Nairobi",
    "birthday teddy bears Nairobi",
    "birthday wine gifts Nairobi",

    // Surprise & Spontaneous Keywords
    "surprise flowers Nairobi",
    "surprise gifts for girlfriend Nairobi",
    "surprise gifts for boyfriend Nairobi",
    "surprise gifts for wife Nairobi",
    "surprise gifts for husband Nairobi",
    "just because flowers Nairobi",
    "spontaneous gifts Nairobi",
    "unexpected flowers Nairobi",
    "surprise delivery Nairobi",
    "romantic surprises Nairobi",

    // Apology & Reconciliation Keywords
    "apology flowers Nairobi",
    "sorry flowers Nairobi",
    "I'm sorry flowers Nairobi",
    "forgiveness flowers Nairobi",
    "apology gift hampers Nairobi",
    "sorry bouquet Nairobi",
    "make up flowers Nairobi",
    "reconciliation gifts Nairobi",
    "apology flowers delivery Nairobi",
    "express sorry with flowers Nairobi",

    // Relationship-based Keywords
    "gifts for wife Nairobi",
    "gifts for husband Nairobi",
    "gifts for girlfriend Nairobi",
    "gifts for boyfriend Nairobi",
    "gifts for mom Nairobi",
    "gifts for dad Nairobi",
    "gifts for loved ones Nairobi",
    "romantic gifts Nairobi",
    "thoughtful gifts Nairobi",

    // Product-specific Keywords
    "roses Nairobi",
    "flower bouquets Nairobi",
    "chocolate hampers Nairobi",
    "wine gifts Nairobi",
    "teddy bears Nairobi",
    "money bouquet Nairobi",
    "luxury hampers Nairobi",
    "premium flowers Nairobi",
    "fresh flowers Nairobi",

    // Location-specific Keywords
    "flower delivery Nairobi CBD",
    "flowers Westlands",
    "gifts Karen Nairobi",
    "flower delivery Lavington",
    "gifts Kilimani",
    "flowers Kilimani",
    "gifts Westlands",
    "flower delivery Kileleshwa",

    // Timing & Urgency Keywords
    "same-day flower delivery Nairobi",
    "urgent flower delivery Nairobi",
    "last minute gifts Nairobi",
    "express delivery Nairobi",
    "rush flower delivery Nairobi",
    "emergency flowers Nairobi",

    // Search Intent Keywords
    "where to buy flowers Nairobi",
    "best florist Nairobi",
    "gift ideas Nairobi",
    "how to surprise someone Nairobi",
    "romantic gestures Nairobi",
    "affordable gifts Nairobi",
    "luxury gifts Nairobi",
    "online flower delivery Nairobi",
    "order flowers online Nairobi",

    // Voice & Long-tail Keywords
    "find flowers near me Nairobi",
    "florist near me Kenya",
    "order flowers online Nairobi",
    "gift delivery near me",
    "beautiful flower arrangements Nairobi",
    "personalized gift hampers Nairobi",
    "thoughtful presents Nairobi",
    "memorable gifts Nairobi",
    "unique gift ideas Nairobi",

    // Corporate & Business Keywords
    "corporate gifts Nairobi",
    "business gifts Nairobi",
    "employee appreciation gifts Nairobi",
    "client gifts Nairobi",

    // Traditional Keywords
    "best gifts for men Nairobi",
    "best gifts for women Nairobi",
    "best gifts for couples Nairobi",
    "romantic flowers Kenya",
    "gift hampers Kenya",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Express Love & Celebrate Moments | Anniversary Flowers, Birthday Gifts & Surprise Hampers Nairobi | The Stems Flowers",
    description: "Celebrate every moment that matters: anniversary flowers, birthday surprises, apology bouquets & thoughtful gift hampers in Nairobi. Same-day delivery across CBD, Westlands, Karen, Lavington.",
    url: baseUrl,
    siteName: "The Stems Flowers",
    images: [
      {
        url: "/images/logo/thestemslogo.jpeg",
        width: 1200,
        height: 630,
        alt: "The Stems Flowers - Express Love & Celebrate Every Moment in Nairobi",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Express Love & Celebrate Moments | Anniversary Flowers, Birthday Gifts & Surprise Hampers Nairobi",
    description: "Celebrate every moment that matters: anniversary flowers, birthday surprises, apology bouquets & thoughtful gift hampers in Nairobi. Same-day delivery across Nairobi.",
    images: ["/images/logo/thestemslogo.jpeg"],
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
  ],
};

// Helper function to create a product section
function ProductSection({
  title,
  subtitle,
  products,
  bgColor = "bg-brand-blush",
  linkHref,
}: {
  title: string;
  subtitle?: string;
  products: any[];
  bgColor?: string;
  linkHref?: string;
}) {
  return (
    <section className={`py-10 md:py-14 lg:py-16 ${bgColor} relative overflow-hidden`}>
      {/* Magazine-style background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
           }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-brand-gray-600 mt-1 md:mt-2">
                {subtitle}
              </p>
            )}
          </div>
          {linkHref && (
            <Link
              href={linkHref}
              className="text-brand-red hover:text-brand-red/80 font-medium text-base md:text-lg transition-colors"
            >
              View all
            </Link>
          )}
        </div>
        {products.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 md:gap-5 lg:gap-6 pb-4 scrollbar-thin scrollbar-thumb-brand-gray-300 scrollbar-track-transparent -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className="flex-shrink-0 w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] xs:min-w-[140px] xs:max-w-[140px] sm:min-w-[280px] sm:max-w-[300px] md:w-[320px]">
                <ProductCard
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  image={product.images[0] || "/images/products/hampers/GiftAmper3.jpg"}
                  slug={product.slug}
                  shortDescription={product.short_description}
                  category={product.category}
                  homePage={true}
                  priority={index < 3}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-gray-600 text-center py-8">No products available at the moment.</p>
        )}
      </div>
    </section>
  );
}

// Blog Section Component
async function BlogSection() {
  const posts = await getBlogPosts();
  
  // Fallback blog posts if database is empty - Similar to bloomsandgifts.co.ke style
  const BLOG_FALLBACK = [
    {
      slug: "how-to-choose-flowers-for-a-birthday",
      title: "How to Choose Flowers for a Birthday",
      excerpt: "We help you celebrate birthdays in floral style. Discover the perfect birthday blooms from The Stems. Learn how to choose flowers based on recipient's personality, occasion, and budget.",
      content: `# How to Choose Flowers for a Birthday

We help you celebrate birthdays in floral style

Why are flowers so popular for birthdays? Why are we so popular in gifting birthday flowers? Given their sweet fragrances and beautiful colors, flowers bring happiness and joy to the recipient. Flowers are associated with significant meanings and symbolism, making them the right gifts to appreciate a friend or family member during their birthdays. They help people express their emotions of friendship, gratitude, love, and more. Flowers are versatile and can be personalized in unique ways, such as arrangements to reflect the recipients' preferences and personality. Moreover, flowers influence a person's mental well-being and moods, making them a thoughtful gift for expressing appreciation and love as well as surprising friends and family members on their special day.

However, given the available flower varieties, it can be difficult to know the right kind of flowers to choose. This blog post provides a guideline for helping you choose the ideal birthday blooms from The Stems. The criteria for choosing the right birthday flowers is based on several parameters that include:

## Recipient's Personality

The first thing to consider when gifting someone flowers for their birthday is their personal preference. This includes asking yourself, what type of blooms do they like? Their color preferences, whether they prefer soft pastels or bright colors. Considering the recipient's personality demonstrates that you care and have put thought into selecting a perfect gift that suits the person's personality and a choice that brings them happiness.

## Consider the Occasion

Is the birthday occasion a casual get-together party, a surprise party, or a milestone birthday? The occasion can help you choose the right flower arrangement and size suitable for the birthday event. For individuals celebrating their golden jubilee (50 years), you may consider selecting a lot of roses to represent passion and vitality. For a person turning 21, you may go for colored flower varieties. Milestone birthdays are ideal for flower bouquets and choosing arrangements that align with the person's personality.

Another thing to consider is the symbolic representation of different flowers. Considering your budget is also essential in determining the best flower gift within one's budget. Choosing the right vase is also vital in ensuring the flowers fit perfectly. Don't forget to add a note, such as a handwritten card or poem, to show you care for the person you are gifting the blooms.

The common flowers to choose from for birthday events include roses, lilies, carnations, tulips, and sunflowers.

In addition, you may choose flowers that complement the birthday party themes. For example, you may opt for flowers that rhyme with the birthday cake.

## Add Special Touches

To personalize the birthday flower gift, you may consider including a personalized ribbon with a personalized message for the recipient to feel extra special. Other special touches include chocolates, a bottle of wine, teddy bears, birthday cakes or gift cards to enhance the birthday experience for the loved one.

However, when not sure what flowers to take, always ask for guidance from The Stems. For the loveliest, freshest, and long-lasting flowers, visit The Stems. Our team of dedicated staff will guide you on the perfectly handcrafted arrangements for your birthday occasion.`,
      author: "The Stems Team",
      publishedAt: new Date().toISOString(),
      image: "/images/products/flowers/BouquetFlowers3.jpg",
      category: "Gift Ideas",
      tags: ["flower delivery nairobi", "flowers", "birthday", "gifts"],
      readTime: 6,
      featured: true,
    },
    {
      slug: "best-anniversary-flowers-nairobi",
      title: "Best Anniversary Flowers: Expressing Love in Nairobi",
      excerpt: "Celebrate your love story with the perfect anniversary flowers. Discover the best flower arrangements to mark your special day in Nairobi. From roses to mixed bouquets, find the ideal blooms for your anniversary celebration.",
      content: `# Best Anniversary Flowers: Expressing Love in Nairobi

Celebrate your love story with the perfect anniversary flowers

Anniversaries are special milestones that deserve to be celebrated with meaningful gestures. Flowers have long been the language of love, and choosing the right anniversary flowers can beautifully express your feelings and commemorate another year of togetherness.

## Why Flowers for Anniversaries?

Flowers symbolize growth, beauty, and the enduring nature of love. They serve as a timeless way to express your feelings and show appreciation for your partner. In Nairobi, where we understand the importance of meaningful gestures, anniversary flowers are a popular choice for celebrating love.

## Choosing the Right Anniversary Flowers

### Consider the Anniversary Year

Different anniversary years have traditional flowers associated with them:
- **1st Anniversary**: Carnations or roses
- **5th Anniversary**: Daisies or roses
- **10th Anniversary**: Daffodils or roses
- **25th Anniversary**: Silver roses or mixed arrangements
- **50th Anniversary**: Golden roses or premium bouquets

### Color Symbolism

- **Red Roses**: Deep love and passion
- **Pink Roses**: Gratitude and admiration
- **White Roses**: Purity and new beginnings
- **Yellow Roses**: Friendship and joy
- **Mixed Colors**: Variety and excitement in your relationship

## Popular Anniversary Flower Arrangements in Nairobi

At The Stems, we offer a wide range of anniversary flower arrangements:

1. **Classic Rose Bouquets**: Timeless elegance with red, pink, or mixed roses
2. **Heart Box Arrangements**: Romantic arrangements in decorative heart-shaped boxes
3. **Vase Arrangements**: Beautiful mixed bouquets perfect for home display
4. **Premium Gift Hampers**: Flowers combined with chocolates, wine, or teddy bears

## Adding Personal Touches

To make your anniversary flowers even more special:
- Include a personalized message or card
- Add chocolates or a bottle of wine
- Choose flowers in your partner's favorite colors
- Select arrangements that match your anniversary theme

## Same-Day Delivery in Nairobi

We offer same-day delivery across Nairobi, including CBD, Westlands, Karen, Lavington, and surrounding areas. Place your order before 2 PM for same-day delivery and make your anniversary celebration even more special.

For the perfect anniversary flowers in Nairobi, trust The Stems. Our expert florists will help you create a memorable arrangement that perfectly expresses your love.`,
      author: "The Stems Team",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      image: "/images/products/flowers/BouquetFlowers4.jpg",
      category: "Occasions",
      tags: ["anniversary", "flowers", "nairobi", "romantic", "gifts"],
      readTime: 5,
      featured: true,
    },
    {
      slug: "same-day-flower-delivery-nairobi-guide",
      title: "Same Day Flower Delivery in Nairobi: Your Complete Guide",
      excerpt: "Need flowers delivered today in Nairobi? Our comprehensive guide covers everything you need to know about same-day flower delivery. From ordering tips to delivery areas, we help you send fresh flowers across Nairobi the same day.",
      content: `# Same Day Flower Delivery in Nairobi: Your Complete Guide

Need flowers delivered today? We make it happen in Nairobi

Life in Nairobi moves fast, and sometimes you need flowers delivered the same day. Whether it's a last-minute birthday surprise, an urgent apology, or a spontaneous gesture of love, same-day flower delivery can be a lifesaver. At The Stems, we pride ourselves on ensuring your heartfelt messages are delivered fresh and on time across Nairobi.

## Why Choose Same-Day Delivery?

1. **Spontaneity**: Life's best moments are often unplanned. Same-day delivery allows you to act on impulse and make someone's day instantly brighter.
2. **Forgetfulness**: We've all been there – a special occasion slips your mind. Same-day delivery is your secret weapon against forgotten anniversaries or birthdays.
3. **Freshness**: Flowers delivered on the same day are guaranteed to be at their peak freshness, ensuring they last longer and look more vibrant.
4. **Impact**: The surprise element of unexpected flowers can amplify the emotional impact of your gift.

## How Our Same-Day Delivery Works in Nairobi

Our process is designed to be seamless and efficient:

1. **Browse Our Collections**: Explore our wide range of exquisite flower bouquets, arrangements, and gift hampers.
2. **Place Your Order**: Select your desired flowers, add a personalized message, and proceed to checkout. Ensure you place your order before our daily cut-off time (usually 2 PM EAT for Nairobi deliveries).
3. **Provide Delivery Details**: Accurately fill in the recipient's name, phone number, and a precise delivery address within Nairobi.
4. **Secure Payment**: Complete your purchase using our convenient M-Pesa STK Push option.
5. **Relax and Track**: Once your order is confirmed, our dedicated team will meticulously prepare your bouquet and dispatch it for delivery.

## Delivery Areas in Nairobi

We proudly serve all major areas in Nairobi, including:
- **Nairobi CBD**: Central Business District
- **Westlands**: Including Parklands and surrounding areas
- **Karen**: Karen, Langata, and Ngong Road
- **Lavington**: Lavington, Kilimani, and Kileleshwa
- **Runda**: Runda and Gigiri
- **And many more areas across Nairobi!**

## Tips for a Smooth Same-Day Delivery Experience

- **Order Early**: To guarantee same-day delivery, especially during peak seasons, place your order as early as possible.
- **Accurate Information**: Double-check all recipient details. Incorrect phone numbers or addresses are the most common causes of delivery delays.
- **Be Specific**: If the delivery location is tricky, provide clear instructions in the "Delivery Instructions" section.
- **Consider Availability**: Ensure someone will be available to receive the flowers at the delivery address.

## Beyond Nairobi: Next-Day Delivery Across Kenya

While our same-day service is focused on Nairobi, we also offer reliable next-day delivery to other major towns across Kenya, including Mombasa, Kisumu, Nakuru, Eldoret, and more.

At The Stems, we believe in making every moment special. Our commitment to fresh flowers, beautiful arrangements, and timely delivery ensures your sentiments are perfectly conveyed. Order today and let us help you spread joy across Nairobi and beyond!`,
      author: "The Stems Team",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      image: "/images/products/flowers/BouquetFlowers4.jpg",
      category: "Delivery Guide",
      tags: ["nairobi", "delivery", "same-day", "flowers", "kenya"],
      readTime: 8,
      featured: true,
    },
    {
      slug: "graduation-gift-ideas-kenya-flowers",
      title: "Graduation Gift Ideas: Celebrate Success with Flowers in Kenya",
      excerpt: "Celebrate your graduate's achievement with thoughtful gift ideas. From flower bouquets to gift hampers, discover the perfect way to honor their success. Find graduation gift inspiration for students in Kenya.",
      content: `# Graduation Gift Ideas: Celebrate Success with Flowers in Kenya

Honor your graduate's achievement with meaningful gifts

Graduation is a milestone worth celebrating, and what better way to honor your graduate's achievement than with beautiful flowers and thoughtful gifts? At The Stems, we help you celebrate this special moment with arrangements that convey pride, joy, and congratulations.

## Why Flowers for Graduation?

Flowers symbolize growth, achievement, and new beginnings – perfect for celebrating a graduate's journey. They serve as a beautiful way to express your pride and congratulations while creating lasting memories of this special day.

## Best Flowers for Graduation

### Popular Choices

1. **Sunflowers**: Represent happiness, optimism, and success
2. **Roses**: Classic choice for expressing pride and admiration
3. **Mixed Bouquets**: Colorful arrangements that celebrate the achievement
4. **Lilies**: Symbolize purity and new beginnings
5. **Carnations**: Represent pride and admiration

## Graduation Gift Ideas

### Flower Arrangements

- **Classic Bouquets**: Traditional flower arrangements perfect for the occasion
- **Vase Arrangements**: Beautiful displays that can be kept as a memento
- **Basket Arrangements**: Elegant and practical gift options

### Gift Hampers

Combine flowers with other thoughtful items:
- **Flower & Chocolate Hampers**: Sweet treats to celebrate the achievement
- **Flower & Wine Hampers**: For graduates who can appreciate a celebratory drink
- **Flower & Teddy Bear Hampers**: A playful and memorable gift combination

## Personalizing Your Graduation Gift

1. **Add a Personalized Message**: Include a heartfelt card expressing your pride
2. **Choose Their Favorite Colors**: Select flowers in colors they love
3. **Consider Their Field of Study**: Choose arrangements that reflect their achievements
4. **Add Special Touches**: Include chocolates, a gift card, or other meaningful items

## Delivery Options in Kenya

We offer delivery across Kenya:
- **Nairobi**: Same-day delivery available
- **Mombasa, Kisumu, Nakuru**: Next-day delivery
- **Other Major Towns**: Reliable delivery service

## Tips for Choosing Graduation Gifts

- **Consider the Graduate's Personality**: Choose gifts that reflect who they are
- **Think About Practicality**: Consider gifts they can use in their next chapter
- **Budget Appropriately**: Graduation gifts can range from simple bouquets to elaborate hampers
- **Order in Advance**: Especially for graduation season, order early to ensure availability

## Making the Day Special

At The Stems, we understand that graduation is a significant milestone. Our team will help you choose the perfect arrangement or gift hamper that honors your graduate's achievement and creates a memorable celebration.

Whether you're celebrating a university graduation, high school completion, or any educational milestone, we have the perfect gift to express your pride and congratulations. Order today and make your graduate's special day even more memorable!`,
      author: "The Stems Team",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      image: "/images/products/flowers/BouquetFlowers6.jpg",
      category: "Gift Ideas",
      tags: ["graduation", "gifts", "kenya", "flowers", "celebration"],
      readTime: 6,
      featured: true,
    },
  ];

  const allPosts = posts.length > 0 ? posts : BLOG_FALLBACK;
  const latestPosts = allPosts.slice(0, 8);

  return (
    <section className="py-10 md:py-14 lg:py-16 bg-white relative overflow-hidden">
      {/* Magazine-style background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
           }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900">
            Latest from Our Blog
          </h2>
          <Link
            href="/blog"
            className="text-brand-red hover:text-brand-red/80 font-medium text-base md:text-lg transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-3 md:gap-5 lg:gap-6 pb-4 scrollbar-thin scrollbar-thumb-brand-gray-300 scrollbar-track-transparent -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex-shrink-0 w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] xs:min-w-[140px] xs:max-w-[140px] sm:min-w-[280px] sm:max-w-[300px] md:w-[320px] card overflow-hidden group hover:shadow-cardHover transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-gray-100">
                <Image
                  src={post.image || "/images/products/flowers/BouquetFlowers3.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 280px, 320px"
                  loading="lazy"
                  quality={70}
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="text-xs text-brand-gray-500 mb-2">
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </div>
                <h3 className="font-heading font-semibold text-base md:text-lg text-brand-gray-900 mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-brand-gray-600 text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="text-brand-green font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  // Fetch all products
  const [dbFlowers, dbHampers, dbTeddy] = await Promise.all([
    getProducts({ category: "flowers" }),
    getProducts({ category: "hampers" }),
    getProducts({ category: "teddy" }),
  ]);

  // Include predefined products for flowers
  const predefinedFlowers = getPredefinedProducts("flowers");
  const dbFlowerSlugs = new Set(dbFlowers.map(p => p.slug));
  const uniquePredefinedFlowers = predefinedFlowers.filter(p => !dbFlowerSlugs.has(p.slug));
  const allFlowers = [...dbFlowers, ...uniquePredefinedFlowers];

  // Fallback products for hampers if database is empty (only existing images: GiftAmper3, GiftAmper6)
  const HAMPER_FALLBACK = [
    { id: "hamper-gentlepaw-hamper", slug: "gentlepaw-hamper", title: "GentlePaw Hamper", price: 2050000, images: ["/images/products/hampers/GiftAmper3.jpg"], short_description: "100cm Teddy bear, Flower bouquet, Non Alcoholic wine, Ferrero rocher chocolate T16, Necklace, Bracelet, Watch", category: "hampers", tags: [] },
    { id: "hamper-signature-celebration-basket", slug: "signature-celebration-basket", title: "Signature Celebration Basket", price: 1050000, images: ["/images/products/hampers/GiftAmper6.jpg"], short_description: "Luxury gift hamper with curated items", category: "hampers", tags: [] },
  ];

  // Fallback products for teddy bears if database is empty (only existing images: Teddybear1, TeddyBears1, TeddyBears3)
  const TEDDY_FALLBACK = [
    { id: "teddy-dream-soft-teddy", slug: "dream-soft-teddy", title: "Dream Soft Teddy", price: 250000, images: ["/images/products/teddies/Teddybear1.jpg"], short_description: "25cm pink teddy bear. Available in brown, white, red, pink, and blue.", category: "teddy", tags: [] },
    { id: "teddy-fluffyjoy-bear", slug: "fluffyjoy-bear", title: "FluffyJoy Bear", price: 450000, images: ["/images/products/teddies/TeddyBears1.jpg"], short_description: "50cm teddy bear. Available in brown, white, red, pink, and blue.", category: "teddy", tags: [] },
    { id: "teddy-tender-heart-bear", slug: "tender-heart-bear", title: "Tender Heart Bear", price: 1250000, images: ["/images/products/teddies/TeddyBears3.jpg"], short_description: "120cm teddy bear with customized Stanley mug. Available in brown, white, red, pink, and blue.", category: "teddy", tags: [] },
  ];

  // Use fallback if database is empty
  const allHampers = dbHampers.length > 0 ? dbHampers : HAMPER_FALLBACK;
  const allTeddy = dbTeddy.length > 0 ? dbTeddy : TEDDY_FALLBACK;

  // Helper function to filter products by tags
  const filterByTags = (products: any[], tags: string[]) => {
    if (tags.length === 0) return products;
    return products.filter(product => 
      product.tags && tags.some(tag => 
        product.tags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  };

  // Helper function to shuffle/mix array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Helper function to mix different product types - ensures all types are included
  const mixProducts = (hampers: any[], flowers: any[], teddies: any[], count: number = 8) => {
    const mixed: any[] = [];
    
    // Ensure we have at least some from each category if available
    const hampersAvailable = hampers.length > 0;
    const flowersAvailable = flowers.length > 0;
    const teddiesAvailable = teddies.length > 0;
    
    const availableTypes = [hampersAvailable, flowersAvailable, teddiesAvailable].filter(Boolean).length;
    const itemsPerType = Math.max(2, Math.floor(count / Math.max(1, availableTypes)));
    
    // Add products from each category
    if (hampersAvailable && hampers.length > 0) {
      mixed.push(...hampers.slice(0, itemsPerType));
    }
    if (flowersAvailable && flowers.length > 0) {
      mixed.push(...flowers.slice(0, itemsPerType));
    }
    if (teddiesAvailable && teddies.length > 0) {
      mixed.push(...teddies.slice(0, itemsPerType));
    }
    
    // Fill remaining slots by cycling through available categories
    let typeIndex = 0;
    const allProducts = [
      ...(hampersAvailable ? hampers : []),
      ...(flowersAvailable ? flowers : []),
      ...(teddiesAvailable ? teddies : []),
    ];
    
    while (mixed.length < count && allProducts.length > 0) {
      const product = allProducts[typeIndex % allProducts.length];
      if (!mixed.some(p => p.id === product.id)) {
        mixed.push(product);
      }
      typeIndex++;
      if (typeIndex > allProducts.length * 2) break; // Prevent infinite loop
    }
    
    // If still not enough, repeat products
    if (mixed.length < count) {
      const needed = count - mixed.length;
      const allMixed = [...mixed];
      for (let i = 0; i < needed; i++) {
        allMixed.push(allMixed[i % allMixed.length]);
      }
      return shuffleArray(allMixed).slice(0, count);
    }
    
    return shuffleArray(mixed).slice(0, count);
  };

  // Valentine's Gift Hampers - gift hampers first (first 3), then mix teddy bears and flowers
  const newYearHampers = (() => {
    const result: any[] = [];
    // Add hampers FIRST (first 3, not shuffled)
    if (allHampers.length > 0) {
      result.push(...allHampers.slice(0, 3));
    }
    // Add teddy bears (at least 2)
    if (allTeddy.length > 0) {
      result.push(...allTeddy.slice(0, 2));
    }
    // Add flowers (at least 2)
    if (allFlowers.length > 0) {
      result.push(...allFlowers.slice(0, 2));
    }
    // Fill remaining with any available products (prioritize more hampers)
    const remainingHampers = allHampers.slice(3);
    const allAvailable = [...remainingHampers, ...allTeddy.slice(2), ...allFlowers.slice(2)].filter(p => p && p.id);
    let addedCount = 0;
    for (let i = 0; i < allAvailable.length && result.length < 8; i++) {
      const next = allAvailable[i];
      if (next && next.id && !result.some(p => p && p.id === next.id)) {
        result.push(next);
        addedCount++;
      }
    }
    // Keep first 3 hampers in place, shuffle the rest
    const firstThree = result.slice(0, 3);
    const rest = shuffleArray(result.slice(3));
    return [...firstThree, ...rest].slice(0, 8);
  })();
  
  // Flowers delivered same day in Nairobi - mix different flower arrangements (shuffled)
  const sameDayFlowers = shuffleArray(allFlowers).slice(0, Math.max(8, allFlowers.length));
  
  // Holiday surprise gifts for families - mix hampers, flowers, and teddy bears
  const holidayFamilyProducts = (() => {
    const result: any[] = [];
    // Add hampers (at least 3)
    if (allHampers.length > 0) {
      result.push(...allHampers.slice(0, 3));
    }
    // Add teddy bears (at least 2)
    if (allTeddy.length > 0) {
      result.push(...allTeddy.slice(0, 2));
    }
    // Add flowers (at least 2)
    if (allFlowers.length > 0) {
      result.push(...allFlowers.slice(0, 2));
    }
    // Fill remaining
    const allAvailable = [...allHampers, ...allTeddy, ...allFlowers].filter(p => p && p.id);
    while (result.length < 8 && allAvailable.length > 0) {
      const index = result.length % allAvailable.length;
      const next = allAvailable[index];
      if (next && next.id && !result.some(p => p && p.id === next.id)) {
        result.push(next);
      } else {
        break;
      }
    }
    return shuffleArray(result).slice(0, 8);
  })();
  
  // Form Four Results Celebration Gifts - Parents celebrating their kids' KCSE results with hampers, flowers, and teddy bears
  const formFourResultsProducts = (() => {
    const result: any[] = [];
    if (allHampers.length > 0) result.push(...allHampers.slice(0, 3));
    if (allTeddy.length > 0) result.push(...allTeddy.slice(0, 2));
    if (allFlowers.length > 0) result.push(...allFlowers.slice(0, 2));
    const allAvailable = [...allHampers, ...allTeddy, ...allFlowers].filter(p => p && p.id);
    while (result.length < 8 && allAvailable.length > 0) {
      const next = allAvailable[result.length % allAvailable.length];
      if (!result.some(p => p.id === next.id)) {
        result.push(next);
      } else {
        break;
      }
    }
    return shuffleArray(result).slice(0, 8);
  })();
  
  // Valentine's anniversary celebrations - mix hampers, flowers, and teddy bears
  const anniversaryProducts = (() => {
    const result: any[] = [];
    if (allHampers.length > 0) result.push(...allHampers.slice(0, 3));
    if (allTeddy.length > 0) result.push(...allTeddy.slice(0, 2));
    if (allFlowers.length > 0) result.push(...allFlowers.slice(0, 2));
    const allAvailable = [...allHampers, ...allTeddy, ...allFlowers].filter(p => p && p.id);
    while (result.length < 8 && allAvailable.length > 0) {
      const next = allAvailable[result.length % allAvailable.length];
      if (!result.some(p => p.id === next.id)) {
        result.push(next);
      } else {
        break;
      }
    }
    return shuffleArray(result).slice(0, 8);
  })();
  
  // Say it with flowers - ONLY flowers, but mixed different arrangements
  const sayItWithFlowers = shuffleArray(allFlowers).slice(0, Math.max(8, allFlowers.length));
  
  // Gift Hampers - dedicated section
  const giftHampers = (() => {
    if (allHampers.length >= 8) {
      return allHampers.slice(0, 8);
    }
    // If not enough, repeat to reach 8
    const result = [...allHampers];
    while (result.length < 8 && allHampers.length > 0) {
      result.push(...allHampers);
    }
    return result.slice(0, 8);
  })();
  
  // Teddy Bears - dedicated section
  const teddyBears = (() => {
    if (allTeddy.length >= 8) {
      return allTeddy.slice(0, 8);
    }
    // If not enough, repeat to reach 8
    const result = [...allTeddy];
    while (result.length < 8 && allTeddy.length > 0) {
      result.push(...allTeddy);
    }
    return result.slice(0, 8);
  })();
  
  // Valentine's colleagues surprises - mix hampers, flowers, and teddy bears
  const colleaguesProducts = (() => {
    const result: any[] = [];
    if (allHampers.length > 0) result.push(...allHampers.slice(0, 3));
    if (allTeddy.length > 0) result.push(...allTeddy.slice(0, 2));
    if (allFlowers.length > 0) result.push(...allFlowers.slice(0, 2));
    const allAvailable = [...allHampers, ...allTeddy, ...allFlowers].filter(p => p && p.id);
    while (result.length < 8 && allAvailable.length > 0) {
      const next = allAvailable[result.length % allAvailable.length];
      if (!result.some(p => p.id === next.id)) {
        result.push(next);
      } else {
        break;
      }
    }
    return shuffleArray(result).slice(0, 8);
  })();

  // Fallback if no tagged products - ensure at least 8
  const getFallbackProducts = (category: string) => {
    if (category === "hampers") {
      // Only hampers, no mixing
      if (allHampers.length >= 8) {
        return allHampers.slice(0, 8);
      }
      const result = [...allHampers];
      while (result.length < 8 && allHampers.length > 0) {
        result.push(...allHampers);
      }
      return result.slice(0, 8);
    }
    if (category === "flowers") {
      return shuffleArray(allFlowers).slice(0, Math.max(8, allFlowers.length));
    }
    if (category === "teddy") {
      if (allTeddy.length >= 8) {
        return allTeddy.slice(0, 8);
      }
      const result = [...allTeddy];
      while (result.length < 8 && allTeddy.length > 0) {
        result.push(...allTeddy);
      }
      return result.slice(0, 8);
    }
    return mixProducts(allHampers, allFlowers, allTeddy, 8);
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div>
        <HeroCarousel />

        {/* Anniversary Gifts - Celebrate Love, Every Year */}
        <ProductSection
          title="Anniversary Gifts - Celebrate Love, Every Year"
          products={anniversaryProducts.length >= 8 ? anniversaryProducts : getFallbackProducts("mixed")}
          bgColor="bg-brand-blush"
          linkHref="/collections/flowers?tags=anniversary"
        />

        {/* Circular Collection Cards */}
        <section className="py-8 md:py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center gap-6 md:gap-8 lg:gap-12">
              {/* Flowers Card */}
              <Link
                href="/collections/flowers"
                className="group flex flex-col items-center"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white hover:border-brand-green transition-all duration-300 transform hover:scale-110">
                  <Image
                    src="/images/products/flowers/BouquetFlowers3.jpg"
                    alt="Flowers Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                  />
                </div>
                <h3 className="mt-3 md:mt-4 font-heading font-semibold text-sm md:text-base lg:text-lg text-brand-gray-900 group-hover:text-brand-green transition-colors">
                  Flowers
                </h3>
              </Link>

              {/* Teddy Bears Card */}
              <Link
                href="/collections/teddy-bears"
                className="group flex flex-col items-center"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white hover:border-brand-green transition-all duration-300 transform hover:scale-110">
                  <Image
                    src="/images/products/teddies/Teddybear1.jpg"
                    alt="Teddy Bears Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                  />
                </div>
                <h3 className="mt-3 md:mt-4 font-heading font-semibold text-sm md:text-base lg:text-lg text-brand-gray-900 group-hover:text-brand-green transition-colors">
                  Teddy Bears
                </h3>
              </Link>

              {/* Gift Hampers Card */}
              <Link
                href="/collections/gift-hampers"
                className="group flex flex-col items-center"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white hover:border-brand-green transition-all duration-300 transform hover:scale-110">
                  <Image
                    src="/images/products/hampers/GiftAmper3.jpg"
                    alt="Gift Hampers Collection"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                  />
                </div>
                <h3 className="mt-3 md:mt-4 font-heading font-semibold text-sm md:text-base lg:text-lg text-brand-gray-900 group-hover:text-brand-green transition-colors">
                  Gift Hampers
                </h3>
              </Link>
            </div>
          </div>
        </section>

        {/* Birthday Surprises - Make Their Day Extraordinary */}
        <ProductSection
          title="Birthday Surprises - Make Their Day Extraordinary"
          products={holidayFamilyProducts.length >= 8 ? holidayFamilyProducts : getFallbackProducts("mixed")}
          bgColor="bg-brand-blush"
          linkHref="/collections"
        />

        {/* Same-Day Flower Delivery - Express Your Feelings Today */}
        <ProductSection
          title="Same-Day Flower Delivery - Express Your Feelings Today"
          products={sameDayFlowers.length >= 8 ? sameDayFlowers : getFallbackProducts("flowers")}
          bgColor="bg-brand-blush"
          linkHref="/collections/flowers"
        />

        {/* Apology Flowers - Say Sorry with Beautiful Blooms */}
        <ProductSection
          title="Apology Flowers - Say Sorry with Beautiful Blooms"
          products={sayItWithFlowers.length >= 8 ? sayItWithFlowers : getFallbackProducts("flowers")}
          bgColor="bg-brand-blush"
          linkHref="/collections/flowers"
        />

        {/* Surprise Gift Hampers - Unexpected Joy, Delivered */}
        <ProductSection
          title="Surprise Gift Hampers - Unexpected Joy, Delivered"
          products={newYearHampers.length >= 8 ? newYearHampers : getFallbackProducts("hampers")}
          bgColor="bg-brand-blush"
          linkHref="/collections/gift-hampers"
        />

        {/* Just Because - Spontaneous Gestures of Love */}
        <ProductSection
          title="Just Because - Spontaneous Gestures of Love"
          products={colleaguesProducts.length >= 8 ? colleaguesProducts : getFallbackProducts("mixed")}
          bgColor="bg-brand-blush"
          linkHref="/collections"
        />

        {/* Premium Gift Hampers - Thoughtful Combinations */}
        <ProductSection
          title="Premium Gift Hampers - Thoughtful Combinations"
          products={giftHampers.length >= 8 ? giftHampers : getFallbackProducts("hampers")}
          bgColor="bg-brand-blush"
          linkHref="/collections/gift-hampers"
        />

        {/* Cuddly Teddy Bears - Warm Hugs, Lasting Memories */}
        <ProductSection
          title="Cuddly Teddy Bears - Warm Hugs, Lasting Memories"
          products={teddyBears}
          bgColor="bg-brand-blush"
          linkHref="/collections/teddy-bears"
        />

        {/* Celebration Gifts - Mark Every Milestone */}
        <ProductSection
          title="Celebration Gifts - Mark Every Milestone"
          products={formFourResultsProducts.length >= 8 ? formFourResultsProducts : getFallbackProducts("mixed")}
          bgColor="bg-brand-blush"
          linkHref="/collections/gift-hampers"
        />

        {/* Explore Collections Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{
                 backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
               }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-2 sm:mb-3 md:mb-4">
                Every Moment Deserves to Be Celebrated
              </h2>
              <p className="text-brand-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                Whether it's an anniversary, birthday, surprise, or apology—we help you express what words cannot. Premium flowers, luxury hampers, and cuddly teddy bears delivered same-day across Nairobi.
                <br />
                <span className="font-semibold text-brand-green">Because every feeling deserves the perfect gift.</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Gift Hampers Card */}
              <Link 
                href="/collections/gift-hampers"
                className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 overflow-hidden">
                  <Image
                    src="/images/products/hampers/GiftAmper3.jpg"
                    alt="Gift Hampers"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 text-white">
                    <h3 className="font-heading font-bold text-sm sm:text-base md:text-2xl lg:text-3xl mb-0.5 sm:mb-1 md:mb-2">Gift Hampers</h3>
                    <p className="text-xs sm:text-xs md:text-sm lg:text-base text-white/90 hidden sm:block">Thoughtful surprise packages</p>
                  </div>
                </div>
                <div className="p-2 sm:p-4 md:p-6">
                  <p className="text-brand-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-xs md:text-sm lg:text-base line-clamp-2 sm:line-clamp-none">
                    Luxury hampers with premium chocolates, wine, teddy bears, and beautiful flowers. Perfect for anniversaries, birthdays, surprises, or saying sorry. Same-day delivery across Nairobi.
                  </p>
                  <span className="inline-flex items-center text-brand-red font-semibold group-hover:gap-2 gap-1 transition-all duration-300 text-xs sm:text-xs md:text-sm">
                    Explore Hampers
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Flowers Card */}
              <Link 
                href="/collections/flowers"
                className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 overflow-hidden">
                  <Image
                    src="/images/products/flowers/BouquetFlowers3.jpg"
                    alt="Flowers"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 text-white">
                    <h3 className="font-heading font-bold text-sm sm:text-base md:text-2xl lg:text-3xl mb-0.5 sm:mb-1 md:mb-2">Fresh Flowers</h3>
                    <p className="text-xs sm:text-xs md:text-sm lg:text-base text-white/90 hidden sm:block">Express every emotion beautifully</p>
                  </div>
                </div>
                <div className="p-2 sm:p-4 md:p-6">
                  <p className="text-brand-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-xs md:text-sm lg:text-base line-clamp-2 sm:line-clamp-none">
                    Express love, celebrate anniversaries, surprise on birthdays, or say sorry with stunning roses, mixed bouquets, and elegant arrangements. Perfect for every occasion. Same-day delivery Nairobi.
                  </p>
                  <span className="inline-flex items-center text-brand-red font-semibold group-hover:gap-2 gap-1 transition-all duration-300 text-xs sm:text-xs md:text-sm">
                    Explore Flowers
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Teddy Bears Card */}
              <Link 
                href="/collections/teddy-bears"
                className="group relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 overflow-hidden">
                  <Image
                    src="/images/products/teddies/Teddybear1.jpg"
                    alt="Teddy Bears"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6 text-white">
                    <h3 className="font-heading font-bold text-sm sm:text-base md:text-2xl lg:text-3xl mb-0.5 sm:mb-1 md:mb-2">Teddy Bears</h3>
                    <p className="text-xs sm:text-xs md:text-sm lg:text-base text-white/90 hidden sm:block">Warm hugs, lasting memories</p>
                  </div>
                </div>
                <div className="p-2 sm:p-4 md:p-6">
                  <p className="text-brand-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-xs md:text-sm lg:text-base line-clamp-2 sm:line-clamp-none">
                    Soft and adorable teddy bears (25cm-200cm) perfect for birthdays, anniversaries, surprises, or just because. Available in brown, red, pink, white, and blue. A gift that brings comfort and joy.
                  </p>
                  <span className="inline-flex items-center text-brand-red font-semibold group-hover:gap-2 gap-1 transition-all duration-300 text-xs sm:text-xs md:text-sm">
                    Explore Teddy Bears
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* About The Stems Flowers Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{
                 backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
               }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text Content - Left Side */}
              <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4 md:mb-6 text-left">
                  About The Stems
                </h2>
                <p className="text-brand-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed text-left">
                  Every feeling deserves the perfect expression. The Stems Flowers is Nairobi&apos;s trusted florist specializing in premium flower arrangements, luxury gift hampers, and cuddly teddy bears that help you say what words cannot.
                </p>
                <p className="text-brand-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed text-left">
                  Whether you&apos;re celebrating an anniversary, surprising someone on their birthday, saying sorry, or simply showing you care—we believe every moment deserves to bloom beautifully.
                </p>
                <p className="text-brand-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed text-left">
                  With same-day delivery across Nairobi and a commitment to excellence, we&apos;ve helped thousands of customers express love, celebrate milestones, and create unforgettable moments.
                </p>
                <p className="text-brand-gray-600 text-sm md:text-base mb-8 md:mb-10 leading-relaxed text-left">
                  <span className="font-semibold text-brand-green">Because when words aren&apos;t enough, flowers speak volumes.</span> Our carefully curated collections ensure your sentiments are perfectly conveyed, every single time.
                </p>
                <Link
                  href="/about"
                  className="btn-primary inline-flex items-center gap-2 text-base md:text-lg px-8 md:px-10 py-3 md:py-4 hover:gap-3 transition-all duration-300"
                >
                  Learn More About Us
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Logo Image - Right Side */}
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-md md:max-w-lg">
                  <Image
                    src="/images/logo/thestemslogo.jpeg"
                    alt="The Stems Logo"
                    width={600}
                    height={600}
                    className="rounded-lg shadow-lg object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <BlogSection />
      </div>
    </>
  );
}
