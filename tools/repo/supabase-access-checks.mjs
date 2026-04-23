import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import { workspaceRoot } from "./lib.mjs";

const trackedSupabaseEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];
const publicSupabaseEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];
const publicReadableTables = ["hospitals", "doctors", "pricing"];
const privateTables = ["vendors", "patients", "bookings", "wallet_transactions", "booking_tasks"];

export function parseEnvFileText(text) {
  return text.split(/\r?\n/).reduce((accumulator, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return accumulator;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return accumulator;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    accumulator[key] = value;
    return accumulator;
  }, {});
}

export async function assertSupabaseRpcParity(root = workspaceRoot) {
  const env = loadRepoSupabaseEnv(root);
  const missingKeys = trackedSupabaseEnvKeys.filter(
    (key) =>
      (key === "SUPABASE_SERVICE_ROLE_KEY" || key === "NEXT_PUBLIC_SUPABASE_URL") && !env[key],
  );

  if (missingKeys.length) {
    throw new Error(
      `repo RPC preflight requires ${missingKeys.join(", ")} in process env or .env.local`,
    );
  }

  const client = createRepoSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  await assertExpectedRpcError(client, "create_booking_transaction", {
    input_hospital_id: "00000000-0000-0000-0000-000000000000",
    input_doctor_id: "00000000-0000-0000-0000-000000000000",
    input_room_type: "General Ward",
    input_patient_name: "Parity Check",
    input_patient_email: "parity-check@example.com",
  });

  await assertExpectedRpcError(client, "complete_booking_task", {
    input_task_id: "00000000-0000-0000-0000-000000000000",
    input_vendor_id: "00000000-0000-0000-0000-000000000000",
  });
}

export async function assertSupabasePublicAccessBoundaries(root = workspaceRoot) {
  const env = loadRepoSupabaseEnv(root);
  const publicKey = resolvePublicSupabaseKey(env);

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !publicKey) {
    const missingKeys = [
      !env.NEXT_PUBLIC_SUPABASE_URL ? "NEXT_PUBLIC_SUPABASE_URL" : null,
      !env.SUPABASE_SERVICE_ROLE_KEY ? "SUPABASE_SERVICE_ROLE_KEY" : null,
      !publicKey ? publicSupabaseEnvKeys.join(" or ") : null,
    ].filter(Boolean);

    throw new Error(
      `repo public access check requires ${missingKeys.join(", ")} in process env or .env.local`,
    );
  }

  const privilegedClient = createRepoSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const publicClient = createRepoSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, publicKey);

  for (const tableName of publicReadableTables) {
    await assertTableHasPublicRows(publicClient, tableName);
  }

  for (const tableName of privateTables) {
    await assertTableRowsStayPrivate(privilegedClient, publicClient, tableName);
  }

  await assertPublicRpcBlocked(publicClient, "create_booking_transaction", {
    input_hospital_id: "00000000-0000-0000-0000-000000000000",
    input_doctor_id: "00000000-0000-0000-0000-000000000000",
    input_room_type: "General Ward",
    input_patient_name: "Public Probe",
    input_patient_email: "public-probe@example.com",
  });

  await assertPublicRpcBlocked(publicClient, "complete_booking_task", {
    input_task_id: "00000000-0000-0000-0000-000000000000",
    input_vendor_id: "00000000-0000-0000-0000-000000000000",
  });
}

export function isExpectedRpcPreflightError(functionName, error) {
  if (!error) {
    return false;
  }

  if (error.code === "PGRST202") {
    return false;
  }

  const message = error.message ?? "";
  const details = error.details ?? "";
  const text = `${message} ${details}`;

  if (functionName === "create_booking_transaction") {
    return text.includes("Invalid hospital, doctor, and room combination");
  }

  if (functionName === "complete_booking_task") {
    return text.includes("Task not found for vendor");
  }

  return false;
}

export function isDeniedPublicRpcAccessError(error) {
  if (!error) {
    return false;
  }

  const code = error.code ?? "";
  const message = error.message ?? "";
  const details = error.details ?? "";
  const text = `${message} ${details}`.toLowerCase();

  return (
    code === "42501" ||
    code === "PGRST202" ||
    text.includes("permission denied") ||
    text.includes("not allowed")
  );
}

async function assertExpectedRpcError(client, functionName, args) {
  const { error } = await client.rpc(functionName, args).single();
  if (isExpectedRpcPreflightError(functionName, error)) {
    return;
  }

  if (error?.code === "PGRST202") {
    throw new Error(
      `repo RPC preflight failed: ${functionName} is not discoverable in the active Supabase schema cache`,
    );
  }

  throw new Error(
    `repo RPC preflight failed for ${functionName}: ${error?.message ?? "unexpected success"}`,
  );
}

async function assertTableHasPublicRows(client, tableName) {
  const { data, error } = await client.from(tableName).select("id").limit(1);
  if (error) {
    throw new Error(
      `repo public access check failed: ${tableName} should be readable by public Supabase access (${error.message})`,
    );
  }

  if (!data?.length) {
    throw new Error(
      `repo public access check failed: ${tableName} returned no rows to public Supabase access`,
    );
  }
}

async function assertTableRowsStayPrivate(privilegedClient, publicClient, tableName) {
  const privilegedCount = await countTableRows(privilegedClient, tableName);
  if (privilegedCount === 0) {
    return;
  }

  const { data, error } = await publicClient.from(tableName).select("id").limit(1);
  if (error) {
    return;
  }

  if ((data ?? []).length > 0) {
    throw new Error(
      `repo public access check failed: ${tableName} exposed row data to public Supabase access`,
    );
  }
}

async function assertPublicRpcBlocked(client, functionName, args) {
  const { error } = await client.rpc(functionName, args).single();
  if (isDeniedPublicRpcAccessError(error)) {
    return;
  }

  if (isExpectedRpcPreflightError(functionName, error)) {
    throw new Error(
      `repo public access check failed: public Supabase access can still execute ${functionName}`,
    );
  }

  throw new Error(
    `repo public access check failed for ${functionName}: ${error?.message ?? "unexpected success"}`,
  );
}

async function countTableRows(client, tableName) {
  const { count, error } = await client.from(tableName).select("id", {
    count: "exact",
    head: true,
  });

  if (error) {
    throw new Error(`repo public access check failed to count ${tableName}: ${error.message}`);
  }

  return count ?? 0;
}

function loadRepoSupabaseEnv(root) {
  const layeredEnv = {};

  for (const relativePath of [".env", ".env.local"]) {
    const absolutePath = resolve(root, relativePath);
    if (!existsSync(absolutePath)) {
      continue;
    }

    Object.assign(layeredEnv, parseEnvFileText(readFileSync(absolutePath, "utf8")));
  }

  for (const key of trackedSupabaseEnvKeys) {
    if (typeof process.env[key] === "string" && process.env[key]) {
      layeredEnv[key] = process.env[key];
    }
  }

  return layeredEnv;
}

function resolvePublicSupabaseKey(env) {
  return env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
}

function createRepoSupabaseClient(url, key) {
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
