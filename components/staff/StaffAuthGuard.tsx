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
import { getStaffToken, clearStaffToken, staffFetch } from "@/lib/staff/api-client";
import { STAFF_SESSION_MS } from "@/lib/staff/constants";

const PUBLIC_PATHS = ["/staff/login", "/staff/forgot-password", "/staff/reset-password"];

interface StaffUser {
  email: string;
  role: string;
  name?: string;
  id?: string;
}

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

  const logout = useCallback(async () => {
    clearStaffToken();
    await fetch("/api/staff/logout", { method: "POST" }).catch(() => {});
    router.push("/staff/login");
  }, [router]);

  useEffect(() => {
    if (PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) {
      setLoading(false);
      return;
    }

    const token = getStaffToken();
    if (!token) {
      router.push("/staff/login");
      setLoading(false);
      return;
    }

    staffFetch<StaffUser>("/api/staff/me")
      .then(setUser)
      .catch(() => {
        clearStaffToken();
        router.push("/staff/login");
      })
      .finally(() => setLoading(false));
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
      <div className="flex items-center justify-center min-h-[40vh] text-brand-gray-600">
        Loading staff panel…
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
