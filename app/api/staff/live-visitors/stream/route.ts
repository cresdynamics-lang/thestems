import { NextRequest } from "next/server";
import { verifyStaffToken } from "@/lib/staff/auth";
import { getLiveVisitorsDashboard } from "@/lib/analytics-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STREAM_INTERVAL_MS = 4_000;

export async function GET(request: NextRequest) {
  if (!verifyStaffToken(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const compact = request.nextUrl.searchParams.get("compact") === "1";
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const push = async () => {
        if (closed) return;
        try {
          const payload = await getLiveVisitorsDashboard({ compact });
          const line = `data: ${JSON.stringify({ ...payload, at: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(line));
        } catch (e) {
          const message = e instanceof Error ? e.message : "stream error";
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ message })}\n\n`)
          );
        }
      };

      await push();
      const interval = setInterval(push, STREAM_INTERVAL_MS);

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      request.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
