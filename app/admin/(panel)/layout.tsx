import type { Metadata } from "next";
import { AdminPanelShell } from "@/components/admin/AdminPanelShell";

export const metadata: Metadata = {
  title: "Admin Dashboard | The Stems Flowers Nairobi",
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminPanelShell>{children}</AdminPanelShell>;
}
