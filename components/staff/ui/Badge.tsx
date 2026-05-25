import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  pending: "bg-amber-50 text-amber-900 ring-amber-200/80",
  paid: "bg-emerald-50 text-emerald-900 ring-emerald-200/80",
  confirmed: "bg-sky-50 text-sky-900 ring-sky-200/80",
  packed: "bg-violet-50 text-violet-900 ring-violet-200/80",
  out_for_delivery: "bg-indigo-50 text-indigo-900 ring-indigo-200/80",
  delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  shipped: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  cancelled: "bg-stone-100 text-stone-700 ring-stone-200/80",
  failed: "bg-red-50 text-red-800 ring-red-200/80",
  draft: "bg-stone-100 text-stone-600 ring-stone-200/80",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  unread: "bg-rose-50 text-rose-900 ring-rose-200/80",
  read: "bg-stone-50 text-stone-600 ring-stone-200/80",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  default: "bg-stone-100 text-stone-600 ring-stone-200/80",
};

export function Badge({ status, className }: { status: string; className?: string }) {
  const key = status?.toLowerCase().replace(/\s+/g, "_") || "default";
  const label = status?.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ring-1 ring-inset",
        variants[key] || variants.default,
        className
      )}
    >
      {label}
    </span>
  );
}
