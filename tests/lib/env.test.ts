import { afterEach, describe, expect, it } from "vitest";

import {
  getSupabaseReadEnv,
  getSupabaseReadEnvIssues,
  getSupabaseWriteEnv,
  getSupabaseWriteEnvIssues,
} from "../../lib/env";

const trackedEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const originalEnv = Object.fromEntries(trackedEnvKeys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of trackedEnvKeys) {
    const value = originalEnv[key];
    if (typeof value === "string") {
      process.env[key] = value;
      continue;
    }

    Reflect.deleteProperty(process.env, key);
  }
});

describe("server env", () => {
  it("accepts the publishable key when a service role key is absent for reads", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    Reflect.deleteProperty(process.env, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
    Reflect.deleteProperty(process.env, "SUPABASE_SERVICE_ROLE_KEY");

    expect(getSupabaseReadEnv()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      supabaseReadKey: "publishable-key",
      supabaseReadKeySource: "publishable",
    });
    expect(getSupabaseReadEnvIssues()).toEqual([]);
    expect(getSupabaseWriteEnv()).toBeNull();
    expect(getSupabaseWriteEnvIssues()).toEqual(["SUPABASE_SERVICE_ROLE_KEY"]);
  });

  it("prefers the service role key for writes", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    expect(getSupabaseWriteEnv()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      supabaseWriteKey: "service-role-key",
    });
    expect(getSupabaseWriteEnvIssues()).toEqual([]);
  });

  it("prefers the publishable key for reads even when a service role key exists", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    expect(getSupabaseReadEnv()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      supabaseReadKey: "publishable-key",
      supabaseReadKeySource: "publishable",
    });
  });

  it("reports access-key issues when no usable Supabase read key exists", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    Reflect.deleteProperty(process.env, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    Reflect.deleteProperty(process.env, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
    Reflect.deleteProperty(process.env, "SUPABASE_SERVICE_ROLE_KEY");

    expect(getSupabaseReadEnv()).toBeNull();
    expect(getSupabaseReadEnvIssues()).toEqual([
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  });
});
