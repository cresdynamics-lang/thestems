"use client";

import { StaffHeader } from "./StaffHeader";

export function StaffPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <StaffHeader title={title} description={description} actions={actions} />
      <div className="staff-main">{children}</div>
    </>
  );
}
