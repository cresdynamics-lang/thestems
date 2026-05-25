"use client";

import { useEffect, useState } from "react";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { staffFetch } from "@/lib/staff/api-client";
import { formatDateTime } from "@/lib/utils";

export default function AuditPage() {
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([]);
  const [logins, setLogins] = useState<Array<Record<string, unknown>>>([]);
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("");

  const load = () => {
    const q = new URLSearchParams();
    if (email) q.set("email", email);
    if (action) q.set("action", action);
    staffFetch<{ logs: typeof logs; logins: typeof logins }>(`/api/staff/audit?${q}`).then((d) => {
      setLogs(d.logs);
      setLogins(d.logins);
    });
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <StaffHeader title="Audit logs" />
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="flex gap-2 mb-4">
          <input className="input-field max-w-xs" placeholder="Staff email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input-field max-w-xs" placeholder="Action type" value={action} onChange={(e) => setAction(e.target.value)} />
          <button type="button" className="btn-primary text-sm" onClick={load}>Filter</button>
        </div>
        <h2 className="font-semibold mb-2">Activity</h2>
        <div className="card divide-y text-sm mb-6 max-h-96 overflow-y-auto">
          {logs.map((l) => (
            <div key={String(l.id)} className="p-3">
              <span className="font-medium">{String(l.staff_email)}</span>
              <span className="text-brand-gray-600"> — {String(l.action)}</span>
              <span className="block text-xs text-brand-gray-500">{formatDateTime(String(l.created_at))}</span>
            </div>
          ))}
        </div>
        <h2 className="font-semibold mb-2">Login history</h2>
        <div className="card divide-y text-sm">
          {logins.map((l) => (
            <div key={String(l.id)} className="p-3 flex justify-between">
              <span>{String(l.email)} {l.success ? "✓" : "✗"}</span>
              <span className="text-xs text-brand-gray-500">{String(l.ip_address)} · {formatDateTime(String(l.created_at))}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
