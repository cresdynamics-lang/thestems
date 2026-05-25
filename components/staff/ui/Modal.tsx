"use client";

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const maxW =
    size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-sm" : "max-w-lg";

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`${maxW} w-full rounded-xl overflow-hidden`}
          style={{
            background: "var(--staff-surface)",
            border: "1px solid var(--staff-border)",
            boxShadow: "0 20px 50px rgba(28,25,23,0.12)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--staff-border)" }}
          >
            <Dialog.Title
              className="font-heading font-semibold text-lg tracking-tight"
              style={{ color: "var(--staff-text)" }}
            >
              {title}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[var(--staff-bg)]"
              style={{ color: "var(--staff-muted)" }}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
