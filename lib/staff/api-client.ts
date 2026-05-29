"use client";

import { ADMIN_TOKEN_KEY } from "@/lib/admin/session";
import { STAFF_TOKEN_KEY } from "./constants";

const STAFF_USER_KEY = "staff_user";

export type StaffUser = {
  email: string;
  role: string;
  name?: string;
  id?: string;
};

export function getStaffToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(STAFF_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY)
  );
}

export function getCachedStaffUser(): StaffUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STAFF_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffUser;
  } catch {
    return null;
  }
}

/** Read profile from JWT for instant panel shell (validated by /api/staff/me in background). */
export function decodeStaffTokenUser(): StaffUser | null {
  const token = getStaffToken();
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as {
      email?: string;
      role?: string;
      name?: string;
      id?: string;
      exp?: number;
    };
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    if (!payload.email) return null;
    return {
      email: payload.email,
      role: payload.role || "staff",
      name: payload.name,
      id: payload.id,
    };
  } catch {
    return null;
  }
}

export function getBootStaffUser(): StaffUser | null {
  return getCachedStaffUser() ?? decodeStaffTokenUser();
}

export function setStaffSession(token: string, user?: StaffUser) {
  localStorage.setItem(STAFF_TOKEN_KEY, token);
  if (user) {
    sessionStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
  }
}

export function setStaffToken(token: string) {
  setStaffSession(token);
}

export function clearStaffToken() {
  localStorage.removeItem(STAFF_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(STAFF_USER_KEY);
}

export async function staffFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStaffToken();
  const res = await fetch(url, {
    ...options,
    cache: options.cache ?? "no-store",
    credentials: "include",
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
