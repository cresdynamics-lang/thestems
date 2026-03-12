import type { Metadata } from "next";
import Link from "next/link";
import { SHOP_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Admin Dashboard | The Stems Flowers Nairobi",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-blush flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-brand-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-brand-gray-200">
          <div>
            <div className="font-heading font-bold text-lg text-brand-gray-900">
              The Stems Admin
            </div>
            <div className="text-xs text-brand-gray-500">
              Nairobi CBD • {SHOP_INFO.hours}
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 text-sm">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-lg text-brand-gray-800 hover:bg-brand-green/5 hover:text-brand-green"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="block px-3 py-2 rounded-lg text-brand-gray-800 hover:bg-brand-green/5 hover:text-brand-green"
          >
            Orders
          </Link>
          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded-lg text-brand-gray-800 hover:bg-brand-green/5 hover:text-brand-green"
          >
            Products
          </Link>
          <Link
            href="/admin/blogs"
            className="block px-3 py-2 rounded-lg text-brand-gray-800 hover:bg-brand-green/5 hover:text-brand-green"
          >
            Blog
          </Link>
          <Link
            href="/admin/hero"
            className="block px-3 py-2 rounded-lg text-brand-gray-800 hover:bg-brand-green/5 hover:text-brand-green"
          >
            Homepage Hero
          </Link>
        </nav>
        <div className="px-6 py-4 border-t border-brand-gray-200 text-xs text-brand-gray-500">
          <div>{SHOP_INFO.name} • Nairobi</div>
          <div>Tel: +{SHOP_INFO.phone}</div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-brand-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="md:hidden">
            <div className="font-heading font-bold text-base text-brand-gray-900">
              The Stems Admin
            </div>
            <div className="text-[11px] text-brand-gray-500">
              Nairobi CBD • {SHOP_INFO.hours}
            </div>
          </div>
          <div className="hidden md:block text-sm text-brand-gray-600">
            Logged in as Admin
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link
              href="/"
              className="text-brand-gray-600 hover:text-brand-green"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

