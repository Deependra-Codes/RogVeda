import { getSupabaseWriteEnvIssues } from "@/lib/env";
import { getSupabaseWriteClient } from "@/supabase/clients/server";

import { type VendorLoginPayload, vendorDemoCredentials } from "../types/contracts";
import type { VendorSessionPayload } from "./session-token";

type VendorRow = {
  id: string;
  username: string;
  password: string;
  display_name: string;
};

export type VendorAuthResult =
  | {
      kind: "ok";
      vendor: VendorSessionPayload;
    }
  | {
      kind: "invalid_credentials";
    }
  | {
      kind: "unconfigured";
      missingKeys: string[];
    }
  | {
      kind: "error";
      message: string;
    };

export async function authenticateVendor(payload: VendorLoginPayload): Promise<VendorAuthResult> {
  if (!matchesDemoCredentials(payload)) {
    return { kind: "invalid_credentials" };
  }

  const missingKeys = getSupabaseWriteEnvIssues();
  if (missingKeys.length) {
    return { kind: "unconfigured", missingKeys };
  }

  const client = getSupabaseWriteClient();
  if (!client) {
    return { kind: "unconfigured", missingKeys: getSupabaseWriteEnvIssues() };
  }

  const { data, error } = await client
    .from("vendors")
    .select("id,username,password,display_name")
    .eq("username", vendorDemoCredentials.username)
    .eq("password", vendorDemoCredentials.password)
    .maybeSingle();

  if (error) {
    console.error("Failed to authenticate vendor", error);
    return {
      kind: "error",
      message: "The vendor login service is currently unavailable.",
    };
  }

  const vendor = data as VendorRow | null;
  if (!vendor) {
    return { kind: "invalid_credentials" };
  }

  return {
    kind: "ok",
    vendor: {
      vendorId: vendor.id,
      username: vendor.username,
      displayName: vendor.display_name,
    },
  };
}

function matchesDemoCredentials(payload: VendorLoginPayload) {
  return (
    payload.username.trim().toLowerCase() === vendorDemoCredentials.username &&
    payload.password === vendorDemoCredentials.password
  );
}
