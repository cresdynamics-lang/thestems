import Link from "next/link";
import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { WEDDINGS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Wedding Decor & Event Flowers Nairobi",
  "Wedding decor and large event flowers in Nairobi: bridal bouquets, centrepieces, arches and car decor, planned and set up by The Stems Flowers.",
  "/weddings-events"
);

export default function WeddingsEventsHubPage() {
  return (
    <CategoryHubView
      title="Weddings"
      description=""
      h1="Wedding Decor & Event Flowers Nairobi"
      intro="We have done extensive work in events and wedding decor across Nairobi. Bridal bouquets, bridesmaid flowers, centrepieces, arches and wedding car decor, planned with you and set up on the day."
      leaves={WEDDINGS_NAV}
      shopHref="/wedding-flowers-nairobi"
      shopLabel="Wedding flowers Nairobi"
    >
        <h2>Planning wedding flowers with us</h2>
        <p>
          We work with you on <Link href="/wedding-flowers-nairobi">bridal bouquets and bridesmaid flowers</Link>,
          centrepieces, arches and <Link href="/wedding-car-decor-nairobi">wedding car decor</Link>. To get an accurate quote,
          send us your date, venue, colours, guest count and a few inspiration photos on WhatsApp. The earlier you book, the
          easier it is to secure specific flowers and colours.
        </p>
        <p>
          On a tighter budget? Our guide to{" "}
          <Link href="/blog/wedding-flowers-nairobi-the-stems">planning wedding flowers on a budget</Link> shows where to spend
          and where to save. For company events and client gifts, see{" "}
          <Link href="/corporate-flowers-nairobi">corporate flowers</Link> and{" "}
          <Link href="/corporate-gift-hampers-nairobi">corporate hampers</Link>.
        </p>
    </CategoryHubView>
  );
}
