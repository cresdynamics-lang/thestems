import { supabaseAdmin } from "@/lib/supabase";
import { formatPageLabel, parseUserAgent, type ParsedDevice } from "@/lib/parse-user-agent";

const LIVE_WINDOW_MS = 5 * 60 * 1000;

export type LiveVisitorSession = {
  session_id: string;
  user_id: string | null;
  last_seen: string;
  last_path: string | null;
  user_agent: string | null;
  device_type?: string | null;
  device_name?: string | null;
  browser?: string | null;
  os?: string | null;
};

export type EnrichedLiveVisitor = LiveVisitorSession &
  ParsedDevice & {
    pageLabel: string;
    secondsAgo: number;
    visitorLabel: string;
  };

export type AnalyticsSummary = {
  liveVisitorCount: number;
  distinctPages: number;
  pageViewsLast5Min: number;
  productClicksLast5Min: number;
};

function isShopVisitor(path: string | null | undefined): boolean {
  if (!path) return true;
  return !path.startsWith("/staff") && !path.startsWith("/admin") && !path.startsWith("/api");
}

function enrichSession(session: LiveVisitorSession, index: number): EnrichedLiveVisitor {
  const parsed = parseUserAgent(session.user_agent);
  const deviceName = session.device_name || parsed.deviceName;
  const browser = session.browser || parsed.browser;
  const os = session.os || parsed.os;
  const label =
    session.device_name && session.browser
      ? os
        ? `${deviceName} · ${browser} (${os})`
        : `${deviceName} · ${browser}`
      : parsed.label;

  const secondsAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(session.last_seen).getTime()) / 1000)
  );

  return {
    ...session,
    ...parsed,
    deviceName,
    browser,
    os,
    label,
    deviceType: (session.device_type as ParsedDevice["deviceType"]) || parsed.deviceType,
    pageLabel: formatPageLabel(session.last_path),
    secondsAgo,
    visitorLabel: `Visitor ${index + 1}`,
  };
}

export async function getLiveVisitorsDashboard(options?: {
  compact?: boolean;
}): Promise<{
  count: number;
  sessions: EnrichedLiveVisitor[];
  summary: AnalyticsSummary;
}> {
  const cutoff = new Date(Date.now() - LIVE_WINDOW_MS).toISOString();

  const { data, error } = await (supabaseAdmin.from("analytics_sessions") as ReturnType<
    typeof supabaseAdmin.from
  >)
    .select(
      "session_id, user_id, last_seen, last_path, user_agent, device_type, device_name, browser, os"
    )
    .gte("last_seen", cutoff)
    .order("last_seen", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[LiveVisitors] Failed to fetch sessions:", error);
    throw new Error("Failed to fetch live visitors");
  }

  const raw = ((data ?? []) as LiveVisitorSession[]).filter((s) =>
    isShopVisitor(s.last_path)
  );
  const sessions = raw.map((s, i) => enrichSession(s, i));

  const uniquePaths = new Set<string>();
  for (const s of raw) {
    if (s.last_path) uniquePaths.add(s.last_path);
  }

  let pageViewsLast5Min = 0;
  let productClicksLast5Min = 0;

  if (!options?.compact) {
    const { count: pv } = await (supabaseAdmin.from("analytics_events") as ReturnType<
      typeof supabaseAdmin.from
    >)
      .select("*", { count: "exact", head: true })
      .gte("created_at", cutoff)
      .eq("event", "page_view");

    const { count: clicks } = await (supabaseAdmin.from("analytics_events") as ReturnType<
      typeof supabaseAdmin.from
    >)
      .select("*", { count: "exact", head: true })
      .gte("created_at", cutoff)
      .in("event", ["product_view", "add_to_cart", "product_click"]);

    pageViewsLast5Min = pv ?? 0;
    productClicksLast5Min = clicks ?? 0;
  }

  const summary: AnalyticsSummary = {
    liveVisitorCount: sessions.length,
    distinctPages: uniquePaths.size,
    pageViewsLast5Min,
    productClicksLast5Min,
  };

  return { count: sessions.length, sessions, summary };
}

/** @deprecated Use getLiveVisitorsDashboard */
export async function getLiveVisitors() {
  const dash = await getLiveVisitorsDashboard();
  return { count: dash.count, sessions: dash.sessions };
}

/** @deprecated Use getLiveVisitorsDashboard */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const dash = await getLiveVisitorsDashboard();
  return dash.summary;
}
