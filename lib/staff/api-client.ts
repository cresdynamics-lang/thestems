"use client";

import { STAFF_TOKEN_KEY } from "./constants";

export function getStaffToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STAFF_TOKEN_KEY);
}

export function setStaffToken(token: string) {
  localStorage.setItem(STAFF_TOKEN_KEY, token);
}

export function clearStaffToken() {
  localStorage.removeItem(STAFF_TOKEN_KEY);
}

export async function staffFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStaffToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data as { message?: string }).message || "Request failed");
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  return data as T;
}
