export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "accent" | "warn";
}) {
  const valueColor =
    tone === "accent"
      ? "var(--staff-accent)"
      : tone === "warn"
        ? "#b45309"
        : "var(--staff-text)";

  return (
    <div className="staff-stat">
      <p className="staff-stat-label">{label}</p>
      <p className="staff-stat-value" style={{ color: valueColor }}>
        {value}
      </p>
      {hint && (
        <p className="text-xs mt-1.5" style={{ color: "var(--staff-muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
