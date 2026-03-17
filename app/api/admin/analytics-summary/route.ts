import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // last 5 minutes

  let liveVisitorCount = 0;
  let distinctPages = 0;
  let pageViewsLast5Min = 0;
  let productClicksLast5Min = 0;

  // Live visitors + pages from sessions
  try {
    const { data: sessions, error: sessionsError } = await (supabaseAdmin
      .from("analytics_sessions") as any)
      .select("*")
      .gte("last_seen", cutoff);

    if (sessionsError) {
      console.error(
        "[AnalyticsSummary] Failed to fetch analytics_sessions:",
        sessionsError
      );
    } else if (sessions) {
      liveVisitorCount = sessions.length;
      const uniquePaths = new Set<string>();
      for (const s of sessions as any[]) {
        if (s.last_path) {
          uniquePaths.add(s.last_path as string);
        }
      }
      distinctPages = uniquePaths.size;
    }
  } catch (err) {
    console.error(
      "[AnalyticsSummary] Unexpected error reading analytics_sessions:",
      err
    );
  }

  // Event-based stats (page views, product clicks)
  try {
    const { data: events, error: eventsError } = await (supabaseAdmin
      .from("analytics_events") as any)
      .select("*")
      .gte("created_at", cutoff);

    if (eventsError) {
      console.error(
        "[AnalyticsSummary] Failed to fetch analytics_events:",
        eventsError
      );
    } else if (events) {
      for (const ev of events as any[]) {
        if (ev.event === "page_view") {
          pageViewsLast5Min += 1;
        }
        if (ev.event === "product_view" || ev.event === "add_to_cart") {
          productClicksLast5Min += 1;
        }
      }
    }
  } catch (err) {
    console.error(
      "[AnalyticsSummary] Unexpected error reading analytics_events:",
      err
    );
  }

  return NextResponse.json({
    liveVisitorCount,
    distinctPages,
    pageViewsLast5Min,
    productClicksLast5Min,
  });
}

