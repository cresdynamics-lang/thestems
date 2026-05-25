"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog } from "@headlessui/react";
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
};

export function StaffNavDrawer() {
  const pathname = usePathname();
  const { user } = useStaff();
  const { open, closeNav } = useStaffNav();

  const visibleItems = (NAV_ITEMS ?? []).filter(
    (item) => !(item.superOnly && !canViewFinancials(user.role))
  );
  const navGroups = getStaffNavGroups(visibleItems);

  return (
    <Dialog open={open} onClose={closeNav} className="relative z-50">
      <div className="fixed inset-0 bg-stone-900/50" aria-hidden="true" />
      <Dialog.Panel
        className="fixed inset-y-0 left-0 w-[min(280px,88vw)] flex flex-col text-white shadow-xl"
        style={{ background: "var(--staff-sidebar)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--staff-sidebar-border)]">
          <Link href="/staff" className="flex items-center gap-3 min-w-0" onClick={closeNav}>
            <Image
              src="/images/logo/thestemslogo.jpeg"
              alt=""
              width={40}
              height={40}
              className="rounded-lg object-cover ring-2 ring-white/20 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-heading font-semibold text-[15px] leading-tight truncate">
                {STAFF_BRAND.shortName ?? STAFF_BRAND.name}
              </p>
              <p className="text-[11px] text-white/55">Store panel</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeNav}
            className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navGroups.map((group) => {
            const items = visibleItems.filter((i) => i.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mb-5 last:mb-0">
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  {group}
                </p>
                <ul className="space-y-0.5">
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
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                            active
                              ? "bg-white/12 text-white font-medium"
                              : "text-white/75 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          <Icon
                            className={`w-[18px] h-[18px] shrink-0 ${active ? "opacity-100" : "opacity-70"}`}
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[var(--staff-sidebar-border)]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white/15"
              aria-hidden
            >
              {(user.name || user.email)[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{user.name || user.email.split("@")[0]}</p>
              <p className="text-[10px] text-white/50 truncate">
                {isSuperAdmin(user.role) ? "Super admin" : "Staff"}
              </p>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
