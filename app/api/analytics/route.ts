import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { parseUserAgent } from "@/lib/parse-user-agent";

// Analytics endpoint - stores user data
export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (!raw?.trim()) {
      return NextResponse.json({ success: false }, { status: 200 });
    }
    const data = JSON.parse(raw);

    const path = data.path ?? data.pathname ?? null;
    if (path?.startsWith("/staff") || path?.startsWith("/admin")) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Keep session alive for live visitor dashboard (page views + heartbeats)
    const sessionEvents = ["page_view", "heartbeat", "product_view", "collection_view"];
    if (data?.sessionId && sessionEvents.includes(data.event)) {
      const device = parseUserAgent(data.userAgent, data.screen);
      try {
        const { error } = await (supabaseAdmin
          .from("analytics_sessions") as any)
          .upsert(
            {
              session_id: data.sessionId,
              user_id: data.userId ?? null,
              last_seen: new Date().toISOString(),
              last_path: path,
              user_agent: data.userAgent ?? null,
              device_type: device.deviceType,
              device_name: device.deviceName,
              browser: device.browser,
              os: device.os || null,
            },
            { onConflict: "session_id" }
          );

        if (error) {
          console.error(
            "[Analytics] Failed to upsert analytics_sessions:",
            error
          );
        }
      } catch (err) {
        console.error(
          "[Analytics] Unexpected error upserting analytics_sessions:",
          err
        );
      }
    }

    // Store all analytics events (page views, product clicks, etc.)
    try {
      const { error: insertError } = await (supabaseAdmin
        .from("analytics_events") as any)
        .insert({
          event: data.event ?? null,
          session_id: data.sessionId ?? null,
          user_id: data.userId ?? null,
          path: data.path ?? null,
          title: data.title ?? null,
          product_id: data.productId ?? null,
          product_name: data.productName ?? null,
          category: data.category ?? null,
          price: data.price ?? null,
          quantity: data.quantity ?? null,
          metadata: data,
        });

      if (insertError) {
        console.error(
          "[Analytics] Failed to insert into analytics_events:",
          insertError
        );
      }
    } catch (err) {
      console.error(
        "[Analytics] Unexpected error inserting analytics_events:",
        err
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Silently fail - analytics should not break the app
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

