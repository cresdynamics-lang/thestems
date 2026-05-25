"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
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
    setMsg(data.message);
    setLoading(false);
    if (res.ok) setTimeout(() => router.push("/staff/login"), 2000);
  }

  return (
    <form onSubmit={submit} className="card max-w-md w-full p-6 space-y-4">
      <h1 className="font-heading font-bold text-xl">Set new password</h1>
      <input
        type="password"
        className="input-field"
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {msg && <p className="text-sm">{msg}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        Update password
      </button>
      <Link href="/staff/login" className="block text-center text-sm">Login</Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream-light px-4">
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
