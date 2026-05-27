"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TicketIcon,
  TruckIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  EyeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { NAV_ITEMS, STAFF_BRAND, getStaffNavGroups } from "@/lib/staff/constants";
import { useStaff } from "./StaffAuthGuard";
import { canViewFinancials, isSuperAdmin } from "@/lib/staff/permissions";
import { useStaffNav } from "./StaffNavContext";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  cube: CubeIcon,
  tag: TagIcon,
  "shopping-bag": ShoppingBagIcon,
  users: UsersIcon,
  currency: CurrencyDollarIcon,
  ticket: TicketIcon,
  truck: TruckIcon,
  document: DocumentTextIcon,
  mail: EnvelopeIcon,
  clipboard: ClipboardDocumentListIcon,
  cog: Cog6ToothIcon,
  eye: EyeIcon,
  store: BuildingStorefrontIcon,
};

export function StaffNavDrawer() {
  const pathname = usePathname();
  const { user } = useStaff();
  const { open, closeNav } = useStaffNav();
  const [mounted, setMounted] = useState(false);

  const visibleItems = (NAV_ITEMS ?? []).filter(
    (item) => !(item.superOnly && !canViewFinancials(user.role))
  );
  const navGroups = getStaffNavGroups(visibleItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNav();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeNav]);

  if (!open || !mounted) return null;

  const drawer = (
    <div
      className="staff-nav-overlay fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
        aria-label="Close menu"
        onClick={closeNav}
      />
      <aside className="staff-nav-drawer fixed inset-y-0 left-0 z-[201] w-[min(300px,90vw)] flex flex-col shadow-2xl border-r border-[#e5e7eb]">
        <div className="h-1 shrink-0 bg-[#e75480]" />

        <div className="staff-nav-drawer-head flex items-center justify-between px-5 py-5 shrink-0 border-b border-[#e5e7eb]">
          <Link
            href="/staff"
            className="flex items-center gap-3 min-w-0"
            onClick={closeNav}
          >
            <Image
              src="/images/logo/thestemslogo.jpeg"
              alt=""
              width={44}
              height={44}
              className="rounded-full object-cover shrink-0"
              style={{ boxShadow: "0 0 0 2px #f8c8dc" }}
            />
            <div className="min-w-0">
              <p className="staff-nav-drawer-title font-heading font-bold text-base leading-tight truncate">
                {STAFF_BRAND.shortName ?? STAFF_BRAND.name}
              </p>
              <p className="staff-nav-drawer-subtitle text-[11px]">Staff panel</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeNav}
            className="staff-nav-drawer-close p-2 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto min-h-0">
          {navGroups.length === 0 ? (
            <p className="staff-nav-drawer-subtitle px-4 py-3 text-sm">No menu items loaded.</p>
          ) : (
            navGroups.map((group) => {
              const items = visibleItems.filter((i) => i.group === group);
              if (!items.length) return null;
              return (
                <div key={group} className="mb-5 last:mb-0">
                  <p className="staff-nav-group-label px-4 mb-2 text-[10px] font-bold uppercase tracking-widest">
                    {group}
                  </p>
                  <ul className="space-y-1">
                    {items.map((item) => {
                      const Icon = ICONS[item.icon] || HomeIcon;
                      const active =
                        pathname === item.href ||
                        (item.href !== "/staff" && pathname?.startsWith(item.href));
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeNav}
                            className={`staff-nav-link flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              active ? "staff-nav-link--active" : ""
                            }`}
                          >
                            <Icon className="staff-nav-icon w-5 h-5 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </nav>

        <div className="staff-nav-drawer-foot px-4 py-4 shrink-0 border-t border-[#e5e7eb]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
              style={{ backgroundColor: "#e75480" }}
            >
              {(user.name || user.email)[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="staff-nav-drawer-user text-sm font-medium truncate">
                {user.name || user.email.split("@")[0]}
              </p>
              <p className="staff-nav-drawer-subtitle text-xs truncate">
                {isSuperAdmin(user.role) ? "Super admin" : "Staff"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );

  return createPortal(drawer, document.body);
}
