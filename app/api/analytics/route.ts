import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Analytics endpoint - stores user data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Log analytics data (for debugging)
    console.log("[Analytics]", JSON.stringify(data, null, 2));

    // For page views, upsert a live session row so admin can see live visitors
    if (data?.event === "page_view" && data.sessionId) {
      try {
        const { error } = await (supabaseAdmin
          .from("analytics_sessions") as any)
          .upsert(
            {
              session_id: data.sessionId,
              user_id: data.userId ?? null,
              last_seen: new Date().toISOString(),
              last_path: data.path ?? null,
              user_agent: data.userAgent ?? null,
            },
            { onConflict: "session_id" }
          );

        if (error) {
          console.error("[Analytics] Failed to upsert analytics_sessions:", error);
        }
      } catch (err) {
        console.error("[Analytics] Unexpected error upserting analytics_sessions:", err);
      }
    }

    // You can store other events as well if needed
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Silently fail - analytics should not break the app
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

