"use client";

import { useEffect, useState } from "react";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { staffFetch } from "@/lib/staff/api-client";
import { invalidateStaffCache } from "@/lib/staff/staff-cache";
import { useStaffQuery } from "@/hooks/useStaffQuery";
import { useStaff } from "@/components/staff/StaffAuthGuard";
import { canManageStaff } from "@/lib/staff/permissions";

export default function SettingsPage() {
  const { user } = useStaff();
  const { data, refetch } = useStaffQuery<{
    settings: Record<string, string>;
    staffUsers: Array<Record<string, unknown>>;
  }>("/api/staff/settings", { ttlMs: 60_000 });
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [staffUsers, setStaffUsers] = useState<Array<Record<string, unknown>>>([]);
  const [newStaff, setNewStaff] = useState({ email: "", password: "", name: "", role: "staff" });

  useEffect(() => {
    if (data?.settings) setSettings(data.settings);
    if (data?.staffUsers) setStaffUsers(data.staffUsers);
  }, [data]);

  async function save() {
    await staffFetch("/api/staff/settings", {
      method: "PUT",
      body: JSON.stringify({ settings }),
    });
    invalidateStaffCache("/api/staff/settings");
    alert("Settings saved");
  }

  async function addStaff() {
    await staffFetch("/api/staff/settings", {
      method: "PUT",
      body: JSON.stringify({ staffUser: newStaff }),
    });
    setNewStaff({ email: "", password: "", name: "", role: "staff" });
    invalidateStaffCache("/api/staff/settings");
    void refetch(false);
  }

  const fields = [
    { key: "store_name", label: "Store name" },
    { key: "store_address", label: "Address" },
    { key: "store_phone", label: "Phone" },
    { key: "store_email", label: "Email" },
    { key: "store_whatsapp", label: "WhatsApp" },
    { key: "mpesa_till", label: "M-PESA Till" },
    { key: "mpesa_paybill", label: "Paybill" },
    { key: "mpesa_account", label: "Paybill account" },
    { key: "tax_vat_rate", label: "VAT %" },
    { key: "notify_new_order", label: "Email on new order (true/false)" },
    { key: "notify_low_stock", label: "Email on low stock (true/false)" },
  ];

  return (
    <>
      <StaffHeader title="Settings" />
      <main className="flex-1 p-4 sm:p-6 max-w-2xl space-y-6">
        <div className="card p-6 space-y-3">
          <h2 className="font-heading font-semibold">Store info & payments</h2>
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs text-brand-gray-600">{f.label}</label>
              <input
                className="input-field"
                value={settings[f.key] || ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              />
            </div>
          ))}
          <button type="button" className="btn-primary" onClick={save}>Save settings</button>
        </div>

        {canManageStaff(user.role) && (
          <div className="card p-6 space-y-3">
            <h2 className="font-heading font-semibold">Staff accounts</h2>
            <ul className="text-sm divide-y">
              {staffUsers.map((s) => (
                <li key={String(s.id)} className="py-2 flex justify-between">
                  <span>{String(s.email)} — {String(s.role)}</span>
                  <span className={s.is_active === false ? "text-red-600" : "text-green-700"}>
                    {s.is_active === false ? "Inactive" : "Active"}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-medium pt-2">Add staff</h3>
            <input className="input-field" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
            <input className="input-field" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
            <input className="input-field" type="password" placeholder="Password" value={newStaff.password} onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} />
            <select className="input-field" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}>
              <option value="staff">Staff</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <button type="button" className="btn-secondary text-sm" onClick={addStaff}>Add user</button>
          </div>
        )}
      </main>
    </>
  );
}
