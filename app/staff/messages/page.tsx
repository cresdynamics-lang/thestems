"use client";

import { useEffect, useState } from "react";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { Badge } from "@/components/staff/ui/Badge";
import { staffFetch } from "@/lib/staff/api-client";
import { formatDateTime } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  status: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [waLogs, setWaLogs] = useState<{ message: string; created_at: string; phone?: string }[]>([]);
  const [reply, setReply] = useState("");
  const [active, setActive] = useState<Message | null>(null);

  const load = () =>
    staffFetch<{ messages: Message[]; whatsappLogs: typeof waLogs }>("/api/staff/messages").then((d) => {
      setMessages(d.messages);
      setWaLogs(d.whatsappLogs);
    });

  useEffect(() => { load(); }, []);

  async function resolve(id: string, status: string) {
    await staffFetch("/api/staff/messages", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        status,
        reply: reply || undefined,
        email: active?.email,
      }),
    });
    setReply("");
    setActive(null);
    load();
  }

  return (
    <>
      <StaffHeader title="Messages" />
      <main className="flex-1 p-4 sm:p-6 grid lg:grid-cols-2 gap-4">
        <div className="card divide-y max-h-[70vh] overflow-y-auto">
          <h2 className="p-3 font-semibold border-b">Contact enquiries</h2>
          {messages.map((m) => (
            <button
              key={m.id}
              type="button"
              className="w-full text-left p-3 hover:bg-brand-cream/50"
              onClick={() => setActive(m)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{m.name}</span>
                <Badge status={m.status} />
              </div>
              <p className="text-xs text-brand-gray-500 truncate">{m.message}</p>
            </button>
          ))}
          {!messages.length && <p className="p-4 text-sm text-brand-gray-500">No messages yet</p>}
        </div>
        <div>
          {active ? (
            <div className="card p-4 space-y-3">
              <p className="font-medium">{active.name}</p>
              <p className="text-sm whitespace-pre-wrap">{active.message}</p>
              <textarea className="input-field" rows={4} placeholder="Reply via email…" value={reply} onChange={(e) => setReply(e.target.value)} />
              <div className="flex gap-2">
                <button type="button" className="btn-primary text-sm" onClick={() => resolve(active.id, "resolved")}>Reply & resolve</button>
                <button type="button" className="btn-outline text-sm" onClick={() => resolve(active.id, "read")}>Mark read</button>
              </div>
            </div>
          ) : (
            <div className="card p-4 text-sm text-brand-gray-500">Select a message</div>
          )}
          <div className="card p-4 mt-4">
            <h3 className="font-semibold text-sm mb-2">WhatsApp order log</h3>
            <ul className="text-xs space-y-2 max-h-48 overflow-y-auto">
              {waLogs.map((w, i) => (
                <li key={i}>{formatDateTime(w.created_at)} — {w.phone} — {w.message?.slice(0, 60)}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
