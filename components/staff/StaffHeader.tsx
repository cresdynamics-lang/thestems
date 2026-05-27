"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStaff } from "./StaffAuthGuard";
import { useStaffNav } from "./StaffNavContext";
import { Bars3Icon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

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
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <header className="shrink-0 bg-white border-b border-brand-gray-200 sticky top-0 z-40 px-4 sm:px-6 py-4 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <button
          type="button"
          className="p-2 -ml-2 rounded-lg text-brand-gray-700 hover:text-brand-pink hover:bg-brand-gray-50 transition-colors"
          onClick={openNav}
          aria-label="Open navigation menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div>
          {title ? (
            <h1 className="font-heading font-semibold text-xl text-brand-gray-900 tracking-tight">
              {title}
            </h1>
          ) : (
            <h1 className="font-heading font-semibold text-xl text-brand-gray-900 tracking-tight">
              {greeting || "Dashboard"}
            </h1>
          )}
          <p className="text-sm mt-0.5 text-brand-gray-600" suppressHydrationWarning>
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
