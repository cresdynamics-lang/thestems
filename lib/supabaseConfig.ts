/** True when real Supabase env vars are set (not placeholders). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) return false;
  if (!url.startsWith("http")) return false;
  if (url.includes("your-project") || url.includes("placeholder")) return false;
  if (key.includes("your-anon") || key === "placeholder-key") return false;

  return true;
}

/** Orders/admin writes need the service role key (anon key is blocked by RLS). */
export function isSupabaseServiceRoleConfigured(): boolean {
  if (!isSupabaseConfigured()) return false;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return false;
  if (key.includes("your-service") || key.includes("placeholder")) return false;
  return true;
}

export function formatSupabaseError(error: unknown): string {
  if (!error) return "Unknown Supabase error";
  if (error instanceof Error) {
    return error.message || error.name;
  }
  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const parts = [record.message, record.details, record.hint, record.code]
      .filter((part) => typeof part === "string" && part.length > 0)
      .map(String);
    if (parts.length > 0) return parts.join(" — ");
    try {
      const serialized = JSON.stringify(error);
      return serialized !== "{}" ? serialized : "Supabase request failed";
    } catch {
      return "Supabase request failed";
    }
  }
  return String(error);
}

let missingConfigWarningLogged = false;

/** One clear dev warning when Supabase is not configured. */
export function warnIfSupabaseNotConfigured(context: string): void {
  if (isSupabaseConfigured() || missingConfigWarningLogged) return;
  missingConfigWarningLogged = true;
  console.warn(
    `[Supabase] ${context}: credentials missing. Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart \`npm run dev\`.`
  );
}
