import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  ROGVEDA_SESSION_SECRET: z.string().min(1).optional(),
});

type RawServerEnv = z.infer<typeof serverEnvSchema>;
type ServerEnvKey = keyof RawServerEnv;
type RawServerEnvInput = ReturnType<typeof rawServerEnv>;

type ResolvedSupabaseReadEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  supabaseReadKey: string;
  supabaseReadKeySource: "publishable" | "anon" | "service_role";
};

type ResolvedSupabaseWriteEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  supabaseWriteKey: string;
};

const keyFallbackOrder = [
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const satisfies readonly ServerEnvKey[];

function rawServerEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ROGVEDA_SESSION_SECRET: process.env.ROGVEDA_SESSION_SECRET,
  };
}

export function getSupabaseReadEnv() {
  const parsed = serverEnvSchema.safeParse(rawServerEnv());
  if (!parsed.success) {
    return null;
  }

  const resolvedKey = resolveSupabaseKey(parsed.data);
  if (!resolvedKey) {
    return null;
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
    supabaseReadKey: resolvedKey.value,
    supabaseReadKeySource: resolvedKey.source,
  } satisfies ResolvedSupabaseReadEnv;
}

export function getSupabaseReadEnvIssues() {
  const raw = rawServerEnv();
  const parsed = serverEnvSchema.safeParse(raw);
  const issues = parsed.success
    ? []
    : [...new Set(parsed.error.issues.map((issue) => issue.path[0] as ServerEnvKey))];

  if (!resolveSupabaseKey(raw)) {
    for (const key of keyFallbackOrder) {
      if (!issues.includes(key)) {
        issues.push(key);
      }
    }
  }

  if (parsed.success) {
    return issues;
  }

  return issues;
}

export function getSupabaseWriteEnv() {
  const parsed = serverEnvSchema.safeParse(rawServerEnv());
  if (!parsed.success || !parsed.data.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
    supabaseWriteKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
  } satisfies ResolvedSupabaseWriteEnv;
}

export function getSupabaseWriteEnvIssues() {
  const raw = rawServerEnv();
  const parsed = serverEnvSchema.safeParse(raw);
  const issues = parsed.success
    ? []
    : [...new Set(parsed.error.issues.map((issue) => issue.path[0] as ServerEnvKey))];

  if (!raw.SUPABASE_SERVICE_ROLE_KEY && !issues.includes("SUPABASE_SERVICE_ROLE_KEY")) {
    issues.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  return issues;
}

export function getRogvedaSessionSecret() {
  const secret = rawServerEnv().ROGVEDA_SESSION_SECRET;
  return typeof secret === "string" && secret.length > 0 ? secret : null;
}

export function getRogvedaSessionSecretIssues() {
  return getRogvedaSessionSecret() ? [] : (["ROGVEDA_SESSION_SECRET"] as const);
}

function resolveSupabaseKey(env: RawServerEnv | RawServerEnvInput) {
  if (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return {
      value: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      source: "publishable" as const,
    };
  }

  if (env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { value: env.NEXT_PUBLIC_SUPABASE_ANON_KEY, source: "anon" as const };
  }

  if (env.SUPABASE_SERVICE_ROLE_KEY) {
    return { value: env.SUPABASE_SERVICE_ROLE_KEY, source: "service_role" as const };
  }

  return null;
}
