import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./supabaseConfig";

function getAdminKey(): string {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  const key = serviceKey || secretKey;
  if (key && !key.includes("your_") && !key.includes("your-service") && !key.includes("placeholder")) {
    return key;
  }
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return anonKey || "placeholder-key";
}

function createClients(): { supabase: SupabaseClient; supabaseAdmin: SupabaseClient } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!isSupabaseConfigured() || !url || !anonKey) {
    const placeholder = createClient("https://placeholder.supabase.co", "placeholder-key");
    return { supabase: placeholder, supabaseAdmin: placeholder };
  }

  const supabase = createClient(url, anonKey);
  const supabaseAdmin = createClient(url, getAdminKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return { supabase, supabaseAdmin };
}

let cached: { supabase: SupabaseClient; supabaseAdmin: SupabaseClient } | null = null;

function getClients() {
  if (!cached) {
    cached = createClients();
  }
  return cached;
}

function clientProxy(getClient: () => SupabaseClient): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      const client = getClient();
      const value = Reflect.get(client, prop, client);
      if (typeof value === "function") {
        return value.bind(client);
      }
      return value;
    },
  });
}

/** Reads .env.local on first use (restart dev server after changing env). */
export const supabase = clientProxy(() => getClients().supabase);
export const supabaseAdmin = clientProxy(() => getClients().supabaseAdmin);
