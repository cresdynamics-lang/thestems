"use client";

import { useState } from "react";
import Link from "next/link";
import { STAFF_BRAND } from "@/lib/staff/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/staff/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message || "Check your email.");
    setLoading(false);
  }

  return (
    <div className="staff-auth-form-wrap w-full col-span-2">
      <div className="w-full max-w-[380px]">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-sm text-[var(--staff-muted)] mt-1 mb-8">{STAFF_BRAND.shortName} staff account</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="staff-label">Email</label>
            <input
              type="email"
              className="staff-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {msg && (
            <p className="text-sm px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              {msg}
            </p>
          )}
          <button type="submit" disabled={loading} className="staff-btn staff-btn-primary w-full">
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <Link
          href="/staff/login"
          className="block text-center mt-6 text-sm font-medium"
          style={{ color: "var(--staff-accent)" }}
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
