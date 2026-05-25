"use client";

import { useState } from "react";
import Link from "next/link";
import { STAFF_BRAND } from "@/lib/staff/constants";
import { StaffAuthLayout } from "@/components/staff/StaffAuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/staff/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message || "If that email exists, we sent a reset link.");
    setLoading(false);
  }

  return (
    <StaffAuthLayout
      title="Reset password"
      subtitle={`Enter the email for your ${STAFF_BRAND.name} staff account`}
      footer={
        <p className="text-center text-sm">
          <Link href="/staff/login" className="font-medium text-brand-pink hover:underline">
            ← Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label htmlFor="email" className="staff-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="staff-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {msg ? <p className="staff-auth-success">{msg}</p> : null}

        <button type="submit" disabled={loading} className="staff-btn staff-btn-primary w-full py-2.5">
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </StaffAuthLayout>
  );
}
