"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import Logo from "./Logo";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/db";

const CartSidebar = dynamic(() => import("./CartSidebar"), { ssr: false });

/** Top nav — occasions & collections (Contact lives in footer only) */
const navigation: { name: string; href: string }[] = [
  { name: "Wedding", href: "/wedding-flowers-nairobi" },
  { name: "Teddy Bears", href: "/collections/teddy-bears" },
  { name: "Flowers", href: "/collections/flowers" },
  { name: "Gift Hampers", href: "/collections/gift-hampers" },
  { name: "Graduation", href: "/services#graduation" },
  { name: "Anniversary", href: "/anniversary-flowers-nairobi" },
  { name: "Birthday", href: "/birthday-flowers-nairobi" },
  { name: "Kids Gifts", href: "/collections/teddy-bears" },
  { name: "Gift Cards", href: "/collections/cards" },
];

type SearchPayload = {
  results: Product[];
  count: number;
  query: string;
};

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartOpen, setCartOpen } = useUIStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchCount(0);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        // Support both legacy array and { results, count } payloads
        if (Array.isArray(data)) {
          setSearchResults(data);
          setSearchCount(data.length);
        } else {
          setSearchResults(data.results || []);
          setSearchCount(typeof data.count === "number" ? data.count : (data.results || []).length);
        }
      } else {
        setSearchResults([]);
        setSearchCount(0);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setSearchCount(0);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 160);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setSearchCount(0);
    }
  };

  const handleResultClick = (product: Product) => {
    router.push(`/product/${product.slug}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchCount(0);
  };

  return (
    <>
      <header className="bg-white border-b border-brand-gray-200 sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 md:h-20 items-center justify-between gap-2">
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center">
                <Logo className="h-12 md:h-16 w-auto" />
              </Link>
            </div>

            <div className="hidden lg:flex lg:items-center lg:flex-wrap lg:justify-center lg:gap-x-3 xl:gap-x-4 lg:gap-y-1 max-w-[58%] xl:max-w-none">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-brand-gray-900 hover:text-brand-red transition-colors font-medium text-[11px] xl:text-sm whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
              <button
                type="button"
                onClick={handleSearchClick}
                className="p-2 text-brand-gray-700 hover:text-brand-red transition-colors"
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                <MagnifyingGlassIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-brand-gray-700 hover:text-brand-red transition-colors"
                aria-label="Open shopping cart"
              >
                <ShoppingCartIcon className="h-5 w-5 md:h-6 md:w-6" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-brand-gray-900"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-brand-gray-200 py-4 relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search flowers, teddy bears, hampers…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  autoFocus
                  autoComplete="off"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-red" />
                  </div>
                )}
              </div>

              {searchQuery.trim() && (
                <div
                  ref={searchResultsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                  data-search-result
                >
                  <div className="px-4 py-2 border-b border-brand-gray-100 bg-brand-gray-50 sticky top-0">
                    <p className="text-xs font-medium text-brand-gray-600">
                      {isSearching
                        ? "Searching…"
                        : searchCount === 0
                          ? `No products match “${searchQuery.trim()}”`
                          : `${searchCount} product${searchCount === 1 ? "" : "s"} found`}
                    </p>
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleResultClick(product)}
                          className="w-full px-4 py-2.5 hover:bg-brand-gray-50 transition-colors text-left flex items-center gap-3 group"
                          data-search-result
                        >
                          {product.images && product.images.length > 0 && (
                            <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-brand-gray-100">
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                                sizes="48px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-product text-[15px] font-semibold tracking-tight text-brand-gray-900 group-hover:text-brand-red transition-colors truncate">
                              {product.title}
                            </h3>
                            <p className="font-price text-sm font-bold tabular-nums text-brand-rose-deep mt-0.5">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : !isSearching ? (
                    <div className="px-4 py-6 text-center text-brand-gray-500 text-sm">
                      Try another name or category
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </nav>

        <Transition show={mobileMenuOpen}>
          <Dialog onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
            <Transition.Child
              enter="transition-opacity duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            </Transition.Child>
            <Transition.Child
              enter="transition-transform duration-300 ease-out"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition-transform duration-200 ease-in"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-gray-200">
                  <Logo className="h-10 w-auto" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-brand-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6 text-brand-gray-600" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-all font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-brand-gray-200 space-y-3">
                  <p className="px-4 text-xs uppercase tracking-wider text-brand-gray-500 font-semibold">
                    Add-ons
                  </p>
                  <Link
                    href="/collections/cards"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 flex items-center justify-between rounded-xl border border-brand-gray-200 bg-brand-blush/40 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:border-brand-rose-deep/40"
                  >
                    Gift Cards
                    <span className="text-brand-rose-deep text-xs">Shop →</span>
                  </Link>
                  <Link
                    href="/collections/wines"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 flex items-center justify-between rounded-xl border border-brand-gray-200 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:bg-brand-gray-50"
                  >
                    Wines
                    <span className="text-brand-gray-400 text-xs">Add-on →</span>
                  </Link>
                  <Link
                    href="/collections/chocolates"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 flex items-center justify-between rounded-xl border border-brand-gray-200 px-4 py-3 text-sm font-medium text-brand-gray-900 hover:bg-brand-gray-50"
                  >
                    Chocolates
                    <span className="text-brand-gray-400 text-xs">Add-on →</span>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </header>
      {cartOpen ? <CartSidebar /> : null}
    </>
  );
}
