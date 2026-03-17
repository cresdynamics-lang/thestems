\"use client\";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LiveVisitorSession {
  session_id: string;
  user_id: string | null;
  last_seen: string;
  last_path: string | null;
  user_agent: string | null;
}

interface LiveVisitorsResponse {
  count: number;
  sessions: LiveVisitorSession[];
}

interface AnalyticsSummary {
  liveVisitorCount: number;
  distinctPages: number;
  pageViewsLast5Min: number;
  productClicksLast5Min: number;
}

export default function LiveVisitorsPage() {
  const router = useRouter();
  const [liveData, setLiveData] = useState<LiveVisitorsResponse | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const knownSessionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const [liveRes, summaryRes] = await Promise.all([
          axios.get<LiveVisitorsResponse>("/api/admin/live-visitors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<AnalyticsSummary>("/api/admin/analytics-summary", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!isMounted) return;

        const sessions = liveRes.data.sessions || [];
        const currentIds = new Set(sessions.map((s) => s.session_id));

        // Play a sound when a brand-new session appears
        const known = knownSessionsRef.current;
        const hasNewSession = sessions.some((s) => !known.has(s.session_id));
        if (hasNewSession) {
          if (!audioRef.current) {
            audioRef.current = new Audio("/sounds/live-visitor.mp3");
          }
          audioRef.current
            .play()
            .catch(() => {
              // ignore autoplay issues
            });
        }
        knownSessionsRef.current = currentIds;

        setLiveData(liveRes.data);
        setSummary(summaryRes.data);
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [router]);

  const distinctPaths = useMemo(() => {
    if (!liveData) return [];
    const set = new Set<string>();
    for (const s of liveData.sessions) {
      if (s.last_path) set.add(s.last_path);
    }
    return Array.from(set);
  }, [liveData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-brand-gray-600">Loading live visitors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-brand-gray-900">
          Live Visitors
        </h1>
        <p className="text-xs md:text-sm text-brand-gray-500 max-w-sm text-right">
          View who is currently browsing, which pages are being viewed, and how
          many product clicks are happening in real time. A chime plays when a
          new visitor appears while this page is open.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Live Visitors (last 5 minutes)
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-green">
            {summary?.liveVisitorCount ?? liveData?.count ?? 0}
          </p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Active Pages
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-gray-900">
            {summary?.distinctPages ?? distinctPaths.length}
          </p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Page Views (last 5 min)
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-gray-900">
            {summary?.pageViewsLast5Min ?? 0}
          </p>
        </div>
        <div className="card p-4 md:p-6">
          <h3 className="text-xs md:text-sm font-medium text-brand-gray-600 mb-1 md:mb-2">
            Product Clicks (last 5 min)
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-brand-pink">
            {summary?.productClicksLast5Min ?? 0}
          </p>
        </div>
      </div>

      <div className="card p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-brand-gray-900">
            Live Sessions
          </h2>
          <span className="text-xs text-brand-gray-500">
            Updating every 10 seconds
          </span>
        </div>

        {liveData && liveData.sessions.length > 0 ? (
          <div className="overflow-x-auto -mx-2 md:mx-0">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left text-brand-gray-500 border-b border-brand-gray-200">
                  <th className="px-2 md:px-3 py-2 font-medium">Session</th>
                  <th className="px-2 md:px-3 py-2 font-medium">Last Page</th>
                  <th className="px-2 md:px-3 py-2 font-medium">Last Seen</th>
                  <th className="px-2 md:px-3 py-2 font-medium">Device</th>
                </tr>
              </thead>
              <tbody>
                {liveData.sessions.map((session) => (
                  <tr
                    key={session.session_id}
                    className="border-b border-brand-gray-100 last:border-0"
                  >
                    <td className="px-2 md:px-3 py-2 align-top">
                      <div className="font-mono text-[10px] md:text-xs text-brand-gray-700 break-all">
                        {session.session_id}
                      </div>
                      {session.user_id && (
                        <div className="text-[10px] text-brand-gray-500 mt-1">
                          User: {session.user_id}
                        </div>
                      )}
                    </td>
                    <td className="px-2 md:px-3 py-2 align-top">
                      <div className="text-[11px] md:text-xs text-brand-gray-800 break-all">
                        {session.last_path || "—"}
                      </div>
                    </td>
                    <td className="px-2 md:px-3 py-2 align-top">
                      <div className="text-[11px] md:text-xs text-brand-gray-800">
                        {new Date(session.last_seen).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-2 md:px-3 py-2 align-top">
                      <div className="text-[10px] md:text-[11px] text-brand-gray-500 line-clamp-2 max-w-[200px]">
                        {session.user_agent || "Unknown"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs md:text-sm text-brand-gray-500">
            No active visitors in the last 5 minutes.
          </div>
        )}
      </div>
    </div>
  );
}

