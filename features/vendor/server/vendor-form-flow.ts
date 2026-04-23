import { getSupabaseWriteClient } from "@/supabase/clients/server";

import {
  buildVendorDashboardRoute,
  buildVendorLoginRoute,
  parseCompleteTaskPayload,
  parseVendorLoginPayload,
} from "../types/contracts";
import { authenticateVendor } from "./authenticate-vendor";
import {
  createClearedVendorSessionCookie,
  createVendorSessionCookie,
  readVendorSession,
} from "./session";

export async function resolveVendorLoginFormResult(formData: FormData, secureCookie: boolean) {
  const parsed = parseVendorLoginPayload(formData);
  if (!parsed.success) {
    return { route: buildVendorLoginRoute("invalid_request") };
  }

  const authResult = await authenticateVendor(parsed.data);
  if (authResult.kind === "invalid_credentials") {
    return { route: buildVendorLoginRoute("invalid_credentials") };
  }

  if (authResult.kind === "unconfigured" || authResult.kind === "error") {
    return { route: buildVendorLoginRoute("service_unavailable") };
  }

  const cookie = createVendorSessionCookie(authResult.vendor, secureCookie);
  if (!cookie) {
    return { route: buildVendorLoginRoute("service_unavailable") };
  }

  return {
    route: buildVendorDashboardRoute({ status: "signed_in" }),
    cookie,
  };
}

export async function resolveCompleteTaskFormRoute(formData: FormData) {
  const session = await readVendorSession();
  if (!session) {
    return buildVendorLoginRoute();
  }

  const parsed = parseCompleteTaskPayload(formData);
  if (!parsed.success) {
    return buildVendorDashboardRoute({ error: "invalid_task" });
  }

  const client = getSupabaseWriteClient();
  if (!client) {
    return buildVendorDashboardRoute({ error: "service_unavailable" });
  }

  const { error } = await client
    .rpc("complete_booking_task", {
      input_task_id: parsed.data.taskId,
      input_vendor_id: session.vendorId,
    } as never)
    .single();

  if (error) {
    console.error("Failed to complete booking task", error);
    return buildVendorDashboardRoute({
      error: error.message.includes("Task not found for vendor") ? "invalid_task" : "task_failed",
    });
  }

  return buildVendorDashboardRoute({ status: "task_completed" });
}

export function resolveVendorLogoutFormResult(secureCookie: boolean) {
  return {
    route: buildVendorLoginRoute(),
    cookie: createClearedVendorSessionCookie(secureCookie),
  };
}
