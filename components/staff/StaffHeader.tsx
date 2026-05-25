"use client";

import Link from "next/link";
import { useStaff } from "./StaffAuthGuard";
import { useStaffNav } from "./StaffNavContext";
import { Bars3Icon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export function StaffHeader({
  title,
  description,
  actions,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const { logout, user } = useStaff();
  const { openNav } = useStaffNav();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header
      className="shrink-0 border-b px-4 sm:px-6 py-4 flex flex-wrap items-start justify-between gap-4"
      style={{
        background: "var(--staff-surface)",
        borderColor: "var(--staff-border)",
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <button
          type="button"
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--staff-bg)] transition-colors"
          onClick={openNav}
          aria-label="Open navigation menu"
        >
          <Bars3Icon className="w-6 h-6" style={{ color: "var(--staff-text)" }} />
        </button>
        <div>
          {title ? (
            <h1
              className="font-heading font-semibold text-xl tracking-tight"
              style={{ color: "var(--staff-text)" }}
            >
              {title}
            </h1>
          ) : (
            <h1
              className="font-heading font-semibold text-xl tracking-tight"
              style={{ color: "var(--staff-text)" }}
            >
              {greeting}
            </h1>
          )}
          <p className="text-sm mt-0.5" style={{ color: "var(--staff-muted)" }}>
            {description || user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {actions}
        <Link
          href="/"
          target="_blank"
          className="staff-btn staff-btn-ghost text-sm hidden sm:inline-flex"
        >
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          View shop
        </Link>
        <button type="button" onClick={logout} className="staff-btn staff-btn-ghost text-sm">
          Sign out
        </button>
      </div>
    </header>
  );
}
