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
  const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));
  const [user, setUser] = useState<StaffUser | null>(() =>
    isPublic ? null : getCachedStaffUser()
  );
  const [loading, setLoading] = useState(() => !isPublic && !getCachedStaffUser());
  const lastActivity = useRef(Date.now());
  const authInit = useRef(false);

  const logout = useCallback(async () => {
    authInit.current = false;
    clearStaffToken();
    await fetch("/api/staff/logout", { method: "POST", credentials: "include" }).catch(
      () => {}
    );
    router.replace("/staff/login");
  }, [router]);

  useEffect(() => {
    if (isPublic) {
      setLoading(false);
      return;
    }

    if (authInit.current) return;
    authInit.current = true;

    const cached = getCachedStaffUser();
    if (cached) {
      setUser(cached);
      setLoading(false);
    }

    let cancelled = false;
    staffFetch<StaffUser>("/api/staff/me")
      .then((profile) => {
        if (cancelled) return;
        const token = getStaffToken();
        if (token) setStaffSession(token, profile);
        setUser(profile);
      })
      .catch(() => {
        if (cancelled) return;
        authInit.current = false;
        clearStaffToken();
        setUser(null);
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
        router.replace(`/staff/login${next}`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Auth bootstrap once per app mount — not on every route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublic]);

  useEffect(() => {
    if (isPublic) return;

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
  }, [isPublic, logout]);

  if (isPublic) {
    return <>{children}</>;
  }

  if (loading && !user) {
    return (
      <div className="staff-auth-form-wrap min-h-dvh w-full flex items-center justify-center text-brand-gray-600 text-sm">
        Signing in…
      </div>
    );
  }

  if (!user) return null;

  return (
    <StaffContext.Provider value={{ user, logout }}>{children}</StaffContext.Provider>
  );
}
