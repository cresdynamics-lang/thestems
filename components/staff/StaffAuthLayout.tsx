import Image from "next/image";
import Link from "next/link";
import { STAFF_BRAND } from "@/lib/staff/constants";

type StaffAuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Replaces default store-management copy on the left (e.g. admin login) */
  intro?: string;
  /** Hide feature bullets on the left */
  hideFeatures?: boolean;
};

const FEATURES = [
  "Orders & fulfilment",
  "Products & inventory",
  "Delivery & enquiries",
] as const;

/** Full-page split: brand left, sign-in right */
export function StaffAuthLayout({
  title,
  subtitle,
  children,
  footer,
  intro,
  hideFeatures = false,
}: StaffAuthLayoutProps) {
  return (
    <div className="staff-auth">
      <aside className="staff-auth-brand">
        <div className="staff-auth-brand-inner">
          <Link href="/" className="inline-flex items-center gap-4">
            <Image
              src="/images/logo/thestemslogo.jpeg"
              alt="The Stems logo"
              width={72}
              height={72}
              className="rounded-full object-cover staff-auth-logo shrink-0"
              priority
            />
            <div>
              <p className="font-heading text-2xl font-bold text-brand-pink leading-tight">
                {STAFF_BRAND.name}
              </p>
              <p className="text-sm text-brand-gray-600 mt-0.5">{STAFF_BRAND.tagline}</p>
            </div>
          </Link>

          {intro ? (
            <p className="mt-10 text-sm text-brand-gray-600 leading-relaxed max-w-md">{intro}</p>
          ) : (
            <>
              <h1 className="font-heading text-xl font-semibold text-brand-gray-900 mt-10 max-w-md">
                Store management
              </h1>
              <p className="mt-3 text-sm text-brand-gray-600 leading-relaxed max-w-md">
                Sign in to manage orders, products, deliveries, and customer enquiries for your
                Nairobi florist.
              </p>
              {!hideFeatures ? (
                <ul className="staff-auth-features mt-8 space-y-2.5 text-sm text-brand-gray-700 max-w-md">
                  {FEATURES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </>
          )}

          <p className="staff-auth-address mt-auto pt-10 text-xs text-brand-gray-500 max-w-md">
            {STAFF_BRAND.address}
          </p>
        </div>
      </aside>

      <main className="staff-auth-form-wrap">
        <div className="staff-auth-card w-full max-w-[420px]">
          <header className="staff-auth-card-head">
            <h2 className="font-heading text-2xl font-semibold text-brand-gray-900">{title}</h2>
            {subtitle ? (
              <p className="text-sm text-brand-gray-600 mt-1">{subtitle}</p>
            ) : null}
          </header>
          <div className="staff-auth-card-body">{children}</div>
          {footer ? <footer className="staff-auth-card-foot">{footer}</footer> : null}
        </div>
      </main>
    </div>
  );
}
