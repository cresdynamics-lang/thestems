import Link from "next/link";
import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { GIFTS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Gifts Nairobi | Teddy Bears, Hampers & Wine",
  "Shop gifts in Nairobi: teddy bears, gift hampers, chocolates, wines and flower combos. Same-day delivery from The Stems Flowers CBD.",
  "/gifts"
);

export default function GiftsHubPage() {
  return (
    <CategoryHubView
      title="Gifts"
      description=""
      h1="Gifts in Nairobi"
      intro="Flowers, teddy bears, gift hampers, chocolates and more — curated gifts with same-day delivery across Nairobi from The Stems Flowers."
      leaves={GIFTS_NAV}
      skipLabels={["All Gifts"]}
      shopHref="/collections/gift-hampers"
      shopLabel="Shop gift hampers"
    >
        <h2>Gift ideas by budget</h2>
        <p>
          Under KSh 5,000, choose a <Link href="/collections/teddy-bears">25cm or 50cm teddy bear</Link>, an 8-piece box
          of <Link href="/collections/chocolates">Ferrero Rocher</Link> or a{" "}
          <Link href="/collections/wines">bottle of wine</Link>. From KSh 8,500, our{" "}
          <Link href="/gift-hampers-nairobi">gift hampers</Link> make a bigger impression, and giant teddy bears run up to
          200cm for a real surprise.
        </p>
        <h2>Add flowers and a card</h2>
        <p>
          Most gifts land better with a bouquet and a short message. You can add{" "}
          <Link href="/collections/cards">a greeting card</Link> from KSh 250 to any order. Not sure who it suits? Read our
          guides to <Link href="/blog/gifts-for-women-and-girlfriends-nairobi">gifts for women</Link>,{" "}
          <Link href="/blog/best-gifts-for-men-nairobi">gifts for men</Link> and{" "}
          <Link href="/blog/best-gifts-for-children-nairobi">gifts for children</Link>. Order by 4PM for same-day delivery
          across Nairobi.
        </p>
    </CategoryHubView>
  );
}
