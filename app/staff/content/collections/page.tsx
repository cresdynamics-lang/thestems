"use client";

import { StaffHeader } from "@/components/staff/StaffHeader";

export default function CollectionsPage() {
  return (
    <>
      <StaffHeader title="Homepage collections" />
      <main className="flex-1 p-4 sm:p-6">
        <div className="card p-6 text-sm text-brand-gray-600">
          <p>Configure featured product sections via <strong>homepage_sections</strong> in Supabase, or contact dev to wire the visual editor.</p>
          <p className="mt-2">Sections: Featured bouquets, Teddy bears, Gift hampers, etc.</p>
        </div>
      </main>
    </>
  );
}
