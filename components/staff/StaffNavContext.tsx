"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type StaffNavContextValue = {
  open: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
};

const StaffNavContext = createContext<StaffNavContextValue | null>(null);

export function StaffNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeNav = useCallback(() => setOpen(false), []);
  const openNav = useCallback(() => setOpen(true), []);
  const toggleNav = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    closeNav();
  }, [pathname, closeNav]);

  return (
    <StaffNavContext.Provider value={{ open, openNav, closeNav, toggleNav }}>
      {children}
    </StaffNavContext.Provider>
  );
}

export function useStaffNav() {
  const ctx = useContext(StaffNavContext);
  if (!ctx) {
    throw new Error("useStaffNav must be used within StaffNavProvider");
  }
  return ctx;
}
