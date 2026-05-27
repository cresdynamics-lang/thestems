"use client";

import Link from "next/link";
import { StaffPage } from "@/components/staff/StaffPage";

const sections = [
  {
    href: "/staff/blogs",
    title: "Blog",
    desc: "Write posts, set SEO, and upload featured images.",
  },
  {
    href: "/staff/content/banners",
    title: "Homepage banners",
    desc: "Update the hero carousel and promotional slides.",
  },
  {
    href: "/staff/content/collections",
    title: "Featured collections",
    desc: "Choose which products appear on the homepage.",
  },
  {
    href: "/staff/live-visitors",
    title: "Live visitors",
    desc: "See who is browsing the shop right now.",
  },
  {
    href: "/staff/shop",
    title: "Shop preview",
    desc: "View every published product as customers see it.",
  },
];

export default function ContentPage() {
  return (
    <StaffPage title="Content" description="Website pages and merchandising">
      <div className="grid sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="staff-panel p-6 block hover:border-[var(--staff-sage)] transition-colors group"
          >
            <h2 className="font-heading font-semibold text-base group-hover:text-[var(--staff-accent)]">
              {s.title}
            </h2>
            <p className="text-sm mt-2 leading-relaxed text-[var(--staff-muted)]">{s.desc}</p>
          </Link>
        ))}
      </div>
    </StaffPage>
  );
}
