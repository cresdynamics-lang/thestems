"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import Logo from "./Logo";
import { CurrencySwitcher } from "@/components/PriceDisplay";
import PriceDisplay from "@/components/PriceDisplay";
import NavLeafGrid from "@/components/NavLeafGrid";
import type { Product } from "@/lib/db";
import { MAIN_NAV, HERO_GIFT_AUDIENCES, type NavItem } from "@/lib/navTaxonomy";

const CartSidebar = dynamic(() => import("./CartSidebar"), { ssr: false });

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Colour matching substrings of the typed query inside product titles. */
function HighlightMatch({ text, query }: { text: string; query: string }): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const tokens = [...new Set(q.split(/\s+/).filter((t) => t.length > 0))];
  if (!tokens.length) return text;
  const re = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) => {
    const isMatch = tokens.some((t) => t.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <mark
          key={i}
          className="rounded-sm bg-brand-rose-deep/20 px-0.5 font-semibold text-brand-rose-deep not-italic"
        >
          {part}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChildren = Boolean(item.children?.length);
  const childCount = item.children?.length ?? 0;
  const cols =
    childCount > 9
      ? "grid-cols-3"
      : childCount > 4
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2";

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => clearClose(), []);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className="text-brand-gray-900 hover:text-brand-rose-deep transition-colors font-medium text-[11px] xl:text-[13px] whitespace-nowrap py-2"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={item.href}
        className="inline-flex items-center gap-0.5 text-brand-gray-900 hover:text-brand-rose-deep transition-colors font-medium text-[11px] xl:text-[13px] whitespace-nowrap py-2"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </Link>
      {open ? (
        <div
          className="absolute left-0 top-full z-50 pt-1"
          onMouseEnter={clearClose}
          onMouseLeave={scheduleClose}
        >
          <div className="w-[min(92vw,36rem)] max-h-[75vh] overflow-y-auto rounded-xl border border-brand-gray-200 bg-white shadow-xl">
            <NavLeafGrid
              leaves={item.children!}
              columnsClass={cols}
              onNavigate={() => setOpen(false)}
            />
            <div className="border-t border-brand-gray-100 px-3 py-2">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-brand-rose-deep hover:underline"
              >
                View all {item.label} →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
  const { getItemCount, addItem } = useCartStore();
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
        if (Array.isArray(data)) {
          setSearchResults(data);
          setSearchCount(data.length);
        } else {
          setSearchResults(data.results || []);
          setSearchCount(
            typeof data.count === "number" ? data.count : (data.results || []).length
          );
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
    }, 100);
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

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.images?.[0] || "/images/logo/thestemslogo.jpeg",
      slug: product.slug,
    });
    setCartOpen(true);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="bg-white border-b border-brand-gray-200 sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8" aria-label="Main">
          <div className="flex h-16 md:h-20 items-center justify-between gap-2">
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center">
                <Logo className="h-12 md:h-16 w-auto" />
              </Link>
            </div>

            <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-x-2 xl:gap-x-3 lg:flex-1 lg:px-2">
              {MAIN_NAV.map((item) => (
                <DesktopNavItem key={item.label} item={item} />
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
              {/* Currency switcher desktop only — not on hamburger / small screens */}
              <CurrencySwitcher className="hidden lg:block" />
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
                        <div
                          key={product.id}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-brand-gray-50 transition-colors group"
                          data-search-result
                        >
                          <button
                            type="button"
                            onClick={() => handleResultClick(product)}
                            className="flex flex-1 min-w-0 items-center gap-3 text-left"
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
                              <h3 className="font-product text-[15px] font-semibold tracking-tight text-brand-gray-900 truncate">
                                <HighlightMatch text={product.title} query={searchQuery} />
                              </h3>
                              <p className="font-price text-sm font-bold tabular-nums text-brand-rose-deep mt-0.5">
                                <PriceDisplay amountCents={product.price} size="sm" />
                              </p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-rose-deep px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-rose-deep/90"
                            aria-label={`Add ${product.title} to cart`}
                          >
                            <PlusIcon className="h-3.5 w-3.5" aria-hidden />
                            Add
                          </button>
                        </div>
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
          <Dialog onClose={closeMobile} className="lg:hidden">
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
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gray-200">
                  <Logo className="h-10 w-auto" />
                  <button
                    type="button"
                    onClick={closeMobile}
                    className="p-2 rounded-full hover:bg-brand-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <XMarkIcon className="h-6 w-6 text-brand-gray-600" />
                  </button>
                </div>

                {/* Product categories — mobile counterpart of hero card */}
                <div className="mb-5 rounded-xl bg-brand-rose-deep text-white overflow-hidden">
                  <div className="px-4 py-3 border-b border-dashed border-amber-300/70">
                    <p className="font-heading text-sm font-bold tracking-wide">
                      Product Categories
                    </p>
                  </div>
                  <ul className="grid grid-cols-2 gap-0">
                    {HERO_GIFT_AUDIENCES.map((item) => (
                      <li key={item.label} className="border-b border-r border-dashed border-amber-300/40">
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          className="block px-3 py-2.5 text-[13px] font-medium text-white/95 hover:bg-white/15"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <nav className="flex flex-col" aria-label="Mobile">
                  {MAIN_NAV.map((item) =>
                    item.children?.length ? (
                      <Disclosure key={item.label} as="div" className="border-b border-brand-gray-100">
                        {({ open }) => (
                          <>
                            <div className="flex items-stretch">
                              <Link
                                href={item.href}
                                onClick={closeMobile}
                                className="flex-1 px-3 py-3.5 text-brand-gray-900 font-semibold text-[15px] hover:text-brand-rose-deep"
                              >
                                {item.label}
                              </Link>
                              <Disclosure.Button
                                className="px-3 py-3.5 text-brand-gray-600 hover:text-brand-rose-deep"
                                aria-label={`Toggle ${item.label} submenu`}
                              >
                                <ChevronDownIcon
                                  className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
                                />
                              </Disclosure.Button>
                            </div>
                            <Disclosure.Panel>
                              <NavLeafGrid
                                leaves={item.children!}
                                onNavigate={closeMobile}
                                columnsClass="grid-cols-2"
                              />
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={closeMobile}
                        className="border-b border-brand-gray-100 px-3 py-3.5 text-brand-gray-900 font-semibold text-[15px] hover:text-brand-rose-deep"
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </header>
      {cartOpen ? <CartSidebar /> : null}
    </>
  );
}
