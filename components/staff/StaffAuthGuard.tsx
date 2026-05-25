"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getStaffToken,
  getCachedStaffUser,
  setStaffSession,
  clearStaffToken,
  staffFetch,
  type StaffUser,
} from "@/lib/staff/api-client";
import { STAFF_SESSION_MS } from "@/lib/staff/constants";

const PUBLIC_PATHS = ["/staff/login", "/staff/forgot-password", "/staff/reset-password"];

const StaffContext = createContext<{ user: StaffUser; logout: () => void } | null>(null);

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used within StaffAuthGuard");
  return ctx;
}

export function StaffAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const lastActivity = useRef(Date.now());
  const authReady = useRef(false);

  const logout = useCallback(async () => {
    clearStaffToken();
    authReady.current = false;
    await fetch("/api/staff/logout", { method: "POST" }).catch(() => {});
    router.replace("/staff/login");
  }, [router]);

  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) {
      setLoading(false);
      return;
    }

    const token = getStaffToken();
    if (!token) {
      authReady.current = false;
      router.replace("/staff/login");
      setLoading(false);
      return;
    }

    const cached = getCachedStaffUser();
    if (cached) {
      setUser(cached);
      setLoading(false);
      authReady.current = true;
      return;
    }

    if (authReady.current) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    staffFetch<StaffUser>("/api/staff/me")
      .then((profile) => {
        if (cancelled) return;
        setStaffSession(token, profile);
        setUser(profile);
        authReady.current = true;
      })
      .catch(() => {
        if (cancelled) return;
        clearStaffToken();
        authReady.current = false;
        router.replace("/staff/login");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) return;

    const onActivity = () => {
      lastActivity.current = Date.now();
    };
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, onActivity));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity.current > STAFF_SESSION_MS) {
        logout();
      }
    }, 60000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      clearInterval(interval);
    };
  }, [pathname, logout]);

  if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="staff-auth-form-wrap min-h-dvh w-full flex items-center justify-center text-brand-gray-600">
        Loading…
      </div>
    );
  }

  if (!user) return null;

  return (
    <StaffContext.Provider value={{ user, logout }}>
      {children}
    </StaffContext.Provider>
  );
}
