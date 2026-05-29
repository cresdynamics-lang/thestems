"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { staffFetch } from "@/lib/staff/api-client";
import { getStaffCache, getStaffCacheAge, setStaffCache } from "@/lib/staff/staff-cache";

type Options = {
  ttlMs?: number;
  enabled?: boolean;
};

export function useStaffQuery<T>(url: string, options: Options = {}) {
  const { ttlMs = 45_000, enabled = true } = options;
  const [data, setData] = useState<T | null>(() =>
    enabled ? getStaffCache<T>(url) : null
  );
  const [loading, setLoading] = useState(() =>
    enabled ? !getStaffCache<T>(url) : false
  );
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef(url);

  const refetch = useCallback(
    async (background = false) => {
      if (!background) setLoading(true);
      try {
        const fresh = await staffFetch<T>(url);
        setStaffCache(url, fresh, ttlMs);
        setData(fresh);
        setError(null);
      } catch (e: unknown) {
        const err = e as Error & { status?: number };
        if (!background || !getStaffCache<T>(url)) {
          setError(err.message || "Request failed");
        }
      } finally {
        if (!background) setLoading(false);
      }
    },
    [url, ttlMs]
  );

  useEffect(() => {
    if (!enabled) return;

    urlRef.current = url;
    const cached = getStaffCache<T>(url);
    if (cached) {
      setData(cached);
      setLoading(false);
      const age = getStaffCacheAge(url);
      if (age === null || age > ttlMs / 2) {
        void refetch(true);
      }
      return;
    }

    setLoading(true);
    void refetch(false);
  }, [url, enabled, refetch]);

  return { data, loading, error, refetch, setData };
}
