import Link from "next/link";
import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { GRADUATION_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Graduation Gifts Nairobi | Bouquets & Teddies",
  "Graduation flowers and gifts in Nairobi for PP2, Grade 3, 6 and 9. Bouquets, snack hampers and teddy bears with same-day delivery.",
  "/graduation"
);

export default function GraduationHubPage() {
  return (
    <CategoryHubView
      title="Graduation"
      description=""
      h1="Graduation Flowers & Gifts Nairobi"
      intro="Celebrate PP2, Grade 3, Grade 6, Grade 9 and campus graduations with fresh bouquets, teddy bears and gift hampers. Same-day delivery across Nairobi."
      leaves={GRADUATION_NAV}
      shopHref="/graduation-bouquets-nairobi"
      shopLabel="Graduation bouquets Nairobi"
    >
        <h2>Gifts for every graduation stage</h2>
        <p>
          For PP2 and Grade 3, children love a small <Link href="/graduation-bouquets-nairobi">bright bouquet</Link> or a{" "}
          <Link href="/teddy-bears-nairobi">teddy bear</Link> they can hold in photos. For Grade 6 and Grade 9, a bouquet with
          chocolates feels more grown up. For campus graduations, consider{" "}
          <Link href="/gift-hampers-nairobi">a gift hamper</Link> or a bouquet with a card.
        </p>
        <h2>Getting it there on the day</h2>
        <p>
          Ceremonies start early and school gates get busy, so share the school name, a contact phone number and the time you
          need the gift. Order a day ahead where you can, or by 4PM the day before a morning ceremony. Read more in our{" "}
          <Link href="/blog/graduation-and-kids-gifts-nairobi">graduation and kids gifts guide</Link>.
        </p>
    </CategoryHubView>
  );
}
