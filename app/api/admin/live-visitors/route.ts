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

  const { data, error } = await (supabaseAdmin
    .from("analytics_sessions") as any)
    .select("*")
    .gte("last_seen", cutoff)
    .order("last_seen", { ascending: false });

  if (error) {
    console.error("[LiveVisitors] Failed to fetch sessions:", error);
    return NextResponse.json({ message: "Failed to fetch live visitors" }, { status: 500 });
  }

  const sessions = data ?? [];
  return NextResponse.json({
    count: sessions.length,
    sessions,
  });
}

