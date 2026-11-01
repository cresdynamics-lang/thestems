import Link from "next/link";
import CategoryHubView, { hubMetadata } from "@/components/CategoryHubView";
import { OCCASIONS_NAV } from "@/lib/navTaxonomy";

export const metadata = hubMetadata(
  "Flowers by Occasion Nairobi",
  "Shop flowers and gifts by occasion in Nairobi: birthday, anniversary, apology, get well soon and more. Same-day delivery.",
  "/occasions"
);

export default function OccasionsHubPage() {
  return (
    <CategoryHubView
      title="Occasions"
      description=""
      h1="Flowers & Gifts by Occasion"
      intro="Find the right arrangement for every moment — birthday, anniversary, apology, get well soon, sympathy and more. Same-day flower delivery across Nairobi."
      leaves={OCCASIONS_NAV}
      skipLabels={["All Occasions"]}
      shopHref="/collections/flowers"
      shopLabel="Shop flowers"
    >
        <h2>What to send for each occasion</h2>
        <p>
          For <Link href="/birthday-flowers-nairobi">birthdays</Link>, bright mixed bouquets or a flower and teddy combo work
          well. For <Link href="/anniversary-flowers-nairobi">anniversaries</Link>, red roses remain the classic choice. To
          say sorry, <Link href="/apology-flowers-nairobi">apology flowers</Link> in soft pinks or whites feel sincere. For
          recovery, send <Link href="/get-well-soon-flowers-nairobi">get well flowers</Link> or a{" "}
          <Link href="/fruit-baskets-nairobi">fruit basket</Link>, and for loss,{" "}
          <Link href="/funeral-flowers-nairobi">sympathy flowers and wreaths</Link>.
        </p>
        <p>
          Our <Link href="/blog/what-flowers-to-send-occasion-kenya">occasion guide</Link> goes into more detail. For busy
          dates such as Mother&apos;s Day, order early:{" "}
          <Link href="/blog/valentines-mothers-day-christmas-flowers-kenya">here is when to book</Link>. On normal days, order
          by 4PM for same-day delivery across Nairobi.
        </p>
    </CategoryHubView>
  );
}
