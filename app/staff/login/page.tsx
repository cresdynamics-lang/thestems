"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setStaffSession } from "@/lib/staff/api-client";
import { STAFF_BRAND } from "@/lib/staff/constants";
import { StaffAuthLayout } from "@/components/staff/StaffAuthLayout";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "At least 6 characters"),
});

type FormData = yup.InferType<typeof schema>;

export default function StaffLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
        cache: "no-store",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");
      if (result.token) {
        setStaffSession(result.token, result.user);
        const next = new URLSearchParams(window.location.search).get("next");
        router.replace(next && next.startsWith("/staff") ? next : "/staff");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  });

  return (
    <StaffAuthLayout
      title="Sign in"
      subtitle={`${STAFF_BRAND.name} staff & admin access`}
      footer={
        <p className="text-center text-sm text-brand-gray-600">
          <Link href="/" className="hover:text-brand-gray-900 transition-colors">
            ← Back to website
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {error ? <div className="staff-auth-error">{error}</div> : null}

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
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-red-700 mt-1">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label htmlFor="password" className="staff-label mb-0">
              Password
            </label>
            <Link
              href="/staff/forgot-password"
              className="text-xs font-medium text-brand-pink hover:underline shrink-0"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="staff-input"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-red-700 mt-1">{errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="staff-btn staff-btn-primary w-full py-2.5"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </StaffAuthLayout>
  );
}
