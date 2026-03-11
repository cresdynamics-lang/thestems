import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apology Flowers Nairobi — I'm Sorry Flowers Delivered | The Stems Flowers",
  description:
    "Send apology flowers in Nairobi — I'm sorry bouquets delivered same day. Red and mixed rose arrangements from The Stems Flowers, Nairobi CBD. Order with M-Pesa.",
};

export default function ApologyFlowersNairobiPage() {
  return (
    <div className="py-10 md:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-brand-gray-900 mb-4">
          Apology Flowers in Nairobi — Say I&apos;m Sorry with Fresh Flowers
        </h1>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          The Most Heartfelt Apology — Fresh Roses Delivered in Nairobi
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Sometimes words are not enough — especially after a difficult argument or misunderstanding. Apology flowers give you
          a chance to show genuine effort and care. In Nairobi, red roses are the traditional I&apos;m Sorry flower: deep,
          passionate and sincere. A well-chosen bouquet says “I&apos;m listening, I regret what happened and I want to make it
          right.”
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Mixed rose bouquets can soften the gesture, combining reds with pinks, whites or other colours to bring warmth and
          balance. They are ideal when you want to keep the apology gentle but still meaningful. At The Stems Flowers we offer
          a range of apology-ready arrangements that can be delivered with your personal message anywhere in Nairobi, often
          within hours.
        </p>
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-brand-gray-900 mb-3">
          How to Choose the Right I&apos;m Sorry Flowers
        </h2>
        <p className="text-brand-gray-700 text-base md:text-lg mb-6">
          Choose red roses when the relationship is romantic and you want to show deep commitment. Opt for softer pink and
          white mixes when the apology is for a friend, relative or colleague. Add a handwritten-style card with honest, short
          words — you don&apos;t need an essay, just something real. You can also include chocolates or a teddy bear to help
          break the tension and make the gesture feel more comforting.
        </p>
        <p className="text-brand-gray-700 text-base md:text-lg mb-8">
          The Stems Flowers delivers I&apos;m Sorry flowers across Nairobi the same day when you order by 4PM. Pay securely via
          M-Pesa and our team will prepare, pack and send your bouquet from our Nairobi CBD shop at Delta Hotel, University
          Way. This keyword has near-zero competition — but in real life, the impact is huge for relationships across Nairobi.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-10">
          <Link
            href="/collections/flowers?tags=apology"
            className="btn-primary text-sm md:text-base"
          >
            Shop I&apos;m Sorry Flowers in Nairobi
          </Link>
          <Link
            href="https://wa.me/254725707143"
            className="btn-outline text-sm md:text-base"
          >
            Get Help Choosing Apology Flowers
          </Link>
        </div>
      </div>
    </div>
  );
}

