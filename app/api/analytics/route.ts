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

