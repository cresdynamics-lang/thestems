"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StaffAuthLayout } from "@/components/staff/StaffAuthLayout";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError(false);
    const res = await fetch("/api/staff/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: params.get("email"),
        token: params.get("token"),
        password,
      }),
    });
    const data = await res.json();
    setMsg(data.message || (res.ok ? "Password updated." : "Could not reset password."));
    setError(!res.ok);
    setLoading(false);
    if (res.ok) setTimeout(() => router.push("/staff/login"), 2000);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="password" className="staff-label">
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          placeholder="At least 6 characters"
          className="staff-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {msg ? (
        <p className={error ? "staff-auth-error" : "staff-auth-success"}>{msg}</p>
      ) : null}

      <button type="submit" disabled={loading} className="staff-btn staff-btn-primary w-full py-2.5">
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <StaffAuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your staff account"
      footer={
        <p className="text-center text-sm">
          <Link href="/staff/login" className="font-medium text-brand-pink hover:underline">
            ← Back to sign in
          </Link>
        </p>
      }
    >
      <Suspense fallback={<p className="text-sm text-brand-gray-600">Loading…</p>}>
        <ResetForm />
      </Suspense>
    </StaffAuthLayout>
  );
}
