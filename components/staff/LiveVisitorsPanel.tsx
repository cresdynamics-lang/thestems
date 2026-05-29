"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLiveVisitors, sessionSecondsAgo } from "@/hooks/useLiveVisitors";

type LiveVisitorsPanelProps = {
  compact?: boolean;
};

function formatSecondsAgo(seconds: number): string {
  if (seconds < 15) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  return `${m}m ago`;
}

function LiveBadge({ connected }: { connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        className={`relative flex h-2 w-2 rounded-full ${
          connected ? "bg-green-500" : "bg-amber-400"
        }`}
        aria-hidden
      >
        {connected ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        ) : null}
      </span>
      {connected ? "Live" : "Connecting…"}
    </span>
  );
}

export function LiveVisitorsPanel({ compact = false }: LiveVisitorsPanelProps) {
  const { data, loading, error, connected, liveCount } = useLiveVisitors({
    compact,
    realtime: !compact,
  });
  const [, setTick] = useState(0);

  useEffect(() => {
    if (compact) return;
    const timer = setInterval(() => setTick((n) => n + 1), 15_000);
    return () => clearInterval(timer);
  }, [compact]);

  const snapshotAt = data?.at;

  if (loading) {
    return (
      <div className="text-sm text-[var(--staff-muted)] py-4">
        Connecting to live feed…
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-auth-error text-sm">
        {error}
        <p className="mt-2 text-xs text-[var(--staff-muted)]">
          Run <code className="text-xs">supabase/migrations/analytics_tables.sql</code> in Supabase
          if tables are missing.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="staff-panel p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="font-heading font-semibold text-[15px]">Live visitors</h2>
          <div className="flex items-center gap-2">
            <LiveBadge connected={connected} />
            <Link
              href="/staff/live-visitors"
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--staff-accent)" }}
            >
              Details →
            </Link>
          </div>
        </div>
        <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--staff-sage)" }}>
          {liveCount}
        </p>
        <p className="text-xs text-[var(--staff-muted)] mt-1">
          Real-time · shoppers on the site now
        </p>
      </div>
    );
  }

  const summary = data?.summary;
  const sessions = data?.sessions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[var(--staff-muted)]">
          Real-time feed — device, browser, and page for each shopper. Staff visits are excluded.
        </p>
        <LiveBadge connected={connected} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="staff-panel p-4">
          <p className="text-xs text-[var(--staff-muted)] mb-1">On the site now</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: "var(--staff-sage)" }}>
            {liveCount}
          </p>
        </div>
        <div className="staff-panel p-4">
          <p className="text-xs text-[var(--staff-muted)] mb-1">Pages being viewed</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums">
            {summary?.distinctPages ?? 0}
          </p>
        </div>
        <div className="staff-panel p-4">
          <p className="text-xs text-[var(--staff-muted)] mb-1">Page views (5 min)</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums">
            {summary?.pageViewsLast5Min ?? 0}
          </p>
        </div>
        <div className="staff-panel p-4">
          <p className="text-xs text-[var(--staff-muted)] mb-1">Product interest (5 min)</p>
          <p className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: "var(--staff-accent)" }}>
            {summary?.productClicksLast5Min ?? 0}
          </p>
        </div>
      </div>

      <div className="staff-panel overflow-hidden">
        <div className="staff-panel-head flex items-center justify-between">
          <span>Who is browsing</span>
          <span className="text-xs text-[var(--staff-muted)]">Updates every ~12 seconds</span>
        </div>
        {sessions.length > 0 ? (
          <ul className="divide-y divide-[#f3f4f6]">
            {sessions.map((session) => (
              <li
                key={session.session_id}
                className="flex flex-wrap items-start gap-3 p-4 hover:bg-brand-blush/30 transition-colors"
              >
                <span className="text-2xl shrink-0" aria-hidden>
                  {session.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-brand-gray-900">
                    {session.deviceName}
                    <span className="font-normal text-[var(--staff-muted)]">
                      {" "}
                      · {session.browser}
                      {session.os ? ` · ${session.os}` : ""}
                    </span>
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--staff-accent)" }}>
                    {session.pageLabel}
                  </p>
                  {session.last_path && session.last_path !== "/" ? (
                    <p className="text-[11px] text-[var(--staff-muted)] truncate mt-0.5">
                      {session.last_path}
                    </p>
                  ) : null}
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-800">
                    Active
                  </span>
                  <p className="text-[11px] text-[var(--staff-muted)] mt-1 tabular-nums">
                    {formatSecondsAgo(sessionSecondsAgo(session.last_seen, snapshotAt))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-sm text-[var(--staff-muted)]">
            No shoppers on the site in the last 5 minutes. Open the shop homepage in a private
            window to test — you should see your device appear within a few seconds.
          </p>
        )}
      </div>
    </div>
  );
}
