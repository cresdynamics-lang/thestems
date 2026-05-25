"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setStaffToken } from "@/lib/staff/api-client";
import { STAFF_BRAND } from "@/lib/staff/constants";

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
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");
      if (result.token) {
        setStaffToken(result.token);
        const next = new URLSearchParams(window.location.search).get("next");
        router.push(next && next.startsWith("/staff") ? next : "/staff");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <div className="staff-auth-brand">
        <Image
          src="/images/logo/thestemslogo.jpeg"
          alt=""
          width={56}
          height={56}
          className="rounded-full object-cover mb-8 ring-2 ring-brand-blush"
        />
        <h1 className="font-heading text-3xl font-semibold tracking-tight leading-snug max-w-sm text-brand-pink">
          {STAFF_BRAND.name}
        </h1>
        <p className="mt-3 text-brand-gray-600 text-sm leading-relaxed max-w-xs">
          Manage orders, stock, and deliveries for your Nairobi store — all in one place.
        </p>
        <p className="mt-8 text-xs text-brand-gray-500">{STAFF_BRAND.location}</p>
      </div>

      <div className="staff-auth-form-wrap">
        <div className="w-full max-w-[380px]">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-brand-gray-900">
            Sign in
          </h2>
          <p className="text-sm text-brand-gray-600 mt-1 mb-8">
            Staff and admin accounts only
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div
                className="text-sm px-3 py-2.5 rounded-lg border"
                style={{
                  background: "#fef2f2",
                  borderColor: "#fecaca",
                  color: "#991b1b",
                }}
              >
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="staff-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="staff-input"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-700 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="staff-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="staff-input"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-700 mt-1">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="staff-btn staff-btn-primary w-full py-2.5"
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
            <p className="text-center text-sm">
              <Link
                href="/staff/forgot-password"
                className="font-medium text-brand-pink hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </form>

          <p className="text-center mt-10 text-sm text-brand-gray-600">
            <Link href="/" className="hover:text-brand-gray-900 transition-colors">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
