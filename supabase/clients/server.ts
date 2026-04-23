import { type SupabaseClient, createClient } from "@supabase/supabase-js";

import { getSupabaseReadEnv, getSupabaseWriteEnv } from "@/lib/env";

import type { Database } from "../types";

let cachedReadClient: SupabaseClient<Database> | null = null;
let cachedWriteClient: SupabaseClient<Database> | null = null;

export function getSupabaseReadClient() {
  if (cachedReadClient) {
    return cachedReadClient;
  }

  const env = getSupabaseReadEnv();
  if (!env) {
    return null;
  }

  cachedReadClient = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.supabaseReadKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedReadClient;
}

export function getSupabaseWriteClient() {
  if (cachedWriteClient) {
    return cachedWriteClient;
  }

  const env = getSupabaseWriteEnv();
  if (!env) {
    return null;
  }

  cachedWriteClient = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.supabaseWriteKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedWriteClient;
}
