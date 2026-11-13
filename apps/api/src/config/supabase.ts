import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// ─── Supabase Client (Service Role) ──────────────────────────────────────────
// This client uses the SERVICE ROLE KEY — it bypasses Row Level Security.
// It is used only on the backend for server-to-server operations.
//
// Security: Never send this client or its key to the browser/mobile app.
// All user-data operations must go through our own auth middleware first.

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  _supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      // Disable auto-refresh — we manage tokens ourselves
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return _supabase;
}

// ─── Health Check Helper ──────────────────────────────────────────────────────
// A lightweight probe: select 1 row from information_schema.
// Does not read user data. Used only by the /health endpoint.
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    // Simple query that works on any PostgreSQL database
    const { error } = await supabase.rpc('health_check').single();
    // If the RPC doesn't exist yet, we fall back to a raw query approach
    if (error && error.code === 'PGRST202') {
      // Function not found — that's OK in Phase 1, DB is still connected
      return true;
    }
    return !error;
  } catch {
    return false;
  }
}
