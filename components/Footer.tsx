import Link from "next/link";
import { SHOP_INFO } from "@/lib/constants";
import { MAIN_NAV, type NavItem } from "@/lib/navTaxonomy";

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-brand-gray-300 hover:text-brand-red transition-all duration-300 inline-block hover:translate-x-1 group text-xs sm:text-[13px] leading-snug"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-0 group-hover:w-1.5 h-0.5 bg-brand-red transition-all duration-300 shrink-0" />
          {label}
        </span>
      </Link>
    </li>
  );
}

function NavColumn({ item }: { item: NavItem }) {
  return (
    <div>
      <h3 className="font-heading font-bold text-sm mb-3 text-white">
        <Link href={item.href} className="hover:text-brand-pink transition-colors">
          {item.label}
        </Link>
      </h3>
      <ul className="space-y-1.5">
        {item.children?.length ? (
          item.children.map((leaf) => (
            <FooterLink key={`${item.label}-${leaf.label}`} href={leaf.href} label={leaf.label} />
          ))
        ) : (
          <FooterLink href={item.href} label={item.label} />
        )}
      </ul>
    </div>
  );
}

export default function Footer() {
  const navWithChildren = MAIN_NAV.filter((n) => n.children?.length);
  const topLevelOnly = MAIN_NAV.filter((n) => !n.children?.length);

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5" aria-hidden>
        <div className="absolute inset-0 bg-[url('/images/patterns/diagonal-lines.svg')] bg-repeat" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Brand + contact strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <Link href="/" className="inline-block mb-3">
              <h2 className="font-heading font-bold text-lg mb-1">
                <span className="text-brand-pink">The Stems</span>
                <span className="text-white ml-1">Flowers</span>
              </h2>
            </Link>
            <p className="text-brand-gray-300 mb-2 text-xs leading-relaxed max-w-md">
              Premium flowers, gift hampers, and teddy bears in Nairobi. Same-day delivery available
              across the city.
            </p>
            <p className="text-brand-gray-400 text-xs mb-3">{SHOP_INFO.hours}</p>
            <div className="flex gap-3">
              <a
                href={`https://www.instagram.com/${SHOP_INFO.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/${SHOP_INFO.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${SHOP_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-sm mb-3 text-white">Contact Us</h3>
            <ul className="space-y-1.5 text-brand-gray-300">
              <li>
                <a
                  href={`tel:+${SHOP_INFO.phone}`}
                  className="hover:text-brand-red transition-colors flex items-start gap-3 group text-sm"
                >
                  <span className="text-brand-red shrink-0">☎</span>
                  +{SHOP_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SHOP_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-green transition-colors flex items-start gap-3 text-sm"
                >
                  <span className="text-brand-green shrink-0">WhatsApp</span>
                  +{SHOP_INFO.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SHOP_INFO.email}`}
                  className="hover:text-brand-red transition-colors text-sm break-all"
                >
                  {SHOP_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={SHOP_INFO.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-brand-pink transition-colors underline decoration-dotted"
                >
                  {SHOP_INFO.address} — View on map
                </a>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link href="/about" className="text-brand-gray-400 hover:text-brand-pink">
                About Us
              </Link>
              <Link href="/contact" className="text-brand-gray-400 hover:text-brand-pink">
                Contact
              </Link>
              <Link href="/services" className="text-brand-gray-400 hover:text-brand-pink">
                Services
              </Link>
              <Link href="/blog" className="text-brand-gray-400 hover:text-brand-pink">
                Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Full MAIN NAV — multi-column */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-5 mb-8">
          {navWithChildren.map((item) => (
            <NavColumn key={item.label} item={item} />
          ))}
          <div>
            <h3 className="font-heading font-bold text-sm mb-3 text-white">More</h3>
            <ul className="space-y-1.5">
              {topLevelOnly.map((item) => (
                <FooterLink key={item.label} href={item.href} label={item.label} />
              ))}
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/services" label="Our Services" />
              <FooterLink href="/florist-nairobi" label="Florist Nairobi" />
              <FooterLink href="/flower-delivery-nairobi" label="Flower Delivery Nairobi" />
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="font-heading font-semibold text-sm mb-3 text-white">
            Accepted Payment Methods
          </h3>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="w-12 h-8 bg-[#007C42] rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">M-PESA</span>
              </div>
              <div className="w-12 h-8 bg-white border border-gray-300 rounded flex items-center justify-center px-2 flex-shrink-0">
                <span className="text-[#1434CB] font-bold text-xs">VISA</span>
              </div>
              <div className="w-12 h-8 bg-white border border-gray-300 rounded flex items-center justify-center px-1 flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#EB001B] rounded-full -mr-1.5" />
                  <div className="w-3 h-3 bg-[#F79E1B] rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 text-xs justify-center">
              <div className="bg-white/5 rounded-lg p-2 min-w-fit">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-4 bg-[#007C42] rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">T</span>
                  </div>
                  <span className="font-medium text-white text-xs">Till Number</span>
                </div>
                <p className="text-white font-mono font-bold text-center">{SHOP_INFO.mpesa.till}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2 min-w-fit">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-4 bg-[#007C42] rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">P</span>
                  </div>
                  <span className="font-medium text-white text-xs">Paybill</span>
                </div>
                <div className="text-center">
                  <p className="text-brand-gray-300 text-xs">
                    Business:{" "}
                    <span className="text-white font-mono font-bold">{SHOP_INFO.mpesa.paybill}</span>
                  </p>
                  <p className="text-brand-gray-300 text-xs">
                    Account:{" "}
                    <span className="text-white font-mono font-bold">{SHOP_INFO.mpesa.account}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-4 pt-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-brand-gray-400 text-xs">
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> The Stems
              Flowers. All rights reserved. Designed by{" "}
              <a
                href="https://nelson.strivego.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:text-brand-green transition-colors"
              >
                NelsonW
              </a>
              .
            </p>
            <div className="flex items-center gap-6 text-xs sm:text-sm flex-wrap justify-center md:justify-end">
              <Link href="/staff/login" className="text-brand-gray-400 hover:text-brand-pink transition-colors">
                Staff
              </Link>
              <Link href="/terms-of-service" className="text-brand-gray-400 hover:text-brand-red transition-colors">
                Terms &amp; Conditions
              </Link>
              <Link href="/refund-policy" className="text-brand-gray-400 hover:text-brand-red transition-colors">
                Refund Policy
              </Link>
              <Link href="/privacy-policy" className="text-brand-gray-400 hover:text-brand-red transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
