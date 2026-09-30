"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavLeaf } from "@/lib/navTaxonomy";
import { navLeafImage } from "@/lib/navLeafImages";

/**
 * Horizontal multi-column nav leaf grid.
 * Desktop: thumbnail appears beside the label on hover.
 * Touch / hamburger: small thumbnail always visible.
 */
export default function NavLeafGrid({
  leaves,
  onNavigate,
  columnsClass = "grid-cols-2 sm:grid-cols-3",
}: {
  leaves: NavLeaf[];
  onNavigate?: () => void;
  columnsClass?: string;
}) {
  return (
    <ul className={`grid ${columnsClass} gap-1 p-2`}>
      {leaves.map((child) => {
        const img = navLeafImage(child.label);
        return (
          <li key={child.label}>
            <Link
              href={child.href}
              onClick={onNavigate}
              className="group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-brand-blush"
            >
              <span
                className="relative shrink-0 overflow-hidden rounded-md bg-brand-gray-100
                  h-10 w-10
                  lg:max-w-0 lg:opacity-0 lg:scale-90
                  lg:group-hover:max-w-[2.5rem] lg:group-hover:opacity-100 lg:group-hover:scale-100
                  transition-all duration-200 ease-out"
              >
                <span className="relative block h-10 w-10">
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </span>
              </span>
              <span className="text-sm font-medium leading-snug text-brand-gray-800 group-hover:text-brand-rose-deep">
                {child.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
