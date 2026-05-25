"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { SHOP_INFO } from "@/lib/constants";
import { StaffAuthLayout } from "@/components/staff/StaffAuthLayout";
import { setAdminToken } from "@/lib/admin/session";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      if (result.token) {
        setAdminToken(result.token);
        router.replace("/admin");
        return;
      }

      throw new Error("No token received from server");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
      setIsSubmitting(false);
    }
  });

  return (
    <StaffAuthLayout
      title="Admin sign in"
      subtitle={`${SHOP_INFO.name} content admin`}
      intro="Legacy admin for blog and homepage content. For orders and products, use the staff panel."
      footer={
        <div className="space-y-3 text-center text-sm text-brand-gray-600">
          <p>
            <Link href="/staff/login" className="font-medium text-brand-pink hover:underline">
              Go to staff panel sign in →
            </Link>
          </p>
          <p>
            <Link href="/" className="hover:text-brand-gray-900 transition-colors">
              ← Back to website
            </Link>
          </p>
        </div>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
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
            {...register("email")}
            className="staff-input"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email ? (
            <p className="text-xs text-red-700 mt-1">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="staff-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className="staff-input"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password ? (
            <p className="text-xs text-red-700 mt-1">{errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="staff-btn staff-btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </StaffAuthLayout>
  );
}
