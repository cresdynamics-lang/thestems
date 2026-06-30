"use client";

import { useState } from "react";
import { sanitizeInput } from "@/lib/utils";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = sanitizeInput(email.trim());
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          subject: "Newsletter signup",
          message: `New newsletter signup: ${trimmed}`,
          email: trimmed,
          name: "Newsletter subscriber",
        }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-white py-12 md:py-16 border-t border-brand-gray-200">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-brand-gray-900 mb-2">
          Sign Up for Offers
        </h2>
        <p className="text-brand-gray-600 text-sm md:text-base mb-6">
          Join our list for exclusive deals, seasonal bouquets, and first access to new gift hampers in Nairobi.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter your email"
            className="input-field flex-1 text-sm"
            autoComplete="email"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary whitespace-nowrap text-sm px-6 py-3 disabled:opacity-60"
          >
            {status === "loading" ? "Signing up…" : "Subscribe"}
          </button>
        </form>
        {status === "success" && (
          <p className="mt-4 text-sm text-brand-green font-medium">
            Thank you! You&apos;re on the list for exclusive offers.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-600">
            Please enter a valid email address.
          </p>
        )}
      </div>
    </section>
  );
}
