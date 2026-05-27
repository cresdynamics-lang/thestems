"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getStaffToken, staffFetch } from "@/lib/staff/api-client";
import type { AnalyticsSummary, EnrichedLiveVisitor } from "@/lib/analytics-server";

export type LiveVisitorsPayload = {
  count: number;
  sessions: EnrichedLiveVisitor[];
  summary: AnalyticsSummary;
  at?: number;
};

type Options = {
  compact?: boolean;
  enabled?: boolean;
  /** Full live page only — dashboard uses light polling to avoid lag */
  realtime?: boolean;
};

function enrichSecondsAgo(sessions: EnrichedLiveVisitor[]): EnrichedLiveVisitor[] {
  const now = Date.now();
  return sessions.map((s) => ({
    ...s,
    secondsAgo: Math.max(
      0,
      Math.floor((now - new Date(s.last_seen).getTime()) / 1000)
    ),
  }));
}

export function useLiveVisitors({
  compact = false,
  enabled = true,
  realtime = !compact,
}: Options = {}) {
  const [data, setData] = useState<LiveVisitorsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const knownSessionsRef = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onNewVisitorRef = useRef<(() => void) | null>(null);

  const applyPayload = useCallback(
    (payload: LiveVisitorsPayload, playSound: boolean) => {
      const sessions = enrichSecondsAgo(payload.sessions || []);
      const currentIds = new Set(sessions.map((s) => s.session_id));
      const hasNew =
        playSound &&
        sessions.some((s) => !knownSessionsRef.current.has(s.session_id));
      if (hasNew && knownSessionsRef.current.size > 0 && !compact) {
        if (!audioRef.current) {
          audioRef.current = new Audio("/sounds/live-visitor.mp3");
        }
        audioRef.current.play().catch(() => {});
        onNewVisitorRef.current?.();
      }
      knownSessionsRef.current = currentIds;
      setData({
        ...payload,
        sessions,
        summary: payload.summary,
        count: payload.summary?.liveVisitorCount ?? payload.count,
      });
      setError(null);
      setLoading(false);
    },
    [compact]
  );

  const fetchOnce = useCallback(async () => {
    const url = compact
      ? "/api/staff/live-visitors?compact=1"
      : "/api/staff/live-visitors";
    const payload = await staffFetch<LiveVisitorsPayload>(url);
    applyPayload(payload, true);
  }, [compact, applyPayload]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let es: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (pollTimer) return;
      setConnected(false);
      fetchOnce().catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
          setLoading(false);
        }
      });
      pollTimer = setInterval(() => {
        fetchOnce().catch(() => {});
      }, compact ? 60_000 : 8_000);
    };

    if (!realtime) {
      startPolling();
      return () => {
        cancelled = true;
        if (pollTimer) clearInterval(pollTimer);
      };
    }

    const token = getStaffToken();
    const params = new URLSearchParams();
    if (compact) params.set("compact", "1");
    if (token) params.set("token", token);
    const qs = params.toString();
    const streamUrl = `/api/staff/live-visitors/stream${qs ? `?${qs}` : ""}`;

    try {
      es = new EventSource(streamUrl);
      es.onopen = () => {
        if (!cancelled) setConnected(true);
      };
      es.onmessage = (event) => {
        if (cancelled) return;
        try {
          const payload = JSON.parse(event.data) as LiveVisitorsPayload;
          applyPayload(payload, true);
          setConnected(true);
        } catch {
          /* ignore malformed */
        }
      };
      es.onerror = () => {
        if (cancelled) return;
        es?.close();
        es = null;
        startPolling();
      };
    } catch {
      startPolling();
    }

    return () => {
      cancelled = true;
      es?.close();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [enabled, compact, realtime, applyPayload, fetchOnce]);

  useEffect(() => {
    if (!realtime || !data?.sessions?.length) return;
    const tick = setInterval(() => {
      setData((prev) =>
        prev
          ? {
              ...prev,
              sessions: enrichSecondsAgo(prev.sessions),
            }
          : prev
      );
    }, 1000);
    return () => clearInterval(tick);
  }, [realtime, data?.sessions.length]);

  return {
    data,
    loading,
    error,
    connected,
    liveCount: data?.summary.liveVisitorCount ?? data?.count ?? 0,
    refetch: fetchOnce,
  };
}
